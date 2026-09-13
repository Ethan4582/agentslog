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
    navigator.clipboard.writeText("npx agentlog init");
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const copyExportCmd = () => {
    navigator.clipboard.writeText(`npx agentlog export --type ${selectedType}`);
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
                <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zM8.307 10.74l3.69-2.132 3.69 2.132v4.264l-3.69 2.13-3.69-2.13z" />
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
          <span>npx agentlog init</span>
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
            <span className="rounded bg-[#252525] px-2 py-0.5 text-[11px] font-mono text-[#a0a0a0]">
              claude-3-5-sonnet
            </span>
          </div>

          <div className="flex items-center gap-4 text-[12px] font-mono text-[#888888]">
            <span className="flex items-center gap-1 text-[#4ade80]">
              <Clock className="h-3 w-3" /> 382ms
            </span>
            <span className="flex items-center gap-1 text-[#f5a623]">
              <Coins className="h-3 w-3" /> 1,420 tokens ($0.0084)
            </span>
            <span className="flex items-center gap-1 text-[#60a5fa]">
              <Shield className="h-3 w-3" /> 2 keys redacted
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#242424] bg-[#141414]">
          <div className="md:col-span-2 p-6 space-y-4">
            <div className="rounded-xl border border-[#282828] bg-[#181818] p-5 shadow-sm">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#888888] mb-2">
                <span className="text-[#f5a623]">USER MESSAGE</span>
                <span>call #1</span>
              </div>
              <p className="text-[14px] leading-relaxed text-[#d4d4d4]">
                Refactor the authentication middleware to support JWT refresh tokens. Use the internal key <span className="font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded text-[12px]">sk-ant-api03-[REDACTED]</span> and run the regression tests.
              </p>
            </div>

            <div className="rounded-xl border border-[#262626] bg-[#171717] p-4 font-mono text-[12px]">
              <div className="flex items-center justify-between text-[#888888] mb-2">
                <span className="text-sky-400">TOOL CALL: execute_test_suite</span>
                <span>latency: 184ms</span>
              </div>
              <div className="rounded bg-[#121212] p-3 text-[#a3a3a3] border border-[#222222]">
                <div className="text-emerald-400">✔ 14 test suites passed (42 tests)</div>
                <div className="text-[#737373] mt-1">Exit code 0 &bull; 0 warnings &bull; Memory: 64MB</div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setStepsOpen(!stepsOpen)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#282828] bg-[#191919] px-3 py-1.5 text-[12px] font-mono text-[#a0a0a0] hover:text-white transition-all cursor-pointer"
              >
                {stepsOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                {stepsOpen ? "Hide session details" : "Show 2 more recorded calls"}
              </button>

              {stepsOpen && (
                <div className="mt-3 space-y-2 rounded-xl border border-[#262626] bg-[#161616] p-4 text-[12px] font-mono text-[#a3a3a3]">
                  <div className="flex items-center justify-between border-b border-[#222222] pb-2">
                    <span className="text-amber-400">Call #2: write_file</span>
                    <span>src/auth/jwt.ts (+84 lines)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400">Call #3: git_status</span>
                    <span>branch: feat/jwt-refresh (clean)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 space-y-6 text-[13px] bg-[#161616]">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#888888] mb-3">
                Export As
              </div>

              <div className="space-y-2">
                {(["interview", "debug", "audit", "portfolio"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type)}
                    className={`w-full text-left rounded-lg p-2.5 border transition-all cursor-pointer ${
                      selectedType === type
                        ? "border-[#f5a623] bg-[#f5a623]/10 text-white"
                        : "border-[#252525] bg-[#181818] text-[#888888] hover:text-[#d4d4d4] hover:border-[#333333]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize text-[13px]">{type} Log</span>
                      {selectedType === type && <Sparkles className="h-3.5 w-3.5 text-[#f5a623]" />}
                    </div>
                    <div className="text-[11px] text-[#737373] mt-0.5">
                      {type === "interview" && "Story-driven narrative & tradeoffs"}
                      {type === "debug" && "Raw telemetry & error traces"}
                      {type === "audit" && "Formal compliance & cost ledger"}
                      {type === "portfolio" && "Outcome showcase & impact metrics"}
                    </div>
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
                <span className="truncate mr-2">npx agentlog export --type {selectedType}</span>
                {copiedExport ? <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" /> : <Copy className="h-3.5 w-3.5 text-zinc-500 shrink-0" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
