# CLI Publishing and Usage Instructions

This guide covers building, verifying, and publishing `agent-logs` to npm, along with CLI usage commands.

---

## 1. Build the Package

From the repository root:

```bash
# Build the CLI bundle and TypeScript declarations
bun run build:pkg
```

Or from within `packages/agentlog`:

```bash
cd packages/agentlog
bun run build
```

This compiles:
- `dist/index.js` (Library entry point)
- `dist/cli/index.js` (CLI executable with `#!/usr/bin/env node`)
- `dist/**/*.d.ts` (TypeScript type declarations)

---

## 2. Verify Package Contents

Before publishing, verify that only the required production files are included in the tarball:

```bash
cd packages/agentlog
npm pack --dry-run
```

Ensure only `dist/`, `README.md`, `LICENSE`, and `package.json` appear in the file list. Source files, tests, and configuration files are excluded automatically.

---

## 3. Publish to npm

### First-Time Login
```bash
npm login
```

### Publishing the Package
```bash
cd packages/agentlog

# For initial release
npm publish --access public

# For subsequent updates (bump version first)
npm version patch
npm publish --access public
```

---

## 4. CLI Usage Guide

The CLI runs directly via `npx` or globally installed:

```bash
npm install -g agent-logs
```

### Commands

| Command | Description |
|---|---|
| `npx agent-logs` | Show help and version |
| `npx agent-logs init` | Interactive first-run setup (creates `.agentlog/` and config) |
| `npx agent-logs sessions` | List captured sessions, token counts, and dollar costs |
| `npx agent-logs sessions clear` | Delete all local session traces |
| `npx agent-logs export` | Interactive prompt to select session and export format |
| `npx agent-logs share` | Export and upload session HTML to GitHub Gist |

### Export Options

```bash
# Export specific session non-interactively
npx agent-logs export --session <session-id> --type interview --output ./trace.html

# Available formats:
# --type interview   Story-driven narrative showing reasoning and decisions
# --type debug       Dense timeline with millisecond latency and raw payloads
# --type audit       Compliance ledger with token counts and itemized costs
# --type portfolio   Outcome-focused summary for engineering showcases
```

### Environment Variables

- `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`: Used by `agent-logs export` for optional narrative synthesis.
- `GITHUB_TOKEN`: Required for `agent-logs share` to upload to a GitHub Gist.
