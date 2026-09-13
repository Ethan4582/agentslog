import Link from "next/link";
import { Github, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#222222] bg-[#121212] py-16 text-center">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-center justify-center gap-7 text-[14px] text-[#888888]">
          <Link href="/docs" className="transition-colors hover:text-white">
            Docs
          </Link>
          <Link href="/changelog" className="transition-colors hover:text-white">
            Changelog
          </Link>
          <Link href="#log-types" className="transition-colors hover:text-white">
            Log Types
          </Link>
          <a
            href="https://github.com/agentlogs/agentlogs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
        </div>

        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#262626] bg-[#181818] px-4 py-1.5 font-mono text-[12px] text-[#a0a0a0]">
            <Terminal className="h-3.5 w-3.5 text-[#f5a623]" />
            <span>npm install agent-logs</span>
          </div>
        </div>

        <p className="mt-8 text-[13px] text-[#666666]">
          Released under MIT License &bull; &copy; 2026 agent-logs
        </p>
      </div>
    </footer>
  );
}
