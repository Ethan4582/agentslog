import type { Session } from "../capture/session";

export function renderDebugHtml(session: Session): string {
  return `<!DOCTYPE html>
<html>
<head><title>Debug Log: ${session.id}</title><style>body{background:#111;color:#eee;font-family:monospace;padding:24px;}</style></head>
<body>
  <h1>Debug Log — Session ${session.id}</h1>
  <p>Model: ${session.model} | Calls: ${session.calls.length}</p>
  <pre>${JSON.stringify(session, null, 2)}</pre>
</body>
</html>`;
}
