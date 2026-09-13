"use client";

import { useState } from "react";
import { Check, Copy, Sparkles, BookOpen, Bug, ShieldCheck, Briefcase } from "lucide-react";

type LogTypeKey = "interview" | "debug" | "audit" | "portfolio";

interface LogTypeConfig {
  key: LogTypeKey;
  title: string;
  badge: string;
  description: string;
  features: string[];
  cliFlag: string;
  placeholderBadge: string;
  placeholderHeader: string;
  placeholderLines: { label: string; value: string }[];
}

const LOG_TYPES: Record<LogTypeKey, LogTypeConfig> = {
  interview: {
    key: "interview",
    title: "Interview Log",
    badge: "Reasoning & Narrative",
    description:
      "Translates raw AI transcripts into a structured narrative. Perfect for hiring managers and technical leads to evaluate your problem framing, architectural tradeoffs, and reasoning flow.",
    features: [
      "Executive summary & high-level objective",
      "Key engineering decisions & tradeoffs",
      "Curated tool invocations & stdout snippets",
      "Lessons learned & post-session retrospective"
    ],
    cliFlag: "npx agent-logs export --type interview",
    placeholderBadge: "Interview Log Preview",
    placeholderHeader: "Session Narrative: Autonomous Migration to Bun Runtimes",
    placeholderLines: [
      { label: "Goal", value: "Migrate Node.js test harness to Bun 1.4 without breaking legacy mocks." },
      { label: "Key Decision", value: "Selected Bun test runner over Jest for 8x faster execution in CI." },
      { label: "Tool Executed", value: "bun test --coverage (exit 0, 42 passing specs)" },
      { label: "Takeaway", value: "Zero external dependencies reduced cold-start time by 450ms." }
    ]
  },
  debug: {
    key: "debug",
    title: "Debug Log",
    badge: "Telemetry & Errors",
    description:
      "High-density chronological call trace. Inspect exact latencies, token consumption per turn, raw input/output payloads, tool call arguments, and error stack traces.",
    features: [
      "Millisecond-level duration tracking per turn",
      "Full input prompt & system message inspector",
      "Raw tool arguments and output payloads",
      "Explicit error codes, warnings, and retry states"
    ],
    cliFlag: "npx agent-logs export --type debug",
    placeholderBadge: "Debug Log Preview",
    placeholderHeader: "Trace Telemetry: Call #34 - Tool Invocation Failure & Recovery",
    placeholderLines: [
      { label: "Timestamp", value: "2026-09-13T16:30:12.482Z (duration: 412ms)" },
      { label: "Tool Invoked", value: "database_query (arguments: { table: 'users', limit: 10 })" },
      { label: "Raw Response", value: "ECONNRESET from 10.0.4.12:5432 -> auto-retried with backoff" },
      { label: "Tokens Used", value: "Prompt: 840 · Completion: 180 · Total: 1,020 tokens" }
    ]
  },
  audit: {
    key: "audit",
    title: "Audit Log",
    badge: "Compliance & Ledger",
    description:
      "Formal compliance and governance report. Tracks exact model versions, cryptographic timestamps, automated secret redaction verification, and precise dollar cost accounting.",
    features: [
      "Exact model checkpoint identification",
      "Cryptographic session timestamp verification",
      "Itemized token pricing and total cost ledger",
      "Client-side secret redaction certification"
    ],
    cliFlag: "npx agent-logs export --type audit",
    placeholderBadge: "Audit Log Preview",
    placeholderHeader: "Compliance Ledger: Model Checkpoints & Cost Accounting",
    placeholderLines: [
      { label: "Model ID", value: "claude-3-5-sonnet-20241022 (provider: Anthropic)" },
      { label: "Redaction Check", value: "PASSED - 4 API keys & 2 Bearer tokens sanitized" },
      { label: "Token Ledger", value: "Input: 124,500 ($0.3735) · Output: 38,200 ($0.5730)" },
      { label: "Total Cost", value: "$0.9465 USD (calculated via official Anthropic rates)" }
    ]
  },
  portfolio: {
    key: "portfolio",
    title: "Portfolio Log",
    badge: "Showcase & Outcomes",
    description:
      "Outcome-focused showcase for technical portfolios and client presentations. Strips out conversational noise and emphasizes finished deliverables, architectures, and measurable results.",
    features: [
      "Clean outcome and deliverable highlights",
      "Before and after performance metrics",
      "Architecture diagram & component tree",
      "Minimalist presentation ready for social sharing"
    ],
    cliFlag: "npx agent-logs export --type portfolio",
    placeholderBadge: "Portfolio Log Preview",
    placeholderHeader: "Project Showcase: Automated Event Pipeline Engine",
    placeholderLines: [
      { label: "Deliverable", value: "Production-ready streaming pipeline with full test coverage" },
      { label: "Performance", value: "P99 latency decreased from 320ms to 42ms" },
      { label: "Code Output", value: "12 files created, 3 components refactored, zero warnings" },
      { label: "Verification", value: "End-to-end load test verified with 10,000 concurrent events" }
    ]
  }
};

const TYPE_ICONS: Record<LogTypeKey, React.ComponentType<{ className?: string }>> = {
  interview: BookOpen,
  debug: Bug,
  audit: ShieldCheck,
  portfolio: Briefcase
};

export function LogTypesSection() {
  const [activeKey, setActiveKey] = useState<LogTypeKey>("interview");
  const [copied, setCopied] = useState(false);

  const active = LOG_TYPES[activeKey];

  const handleCopy = () => {
    navigator.clipboard.writeText(active.cliFlag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="log-types" className="mx-auto max-w-7xl px-6 py-24 text-center">
      <div className="mx-auto max-w-3xl space-y-4">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[#f5a623]">
          Multi-Purpose Export
        </span>
        <h2 className="type-h2 text-white">One session recording. Four tailored formats.</h2>
        <p className="type-body text-[#9ca3af]">
          Every AI coding session produces different stakeholders. AgentLogs converts raw traces into the exact format you need with a single command.
        </p>
      </div>

      {/* Tabs */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
        {(Object.keys(LOG_TYPES) as LogTypeKey[]).map((key) => {
          const item = LOG_TYPES[key];
          const Icon = TYPE_ICONS[key];
          const isActive = activeKey === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveKey(key)}
              className={`flex items-center gap-2 rounded-xl px-5 py-3 text-[14px] font-medium transition-all cursor-pointer ${
                isActive
                  ? "bg-[#222222] text-white border border-[#383838] shadow-md ring-1 ring-white/10"
                  : "text-[#888888] hover:text-[#ededed] hover:bg-[#181818] border border-transparent"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-[#f5a623]" : "text-[#777777]"}`} />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Detailed Card */}
      <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl border border-[#252525] bg-[#161616] text-left shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#242424]">
          {/* Metadata side */}
          <div className="md:col-span-6 p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#2e2e2e] bg-[#1d1d1d] px-3 py-1 font-mono text-[11px] text-[#f5a623]">
                <Sparkles className="h-3 w-3" />
                <span>{active.badge}</span>
              </div>
              <h3 className="text-[24px] font-bold text-white tracking-tight">{active.title}</h3>
              <p className="text-[14px] text-[#a0a0a0] leading-relaxed">{active.description}</p>

              <ul className="space-y-2.5 pt-2">
                {active.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-[13px] text-zinc-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#f5a623] mt-2 shrink-0"></span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-[#222222]">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] mb-2">
                Generate via CLI
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="w-full flex items-center justify-between rounded-xl border border-[#2a2a2a] bg-[#121212] p-3 font-mono text-[12px] text-zinc-300 hover:border-[#f5a623] transition-all cursor-pointer"
              >
                <span className="truncate mr-2">{active.cliFlag}</span>
                {copied ? <Check className="h-4 w-4 text-emerald-400 shrink-0" /> : <Copy className="h-4 w-4 text-zinc-500 shrink-0" />}
              </button>
            </div>
          </div>

          {/* Report Preview side */}
          <div className="md:col-span-6 p-8 bg-[#131313] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#242424] pb-3 mb-5">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#888888]">
                  {active.placeholderBadge}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span> Validated Output
                </span>
              </div>

              <div className="rounded-xl border border-[#252525] bg-[#171717] p-5 space-y-4 font-mono">
                <div className="text-[13px] font-semibold text-white border-b border-[#252525] pb-2 leading-snug">
                  {active.placeholderHeader}
                </div>

                <div className="space-y-3 text-[12px]">
                  {active.placeholderLines.map((line) => (
                    <div key={line.label} className="space-y-1">
                      <div className="text-[#888888] text-[10px] uppercase tracking-wider">{line.label}</div>
                      <div className="text-zinc-200 leading-relaxed font-sans">{line.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-[11px] text-[#666666] font-mono">
              <span>Standalone HTML &bull; Zero CDN dependencies</span>
              <span>Generated by agent-logs engine</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
