import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function ChangelogPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#121212] text-[#ededed]">
      <Navbar />
      <main className="flex-1 mx-auto max-w-4xl px-6 py-16 text-left">
        <div className="border-b border-[#222222] pb-8 mb-12">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#f5a623]">
            Releases
          </span>
          <h1 className="type-h1 mt-3 text-white">Changelog</h1>
          <p className="type-body mt-3 text-[#a0a0a0]">
            Release notes and feature updates for agentlog.
          </p>
        </div>

        <div className="space-y-12">
          <article className="rounded-2xl border border-[#262626] bg-[#161616] p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#222222] pb-4">
              <div className="flex items-center gap-3">
                <span className="rounded-md bg-[#f5a623]/10 px-2.5 py-1 text-[13px] font-mono font-semibold text-[#f5a623] border border-[#f5a623]/25">
                  v0.1.0
                </span>
                <span className="text-[14px] font-medium text-white">Initial Release</span>
              </div>
              <time className="text-[13px] font-mono text-[#666666]">September 2026</time>
            </div>

            <div className="space-y-4 text-[15px] text-[#a0a0a0] leading-relaxed">
              <p>
                Initial release of <strong>agentlog</strong> &mdash; zero-config AI session logger and export engine.
              </p>

              <h4 className="font-semibold text-white text-[16px] pt-2">Features Included:</h4>
              <ul className="list-disc pl-5 space-y-2 text-[#d4d4d4]">
                <li>
                  <strong className="text-white">One-Line Client Wrapping:</strong> Wrap Anthropic, OpenAI, DeepSeek, Grok, and Vercel AI SDK clients with full type safety.
                </li>
                <li>
                  <strong className="text-white">Local NDJSON Session Recording:</strong> High-performance append-only trace storage in <code className="text-[#f5a623]">.agentlog/sessions/</code>.
                </li>
                <li>
                  <strong className="text-white">Client-Side Secret Redaction:</strong> Built-in regex engine sanitizes API keys (<code className="text-emerald-400">sk-...</code>), bearer tokens, emails, and credit cards before persistence.
                </li>
                <li>
                  <strong className="text-white">Interactive CLI:</strong> Built with <code className="text-[#38bdf8]">@clack/prompts</code>, featuring animated ANSI terminal branding and commands: <code className="text-[#f5a623]">init</code>, <code className="text-[#f5a623]">sessions</code>, <code className="text-[#f5a623]">export</code>, and <code className="text-[#f5a623]">share</code>.
                </li>
                <li>
                  <strong className="text-white">Four Export Log Formats:</strong> Standalone single-file HTML reports for Interview, Debug, Audit, and Portfolio logs with zero CDN dependencies.
                </li>
                <li>
                  <strong className="text-white">Real-Time Cost Engine:</strong> Calculates USD token pricing across Claude, GPT-4o, Gemini, and DeepSeek.
                </li>
              </ul>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
