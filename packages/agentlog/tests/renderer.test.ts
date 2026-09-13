import { describe, it, expect, afterAll } from "bun:test";
import { existsSync, rmSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { exportSession } from "../src/export/renderer";
import type { Session } from "../src/capture/session";

describe("renderer", () => {
  const exportDir = resolve(process.cwd(), ".agentlog-test-exports");

  const sampleSession: Session = {
    id: "test-sess-001",
    startedAt: new Date().toISOString(),
    provider: "anthropic",
    model: "claude-3-5-sonnet",
    title: "Stream Claude Bash Command Output",
    calls: [
      {
        id: "call-1",
        timestamp: new Date().toISOString(),
        durationMs: 450,
        input: {
          messages: [
            {
              role: "user",
              content:
                "Is it possible to stream the output of claude as a means to track progress?"
            }
          ]
        },
        output: {
          content: [
            {
              type: "text",
              text: "Yes, you can stream the stdout chunks directly via child_process."
            }
          ],
          stopReason: "end_turn",
          usage: {
            promptTokens: 45,
            completionTokens: 30,
            totalTokens: 75
          }
        }
      }
    ]
  };

  afterAll(() => {
    if (existsSync(exportDir)) {
      rmSync(exportDir, { recursive: true, force: true });
    }
  });

  it("exports interview session to self-contained HTML file", async () => {
    const result = await exportSession(sampleSession, {
      type: "interview",
      exportDir: ".agentlog-test-exports",
      skipLlm: true
    });

    expect(existsSync(result.outputPath)).toBe(true);
    const content = readFileSync(result.outputPath, "utf8");
    expect(content).toContain("<!DOCTYPE html>");
    expect(content).toContain("Stream Claude Bash Command Output");
    expect(content).toContain("claude-3-5-sonnet");
    expect(content).toContain("Is it possible to stream the output");
    expect(content).toContain("75 tokens");
  });

  it("exports debug session with telemetry metrics and raw calls", async () => {
    const result = await exportSession(sampleSession, {
      type: "debug",
      exportDir: ".agentlog-test-exports",
      skipLlm: true
    });

    expect(existsSync(result.outputPath)).toBe(true);
    const content = readFileSync(result.outputPath, "utf8");
    expect(content).toContain("<!DOCTYPE html>");
    expect(content).toContain("Debug Telemetry");
    expect(content).toContain("450ms");
    expect(content).toContain("75");
    expect(content).toContain("Input Messages");
  });

  it("exports audit session with compliance ledger and cost calculations", async () => {
    const result = await exportSession(sampleSession, {
      type: "audit",
      exportDir: ".agentlog-test-exports",
      skipLlm: true
    });

    expect(existsSync(result.outputPath)).toBe(true);
    const content = readFileSync(result.outputPath, "utf8");
    expect(content).toContain("<!DOCTYPE html>");
    expect(content).toContain("Audit Ledger");
    expect(content).toContain("SANITIZED");
    expect(content).toContain("Turn");
  });

  it("exports portfolio session with clean showcase presentation", async () => {
    const result = await exportSession(sampleSession, {
      type: "portfolio",
      exportDir: ".agentlog-test-exports",
      skipLlm: true
    });

    expect(existsSync(result.outputPath)).toBe(true);
    const content = readFileSync(result.outputPath, "utf8");
    expect(content).toContain("<!DOCTYPE html>");
    expect(content).toContain("Engineering Showcase");
    expect(content).toContain("Stream Claude Bash Command Output");
    expect(content).toContain("Step 1");
  });
});
