"use client";

import Link from "next/link";
import Image from "next/image";
import { Github } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#232323] bg-[#121212]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-[#2c2c2c] bg-[#1a1a1a]">
            <Image
              src="/applog.png"
              alt="agent-logs logo"
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-[17px] font-semibold tracking-tight text-white font-mono">
            agent-logs
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="#log-types"
            className="text-[14px] font-medium text-[#a0a0a0] transition-colors hover:text-white"
          >
            Log Types
          </Link>
          <Link
            href="/docs"
            className="text-[14px] font-medium text-[#a0a0a0] transition-colors hover:text-white"
          >
            Docs
          </Link>
          <Link
            href="/changelog"
            className="text-[14px] font-medium text-[#a0a0a0] transition-colors hover:text-white"
          >
            Changelog
          </Link>
          <a
            href="https://github.com/agentlogs/agentlogs"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-[14px] font-medium text-[#a0a0a0] transition-colors hover:text-white"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
          <Link
            href="/docs#installation"
            className="rounded-lg bg-[#ededed] px-3.5 py-1.5 text-[13px] font-medium text-black transition-all hover:bg-white active:scale-95"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
