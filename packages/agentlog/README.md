# agentlog

> Zero-config AI session logger. Wrap once, export anywhere.

## Quick Start

```bash
bun add agentlog
# or
npm install agentlog
```

### 1. Wrap your client (one-line change)

```ts
import Anthropic from '@anthropic-ai/sdk';
import { wrap } from 'agentlog';

const client = wrap(new Anthropic());
```

### 2. Run your agent normally

Every call is captured silently to `.agentlog/sessions/`.

### 3. Export when ready

```bash
npx agentlog export
```

Generates a standalone, beautiful HTML trace file ready to share with hiring managers, teammates, or clients.

## Features

- **Zero-config**: Works out of the box with Anthropic, OpenAI, DeepSeek, Grok, and Vercel AI SDK.
- **Automated Redaction**: Automatically sanitizes API keys, authorization tokens, emails, and credentials.
- **Self-Contained HTML**: Exports are single static files with all styling and interactions inlined.
- **Accurate Token Pricing**: Built-in pricing engine tracks costs across Claude, GPT, and DeepSeek models.
- **Terminal First**: Interactive and elegant CLI powered by `@clack/prompts`.
