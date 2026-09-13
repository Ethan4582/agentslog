import type { Session } from "../capture/session";

export const AUDIT_SYSTEM_PROMPT = `You are a compliance auditor. Output formal model verification, token ledger, and safety traces.`;

export function buildAuditPrompt(session: Session): string {
  return `Audit log extraction for session ${session.id}:\n${JSON.stringify(session, null, 2)}`;
}
