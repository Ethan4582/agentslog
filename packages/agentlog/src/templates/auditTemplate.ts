import type { Session } from "../capture/session";

export function renderAuditHtml(session: Session): string {
  return `<!DOCTYPE html>
<html>
<head><title>Audit Log: ${session.id}</title><style>body{background:#0d1117;color:#c9d1d9;font-family:sans-serif;padding:24px;}</style></head>
<body>
  <h1>Audit Log & Compliance Report — Session ${session.id}</h1>
  <p>Coming soon in v1.1. Captured ${session.calls.length} calls with full provenance.</p>
</body>
</html>`;
}
