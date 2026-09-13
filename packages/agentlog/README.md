# agent-logs

Zero-config AI session logger. Wrap once, export anywhere.

## Installation

```bash
npm install agent-logs
# or
bun add agent-logs
```

## Quick Start

### 1. Wrap your client

```ts
import Anthropic from "@anthropic-ai/sdk";
import { wrap } from "agent-logs";

const client = wrap(new Anthropic());
```

For OpenAI or compatible endpoints (e.g. DeepSeek):

```ts
import OpenAI from "openai";
import { wrap } from "agent-logs";

const client = wrap(new OpenAI());
```

### 2. Run your agent normally

Every call is captured silently to `.agentlog/sessions/` with secrets scrubbed automatically.

### 3. Inspect and export

```bash
# List captured sessions
npx agent-logs sessions

# Export session to a self-contained HTML file
npx agent-logs export
```

## CLI Commands

| Command | Description |
|---|---|
| `npx agent-logs init` | Interactive setup and configuration |
| `npx agent-logs sessions` | List captured sessions and token costs |
| `npx agent-logs sessions clear` | Delete local session traces |
| `npx agent-logs export` | Export session to standalone HTML |
| `npx agent-logs share` | Export and upload trace to GitHub Gist |

## Features

- **Single-line wrap:** Works with Anthropic, OpenAI, DeepSeek, and Vercel AI SDK.
- **Append-only streaming:** Saves to local NDJSON so traces survive process crashes.
- **In-memory redaction:** Strips API keys, Bearer tokens, and emails before saving.
- **Token cost tracking:** Built-in pricing for Claude, GPT, DeepSeek, and Gemini models.
- **Self-contained HTML:** Generates standalone reports without external runtime dependencies.
- **Zero telemetry:** 100% local and offline.
