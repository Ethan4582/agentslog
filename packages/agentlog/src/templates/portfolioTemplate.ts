import type { Session } from "../capture/session";
import { calculateCost } from "../costs";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderPortfolioHtml(session: Session): string {
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

  const toolsMap = new Map<string, number>();
  for (const call of session.calls) {
    for (const b of call.output.content) {
      if (b.type === "tool_use") {
        toolsMap.set(b.name, (toolsMap.get(b.name) || 0) + 1);
      }
    }
  }

  const toolsListHtml =
    Array.from(toolsMap.entries())
      .map(
        ([name, count]) => `
      <div class="tool-badge">
        <span class="tool-name">${escapeHtml(name)}</span>
        <span class="tool-count">&times;${count}</span>
      </div>`
      )
      .join("") || `<span class="text-muted">Zero external tool calls</span>`;

  const highlightsHtml = session.calls
    .slice(0, 5)
    .map((call, idx) => {
      const toolNames = call.output.content
        .filter((b) => b.type === "tool_use")
        .map((b) => b.name);

      const userText =
        call.input.messages.find((m) => m.role === "user")?.content || "";
      const summaryText =
        typeof userText === "string"
          ? userText.slice(0, 100)
          : JSON.stringify(userText).slice(0, 100);

      return `
      <div class="milestone-card">
        <div class="milestone-index">Step ${idx + 1}</div>
        <div class="milestone-content">
          <div class="milestone-title">${escapeHtml(summaryText.replace(/[\r\n]+/g, " ")) || `Turn ${idx + 1}`}</div>
          ${
            toolNames.length > 0
              ? `<div class="milestone-meta">Invocations: ${toolNames.map((t) => `<code>${escapeHtml(t)}</code>`).join(" ")}</div>`
              : ""
          }
        </div>
      </div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>agentlog — Portfolio Showcase: ${escapeHtml(session.id)}</title>
  <style>
    :root {
      --bg: #121212;
      --card-bg: #171717;
      --border: #262626;
      --text: #ededed;
      --text-muted: #888888;
      --accent: #f5a623;
      --cyan: #38bdf8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 40px 24px;
      line-height: 1.6;
    }
    .container {
      max-width: 960px;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
    }
    .tag {
      display: inline-block;
      padding: 3px 10px;
      background: rgba(245, 166, 35, 0.12);
      border: 1px solid rgba(245, 166, 35, 0.3);
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }
    h1 {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #fff;
    }
    .subtitle {
      margin-top: 8px;
      color: var(--text-muted);
      font-size: 15px;
    }
    .metrics-bar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
      margin: 32px 0;
    }
    .metric {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      text-align: center;
    }
    .metric-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 4px;
    }
    .metric-val {
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      font-family: monospace;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      margin: 32px 0 16px 0;
      color: #fff;
    }
    .tools-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 32px;
    }
    .tool-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #1c1c1c;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 6px 12px;
      font-family: monospace;
      font-size: 12px;
    }
    .tool-name {
      color: var(--cyan);
    }
    .tool-count {
      color: var(--text-muted);
      font-size: 11px;
    }
    .milestones-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .milestone-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 16px 20px;
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }
    .milestone-index {
      font-size: 12px;
      font-weight: 700;
      font-family: monospace;
      color: var(--accent);
      background: rgba(245, 166, 35, 0.1);
      padding: 4px 8px;
      border-radius: 6px;
      white-space: nowrap;
    }
    .milestone-content {
      flex: 1;
    }
    .milestone-title {
      font-size: 14px;
      font-weight: 500;
      color: #fff;
    }
    .milestone-meta {
      margin-top: 6px;
      font-size: 12px;
      color: var(--text-muted);
    }
    .milestone-meta code {
      color: #a3a3a3;
      background: #111;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
    footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
      font-size: 12px;
      color: var(--text-muted);
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="tag">Engineering Showcase</span>
      <h1>${escapeHtml(session.title || `Session ${session.id}`)}</h1>
      <p class="subtitle">AI-assisted engineering session compiled with agentlog</p>
    </div>

    <div class="metrics-bar">
      <div class="metric">
        <div class="metric-label">Model</div>
        <div class="metric-val" style="font-size: 15px;">${escapeHtml(session.model)}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Turns Executed</div>
        <div class="metric-val">${session.calls.length}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Total Tokens</div>
        <div class="metric-val">${totalTokens.toLocaleString()}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Total Investment</div>
        <div class="metric-val" style="color: var(--accent);">${costDisplay}</div>
      </div>
    </div>

    <div class="section-title">Tools &amp; Capabilities Invoked</div>
    <div class="tools-list">
      ${toolsListHtml}
    </div>

    <div class="section-title">Execution Milestones</div>
    <div class="milestones-container">
      ${highlightsHtml}
    </div>

    <footer>
      <span>Showcase generated with agentlog &bull; Standalone HTML</span>
      <span>${escapeHtml(new Date().toISOString().split("T")[0])}</span>
    </footer>
  </div>
</body>
</html>`;
}
