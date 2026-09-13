import type { Session } from "../capture/session";
import {
  INTERVIEW_SYSTEM_PROMPT,
  buildInterviewPrompt,
  DEBUG_SYSTEM_PROMPT,
  buildDebugPrompt,
  AUDIT_SYSTEM_PROMPT,
  buildAuditPrompt,
  PORTFOLIO_SYSTEM_PROMPT,
  buildPortfolioPrompt
} from "../prompts";
import {
  renderInterviewHtml,
  renderDebugHtml,
  renderAuditHtml,
  renderPortfolioHtml,
  type InterviewAnalysis
} from "../templates";

export type LogType = "interview" | "debug" | "audit" | "portfolio";

export interface LogTypeHandler {
  type: LogType;
  systemPrompt: string;
  buildPrompt: (session: Session) => string;
  renderHtml: (session: Session, analysis?: unknown) => string;
}

export const LOG_TYPE_HANDLERS: Record<LogType, LogTypeHandler> = {
  interview: {
    type: "interview",
    systemPrompt: INTERVIEW_SYSTEM_PROMPT,
    buildPrompt: buildInterviewPrompt,
    renderHtml: (session, analysis) =>
      renderInterviewHtml(session, analysis as InterviewAnalysis | undefined)
  },
  debug: {
    type: "debug",
    systemPrompt: DEBUG_SYSTEM_PROMPT,
    buildPrompt: buildDebugPrompt,
    renderHtml: (session) => renderDebugHtml(session)
  },
  audit: {
    type: "audit",
    systemPrompt: AUDIT_SYSTEM_PROMPT,
    buildPrompt: buildAuditPrompt,
    renderHtml: (session) => renderAuditHtml(session)
  },
  portfolio: {
    type: "portfolio",
    systemPrompt: PORTFOLIO_SYSTEM_PROMPT,
    buildPrompt: buildPortfolioPrompt,
    renderHtml: (session) => renderPortfolioHtml(session)
  }
};
