import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import type { Session } from "../capture/session";
import { LOG_TYPE_HANDLERS, type LogType } from "./router";
import type { InterviewAnalysis } from "../templates/interviewTemplate";

export interface RenderOptions {
  type?: LogType;
  outputPath?: string;
  exportDir?: string;
  skipLlm?: boolean;
}

export interface RenderResult {
  outputPath: string;
  html: string;
  session: Session;
  type: LogType;
}

function extractHeuristicAnalysis(session: Session): InterviewAnalysis {
  const firstUserMsg = session.calls[0]?.input.messages.find(
    (m) => m.role === "user"
  );
  let goal = "AI Development Workflow";
  if (firstUserMsg) {
    const raw =
      typeof firstUserMsg.content === "string"
        ? firstUserMsg.content
        : JSON.stringify(firstUserMsg.content);
    goal = raw.slice(0, 80).replace(/[\r\n]+/g, " ");
  }

  const toolsSet = new Set<string>();
  for (const c of session.calls) {
    for (const b of c.output.content) {
      if (b.type === "tool_use") {
        toolsSet.add(b.name);
      }
    }
  }

  return {
    title: session.title || `${session.model} Task: ${goal.slice(0, 40)}`,
    summary: `Executed ${session.calls.length} model interactions using ${session.provider} / ${session.model}.`,
    narrative: `The session commenced with initial prompt: "${goal}".\nAcross ${session.calls.length} iterations, the agent completed tool invocations and returned structured responses.`,
    keyDecisions: [
      `Utilized model ${session.model} for session execution`,
      `Managed ${session.calls.length} conversational turns with state tracking`
    ],
    toolsUsed: Array.from(toolsSet),
    lessonsLearned: [
      `Session executed with complete reproducibility and structured logging.`
    ]
  };
}

async function queryLlmForAnalysis(
  session: Session,
  logType: LogType
): Promise<InterviewAnalysis | undefined> {
  const handler = LOG_TYPE_HANDLERS[logType];
  const userPrompt = handler.buildPrompt(session);

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (anthropicKey) {
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 2000,
          system: handler.systemPrompt,
          messages: [{ role: "user", content: userPrompt }]
        })
      });
      if (res.ok) {
        const data = (await res.json()) as {
          content?: Array<{ type: string; text?: string }>;
        };
        const text = data.content?.[0]?.text;
        if (text) {
          const match = text.match(/\{[\s\S]*\}/);
          if (match) {
            return JSON.parse(match[0]) as InterviewAnalysis;
          }
        }
      }
    } catch {
      return undefined;
    }
  }

  if (openaiKey) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: handler.systemPrompt },
            { role: "user", content: userPrompt }
          ]
        })
      });
      if (res.ok) {
        const data = (await res.json()) as {
          choices?: Array<{ message?: { content?: string } }>;
        };
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return JSON.parse(text) as InterviewAnalysis;
        }
      }
    } catch {
      return undefined;
    }
  }

  return undefined;
}

export async function exportSession(
  session: Session,
  options: RenderOptions = {}
): Promise<RenderResult> {
  const type: LogType = options.type ?? "interview";
  const handler = LOG_TYPE_HANDLERS[type];

  let analysis: unknown = undefined;
  if (type === "interview") {
    if (!options.skipLlm) {
      analysis = await queryLlmForAnalysis(session, type);
    }
    if (!analysis) {
      analysis = extractHeuristicAnalysis(session);
    }
  }

  const html = handler.renderHtml(session, analysis);

  const exportDir = options.exportDir
    ? resolve(process.cwd(), options.exportDir)
    : resolve(process.cwd(), "agentlog-exports");

  if (!existsSync(exportDir)) {
    mkdirSync(exportDir, { recursive: true });
  }

  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `${session.id}-${type}-${dateStr}.html`;
  const finalPath = options.outputPath
    ? resolve(process.cwd(), options.outputPath)
    : join(exportDir, filename);

  writeFileSync(finalPath, html, "utf8");

  return {
    outputPath: finalPath,
    html,
    session,
    type
  };
}
