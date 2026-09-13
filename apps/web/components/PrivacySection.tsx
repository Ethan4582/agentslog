import { ShieldCheck, HardDrive, EyeOff, Lock } from "lucide-react";

export function PrivacySection() {
  const points = [
    {
      icon: HardDrive,
      title: "100% Local Storage",
      description: "All session recordings are persisted strictly to your local .agentlog directory in append-only newline-delimited JSON. Nothing is ever sent to an external server."
    },
    {
      icon: EyeOff,
      title: "Automated Secret Redaction",
      description: "Keys like sk-..., ghp_..., Bearer authorization headers, and personal emails are scrubbed before anything touches your disk or exported HTML."
    },
    {
      icon: ShieldCheck,
      title: "Configurable Rules",
      description: "Add proprietary regex patterns to agentlog.config.ts to redact internal database strings, JWT signatures, or internal domain names."
    },
    {
      icon: Lock,
      title: "Zero-Dependency HTML",
      description: "Exported HTML files are self-contained. All styles, icons, and fonts are inline. Open and inspect them safely in any offline environment."
    }
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-28 border-t border-[#222222] text-left">
      <div className="mb-14">
        <span className="text-[13px] font-semibold uppercase tracking-wider text-[#f5a623]">
          Security &amp; Privacy
        </span>
        <h2 className="type-h2 mt-3 text-white">
          Your code and data never leave your machine.
        </h2>
        <p className="type-body mt-4 max-w-2xl text-[#a0a0a0]">
          Designed from first principles for engineers working with sensitive proprietary codebases and customer data.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {points.map((pt) => {
          const Icon = pt.icon;
          return (
            <div
              key={pt.title}
              className="rounded-2xl border border-[#242424] bg-[#161616] p-6 space-y-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#202020] text-[#f5a623] border border-[#2e2e2e]">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-[16px] font-semibold text-white">
                {pt.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-[#888888]">
                {pt.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
