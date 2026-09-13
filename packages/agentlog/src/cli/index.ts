#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync, readFileSync, appendFileSync } from "node:fs";
import { resolve } from "node:path";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { renderBrandHeader } from "./brand";
import { listSessions, clearSessions, readSessionFile } from "../capture/writer";
import { exportSession } from "../export/renderer";
import type { LogType } from "../export/router";
import { calculateCost } from "../costs";
import { loadConfig } from "../config";

function parseArgs(args: string[]): {
  command: string;
  subcommand?: string;
  flags: Record<string, string | boolean>;
} {
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(arg);
    }
  }

  return {
    command: positional[0] || "help",
    subcommand: positional[1],
    flags
  };
}

async function handleInit(): Promise<void> {
  p.intro(pc.yellow("agentlog — setup"));

  const captureMode = await p.select({
    message: "Step 1 of 3 — How should agentlog capture your sessions?",
    options: [
      {
        value: "ambient",
        label: "Use your existing agent environment (Cursor, Claude Code, Codex…)",
        hint: "default"
      },
      {
        value: "manual",
        label: "Provide an API key manually"
      }
    ],
    initialValue: "ambient"
  });

  if (p.isCancel(captureMode)) {
    p.cancel("Operation cancelled");
    process.exit(0);
  }

  const logType = await p.select({
    message: "Step 2 of 3 — Which log type do you want to generate?",
    options: [
      {
        value: "interview",
        label: "Interview log",
        hint: "story-driven, shows your reasoning"
      },
      {
        value: "debug",
        label: "Debug log",
        hint: "raw, dense, timestamps + errors"
      },
      {
        value: "audit",
        label: "Audit log",
        hint: "formal, costs visible, model versions"
      },
      {
        value: "portfolio",
        label: "Portfolio log",
        hint: "outcome-focused, minimal noise"
      }
    ],
    initialValue: "interview"
  });

  if (p.isCancel(logType)) {
    p.cancel("Operation cancelled");
    process.exit(0);
  }

  const sessionName = await p.text({
    message: "Step 3 of 3 — Give this session a name (optional)",
    placeholder: "my-research-agent"
  });

  if (p.isCancel(sessionName)) {
    p.cancel("Operation cancelled");
    process.exit(0);
  }

  const sDir = resolve(process.cwd(), ".agentlog", "sessions");
  if (!existsSync(sDir)) {
    mkdirSync(sDir, { recursive: true });
  }

  const gitignorePath = resolve(process.cwd(), ".gitignore");
  if (existsSync(gitignorePath)) {
    const gitignoreContent = readFileSync(gitignorePath, "utf8");
    if (!gitignoreContent.includes(".agentlog")) {
      appendFileSync(gitignorePath, "\n.agentlog/\nagentlog-exports/\n", "utf8");
    }
  } else {
    writeFileSync(gitignorePath, ".agentlog/\nagentlog-exports/\n", "utf8");
  }

  const configPath = resolve(process.cwd(), "agentlog.config.ts");
  if (!existsSync(configPath)) {
    const configContent = `export default {\n  sessionDir: '.agentlog/sessions',\n  exportDir: './agentlog-exports',\n  redact: {\n    enabled: true,\n    patterns: [],\n  },\n  defaultProvider: 'anthropic',\n  share: {\n    provider: 'gist',\n  }\n};\n`;
    writeFileSync(configPath, configContent, "utf8");
  }

  p.note(
    `✔ Session directory created: .agentlog/sessions/\n✔ Added .agentlog/ to .gitignore\n✔ Config written: agentlog.config.ts`,
    pc.green("Ready to capture")
  );

  p.outro(
    pc.dim(
      "You're set. Run your agent normally — agentlog captures everything silently.\nExport when ready: npx agentlog export"
    )
  );
}

async function handleSessions(subcommand?: string): Promise<void> {
  const config = await loadConfig();
  if (subcommand === "clear") {
    const confirmed = await p.confirm({
      message: "Are you sure you want to delete all local session traces?",
      initialValue: false
    });
    if (!confirmed || p.isCancel(confirmed)) {
      p.cancel("Cancelled");
      return;
    }
    const count = clearSessions(config.sessionDir);
    console.log(pc.green(`✔ Cleared ${count} session file(s).`));
    return;
  }

  const sessions = listSessions(config.sessionDir);
  if (sessions.length === 0) {
    console.log(pc.red("✗ No sessions found."));
    console.log(pc.dim("  Run your agent first, then come back to export."));
    console.log(pc.dim("  Docs: https://agentlog.dev/docs/getting-started\n"));
    return;
  }

  console.log(pc.bold("\nCaptured Sessions:\n"));
  console.log(
    pc.dim(
      "ID".padEnd(14) +
        "Date".padEnd(24) +
        "Model".padEnd(20) +
        "Calls".padEnd(8) +
        "Tokens".padEnd(10) +
        "Cost"
    )
  );
  console.log(pc.dim("-".repeat(84)));

  for (const s of sessions) {
    const totalTokens = s.calls.reduce(
      (acc, c) => acc + c.output.usage.totalTokens,
      0
    );
    const promptTokens = s.calls.reduce(
      (acc, c) => acc + c.output.usage.promptTokens,
      0
    );
    const completionTokens = s.calls.reduce(
      (acc, c) => acc + c.output.usage.completionTokens,
      0
    );
    const cost = calculateCost(s.model, {
      promptTokens,
      completionTokens,
      totalTokens
    });
    const costStr = cost !== null ? `$${cost.toFixed(4)}` : "unknown";

    const dateStr = s.startedAt.replace("T", " ").slice(0, 19);
    console.log(
      pc.yellow(s.id.padEnd(14)) +
        dateStr.padEnd(24) +
        s.model.slice(0, 18).padEnd(20) +
        String(s.calls.length).padEnd(8) +
        String(totalTokens).padEnd(10) +
        costStr
    );
  }
  console.log();
}

async function handleExport(flags: Record<string, string | boolean>): Promise<void> {
  const config = await loadConfig();
  const sessions = listSessions(config.sessionDir);

  if (sessions.length === 0) {
    console.log(pc.red("✗ No sessions found."));
    console.log(pc.dim("  Run your agent first, then come back to export."));
    console.log(pc.dim("  Docs: https://agentlog.dev/docs/getting-started\n"));
    return;
  }

  let selectedSessionId = typeof flags.session === "string" ? flags.session : undefined;

  if (!selectedSessionId) {
    const choices = sessions.map((s) => ({
      value: s.id,
      label: `${s.id} (${s.model})`,
      hint: `${s.calls.length} calls · ${s.startedAt.slice(0, 10)}`
    }));

    const choice = await p.select({
      message: "Pick a session to export:",
      options: choices
    });

    if (p.isCancel(choice)) {
      p.cancel("Export cancelled");
      return;
    }
    selectedSessionId = choice as string;
  }

  const session = sessions.find((s) => s.id === selectedSessionId);
  if (!session) {
    console.log(pc.red(`✗ Session "${selectedSessionId}" not found.`));
    return;
  }

  let selectedType = typeof flags.type === "string" ? (flags.type as LogType) : undefined;
  if (!selectedType) {
    const typeChoice = await p.select({
      message: "Pick export log type:",
      options: [
        { value: "interview", label: "Interview log", hint: "story-driven" },
        { value: "debug", label: "Debug log", hint: "raw telemetry" },
        { value: "audit", label: "Audit log", hint: "compliance" },
        { value: "portfolio", label: "Portfolio log", hint: "showcase" }
      ],
      initialValue: "interview"
    });

    if (p.isCancel(typeChoice)) {
      p.cancel("Export cancelled");
      return;
    }
    selectedType = typeChoice as LogType;
  }

  const spin = p.spinner();
  spin.start(`Generating ${selectedType} log (~5-15s)...`);

  try {
    const result = await exportSession(session, {
      type: selectedType,
      outputPath: typeof flags.output === "string" ? flags.output : undefined,
      exportDir: config.exportDir
    });

    spin.stop(pc.green(`✔ Exported successfully!`));
    console.log(pc.dim(`  Saved to: `) + pc.cyan(result.outputPath) + "\n");
  } catch (err: unknown) {
    spin.stop(pc.red("✗ Export failed"));
    const msg = err instanceof Error ? err.message : String(err);
    console.log(pc.red(`  Error: ${msg}\n`));
  }
}

async function handleShare(flags: Record<string, string | boolean>): Promise<void> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.log(pc.red("✗ GITHUB_TOKEN not set."));
    console.log(pc.dim("  Add it to your .env file or run: export GITHUB_TOKEN=ghp_..."));
    console.log(pc.dim("  Docs: https://agentlog.dev/docs/sharing\n"));
    return;
  }

  const config = await loadConfig();
  const sessions = listSessions(config.sessionDir);
  if (sessions.length === 0) {
    console.log(pc.red("✗ No sessions found to share."));
    return;
  }

  const session = sessions[0];
  const spin = p.spinner();
  spin.start("Exporting session and uploading to GitHub Gist...");

  try {
    const result = await exportSession(session, {
      type: "interview",
      exportDir: config.exportDir
    });

    const res = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        Authorization: `token ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "agentlog-cli"
      },
      body: JSON.stringify({
        description: `agentlog session ${session.id}`,
        public: true,
        files: {
          [`agentlog-${session.id}.html`]: {
            content: result.html
          }
        }
      })
    });

    if (!res.ok) {
      throw new Error(`GitHub API returned status ${res.status}`);
    }

    const data = (await res.json()) as { html_url?: string };
    spin.stop(pc.green("✔ Uploaded to Gist!"));
    console.log(pc.cyan(`  Share link: ${data.html_url ?? "Created"}\n`));
  } catch (err: unknown) {
    spin.stop(pc.red("✗ Share upload failed"));
    const msg = err instanceof Error ? err.message : String(err);
    console.log(pc.red(`  ${msg}\n`));
  }
}

function showHelp(): void {
  console.log(`Commands:
  ${pc.yellow("npx agentlog")}                   ${pc.dim("Show help and ASCII branding")}
  ${pc.yellow("npx agentlog init")}              ${pc.dim("First-run interactive setup")}
  ${pc.yellow("npx agentlog export")}            ${pc.dim("Export session to self-contained HTML")}
  ${pc.yellow("npx agentlog sessions")}          ${pc.dim("List captured sessions")}
  ${pc.yellow("npx agentlog sessions clear")}    ${pc.dim("Delete all local session traces")}
  ${pc.yellow("npx agentlog share")}             ${pc.dim("Export and upload to GitHub Gist")}

Options:
  --session <id>    Specify session ID for export
  --type <type>      interview | debug | audit | portfolio
  --output <file>    Destination path for exported HTML
`);
}

async function main(): Promise<void> {
  const rawArgs = process.argv.slice(2);
  const { command, subcommand, flags } = parseArgs(rawArgs);

  await renderBrandHeader(command === "help" || rawArgs.length === 0);

  try {
    switch (command) {
      case "init":
        await handleInit();
        break;
      case "sessions":
        await handleSessions(subcommand);
        break;
      case "export":
        await handleExport(flags);
        break;
      case "share":
        await handleShare(flags);
        break;
      case "--version":
      case "-v":
        console.log("0.1.0");
        break;
      case "help":
      default:
        showHelp();
        break;
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(pc.red(`\n✗ Error: ${msg}\n`));
    process.exit(1);
  }
}

main();
