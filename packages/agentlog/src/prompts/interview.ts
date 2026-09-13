import type { Session } from "../capture/session";

export const INTERVIEW_SYSTEM_PROMPT = `You are an expert engineering interviewer and technical writer.
Analyze the provided AI coding session trace and extract a clear, compelling story of what the developer was solving.

Highlight:
1. The goal and problem statement.
2. Architecture and design decisions made along the way.
3. Tool usage, execution steps, iterations, and error recoveries.
4. Final outcome and takeaways.

Respond ONLY with valid JSON matching this schema:
{
  "title": "Clear 4-8 word title describing the technical objective",
  "summary": "1-2 sentence executive overview",
  "narrative": "Structured markdown explanation of the thought process and reasoning",
  "keyDecisions": ["Decision 1 with rationale", "Decision 2 with rationale"],
  "toolsUsed": ["List of tools, libraries, or bash commands utilized"],
  "lessonsLearned": ["Key insight or takeaway 1", "Key insight or takeaway 2"]
}`;

export function buildInterviewPrompt(session: Session): string {
  const compactCalls = session.calls.map((c, idx) => ({
    step: idx + 1,
    timestamp: c.timestamp,
    durationMs: c.durationMs,
    systemPrompt: c.input.system,
    userMessages: c.input.messages
      .filter((m) => m.role === "user")
      .map((m) => (typeof m.content === "string" ? m.content : JSON.stringify(m.content))),
    assistantOutputs: c.output.content.map((b) =>
      b.type === "text"
        ? b.text
        : b.type === "tool_use"
          ? `[Tool: ${b.name}]`
          : `[ToolResult]`
    ),
    tokenUsage: c.output.usage,
    error: c.error
  }));

  return `Here is the AI development session trace:
Session ID: ${session.id}
Started At: ${session.startedAt}
Provider: ${session.provider}
Model: ${session.model}
Total Calls: ${session.calls.length}

Trace Details:
${JSON.stringify(compactCalls, null, 2)}

Provide the structured interview analysis JSON.`;
}
