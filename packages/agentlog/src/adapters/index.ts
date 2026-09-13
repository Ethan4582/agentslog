import { wrapAnthropicClient, type AnthropicClientLike } from "./anthropic";
import { wrapOpenAIClient, type OpenAIClientLike } from "./openai";
import { wrapGenerateText } from "./vercel-ai";
import type { SessionWriterOptions } from "../capture/writer";

export { wrapAnthropicClient, wrapOpenAIClient, wrapGenerateText };
export type { AnthropicClientLike, OpenAIClientLike };

export function wrap<T>(
  client: T,
  options?: SessionWriterOptions & { title?: string }
): T {
  if (typeof client === "object" && client !== null) {
    const candidate = client as Record<string, unknown>;
    if (
      "messages" in candidate &&
      typeof (candidate.messages as Record<string, unknown>)?.create === "function"
    ) {
      return wrapAnthropicClient(
        client as unknown as AnthropicClientLike,
        options
      ) as unknown as T;
    }
    if (
      "chat" in candidate &&
      typeof (candidate.chat as Record<string, unknown>)?.completions === "object" &&
      typeof (
        (candidate.chat as Record<string, unknown>).completions as Record<string, unknown>
      )?.create === "function"
    ) {
      return wrapOpenAIClient(
        client as unknown as OpenAIClientLike,
        options
      ) as unknown as T;
    }
  }
  return client;
}
