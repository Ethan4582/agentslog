import type { Call, ContentBlock, Message, Role, TokenUsage } from "../capture/session";
import { SessionWriter, type SessionWriterOptions } from "../capture/writer";

export interface OpenAIMessageParam {
  role: "system" | "user" | "assistant" | "tool";
  content?: string | null;
  name?: string;
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: {
      name: string;
      arguments: string;
    };
  }>;
}

export interface OpenAICreateParams {
  model: string;
  messages: OpenAIMessageParam[];
  stream?: boolean;
  [key: string]: unknown;
}

export interface OpenAIChoice {
  index: number;
  message: {
    role: "assistant";
    content: string | null;
    tool_calls?: Array<{
      id: string;
      type: "function";
      function: {
        name: string;
        arguments: string;
      };
    }>;
  };
  finish_reason: string | null;
}

export interface OpenAIResponse {
  id: string;
  model: string;
  choices: OpenAIChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface OpenAIClientLike {
  chat: {
    completions: {
      create: (params: OpenAICreateParams, ...args: unknown[]) => Promise<OpenAIResponse>;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  baseURL?: string;
  [key: string]: unknown;
}

function detectProvider(client: OpenAIClientLike): string {
  const url = typeof client.baseURL === "string" ? client.baseURL.toLowerCase() : "";
  if (url.includes("deepseek")) return "deepseek";
  if (url.includes("x.ai") || url.includes("grok")) return "grok";
  if (url.includes("openrouter")) return "openrouter";
  return "openai";
}

export function wrapOpenAIClient<T extends OpenAIClientLike>(
  client: T,
  options?: SessionWriterOptions & { title?: string }
): T {
  let writer: SessionWriter | null = null;
  const provider = detectProvider(client);

  const originalCreate = client.chat.completions.create.bind(client.chat.completions);

  client.chat.completions.create = async function (
    params: OpenAICreateParams,
    ...rest: unknown[]
  ): Promise<OpenAIResponse> {
    const model = params.model ?? "unknown-gpt";
    if (!writer) {
      writer = new SessionWriter(provider, model, options?.title, options);
    }

    const startTime = performance.now();
    let errorMsg: string | undefined;
    let response: OpenAIResponse | undefined;

    try {
      response = await originalCreate(params, ...rest);
      return response;
    } catch (err: unknown) {
      errorMsg = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      const durationMs = Math.round(performance.now() - startTime);

      let systemPrompt: string | undefined;
      const callMessages: Message[] = [];

      for (const m of params.messages) {
        if (m.role === "system") {
          systemPrompt = m.content ?? undefined;
        } else {
          callMessages.push({
            role: m.role as Role,
            content: m.content ?? ""
          });
        }
      }

      const outBlocks: ContentBlock[] = [];
      const firstChoice = response?.choices?.[0];

      if (firstChoice?.message?.content) {
        outBlocks.push({
          type: "text",
          text: firstChoice.message.content
        });
      }

      if (firstChoice?.message?.tool_calls) {
        for (const tc of firstChoice.message.tool_calls) {
          let parsedArgs: Record<string, unknown> = {};
          try {
            parsedArgs = JSON.parse(tc.function.arguments) as Record<string, unknown>;
          } catch {
            parsedArgs = { raw: tc.function.arguments };
          }
          outBlocks.push({
            type: "tool_use",
            id: tc.id,
            name: tc.function.name,
            input: parsedArgs
          });
        }
      }

      const usage: TokenUsage = {
        promptTokens: response?.usage?.prompt_tokens ?? 0,
        completionTokens: response?.usage?.completion_tokens ?? 0,
        totalTokens: response?.usage?.total_tokens ?? 0
      };

      const call: Call = {
        id: response?.id ?? crypto.randomUUID().slice(0, 12),
        timestamp: new Date().toISOString(),
        durationMs,
        input: {
          system: systemPrompt,
          messages: callMessages
        },
        output: {
          content: outBlocks,
          stopReason: firstChoice?.finish_reason ?? "unknown",
          usage
        },
        error: errorMsg
      };

      writer.recordCall(call);
    }
  };

  return client;
}
