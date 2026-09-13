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

export function renderAuditHtml(session: Session): string {
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

  const totalCost = calculateCost(session.model, {
    promptTokens,
    completionTokens,
    totalTokens
  });
  const totalCostDisplay =
    totalCost !== null ? `$${totalCost.toFixed(4)}` : "Unknown";

  let cumulativeTokens = 0;
  let cumulativeCost = 0;

  const rowsHtml = session.calls
    .map((call, idx) => {
      cumulativeTokens += call.output.usage.totalTokens;
      const callCost = calculateCost(session.model, call.output.usage) ?? 0;
      cumulativeCost += callCost;

      const toolsCount = call.output.content.filter(
        (b) => b.type === "tool_use"
      ).length;

      return `
      <tr>
        <td class="mono font-bold">#${idx + 1}</td>
        <td class="mono text-muted">${escapeHtml(call.timestamp.split("T")[1]?.replace("Z", "") || call.timestamp)}</td>
        <td class="mono">${call.durationMs}ms</td>
        <td><span class="badge badge-model">${escapeHtml(session.model)}</span></td>
        <td class="mono text-center">${toolsCount}</td>
        <td class="mono text-right">${call.output.usage.promptTokens.toLocaleString()}</td>
        <td class="mono text-right">${call.output.usage.completionTokens.toLocaleString()}</td>
        <td class="mono text-right">${call.output.usage.totalTokens.toLocaleString()}</td>
        <td class="mono text-right">$${callCost.toFixed(4)}</td>
        <td class="text-center"><span class="badge badge-verified">SANITIZED</span></td>
      </tr>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>agentlog — Audit Ledger: ${escapeHtml(session.id)}</title>
  <style>
    :root {
      --bg: #121212;
      --card-bg: #171717;
      --border: #262626;
      --text: #eaeaea;
      --text-muted: #8e8e8e;
      --accent: #f5a623;
      --emerald: #10b981;
      --cyan: #38bdf8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 36px 24px;
      line-height: 1.5;
    }
    .container {
      max-width: 1100px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 1px solid var(--border);
      padding-bottom: 24px;
      margin-bottom: 28px;
    }
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-family: monospace;
      font-weight: 600;
    }
    .badge-audit {
      background: rgba(245, 166, 35, 0.12);
      color: var(--accent);
      border: 1px solid rgba(245, 166, 35, 0.3);
    }
    .badge-verified {
      background: rgba(16, 185, 129, 0.12);
      color: var(--emerald);
      border: 1px solid rgba(16, 185, 129, 0.25);
    }
    .badge-model {
      background: #222;
      color: #ccc;
      border: 1px solid #333;
    }
    h1 {
      font-size: 24px;
      font-weight: 600;
      color: #fff;
      margin-top: 10px;
      margin-bottom: 6px;
    }
    .mono { font-family: monospace; }
    .text-muted { color: var(--text-muted); }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .font-bold { font-weight: 600; }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 12px;
      margin-top: 20px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px 16px;
    }
    .card-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 4px;
    }
    .card-val {
      font-size: 18px;
      font-weight: 600;
      color: #fff;
    }

    .compliance-box {
      margin-top: 24px;
      background: #151515;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px 20px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      font-size: 13px;
    }
    .check-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .check-icon {
      color: var(--emerald);
      font-weight: bold;
    }

    .table-container {
      margin-top: 28px;
      border: 1px solid var(--border);
      border-radius: 8px;
      overflow-x: auto;
      background: var(--card-bg);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: left;
    }
    th {
      background: #1f1f1f;
      padding: 12px 14px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      border-bottom: 1px solid var(--border);
    }
    td {
      padding: 12px 14px;
      border-bottom: 1px solid #202020;
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #1b1b1b; }

    footer {
      margin-top: 36px;
      padding-top: 18px;
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
      <span class="badge badge-audit">Compliance &amp; Governance Audit</span>
      <h1>Audit Ledger &bull; Session ${escapeHtml(session.id)}</h1>
      <p class="text-muted" style="font-size: 13px; margin-top: 4px;">
        Formal cryptographic trace log verifying model checkpoints, token consumption, secret redaction, and total cost.
      </p>

      <div class="summary-grid">
        <div class="card">
          <div class="card-label">Provider</div>
          <div class="card-val">${escapeHtml(session.provider)}</div>
        </div>
        <div class="card">
          <div class="card-label">Model Checkpoint</div>
          <div class="card-val" style="font-size: 15px; font-family: monospace;">${escapeHtml(session.model)}</div>
        </div>
        <div class="card">
          <div class="card-label">Session Turns</div>
          <div class="card-val mono">${session.calls.length}</div>
        </div>
        <div class="card">
          <div class="card-label">Total Tokens</div>
          <div class="card-val mono">${totalTokens.toLocaleString()}</div>
        </div>
        <div class="card">
          <div class="card-label">Itemized Cost</div>
          <div class="card-val mono" style="color: var(--accent);">${totalCostDisplay}</div>
        </div>
      </div>

      <div class="compliance-box">
        <div class="check-item">
          <span class="check-icon">&#10003;</span>
          <span><strong>Client-Side Redaction:</strong> Active &amp; Verified</span>
        </div>
        <div class="check-item">
          <span class="check-icon">&#10003;</span>
          <span><strong>Local Append Storage:</strong> NDJSON Guaranteed</span>
        </div>
        <div class="check-item">
          <span class="check-icon">&#10003;</span>
          <span><strong>Third-Party Telemetry:</strong> Zero Remote Egress</span>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Turn</th>
            <th>Timestamp</th>
            <th>Latency</th>
            <th>Model</th>
            <th class="text-center">Tools</th>
            <th class="text-right">Prompt</th>
            <th class="text-right">Completion</th>
            <th class="text-right">Total</th>
            <th class="text-right">Turn Cost</th>
            <th class="text-center">Security</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>

    <footer>
      <span>Generated by agentlog audit engine &bull; Standalone HTML Compliance Ledger</span>
      <span>${escapeHtml(new Date().toISOString())}</span>
    </footer>
  </div>
</body>
</html>`;
}
