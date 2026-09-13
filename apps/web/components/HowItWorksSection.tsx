import { Code2, ShieldAlert, FileCode2 } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: Code2,
      title: "Wrap your SDK client once",
      description:
        "One wrapper function wraps Anthropic, OpenAI, DeepSeek, or Vercel AI SDK clients. Method signatures and TypeScript types stay 100% identical.",
      code: "import { wrap } from 'agent-logs';\nconst client = wrap(new Anthropic());"
    },
    {
      number: "02",
      icon: ShieldAlert,
      title: "Silent capture with redaction",
      description:
        "Every session call, duration in milliseconds, tool payload, and token count is streamed locally to .agentlog/sessions/ with secrets scrubbed automatically.",
      code: ".agentlog/sessions/sess_4a91f8.ndjson\n✔ Redacted sk-ant-api03-[REDACTED]"
    },
    {
      number: "03",
      icon: FileCode2,
      title: "Export standalone HTML",
      description:
        "Generate a self-contained, beautifully styled single-file HTML report ready to open in any browser or push to GitHub Gist with a single command.",
      code: "npx agent-logs export --type interview\n✔ Saved to agentlog-exports/..."
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-28 border-t border-[#222222] text-left">
      <div className="mb-16">
        <span className="text-[13px] font-semibold uppercase tracking-wider text-[#f5a623]">
          Architecture
        </span>
        <h2 className="type-h2 mt-3 text-white">
          Built for zero friction.
        </h2>
        <p className="type-body mt-4 max-w-2xl text-[#a0a0a0]">
          No servers to configure, no cloud accounts to manage, no telemetry sent to external third parties.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="rounded-2xl border border-[#242424] bg-[#161616] p-6 shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[14px] font-bold text-[#f5a623]">
                    {step.number}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#202020] text-[#a0a0a0] border border-[#2c2c2c]">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <h3 className="text-[18px] font-semibold text-white tracking-tight">
                  {step.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-[#9ca3af]">
                  {step.description}
                </p>
              </div>

              <div className="rounded-xl border border-[#262626] bg-[#121212] p-3 font-mono text-[12px] text-[#d4d4d4] overflow-x-auto whitespace-pre leading-relaxed">
                {step.code}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
