import type { Session } from "../capture/session";

export function renderPortfolioHtml(session: Session): string {
  return `<!DOCTYPE html>
<html>
<head><title>Portfolio Log: ${session.id}</title><style>body{background:#000;color:#fff;font-family:sans-serif;padding:24px;}</style></head>
<body>
  <h1>Portfolio Showcase — Session ${session.id}</h1>
  <p>Coming soon in v1.1. Minimal noise presentation of ${session.calls.length} development calls.</p>
</body>
</html>`;
}
