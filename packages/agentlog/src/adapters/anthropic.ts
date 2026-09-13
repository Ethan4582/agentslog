import type { Call, ContentBlock, Message, Role, TokenUsage } from "../capture/session";
import { SessionWriter, type SessionWriterOptions } from "../capture/writer";

export interface AnthropicMessageParam {
  role: "user" | "assistant";
  content: string | readonly unknown[];
}

export interface AnthropicCreateParams {
  model: string;
  messages: AnthropicMessageParam[];
  system?: string | unknown[];
  max_tokens?: number;
  tools?: readonly unknown[];
  stream?: boolean;
  [key: string]: unknown;
}

export interface AnthropicResponse {
  id: string;
  model: string;
  role: "assistant";
  stop_reason: string | null;
  content: Array<{
    type: string;
    text?: string;
    id?: string;
    name?: string;
    input?: Record<string, unknown>;
  }>;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export interface AnthropicClientLike {
  messages: {
    create: (params: AnthropicCreateParams, ...args: unknown[]) => Promise<AnthropicResponse>;
    stream?: (params: AnthropicCreateParams, ...args: unknown[]) => unknown;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

function parseAnthropicContent(content: string | readonly unknown[]): string | ContentBlock[] {
  if (typeof content === "string") {
    return content;
  }
  const blocks: ContentBlock[] = [];
  for (const block of content) {
    if (typeof block === "object" && block !== null) {
      const b = block as Record<string, unknown>;
      if (b.type === "text" && typeof b.text === "string") {
        blocks.push({ type: "text", text: b.text });
      } else if (
        b.type === "tool_use" &&
        typeof b.id === "string" &&
        typeof b.name === "string"
      ) {
        blocks.push({
          type: "tool_use",
          id: b.id,
          name: b.name,
          input: (b.input as Record<string, unknown>) ?? {}
        });
      } else if (b.type === "tool_result" && typeof b.tool_use_id === "string") {
        blocks.push({
          type: "tool_result",
          toolCallId: b.tool_use_id,
          content: typeof b.content === "string" ? b.content : JSON.stringify(b.content)
        });
      }
    }
  }
  return blocks;
}

export function wrapAnthropicClient<T extends AnthropicClientLike>(
  client: T,
  options?: SessionWriterOptions & { title?: string }
): T {
  let writer: SessionWriter | null = null;

  const originalCreate = client.messages.create.bind(client.messages);

  client.messages.create = async function (
    params: AnthropicCreateParams,
    ...rest: unknown[]
  ): Promise<AnthropicResponse> {
    const model = params.model ?? "unknown-claude";
    if (!writer) {
      writer = new SessionWriter("anthropic", model, options?.title, options);
    }

    const startTime = performance.now();
    let errorMsg: string | undefined;
    let response: AnthropicResponse | undefined;

    try {
      response = await originalCreate(params, ...rest);
      return response;
    } catch (err: unknown) {
      errorMsg = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      const durationMs = Math.round(performance.now() - startTime);
      const callMessages: Message[] = params.messages.map((m) => ({
        role: m.role as Role,
        content: parseAnthropicContent(m.content)
      }));

      const outBlocks: ContentBlock[] = [];
      if (response?.content) {
        for (const item of response.content) {
          if (item.type === "text" && typeof item.text === "string") {
            outBlocks.push({ type: "text", text: item.text });
          } else if (
            item.type === "tool_use" &&
            typeof item.id === "string" &&
            typeof item.name === "string"
          ) {
            outBlocks.push({
              type: "tool_use",
              id: item.id,
              name: item.name,
              input: item.input ?? {}
            });
          }
        }
      }

      const usage: TokenUsage = {
        promptTokens: response?.usage?.input_tokens ?? 0,
        completionTokens: response?.usage?.output_tokens ?? 0,
        totalTokens:
          (response?.usage?.input_tokens ?? 0) +
          (response?.usage?.output_tokens ?? 0)
      };

      const call: Call = {
        id: response?.id ?? crypto.randomUUID().slice(0, 12),
        timestamp: new Date().toISOString(),
        durationMs,
        input: {
          system: typeof params.system === "string" ? params.system : undefined,
          messages: callMessages
        },
        output: {
          content: outBlocks,
          stopReason: response?.stop_reason ?? "unknown",
          usage
        },
        error: errorMsg
      };

      writer.recordCall(call);
    }
  };

  return client;
}
