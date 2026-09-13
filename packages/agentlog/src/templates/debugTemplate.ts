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

export function renderDebugHtml(session: Session): string {
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

  const totalDurationMs = session.calls.reduce(
    (acc, c) => acc + (c.durationMs || 0),
    0
  );

  const cost = calculateCost(session.model, {
    promptTokens,
    completionTokens,
    totalTokens
  });
  const costDisplay = cost !== null ? `$${cost.toFixed(4)}` : "Unknown";

  const callsHtml = session.calls
    .map((call, idx) => {
      const callCost = calculateCost(session.model, call.output.usage);
      const callCostDisplay =
        callCost !== null ? `$${callCost.toFixed(4)}` : "Unknown";

      const toolsUsed = call.output.content
        .filter((b) => b.type === "tool_use")
        .map((b) => b.name)
        .join(", ") || "None";

      const messagesJson = escapeHtml(
        JSON.stringify(call.input.messages, null, 2)
      );
      const outputJson = escapeHtml(
        JSON.stringify(call.output.content, null, 2)
      );

      return `
      <div class="call-card">
        <div class="call-header">
          <div class="call-title">
            <span class="badge badge-turn">CALL #${idx + 1}</span>
            <span class="call-time">${escapeHtml(call.timestamp)}</span>
          </div>
          <div class="call-meta">
            <span class="meta-item"><span class="label">Duration:</span> ${call.durationMs}ms</span>
            <span class="meta-item"><span class="label">Tokens:</span> ${call.output.usage.totalTokens.toLocaleString()}</span>
            <span class="meta-item"><span class="label">Cost:</span> ${callCostDisplay}</span>
            <span class="meta-item"><span class="label">Stop:</span> ${escapeHtml(call.output.stopReason || "end_turn")}</span>
          </div>
        </div>

        <div class="call-body">
          <div class="tools-summary">
            <span class="label">Tools Executed:</span> <code>${escapeHtml(toolsUsed)}</code>
          </div>

          <details class="section-details" open>
            <summary>Input Messages (${call.input.messages.length})</summary>
            <pre class="code-box"><code>${messagesJson}</code></pre>
          </details>

          <details class="section-details" open>
            <summary>Output Content Blocks (${call.output.content.length})</summary>
            <pre class="code-box"><code>${outputJson}</code></pre>
          </details>
        </div>
      </div>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>agentlog — Debug Telemetry: ${escapeHtml(session.id)}</title>
  <style>
    :root {
      --bg: #121212;
      --card-bg: #181818;
      --subtle-bg: #1f1f1f;
      --border: #2a2a2a;
      --text: #e5e5e5;
      --text-muted: #888888;
      --accent: #f5a623;
      --accent-dim: rgba(245, 166, 35, 0.15);
      --success: #10b981;
      --cyan: #38bdf8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
      padding: 32px 20px;
      line-height: 1.5;
    }
    .container {
      max-width: 1040px;
      margin: 0 auto;
    }
    header {
      border-bottom: 1px solid var(--border);
      padding-bottom: 24px;
      margin-bottom: 28px;
    }
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: var(--accent);
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      font-family: monospace;
    }
    .badge-debug {
      background: var(--accent-dim);
      color: var(--accent);
      border: 1px solid rgba(245, 166, 35, 0.3);
    }
    .badge-turn {
      background: #252525;
      color: #ffffff;
      border: 1px solid #383838;
    }
    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 16px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 12px;
      margin-top: 16px;
    }
    .stat-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 14px;
    }
    .stat-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 4px;
    }
    .stat-val {
      font-size: 16px;
      font-weight: 600;
      font-family: monospace;
      color: #ffffff;
    }
    .calls-container {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .call-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
    }
    .call-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      background: var(--subtle-bg);
      border-bottom: 1px solid var(--border);
      padding: 12px 16px;
    }
    .call-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .call-time {
      font-size: 12px;
      font-family: monospace;
      color: var(--text-muted);
    }
    .call-meta {
      display: flex;
      gap: 16px;
      font-size: 12px;
      font-family: monospace;
    }
    .meta-item .label {
      color: var(--text-muted);
    }
    .call-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .tools-summary {
      font-size: 13px;
      background: #141414;
      border: 1px solid #222;
      border-radius: 6px;
      padding: 8px 12px;
    }
    .tools-summary code {
      color: var(--cyan);
      font-family: monospace;
    }
    .section-details {
      background: #131313;
      border: 1px solid var(--border);
      border-radius: 6px;
      overflow: hidden;
    }
    .section-details summary {
      padding: 10px 14px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      user-select: none;
      background: #191919;
      color: #d4d4d4;
    }
    .section-details summary:hover {
      background: #222;
    }
    .code-box {
      padding: 14px;
      margin: 0;
      overflow-x: auto;
      font-family: monospace;
      font-size: 12px;
      color: #a3a3a3;
      line-height: 1.45;
      background: #0d0d0d;
    }
    footer {
      margin-top: 40px;
      padding-top: 20px;
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
    <header>
      <div class="top-bar">
        <span class="brand">agentlog &bull; debug trace</span>
        <span class="badge badge-debug">Raw Telemetry</span>
      </div>
      <h1>Session ${escapeHtml(session.id)}</h1>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Model</div>
          <div class="stat-val">${escapeHtml(session.model)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Provider</div>
          <div class="stat-val">${escapeHtml(session.provider)}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Duration</div>
          <div class="stat-val">${totalDurationMs.toLocaleString()}ms</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Calls</div>
          <div class="stat-val">${session.calls.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Total Tokens</div>
          <div class="stat-val">${totalTokens.toLocaleString()}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Est. Cost</div>
          <div class="stat-val">${costDisplay}</div>
        </div>
      </div>
    </header>

    <div class="calls-container">
      ${callsHtml}
    </div>

    <footer>
      <span>Generated by agentlog telemetry engine</span>
      <span>${escapeHtml(new Date().toISOString())}</span>
    </footer>
  </div>
</body>
</html>`;
}
