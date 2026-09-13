import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Terminal, Shield, FileText, Cpu, CheckCircle2 } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#121212] text-[#ededed]">
      <Navbar />
      <main className="flex-1 mx-auto max-w-4xl px-6 py-16 text-left">
        <div className="border-b border-[#222222] pb-8 mb-12">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#f5a623]">
            Documentation
          </span>
          <h1 className="type-h1 mt-3 text-white">Getting Started with agentlog</h1>
          <p className="type-body mt-3 text-[#a0a0a0]">
            Zero-config AI session logger. Wrap once, record silently, and export anywhere.
          </p>
        </div>

        <div className="space-y-16">
          <section id="installation" className="space-y-4">
            <div className="flex items-center gap-2 text-[22px] font-semibold text-white">
              <Terminal className="h-5 w-5 text-[#f5a623]" />
              <h2>1. Installation</h2>
            </div>
            <p className="text-[15px] text-[#a0a0a0]">
              Install agentlog into your existing TypeScript or Node.js project:
            </p>
            <div className="rounded-xl border border-[#262626] bg-[#161616] p-4 font-mono text-[13px] text-emerald-400">
              bun add agentlog
              <span className="text-[#666666] block mt-1"># or: npm install agentlog / pnpm add agentlog</span>
            </div>
          </section>

          <section id="usage" className="space-y-4">
            <div className="flex items-center gap-2 text-[22px] font-semibold text-white">
              <Cpu className="h-5 w-5 text-sky-400" />
              <h2>2. Wrap Your Client</h2>
            </div>
            <p className="text-[15px] text-[#a0a0a0]">
              Wrap your client instance in one line. All method signatures and TypeScript definitions remain identical:
            </p>
            <div className="rounded-xl border border-[#262626] bg-[#161616] p-4 font-mono text-[13px] text-[#d4d4d4] leading-relaxed">
              <span className="text-purple-400">import</span> Anthropic <span className="text-purple-400">from</span> <span className="text-emerald-400">&apos;@anthropic-ai/sdk&apos;</span>;{"\n"}
              <span className="text-purple-400">import</span> {"{ wrap }"} <span className="text-purple-400">from</span> <span className="text-emerald-400">&apos;agentlog&apos;</span>;{"\n\n"}
              <span className="text-blue-400">const</span> client = <span className="text-amber-400">wrap</span>(<span className="text-blue-400">new</span> Anthropic());{"\n\n"}
              <span className="text-blue-400">const</span> response = <span className="text-purple-400">await</span> client.messages.<span className="text-amber-400">create</span>({"{"}{"\n"}
              {"  "}model: <span className="text-emerald-400">&apos;claude-3-5-sonnet-20241022&apos;</span>,{"\n"}
              {"  "}messages: [&#123; role: <span className="text-emerald-400">&apos;user&apos;</span>, content: <span className="text-emerald-400">&apos;Hello&apos;</span> &#125;]{"\n"}
              {"}"});
            </div>
          </section>

          <section id="cli" className="space-y-4">
            <div className="flex items-center gap-2 text-[22px] font-semibold text-white">
              <Terminal className="h-5 w-5 text-amber-400" />
              <h2>3. CLI Commands</h2>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-[#262626] bg-[#161616] p-4 font-mono text-[13px] space-y-1">
                <div className="text-emerald-400">npx agentlog init</div>
                <div className="text-[12px] text-[#888888]">Runs interactive setup with @clack/prompts and writes agentlog.config.ts.</div>
              </div>
              <div className="rounded-xl border border-[#262626] bg-[#161616] p-4 font-mono text-[13px] space-y-1">
                <div className="text-emerald-400">npx agentlog sessions</div>
                <div className="text-[12px] text-[#888888]">Lists captured sessions in a formatted table with token totals and calculated USD costs.</div>
              </div>
              <div className="rounded-xl border border-[#262626] bg-[#161616] p-4 font-mono text-[13px] space-y-1">
                <div className="text-emerald-400">npx agentlog export</div>
                <div className="text-[12px] text-[#888888]">Interactively select a session and generate a self-contained HTML trace report.</div>
              </div>
              <div className="rounded-xl border border-[#262626] bg-[#161616] p-4 font-mono text-[13px] space-y-1">
                <div className="text-emerald-400">npx agentlog share</div>
                <div className="text-[12px] text-[#888888]">Publishes the exported report to a GitHub Gist and returns a public shareable link.</div>
              </div>
            </div>
          </section>

          <section id="log-types" className="space-y-4">
            <div className="flex items-center gap-2 text-[22px] font-semibold text-white">
              <FileText className="h-5 w-5 text-purple-400" />
              <h2>4. The Four Log Types</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#262626] bg-[#161616] p-5 space-y-2">
                <h3 className="font-semibold text-white text-[15px]">Interview Log</h3>
                <p className="text-[13px] text-[#888888] leading-relaxed">
                  Story-driven narrative highlighting problem statement, architectural tradeoffs, tool executions, and lessons learned.
                </p>
                <div className="text-[11px] font-mono text-[#f5a623]">--type interview</div>
              </div>

              <div className="rounded-xl border border-[#262626] bg-[#161616] p-5 space-y-2">
                <h3 className="font-semibold text-white text-[15px]">Debug Log</h3>
                <p className="text-[13px] text-[#888888] leading-relaxed">
                  Dense chronological telemetry with millisecond duration tracking, raw payloads, and explicit error traces.
                </p>
                <div className="text-[11px] font-mono text-[#f5a623]">--type debug</div>
              </div>

              <div className="rounded-xl border border-[#262626] bg-[#161616] p-5 space-y-2">
                <h3 className="font-semibold text-white text-[15px]">Audit Log</h3>
                <p className="text-[13px] text-[#888888] leading-relaxed">
                  Formal compliance view showing exact model checkpoints, cryptographic timestamps, and token cost ledgers.
                </p>
                <div className="text-[11px] font-mono text-[#f5a623]">--type audit</div>
              </div>

              <div className="rounded-xl border border-[#262626] bg-[#161616] p-5 space-y-2">
                <h3 className="font-semibold text-white text-[15px]">Portfolio Log</h3>
                <p className="text-[13px] text-[#888888] leading-relaxed">
                  Outcome-focused executive summary suitable for public project showcases and technical portfolios.
                </p>
                <div className="text-[11px] font-mono text-[#f5a623]">--type portfolio</div>
              </div>
            </div>
          </section>

          <section id="security" className="space-y-4">
            <div className="flex items-center gap-2 text-[22px] font-semibold text-white">
              <Shield className="h-5 w-5 text-emerald-400" />
              <h2>5. Automated Redaction</h2>
            </div>
            <p className="text-[15px] text-[#a0a0a0]">
              Sensitive tokens are never persisted unredacted. Patterns for API keys (`sk-...`), Bearer tokens, emails, and credit cards are scrubbed client-side. Customize via `agentlog.config.ts`:
            </p>
            <div className="rounded-xl border border-[#262626] bg-[#161616] p-4 font-mono text-[13px] text-[#d4d4d4] leading-relaxed">
              <span className="text-blue-400">export default</span> {"{\n"}
              {"  "}sessionDir: <span className="text-emerald-400">&apos;.agentlog/sessions&apos;</span>,{"\n"}
              {"  "}redact: {"{\n"}
              {"    "}enabled: <span className="text-amber-400">true</span>,{"\n"}
              {"    "}patterns: [/custom-token-[0-9]+/g]{"\n"}
              {"  }"}{"\n"}
              {"};"}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
