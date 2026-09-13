import type { Session } from "../capture/session";

export const PORTFOLIO_SYSTEM_PROMPT = `You are a portfolio curator. Create a clean showcase highlighting project achievements.`;

export function buildPortfolioPrompt(session: Session): string {
  return `Portfolio showcase extraction for session ${session.id}:\n${JSON.stringify(session, null, 2)}`;
}
