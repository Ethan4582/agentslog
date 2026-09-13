"use client";

import { useState } from "react";
import { Terminal, Check, Copy } from "lucide-react";

type CliCommandKey = "init" | "sessions" | "export" | "share";

interface CommandData {
  cmd: string;
  description: string;
  output: string;
}

const COMMANDS: Record<CliCommandKey, CommandData> = {
  init: {
    cmd: "npx agent-logs init",
    description: "Interactive setup wizard powered by @clack/prompts",
    output: `┌  agent-logs — setup
│
◇  Step 1 of 3 — How should agent-logs capture your sessions?
│  ● Use your existing agent environment (ambient)
│
◇  Step 2 of 3 — Which log type do you want to generate?
│  ● Interview log (story-driven, shows your reasoning)
│
◇  Step 3 of 3 — Give this session a name (optional)
│  my-research-agent
│
✔ Session directory created: .agentlog/sessions/
✔ Added .agentlog/ to .gitignore
✔ Config written: agentlog.config.ts
│
└  You're set. Run your agent normally — agent-logs captures everything silently.`
  },
  sessions: {
    cmd: "npx agent-logs sessions",
    description: "View all captured local traces with call counts and estimated costs",
    output: `Captured Sessions:

ID            Date                    Model               Calls   Tokens    Cost
------------------------------------------------------------------------------------
cb55bb5a-3e5  2026-09-13 10:48:02     claude-3-5-sonnet   1       57        $0.0004
8f29d1c0-a1b  2026-09-13 12:15:30     gpt-4o              3       1,420     $0.0084
e992bc44-55f  2026-09-13 14:02:11     deepseek-chat       5       3,890     $0.0028`
  },
  export: {
    cmd: "npx agent-logs export",
    description: "Render session traces into standalone single-file HTML reports",
    output: `? Pick a session to export:
  ● cb55bb5a-3e5 (claude-3-5-sonnet) — 1 calls · 2026-09-13
  ○ 8f29d1c0-a1b (gpt-4o) — 3 calls · 2026-09-13

? Pick export log type:
  ● Interview log (story-driven)
  ○ Debug log (raw telemetry)
  ○ Audit log (compliance)
  ○ Portfolio log (showcase)

✔ Exported successfully!
  Saved to: ./agentlog-exports/cb55bb5a-3e5-interview-2026-09-13.html`
  },
  share: {
    cmd: "npx agent-logs share",
    description: "Upload exported HTML directly to GitHub Gist with a public shareable URL",
    output: `Exporting session and uploading to GitHub Gist...

✔ Uploaded to Gist!
  Share link: https://gist.github.com/agentlogs/9f38e07bb9a2`
  }
};

export function CliShowcaseSection() {
  const [selectedCmd, setSelectedCmd] = useState<CliCommandKey>("sessions");
  const [copied, setCopied] = useState(false);

  const active = COMMANDS[selectedCmd];

  const handleCopy = () => {
    navigator.clipboard.writeText(active.cmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="cli-preview" className="mx-auto max-w-7xl px-6 py-24 text-center border-t border-[#1f1f1f]">
      <div className="mx-auto max-w-3xl space-y-4">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[#f5a623]">
          Terminal First
        </span>
        <h2 className="type-h2 text-white">An interactive CLI built for speed</h2>
        <p className="type-body text-[#9ca3af]">
          Zero configuration files required. Run commands interactively with arrow keys or script them headlessly in CI/CD pipelines.
        </p>
      </div>

      <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-xl border border-[#262626] bg-[#141414] shadow-2xl text-left">
        <div className="flex flex-wrap items-center justify-between border-b border-[#222222] bg-[#1a1a1a] px-4 py-3 gap-2">
          <div className="flex items-center gap-2">
            {(["sessions", "init", "export", "share"] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedCmd(key)}
                className={`rounded-md px-3 py-1.5 font-mono text-[12px] transition-all cursor-pointer ${
                  selectedCmd === key
                    ? "bg-[#252525] text-[#f5a623] font-semibold border border-[#383838]"
                    : "text-[#888888] hover:text-white hover:bg-[#202020]"
                }`}
              >
                agent-logs {key}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md border border-[#2e2e2e] bg-[#1e1e1e] px-2.5 py-1 text-[11px] font-mono text-[#a0a0a0] hover:text-white transition-colors cursor-pointer"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? "Copied" : "Copy Command"}</span>
          </button>
        </div>

        <div className="p-6 font-mono text-[13px] leading-relaxed">
          <div className="flex items-center gap-2 text-[#888888] mb-4 pb-3 border-b border-[#222222]/60">
            <Terminal className="h-4 w-4 text-[#f5a623]" />
            <span className="text-white font-semibold">{active.cmd}</span>
            <span className="text-[12px] ml-auto hidden sm:inline text-[#666666]">{active.description}</span>
          </div>

          <pre className="text-zinc-300 overflow-x-auto whitespace-pre">
            <code>{active.output}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
