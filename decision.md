# agentlog — Architecture and System Design Decisions

> A zero-overhead, local-first capture and export system for AI agent sessions that produces standalone, shareable inspection reports without external infrastructure.

---

## 1. Problem Statement

Developers building with LLMs and AI agents lack a standard, lightweight method to inspect, audit, and share multi-turn execution traces. Existing LLM observability tools require hosted cloud accounts, remote telemetry endpoints, API keys sent to third-party services, and heavy SDK dependencies that inject latency into agent run loops. When engineers want to demonstrate agent reasoning to teammates, interviewers, or clients, they are forced to take screenshot crops of terminal stdout or manually copy-paste raw JSON payloads. Without a local-first recording layer, developers risk exposing API keys in terminal logs, losing session state on process crashes, and spending significant time preparing artifacts for review.

---

## 2. Goals and Non-Goals

### Goals
- Capture complete prompt inputs, completions, tool calls, and token usage with less than 5 milliseconds of invocation overhead.
- Store session traces locally in human-readable, append-only files without requiring external databases or server processes.
- Redact secrets, authorization headers, email addresses, and API credentials before writing data to disk.
- Compile execution sessions into portable, standalone HTML files containing embedded CSS and JavaScript for offline viewing.
- Support multiple export lenses (`interview`, `debug`, `audit`, `portfolio`) tailored to distinct technical and non-technical audiences.
- Maintain a zero-configuration developer experience with single-line client wrapping for major LLM SDKs (Anthropic, OpenAI, DeepSeek, Vercel AI SDK).

### Non-Goals
- Real-time distributed tracing dashboards or cross-machine cluster metrics.
- Centralized multi-tenant SaaS backend with user accounts and team workspaces.
- In-flight prompt rewriting or proxy-level rate limiting.
- Headless browser automation recording or audio/video session captures.
- Proprietary binary file formats for session persistence.

---

## 3. Functional Requirements

- **Client interception:** The library wraps SDK instances (Anthropic, OpenAI, DeepSeek, and Vercel AI SDK) and captures input messages, system instructions, tool definitions, output blocks, stop reasons, and token counts.
- **Append-only streaming:** Each LLM interaction writes to an NDJSON session log immediately upon completion.
- **Automated credential redaction:** The capture pipeline sanitizes API keys (`sk-...`, Anthropic keys, GitHub tokens, Bearer headers, and emails) across strings, nested objects, and arrays.
- **Cost calculation:** The system computes per-call and cumulative dollar costs across common model families using exact and prefix-matched pricing tables.
- **Multi-format export engine:** The CLI transforms session logs into formatted HTML documents using audience-targeted system prompts and inline templates.
- **Interactive CLI:** A command-line interface (`agentlog`) provides commands to inspect sessions (`sessions`), initialize project configuration (`init`), clear traces (`sessions clear`), export HTML reports (`export`), and upload exports to GitHub Gists (`share`).

---

## 4. Non-Functional Requirements

- **Overhead:** Added latency on the LLM request/response cycle must remain under 5 ms.
- **Crash durability:** If an agent process crashes or terminates abnormally, all calls completed prior to the crash must remain intact on disk in `.agentlog/sessions/<session-id>.ndjson`.
- **Security and privacy:** No raw credentials or authorization headers may be written to disk. The capture pipeline executes redaction synchronously in memory before file writes.
- **Zero remote telemetry:** The capture engine never transmits trace data to external servers. External network calls only occur if the user explicitly triggers LLM export synthesis or GitHub Gist sharing.
- **Self-contained output:** Exported HTML files require no external CDN stylesheets, scripts, or font dependencies to render correctly offline.
- **Bundle minimalism:** The core package ships with zero heavyweight runtime dependencies, using optional peer dependencies for provider SDKs.

---

## 5. Scale and Capacity Estimation

The system operates locally within developer environments and CI pipelines.

| Metric | Working Value |
|---|---|
| Average call input payload | 4 KB – 32 KB (system prompt + message history) |
| Average call output payload | 1 KB – 8 KB |
| Single call record size on disk | ~5 KB to 25 KB (compressed text / JSON) |
| Typical multi-turn agent session | 10 – 50 tool invocations and completions |
| Disk space per session | 50 KB – 1.2 MB |
| File write throughput | 1 append operation per LLM call (< 1 ms disk I/O) |
| Storage footprint for 500 sessions | ~150 MB (readily contained within local dev disk) |

**Storage calculation:**
- A session running 25 turns at an average of 12 KB per record consumes ~300 KB of disk space in `.agentlog/sessions/`.
- File writes append a single line per call. Disk operations remain sequential, avoiding read-modify-write locks or database contention.

---

## 6. High-Level Design (HLD)

The system consists of three distinct layers:
1. **Runtime Capture Layer (`packages/agentlog/src/capture` & `adapters`):** Intercepts SDK network completions, sanitizes credentials in memory, and writes NDJSON records to local storage.
2. **Analysis and Export Layer (`packages/agentlog/src/export`, `prompts`, `templates`, `cli`):** Reads session logs, runs audience-specific synthesis via the developer's configured LLM, and formats single-file HTML reports.
3. **Documentation and Web Showcase (`apps/web`):** Next.js 15 static export landing page documenting package usage and architecture.

```
Agent Application
       │
       ▼
[Agentlog Wrapper Proxy]
       │
       ├──► Upstream LLM Provider (Anthropic / OpenAI / DeepSeek / Vercel AI)
       │
       ▼
[Memory Redaction Engine] (Sanitizes keys, tokens, emails)
       │
       ▼
[NDJSON Session Writer]  ──► Writes `.agentlog/sessions/<id>.ndjson`
       │
       ▼
[CLI Export Engine]      ──► LLM Synthesis ──► [Inlined HTML Template] ──► `agentlog-exports/*.html`
```

---

## 7. Low-Level Design (LLD)

### 7.1 Adapters Layer (`src/adapters/`)
The adapters layer uses the JavaScript Proxy pattern and method interception rather than monkey-patching global runtime environments.

- **Anthropic Adapter (`anthropic.ts`):** Wraps `client.messages.create`. Computes call duration, normalizes input content blocks, extracts tool use arguments, maps output blocks, records stop reasons, and passes data to the session writer.
- **OpenAI Adapter (`openai.ts`):** Wraps `client.chat.completions.create`. Supports standard OpenAI models and custom base URLs (including DeepSeek and Grok). Normalizes chat message roles, function call arguments, and finish reasons into unified `Call` schema.
- **Vercel AI SDK Adapter (`vercel-ai.ts`):** Wraps high-level helper functions `generateText` and `streamText`.
- **Automatic Client Detection (`index.ts`):** The `wrap(client)` entry point inspects client signatures (`client.messages` vs `client.chat.completions`) and attaches the appropriate adapter automatically.

### 7.2 Capture and Redaction Engine (`src/capture/`)
- **Redaction (`redact.ts`):** Operates on primitive values, nested objects, and arrays. Evaluates regular expressions for OpenAI keys (`sk-[A-Za-z0-9_-]{20,}`), Anthropic keys (`sk-ant-[A-Za-z0-9_-]{20,}`), Bearer tokens, general API keys, and email addresses. Replaces matched patterns with `[REDACTED_API_KEY]`, `Bearer [REDACTED_TOKEN]`, and `[REDACTED_EMAIL]`.
- **Writer (`writer.ts`):** Initializes a session by creating `.agentlog/sessions/<id>.ndjson` and writing a `SessionHeader` as the first line. Subsequent calls are appended as individual JSON lines. The writer also exposes utilities to list stored sessions, parse complete histories, and clear session logs.

### 7.3 Token Pricing Engine (`src/costs.ts`)
Tracks per-million token rates across major foundation models:
- Claude 3.5 Sonnet / Opus / Haiku
- GPT-4o / GPT-4o-mini
- DeepSeek Chat / Reasoner
- Gemini 1.5 Pro / Flash

The engine implements fuzzy model matching: exact matches are evaluated first, followed by substring and prefix matches. If a model name is not recognized, the calculator returns `null` instead of throwing an exception, preventing unlisted or fine-tuned model identifiers from halting execution.

### 7.4 Export and Templating Engine (`src/export/`)
- **Router (`router.ts`):** Maps requested log types (`interview`, `debug`, `audit`, `portfolio`) to their respective system prompt builders and HTML templates.
- **Renderer (`renderer.ts`):** Reads the requested session NDJSON log, verifies call counts, and compiles the log-type prompt. If the user possesses an active LLM key, the renderer executes a single completion to summarize decisions, trade-offs, and reasoning. The resulting summary and raw call cards are injected directly into a standalone HTML template with zero external CSS or JavaScript dependencies.

### 7.5 CLI Architecture (`src/cli/`)
Built with `@clack/prompts` and `picocolors`:
- **Branding (`brand.ts`):** Renders an ANSI header on boot.
- **`init` command:** Guides developers through environment detection, log selection, and creates `.agentlog/` while verifying `.gitignore`.
- **`export` command:** Interactively selects stored sessions, prompts for export type, triggers the renderer, and outputs a clean path to the generated HTML report.
- **`sessions` command:** Renders a terminal table summarizing captured session IDs, creation timestamps, model names, call counts, token consumption, and estimated costs.
- **`share` command:** Exports the session and creates a GitHub Gist via GitHub CLI or API token, returning a shareable public or secret URL.

---

## 8. Data Models and Schemas

### 8.1 Session Header Record (`SessionHeader`)
Written as line 1 of every `.ndjson` session file:
```json
{
  "type": "header",
  "id": "c1f73b8a",
  "startedAt": "2026-09-13T10:15:30.120Z",
  "provider": "anthropic",
  "model": "claude-3-5-sonnet-20241022",
  "title": "autonomous-repo-refactor",
  "metadata": {}
}
```

### 8.2 Call Record (`SessionCallRecord`)
Appended on every completed LLM turn:
```json
{
  "type": "call",
  "call": {
    "id": "call_01a",
    "timestamp": "2026-09-13T10:15:32.400Z",
    "durationMs": 1420,
    "input": {
      "system": "You are a senior systems engineer.",
      "messages": [
        {
          "role": "user",
          "content": "Analyze memory leaks in worker pool."
        }
      ],
      "tools": [
        {
          "name": "read_profile_dump",
          "description": "Reads heap profile data",
          "parameters": { "type": "object", "properties": { "path": { "type": "string" } } }
        }
      ]
    },
    "output": {
      "content": [
        {
          "type": "tool_use",
          "id": "toolu_01",
          "name": "read_profile_dump",
          "input": { "path": "/var/log/heap.heapsnapshot" }
        }
      ],
      "stopReason": "tool_use",
      "usage": {
        "promptTokens": 850,
        "completionTokens": 45,
        "totalTokens": 895
      }
    },
    "metadata": {
      "costEstimate": 0.0032
    }
  }
}
```

### 8.3 Configuration Schema (`agentlog.config.ts`)
```ts
export interface AgentlogConfig {
  sessionDir?: string;        // Default: ".agentlog/sessions"
  exportDir?: string;         // Default: "./agentlog-exports"
  redact?: {
    enabled: boolean;         // Default: true
    patterns?: RegExp[];      // Custom regexes appended to default suite
  };
  defaultProvider?: "anthropic" | "openai" | "deepseek" | "gemini";
  share?: {
    provider: "gist";
  };
}
```

---

## 9. Key Architectural Decisions and Trade-Offs

### Decision 1: Append-Only Local NDJSON vs. Embedded SQLite Database
- **Context:** Traces must be saved reliably across varying operating systems and runtime environments without requiring compilation tools (node-gyp, native SQLite bindings).
- **Choice:** Local newline-delimited JSON (`.ndjson`) files in `.agentlog/sessions/`.
- **Trade-offs:**
  - *Gained:* Zero binary dependencies, full streaming crash durability (a process kill does not corrupt prior lines), native compatibility with standard Unix utilities (`grep`, `jq`, `wc -l`), and effortless manual inspection.
  - *Lost:* Lack of SQL indexing across millions of calls. Acceptable because sessions are reviewed individually or in batches under 1,000 files.

### Decision 2: Wrapper Proxy vs. Global Fetch Monkey-Patching
- **Context:** To capture API calls, the system could intercept `globalThis.fetch` or wrap client instances directly.
- **Choice:** Explicit `wrap(client)` function returning typed proxy client.
- **Trade-offs:**
  - *Gained:* Zero side effects on unrelated application networking (e.g., database requests, analytics, webhooks). Predictable behavior in complex microservices. Full TypeScript type preservation.
  - *Lost:* Requires two lines of explicit developer code instead of zero-code ambient process hooking. Ambient proxying is reserved as an advanced opt-in mode.

### Decision 3: Client-Side LLM Synthesis vs. Hosted SaaS Ingestion
- **Context:** Transforming raw logs into clean narrative summaries requires an LLM call.
- **Choice:** Run the export synthesis step directly on the developer's machine using their existing environment API keys (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`).
- **Trade-offs:**
  - *Gained:* Zero infrastructure costs, zero user accounts, complete privacy (prompts and code traces never traverse our servers), and compliance with strict enterprise confidentiality constraints.
  - *Lost:* Users must have a configured API key to run AI synthesis during export. Fallback mode outputs structured call inspection cards without narrative summaries if keys are absent.

### Decision 4: Single-File Inlined HTML Reports vs. Web Dashboard
- **Context:** Exported reports need to be reviewed by teammates, interviewers, and clients.
- **Choice:** Self-contained `.html` file with embedded CSS, SVG icons, and vanilla JavaScript for timeline toggles.
- **Trade-offs:**
  - *Gained:* Can be emailed, attached to pull requests, committed to repositories, viewed offline on airplanes, or hosted on static storage (GitHub Pages, S3, Cloudflare Pages) with zero hosting costs.
  - *Lost:* No real-time multi-user live collaborative commenting without saving updated files.

### Decision 5: Peer Dependencies vs. Direct Bundling of Provider SDKs
- **Context:** The package supports Anthropic, OpenAI, DeepSeek, and Vercel AI SDK.
- **Choice:** Declare `@anthropic-ai/sdk` and `openai` as optional peer dependencies (`peerDependenciesMeta`).
- **Trade-offs:**
  - *Gained:* Minimal install footprint. A project using only Anthropic does not install OpenAI SDK packages or transitive dependencies.
  - *Lost:* Dynamic type inference must use generic shapes (`AnthropicClientLike`, `OpenAIClientLike`) to maintain strict typing when peer packages are omitted.

---

## 10. Reliability, Privacy, and Failure Handling

| Component | Failure Mode | Mitigation |
|---|---|---|
| **Capture Layer** | Agent process crashes or runs out of memory mid-turn | Append-only NDJSON guarantees all previously completed calls remain valid and readable on disk. |
| **Capture Layer** | Upstream provider returns 4xx / 5xx API error | Adapter intercepts the rejection, records the error string in the call record, writes the record to disk, and rethrows the original error untouched. |
| **Redaction Pipeline** | Large payload with deeply nested data structures | Recursive walker terminates at safe depth limits; regex patterns run per string primitive to prevent stack overflow. |
| **Pricing Engine** | Novel or uncataloged model identifier passed | Engine returns `null` for estimated cost and logs `Cost unknown` instead of crashing runtime operations. |
| **Export Renderer** | Developer has no internet connection or missing API key | CLI gracefully falls back to raw structured timeline HTML output without narrative synthesis. |
| **Disk I/O** | Destination directory `.agentlog/` does not exist | Session writer invokes recursive directory creation (`mkdirSync({ recursive: true })`) prior to initial write. |

---

## 11. Security and Credential Isolation

- **In-Memory Sanitization:** Redaction executes prior to `fs.appendFileSync`. Raw API keys never touch persistent disk storage.
- **Zero Ingestion Servers:** The package does not contain network telemetry or cloud ingestion URLs.
- **Git Protection:** The `init` command checks the project's `.gitignore` and appends `.agentlog/` and `agentlog-exports/` to prevent accidental commits of local session files.

---

## 12. Diagram Prompts

### High-Level Ingestion Flow
> Left-to-right system architecture diagram:
> Client App -> `wrap(client)` Proxy -> Upstream AI Provider (OpenAI/Anthropic)
> Output returns through Redaction Pipeline -> Local NDJSON Writer -> `.agentlog/sessions/*.ndjson`
> Decoupled CLI Export reads NDJSON -> LLM Synthesis -> Self-Contained HTML.

### Export Pipeline Flow
> Top-to-bottom pipeline:
> CLI `agentlog export` -> Session Selector -> Template Resolver (`interview` / `debug` / `audit` / `portfolio`) -> Local LLM Synthesis with user API key -> HTML Compilation -> Standalone Output File.
