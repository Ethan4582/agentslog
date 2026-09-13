"use client";

import { useState } from "react";
import { MessageSquare, Bug, FileCheck, Award, CheckCircle2, ChevronRight } from "lucide-react";

type LogTypeKey = "interview" | "debug" | "audit" | "portfolio";

interface LogTypeInfo {
  key: LogTypeKey;
  title: string;
  badge: string;
  description: string;
  features: string[];
  cliFlag: string;
  placeholderBadge: string;
  placeholderHeader: string;
  placeholderLines: Array<{ label: string; value: string }>;
}

const LOG_TYPES: Record<LogTypeKey, LogTypeInfo> = {
  interview: {
    key: "interview",
    title: "Interview Log",
    badge: "Story-Driven",
    description:
      "Translates raw AI transcripts into a structured narrative. Perfect for hiring managers and technical leads to evaluate your problem framing, architectural tradeoffs, and reasoning flow.",
    features: [
      "Executive summary & high-level objective",
      "Key engineering decisions & tradeoffs",
      "Curated tool invocations & stdout snippets",
      "Lessons learned & post-session retrospective"
    ],
    cliFlag: "npx agentlog export --type interview",
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
    cliFlag: "npx agentlog export --type debug",
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
    cliFlag: "npx agentlog export --type audit",
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
    cliFlag: "npx agentlog export --type portfolio",
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

export function LogTypesSection() {
  const [activeTab, setActiveTab] = useState<LogTypeKey>("interview");
  const active = LOG_TYPES[activeTab];

  return (
    <section id="log-types" className="mx-auto max-w-7xl px-6 py-28 border-t border-[#222222]">
      <div className="text-left mb-16">
        <span className="text-[13px] font-semibold uppercase tracking-wider text-[#f5a623]">
          Export Engine
        </span>
        <h2 className="type-h2 mt-3 text-white">
          Four purpose-built log formats.
        </h2>
        <p className="type-body mt-4 max-w-2xl text-[#a0a0a0]">
          Every AI coding session produces different stakeholders. AgentLogs converts raw traces into the exact format you need with a single command.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-[#222222] pb-4 mb-8">
        {(
          [
            { key: "interview", label: "Interview Log", icon: MessageSquare },
            { key: "debug", label: "Debug Log", icon: Bug },
            { key: "audit", label: "Audit Log", icon: FileCheck },
            { key: "portfolio", label: "Portfolio Log", icon: Award }
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14px] font-medium transition-all cursor-pointer ${
                isSelected
                  ? "bg-[#202020] text-white border border-[#333333] shadow-sm"
                  : "text-[#888888] hover:text-[#d4d4d4] hover:bg-[#181818]"
              }`}
            >
              <Icon className={`h-4 w-4 ${isSelected ? "text-[#f5a623]" : "text-[#737373]"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start text-left">
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="inline-block rounded bg-[#f5a623]/10 px-2.5 py-1 text-[11px] font-mono font-semibold text-[#f5a623] border border-[#f5a623]/20">
              {active.badge}
            </span>
            <h3 className="text-[26px] font-semibold text-white tracking-tight mt-3">
              {active.title}
            </h3>
            <p className="text-[15px] leading-relaxed text-[#a0a0a0] mt-3">
              {active.description}
            </p>
          </div>

          <div className="space-y-2.5 pt-2">
            <span className="text-[12px] font-semibold uppercase tracking-wider text-[#737373]">
              Included in this export:
            </span>
            <ul className="space-y-2 text-[14px] text-[#d4d4d4]">
              {active.features.map((feat) => (
                <li key={feat} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#f5a623] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-[#222222]">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#737373] block mb-2">
              CLI Export Command
            </span>
            <div className="rounded-lg border border-[#2a2a2a] bg-[#161616] p-3 font-mono text-[12px] text-emerald-400">
              {active.cliFlag}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-[#262626] bg-[#161616] p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#242424] pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]/70"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]/70"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]/70"></span>
                <span className="ml-2 font-mono text-[12px] text-[#888888]">
                  {active.placeholderBadge}
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#737373]">
                Single-file HTML &bull; Zero CDN
              </span>
            </div>

            <div className="rounded-xl border border-[#242424] bg-[#121212] p-5 space-y-4">
              <div className="border-b border-[#202020] pb-3">
                <span className="text-[11px] font-mono text-[#f5a623] uppercase">Export Output</span>
                <h4 className="text-[16px] font-medium text-white mt-1">
                  {active.placeholderHeader}
                </h4>
              </div>

              <div className="space-y-3 font-mono text-[12px]">
                {active.placeholderLines.map((line) => (
                  <div key={line.label} className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 border-b border-[#1c1c1c] pb-2">
                    <span className="text-[#888888] shrink-0 sm:w-32">{line.label}:</span>
                    <span className="text-[#d4d4d4] break-all">{line.value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-[#666666]">
                <span>Generated by agentlog engine</span>
                <span className="flex items-center gap-1 text-[#f5a623]">
                  Ready to share <ChevronRight className="h-3 w-3" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
