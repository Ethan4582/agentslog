import type { Session } from "../capture/session";

export const DEBUG_SYSTEM_PROMPT = `You are a systems debugger. Output raw chronological call telemetry with error diagnostics.`;

export function buildDebugPrompt(session: Session): string {
  return `Debug trace extraction for session ${session.id}:\n${JSON.stringify(session, null, 2)}`;
}
