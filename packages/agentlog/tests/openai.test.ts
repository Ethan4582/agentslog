import { describe, it, expect, afterAll } from "bun:test";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { wrapOpenAIClient } from "../src/adapters/openai";
import { listSessions } from "../src/capture/writer";

describe("openai adapter", () => {
  const testDir = resolve(process.cwd(), ".agentlog-test-openai");

  afterAll(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it("intercepts chat.completions.create and detects deepseek baseURL", async () => {
    const mockClient = {
      baseURL: "https://api.deepseek.com/v1",
      chat: {
        completions: {
          create: async () => ({
            id: "chatcmpl_987",
            model: "deepseek-chat",
            choices: [
              {
                index: 0,
                message: {
                  role: "assistant" as const,
                  content: "DeepSeek response text."
                },
                finish_reason: "stop"
              }
            ],
            usage: {
              prompt_tokens: 12,
              completion_tokens: 6,
              total_tokens: 18
            }
          })
        }
      }
    };

    const wrapped = wrapOpenAIClient(mockClient, {
      sessionDir: ".agentlog-test-openai",
      title: "DeepSeek Test"
    });

    const res = await wrapped.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: "Tell me something" }]
    });

    expect(res.choices[0].message.content).toBe("DeepSeek response text.");

    const sessions = listSessions(".agentlog-test-openai");
    expect(sessions.length).toBe(1);
    expect(sessions[0].provider).toBe("deepseek");
    expect(sessions[0].calls.length).toBe(1);
  });
});
