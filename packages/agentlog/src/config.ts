import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export interface AgentlogConfig {
  sessionDir: string;
  exportDir: string;
  redact: {
    enabled: boolean;
    patterns: RegExp[];
  };
  defaultProvider: string;
  share: {
    provider: "gist";
  };
}

export const DEFAULT_CONFIG: AgentlogConfig = {
  sessionDir: process.env.AGENTLOG_SESSION_DIR || ".agentlog/sessions",
  exportDir: "./agentlog-exports",
  redact: {
    enabled: true,
    patterns: []
  },
  defaultProvider: "anthropic",
  share: {
    provider: "gist"
  }
};

export async function loadConfig(cwd: string = process.cwd()): Promise<AgentlogConfig> {
  const candidateNames = [
    "agentlog.config.ts",
    "agentlog.config.js",
    "agentlog.config.mjs"
  ];

  for (const name of candidateNames) {
    const fullPath = resolve(cwd, name);
    if (existsSync(fullPath)) {
      try {
        const fileUrl = pathToFileURL(fullPath).href;
        const mod = (await import(fileUrl)) as { default?: Partial<AgentlogConfig> };
        const userConfig = mod.default ?? {};
        return {
          ...DEFAULT_CONFIG,
          ...userConfig,
          redact: {
            ...DEFAULT_CONFIG.redact,
            ...(userConfig.redact ?? {})
          },
          share: {
            ...DEFAULT_CONFIG.share,
            ...(userConfig.share ?? {})
          }
        };
      } catch {
        return DEFAULT_CONFIG;
      }
    }
  }

  return DEFAULT_CONFIG;
}
