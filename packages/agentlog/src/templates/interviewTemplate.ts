import type { Session } from "../capture/session";
import { calculateCost } from "../costs";

export interface InterviewAnalysis {
  title?: string;
  summary?: string;
  narrative?: string;
  keyDecisions?: string[];
  toolsUsed?: string[];
  lessonsLearned?: string[];
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderInterviewHtml(
  session: Session,
  analysis?: InterviewAnalysis
): string {
  const totalTokens = session.calls.reduce(
    (acc, c) => acc + c.output.usage.totalTokens,
    0
  );
  const promptTokens = session.calls.reduce(
    (acc, c) => acc + c.output.usage.promptTokens,
    0
  );
  const completionTokens = session.calls.reduce(
    (acc, c) => acc + c.output.usage.completionTokens,
    0
  );

  const cost = calculateCost(session.model, {
    promptTokens,
    completionTokens,
    totalTokens
  });

  const costDisplay = cost !== null ? `$${cost.toFixed(4)}` : "Unknown";
  const title = escapeHtml(
    analysis?.title || session.title || `Session ${session.id}`
  );
  const summary = escapeHtml(
    analysis?.summary || "AI coding session trace recorded with agentlog."
  );

  const decisionsHtml = (analysis?.keyDecisions ?? [])
    .map((d) => `<li>${escapeHtml(d)}</li>`)
    .join("");

  const toolsHtml = (analysis?.toolsUsed ?? [])
    .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
    .join(" ");

  const lessonsHtml = (analysis?.lessonsLearned ?? [])
    .map((l) => `<li>${escapeHtml(l)}</li>`)
    .join("");

  const callsHtml = session.calls
    .map((c, i) => {
      const callTokens = c.output.usage.totalTokens;
      const ms = c.durationMs;
      const userMsgs = c.input.messages.filter((m) => m.role === "user");
      const userText = userMsgs
        .map((m) =>
          typeof m.content === "string" ? m.content : JSON.stringify(m.content)
        )
        .join("\n\n");

      const outText = c.output.content
        .map((b) => (b.type === "text" ? b.text : ""))
        .filter(Boolean)
        .join("\n\n");

      const toolBlocks = c.output.content.filter((b) => b.type === "tool_use");

      const toolsMarkup =
        toolBlocks.length > 0
          ? `
        <details class="tool-accordion">
          <summary>${toolBlocks.length} tool call${
              toolBlocks.length > 1 ? "s" : ""
            } (click to expand)</summary>
          <div class="tool-body">
            ${toolBlocks
              .map(
                (tb) => `
              <div class="tool-call-item">
                <span class="tool-name">${escapeHtml(
                  tb.type === "tool_use" ? tb.name : "tool"
                )}</span>
                <pre><code>${escapeHtml(
                  tb.type === "tool_use"
                    ? JSON.stringify(tb.input, null, 2)
                    : ""
                )}</code></pre>
              </div>
            `
              )
              .join("")}
          </div>
        </details>
      `
          : "";

      return `
      <div class="card call-card">
        <div class="call-meta">
          <div class="call-step">Step ${i + 1}</div>
          <div class="call-badges">
            <span class="badge">${ms}ms</span>
            <span class="badge">${callTokens} tokens</span>
            <span class="badge stop-reason">${escapeHtml(c.output.stopReason)}</span>
          </div>
        </div>

        ${
          userText
            ? `
          <div class="call-section">
            <div class="section-label">User Prompt</div>
            <div class="msg-box user-box">${escapeHtml(userText)}</div>
          </div>
        `
            : ""
        }

        ${
          outText
            ? `
          <div class="call-section">
            <div class="section-label">Assistant Output</div>
            <div class="msg-box assistant-box">${escapeHtml(outText)}</div>
          </div>
        `
            : ""
        }

        ${toolsMarkup}

        ${
          c.error
            ? `
          <div class="error-banner">
            <strong>Error:</strong> ${escapeHtml(c.error)}
          </div>
        `
            : ""
        }
      </div>
    `;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | agentlog</title>
  <style>
    :root {
      --bg: #0f0f0f;
      --card-bg: #161616;
      --border: #262626;
      --text: #ededed;
      --muted: #888888;
      --accent: #f5a623;
      --font-serif: Georgia, Cambria, 'Times New Roman', Times, serif;
      --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: var(--font-sans);
      line-height: 1.6;
      padding: 32px 16px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    header {
      border-bottom: 1px solid var(--border);
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--accent);
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    h1 {
      font-family: var(--font-serif);
      font-size: 2.5rem;
      font-weight: normal;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
      line-height: 1.15;
    }
    .summary {
      color: var(--muted);
      font-size: 1.1rem;
      margin-bottom: 24px;
    }
    .stats-bar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 12px;
      margin-top: 16px;
    }
    .stat-pill {
      background: var(--card-bg);
      border: 1px solid var(--border);
      padding: 12px 14px;
      border-radius: 8px;
    }
    .stat-label {
      font-size: 11px;
      text-transform: uppercase;
      color: var(--muted);
      letter-spacing: 0.05em;
      display: block;
      margin-bottom: 4px;
    }
    .stat-value {
      font-family: var(--font-mono);
      font-size: 15px;
      font-weight: 600;
      color: #fff;
    }
    .stat-value.accent {
      color: var(--accent);
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .card-title {
      font-family: var(--font-serif);
      font-size: 1.5rem;
      margin-bottom: 16px;
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .narrative-content {
      color: #d1d5db;
      font-size: 0.95rem;
      white-space: pre-line;
      line-height: 1.7;
    }
    .list-block {
      margin-top: 16px;
      padding-left: 20px;
    }
    .list-block li {
      margin-bottom: 8px;
      color: #d1d5db;
    }
    .tag-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    .tag {
      background: rgba(245, 166, 35, 0.1);
      border: 1px solid rgba(245, 166, 35, 0.25);
      color: var(--accent);
      padding: 4px 10px;
      border-radius: 6px;
      font-family: var(--font-mono);
      font-size: 12px;
    }
    .timeline-title {
      font-family: var(--font-serif);
      font-size: 1.8rem;
      margin: 40px 0 20px 0;
      letter-spacing: -0.01em;
    }
    .call-card {
      position: relative;
    }
    .call-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border);
    }
    .call-step {
      font-family: var(--font-mono);
      font-weight: 700;
      font-size: 13px;
      color: var(--accent);
    }
    .call-badges {
      display: flex;
      gap: 8px;
    }
    .badge {
      background: #222;
      border: 1px solid #333;
      padding: 2px 8px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--muted);
    }
    .badge.stop-reason {
      color: #34d399;
    }
    .call-section {
      margin-bottom: 14px;
    }
    .section-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--muted);
      margin-bottom: 6px;
    }
    .msg-box {
      font-family: var(--font-mono);
      font-size: 13px;
      padding: 12px;
      border-radius: 6px;
      background: #0a0a0a;
      border: 1px solid #222;
      white-space: pre-wrap;
      word-break: break-word;
      max-height: 380px;
      overflow-y: auto;
    }
    .user-box {
      border-left: 3px solid var(--accent);
    }
    .assistant-box {
      border-left: 3px solid #38bdf8;
    }
    .tool-accordion {
      margin-top: 14px;
      background: #111;
      border: 1px solid #222;
      border-radius: 6px;
      overflow: hidden;
    }
    .tool-accordion summary {
      padding: 10px 14px;
      font-size: 12px;
      color: var(--accent);
      cursor: pointer;
      user-select: none;
      font-family: var(--font-mono);
    }
    .tool-body {
      padding: 12px;
      border-top: 1px solid #222;
    }
    .tool-call-item {
      margin-bottom: 10px;
    }
    .tool-name {
      font-family: var(--font-mono);
      font-size: 12px;
      color: #60a5fa;
      display: inline-block;
      margin-bottom: 4px;
    }
    .tool-call-item pre {
      background: #0a0a0a;
      padding: 8px;
      border-radius: 4px;
      font-size: 11px;
      overflow-x: auto;
    }
    .error-banner {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #fca5a5;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 13px;
      margin-top: 12px;
    }
    footer {
      text-align: center;
      font-size: 12px;
      color: var(--muted);
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="brand">agentlog &bull; Interview Log</div>
      <h1>${title}</h1>
      <div class="summary">${summary}</div>
      <div class="stats-bar">
        <div class="stat-pill">
          <span class="stat-label">Model</span>
          <span class="stat-value">${escapeHtml(session.model)}</span>
        </div>
        <div class="stat-pill">
          <span class="stat-label">Provider</span>
          <span class="stat-value">${escapeHtml(session.provider)}</span>
        </div>
        <div class="stat-pill">
          <span class="stat-label">Total Calls</span>
          <span class="stat-value">${session.calls.length}</span>
        </div>
        <div class="stat-pill">
          <span class="stat-label">Tokens</span>
          <span class="stat-value">${totalTokens.toLocaleString()}</span>
        </div>
        <div class="stat-pill">
          <span class="stat-label">Est. Cost</span>
          <span class="stat-value accent">${costDisplay}</span>
        </div>
      </div>
    </header>

    ${
      analysis?.narrative || analysis?.keyDecisions?.length
        ? `
      <section class="card">
        <div class="card-title">Reasoning Flow</div>
        ${
          analysis.narrative
            ? `<div class="narrative-content">${escapeHtml(
                analysis.narrative
              )}</div>`
            : ""
        }
        ${
          decisionsHtml
            ? `
          <div style="margin-top: 20px;">
            <strong style="font-size: 13px; text-transform: uppercase; color: var(--muted); letter-spacing: 0.05em;">Key Architecture Decisions:</strong>
            <ul class="list-block">${decisionsHtml}</ul>
          </div>
        `
            : ""
        }
        ${
          toolsHtml
            ? `
          <div style="margin-top: 20px;">
            <strong style="font-size: 13px; text-transform: uppercase; color: var(--muted); letter-spacing: 0.05em;">Tools & Capabilities Used:</strong>
            <div class="tag-container">${toolsHtml}</div>
          </div>
        `
            : ""
        }
        ${
          lessonsHtml
            ? `
          <div style="margin-top: 20px;">
            <strong style="font-size: 13px; text-transform: uppercase; color: var(--muted); letter-spacing: 0.05em;">Learnings & Observations:</strong>
            <ul class="list-block">${lessonsHtml}</ul>
          </div>
        `
            : ""
        }
      </section>
    `
        : ""
    }

    <h2 class="timeline-title">Execution Timeline</h2>
    <div class="timeline">
      ${callsHtml || `<div class="card" style="text-align: center; color: var(--muted);">No calls recorded in this session.</div>`}
    </div>

    <footer>
      Generated with agentlog &bull; Zero-config AI session logger
    </footer>
  </div>
</body>
</html>`;
}
