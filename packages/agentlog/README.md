# agent-logs

Log AI agent sessions locally. Wrap once, export anywhere.

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

Calls are saved automatically to `.agentlog/sessions/` with secrets removed.

### 3. Inspect and export

```bash
# List captured sessions
npx agent-logs sessions

# Export session to a standalone HTML file
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

- **One-line setup:** Works with Anthropic, OpenAI, DeepSeek, and Vercel AI SDK.
- **Crash-safe:** Saves each call immediately to disk so you never lose data if your script crashes.
- **Automatic secret redaction:** Removes API keys, tokens, and emails before anything is saved.
- **Cost tracking:** Estimates token usage and costs for Claude, GPT, DeepSeek, and Gemini models.
- **Standalone HTML exports:** Generates clean reports you can open in any browser.
- **100% local:** No accounts, no cloud setup, and no telemetry.
