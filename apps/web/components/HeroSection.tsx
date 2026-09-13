"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Copy, Terminal, Shield, Sparkles, Clock, Coins, ChevronDown, ChevronUp } from "lucide-react";

type ActiveType = "interview" | "debug" | "audit" | "portfolio";

export function HeroSection() {
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedExport, setCopiedExport] = useState(false);
  const [selectedType, setSelectedType] = useState<ActiveType>("interview");
  const [stepsOpen, setStepsOpen] = useState(false);

  const copyInitCmd = () => {
    navigator.clipboard.writeText("npx agent-logs init");
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const copyExportCmd = () => {
    navigator.clipboard.writeText(`npx agent-logs export --type ${selectedType}`);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-28 text-center md:pt-28">
      <h1 className="type-h1 mx-auto max-w-4xl text-white">
        AI agent sessions, beautifully{" "}
        <span className="inline-flex flex-wrap items-center justify-center gap-2 align-middle">
          <span>captured.</span>
          <span className="inline-flex items-center gap-1.5 ml-1">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d97706] p-1.5 shadow-sm ring-1 ring-white/10">
              <Image src="/claude.svg" alt="Claude" width={22} height={22} className="brightness-0 invert" />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black p-1.5 shadow-sm ring-1 ring-white/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47/4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zM8.307 10.74l3.69-2.132 3.69 2.132v4.264l-3.69 2.13-3.69-2.13z" />
              </svg>
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0066cc] p-1.5 shadow-sm">
              <Image src="/deepseek.svg" alt="DeepSeek" width={22} height={22} className="brightness-0 invert" />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-black p-1.5 shadow-sm ring-1 ring-white/20">
              <Image src="/grok.svg" alt="Grok" width={20} height={20} className="brightness-0 invert" />
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black p-1.5 shadow-sm ring-1 ring-white/20">
              <Image src="/vercel.svg" alt="Vercel AI" width={18} height={18} className="brightness-0 invert" />
            </span>
          </span>
        </span>
      </h1>

      <p className="type-body mx-auto mt-6 max-w-2xl text-[#9ca3af]">
        Zero-config session logging for AI engineers. Wrap your client in one line, capture prompts and tool calls locally, and export standalone HTML logs for interviews, debugging, and audits.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={copyInitCmd}
          className="flex items-center gap-2 rounded-lg bg-[#ededed] px-5 py-2.5 text-[14px] font-mono font-medium text-black transition-all hover:bg-white active:scale-95 shadow-sm cursor-pointer"
        >
          <Terminal className="h-4 w-4 text-[#f5a623]" />
          <span>npx agent-logs init</span>
          {copiedCli ? (
            <span className="text-[12px] font-sans font-semibold text-emerald-600 ml-1">Copied!</span>
          ) : (
            <Copy className="h-3.5 w-3.5 text-zinc-500 ml-1" />
          )}
        </button>

        <a
          href="https://github.com/agentlogs/agentlogs"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-[#2a2a2a] bg-[#181818] px-5 py-2.5 text-[14px] font-medium text-[#ededed] transition-all hover:bg-[#222222] hover:border-[#383838] active:scale-95"
        >
          Star on GitHub &rarr;
        </a>
      </div>

      <div className="relative mx-auto mt-16 max-w-5xl overflow-hidden rounded-2xl border border-[#252525] bg-[#161616] shadow-2xl text-left">
        <div className="flex h-11 items-center justify-between border-b border-[#242424] bg-[#1a1a1a] px-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono text-[12px] text-[#ededed]">
              <span className="h-2 w-2 rounded-full bg-[#f5a623]"></span>
              session_4a91f8.ndjson
            </span>
            <span className="rounded bg-[#282828] px-2 py-0.5 font-mono text-[10px] text-[#a0a0a0]">
              claude-3-5-sonnet-20241022
            </span>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-[#888888]">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> 4 turns
            </span>
            <span className="flex items-center gap-1">
              <Coins className="h-3.5 w-3.5 text-[#f5a623]" /> 1,420 tokens ($0.0042)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#242424]">
          {/* Left panel: NDJSON events */}
          <div className="md:col-span-7 p-5 space-y-4 bg-[#121212]/50">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#888888]">
              <span>Captured Live Stream</span>
              <span className="flex items-center gap-1 text-emerald-400 text-[10px] font-mono">
                <Shield className="h-3 w-3" /> Secrets Redacted
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-[12px]">
              <div className="rounded-lg border border-[#252525] bg-[#171717] p-3 text-zinc-300">
                <div className="flex items-center justify-between text-[#888888] text-[10px] mb-1">
                  <span>TURN 1 · USER</span>
                  <span>10:42:01.120</span>
                </div>
                <div className="text-zinc-200">
                  Refactor auth middleware to verify JWT signatures with key [REDACTED_API_KEY]
                </div>
              </div>

              <div className="rounded-lg border border-[#252525] bg-[#171717] p-3 text-zinc-300">
                <div className="flex items-center justify-between text-[#888888] text-[10px] mb-1">
                  <span>TURN 2 · TOOL CALL</span>
                  <span>10:42:02.450 · 1,330ms</span>
                </div>
                <div className="text-amber-400">
                  read_file({`"src/auth/jwt.ts"`})
                </div>
              </div>

              <div className="rounded-lg border border-[#252525] bg-[#171717] p-3 text-zinc-300">
                <div className="flex items-center justify-between text-[#888888] text-[10px] mb-1">
                  <span>TURN 3 · REASONING</span>
                  <span>10:42:04.100 · 1,650ms</span>
                </div>
                <div className="text-zinc-400 italic">
                  Identified algorithm mismatch. Updating token parser to support RS256 with fallback.
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Export Selector */}
          <div className="md:col-span-5 p-5 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#888888] mb-3">
                <span>Select Export Style</span>
                <span className="text-[#f5a623] text-[11px] font-mono">Standalone HTML</span>
              </div>

              <div className="space-y-2">
                {(
                  [
                    { id: "interview", label: "Interview Log", desc: "Story-driven, reasoning first" },
                    { id: "debug", label: "Debug Log", desc: "Dense telemetry, millisecond latency" },
                    { id: "audit", label: "Audit Log", desc: "Formal ledger with token costs" },
                    { id: "portfolio", label: "Portfolio Log", desc: "Outcome-focused showcase" }
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedType(t.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      selectedType === t.id
                        ? "border-[#f5a623] bg-[#f5a623]/10 text-white"
                        : "border-[#252525] bg-[#161616] text-zinc-400 hover:border-[#383838] hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between font-semibold text-[13px]">
                      <span>{t.label}</span>
                      {selectedType === t.id && <Sparkles className="h-3.5 w-3.5 text-[#f5a623]" />}
                    </div>
                    <div className="text-[11px] text-[#888888] mt-0.5">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#242424] pt-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] mb-2">
                Generate Command
              </div>
              <button
                type="button"
                onClick={copyExportCmd}
                className="w-full flex items-center justify-between rounded-lg border border-[#2a2a2a] bg-[#121212] p-2.5 font-mono text-[11px] text-zinc-300 hover:border-[#f5a623] transition-all cursor-pointer"
              >
                <span className="truncate mr-2">npx agent-logs export --type {selectedType}</span>
                {copiedExport ? <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <Copy className="h-3.5 w-3.5 text-zinc-500 shrink-0" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
