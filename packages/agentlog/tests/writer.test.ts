import { describe, it, expect, afterAll } from "bun:test";
import { existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { SessionWriter, readSessionFile, listSessions, clearSessions } from "../src/capture/writer";
import type { Call } from "../src/capture/session";

describe("writer", () => {
  const testDir = resolve(process.cwd(), ".agentlog-test-sessions");

  afterAll(() => {
    if (existsSync(testDir)) {
      rmSync(testDir, { recursive: true, force: true });
    }
  });

  it("creates session ndjson file with header record", () => {
    const writer = new SessionWriter("anthropic", "claude-3-5-sonnet", "Test Session", {
      sessionDir: ".agentlog-test-sessions"
    });

    expect(existsSync(writer.filePath)).toBe(true);

    const session = readSessionFile(writer.filePath);
    expect(session).not.toBeNull();
    expect(session?.id).toBe(writer.sessionId);
    expect(session?.provider).toBe("anthropic");
    expect(session?.model).toBe("claude-3-5-sonnet");
    expect(session?.calls.length).toBe(0);
  });

  it("appends calls correctly", () => {
    const writer = new SessionWriter("openai", "gpt-4o", "Call Session", {
      sessionDir: ".agentlog-test-sessions"
    });

    const call: Call = {
      id: "call-1",
      timestamp: new Date().toISOString(),
      durationMs: 120,
      input: {
        messages: [{ role: "user", content: "Write a quick test" }]
      },
      output: {
        content: [{ type: "text", text: "Here is your test" }],
        stopReason: "stop",
        usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 }
      }
    };

    writer.recordCall(call);

    const session = readSessionFile(writer.filePath);
    expect(session?.calls.length).toBe(1);
    expect(session?.calls[0].id).toBe("call-1");
    expect(session?.calls[0].durationMs).toBe(120);
    expect(session?.calls[0].output.usage.totalTokens).toBe(30);
  });

  it("lists and clears sessions", () => {
    const sessions = listSessions(".agentlog-test-sessions");
    expect(sessions.length).toBeGreaterThanOrEqual(2);

    const count = clearSessions(".agentlog-test-sessions");
    expect(count).toBeGreaterThanOrEqual(2);

    const afterClear = listSessions(".agentlog-test-sessions");
    expect(afterClear.length).toBe(0);
  });
});
