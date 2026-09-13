import type { Call, ContentBlock, Message, Role, TokenUsage } from "../capture/session";
import { SessionWriter, type SessionWriterOptions } from "../capture/writer";

export interface VercelAIMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
}

export interface VercelAIGenerateOptions {
  model: { modelId?: string; provider?: string } | string;
  prompt?: string;
  messages?: VercelAIMessage[];
  system?: string;
  [key: string]: unknown;
}

export interface VercelAIGenerateResult {
  text: string;
  finishReason?: string;
  usage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  [key: string]: unknown;
}

export function wrapGenerateText<
  TFn extends (options: VercelAIGenerateOptions, ...args: unknown[]) => Promise<VercelAIGenerateResult>
>(
  fn: TFn,
  writerOptions?: SessionWriterOptions & { title?: string }
): TFn {
  let writer: SessionWriter | null = null;

  const wrapped = async function (
    options: VercelAIGenerateOptions,
    ...args: unknown[]
  ): Promise<VercelAIGenerateResult> {
    const modelName =
      typeof options.model === "string"
        ? options.model
        : options.model?.modelId ?? "vercel-model";

    const providerName =
      typeof options.model === "object" && options.model.provider
        ? options.model.provider
        : "vercel-ai";

    if (!writer) {
      writer = new SessionWriter(providerName, modelName, writerOptions?.title, writerOptions);
    }

    const start = performance.now();
    let errorMsg: string | undefined;
    let result: VercelAIGenerateResult | undefined;

    try {
      result = await fn(options, ...args);
      return result;
    } catch (err: unknown) {
      errorMsg = err instanceof Error ? err.message : String(err);
      throw err;
    } finally {
      const durationMs = Math.round(performance.now() - start);
      const callMessages: Message[] = [];

      if (options.messages) {
        for (const m of options.messages) {
          callMessages.push({
            role: m.role as Role,
            content: m.content
          });
        }
      } else if (options.prompt) {
        callMessages.push({
          role: "user",
          content: options.prompt
        });
      }

      const outBlocks: ContentBlock[] = [];
      if (result?.text) {
        outBlocks.push({
          type: "text",
          text: result.text
        });
      }

      const usage: TokenUsage = {
        promptTokens: result?.usage?.promptTokens ?? 0,
        completionTokens: result?.usage?.completionTokens ?? 0,
        totalTokens: result?.usage?.totalTokens ?? 0
      };

      const call: Call = {
        id: crypto.randomUUID().slice(0, 12),
        timestamp: new Date().toISOString(),
        durationMs,
        input: {
          system: options.system,
          messages: callMessages
        },
        output: {
          content: outBlocks,
          stopReason: result?.finishReason ?? "stop",
          usage
        },
        error: errorMsg
      };

      writer.recordCall(call);
    }
  };

  return wrapped as unknown as TFn;
}
