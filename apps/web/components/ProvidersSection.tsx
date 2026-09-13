import Image from "next/image";

const PROVIDERS = [
  {
    name: "Anthropic Claude",
    icon: "/claude.svg",
    invert: true,
    models: "Claude 3.5 Sonnet, Claude Opus 4.5, Haiku"
  },
  {
    name: "OpenAI",
    icon: "/codex.svg",
    invert: false,
    models: "GPT-4o, GPT-4o-mini, o1, o3-mini"
  },
  {
    name: "DeepSeek",
    icon: "/deepseek.svg",
    invert: false,
    models: "DeepSeek-V3, DeepSeek-R1"
  },
  {
    name: "Google Gemini",
    icon: "/gemini.svg",
    invert: false,
    models: "Gemini 1.5 Pro, Gemini 1.5 Flash"
  },
  {
    name: "xAI Grok",
    icon: "/grok.svg",
    invert: true,
    models: "Grok-2, Grok-Beta"
  },
  {
    name: "Vercel AI SDK",
    icon: "/vercel.svg",
    invert: true,
    models: "generateText & multi-provider pipelines"
  }
];

export function ProvidersSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28 border-t border-[#222222] text-left">
      <div className="mb-14">
        <span className="text-[13px] font-semibold uppercase tracking-wider text-[#f5a623]">
          Ecosystem
        </span>
        <h2 className="type-h2 mt-3 text-white">
          Native support for your AI stack.
        </h2>
        <p className="type-body mt-4 max-w-2xl text-[#a0a0a0]">
          Wrap any client in one line. AgentLogs automatically detects provider endpoints, token formats, and pricing schedules.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROVIDERS.map((provider) => (
          <div
            key={provider.name}
            className="rounded-xl border border-[#242424] bg-[#161616] p-5 hover:border-[#333333] transition-all"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1a1a1a] p-2 border border-[#2a2a2a]">
                <Image
                  src={provider.icon}
                  alt={provider.name}
                  width={20}
                  height={20}
                  className={provider.invert ? "brightness-0 invert" : "brightness-95"}
                />
              </div>
              <h3 className="text-[15px] font-semibold text-white">
                {provider.name}
              </h3>
            </div>
            <p className="text-[13px] text-[#888888] font-mono">
              {provider.models}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
