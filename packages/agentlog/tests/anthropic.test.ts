import { describe, it, expect, afterAll } from "bun:test";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { wrapAnthropicClient } from "../src/adapters/anthropic";
import { listSessions } from "../src/capture/writer";

describe("anthropic adapter", () => {
  const testDir = resolve(process.cwd(), ".agentlog-test-anthropic");

  afterAll(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it("intercepts messages.create and records session call", async () => {
    const mockClient = {
      messages: {
        create: async () => ({
          id: "msg_12345",
          model: "claude-3-5-sonnet",
          role: "assistant" as const,
          stop_reason: "end_turn",
          content: [
            { type: "text", text: "Hello! How can I help you today?" }
          ],
          usage: {
            input_tokens: 15,
            output_tokens: 8
          }
        })
      }
    };

    const wrapped = wrapAnthropicClient(mockClient, {
      sessionDir: ".agentlog-test-anthropic",
      title: "Anthropic Integration Test"
    });

    const res = await wrapped.messages.create({
      model: "claude-3-5-sonnet",
      messages: [{ role: "user", content: "Hi" }]
    });

    expect(res.content[0].text).toBe("Hello! How can I help you today?");

    const sessions = listSessions(".agentlog-test-anthropic");
    expect(sessions.length).toBe(1);
    expect(sessions[0].provider).toBe("anthropic");
    expect(sessions[0].calls.length).toBe(1);
    expect(sessions[0].calls[0].output.usage.totalTokens).toBe(23);
  });
});
