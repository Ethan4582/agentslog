import { existsSync, mkdirSync, appendFileSync, readFileSync, readdirSync, unlinkSync } from "node:fs";
import { resolve, join } from "node:path";
import { randomUUID } from "node:crypto";
import type { Call, Session, SessionHeader, SessionRecord } from "./session";
import { redactValue } from "./redact";

export interface SessionWriterOptions {
  sessionDir?: string;
  customRedactPatterns?: readonly RegExp[];
}

export class SessionWriter {
  readonly sessionId: string;
  readonly sessionDir: string;
  readonly filePath: string;
  private readonly customRedactPatterns: readonly RegExp[];
  private isInitialized = false;

  constructor(
    provider: string,
    model: string,
    title?: string,
    options?: SessionWriterOptions
  ) {
    this.sessionId = randomUUID().slice(0, 12);
    this.sessionDir = options?.sessionDir
      ? resolve(process.cwd(), options.sessionDir)
      : resolve(process.cwd(), ".agentlog", "sessions");
    this.filePath = join(this.sessionDir, `${this.sessionId}.ndjson`);
    this.customRedactPatterns = options?.customRedactPatterns ?? [];

    this.ensureDirectory();
    this.writeHeader({
      type: "header",
      id: this.sessionId,
      startedAt: new Date().toISOString(),
      provider,
      model,
      title
    });
  }

  private ensureDirectory(): void {
    if (!existsSync(this.sessionDir)) {
      mkdirSync(this.sessionDir, { recursive: true });
    }
  }

  private writeHeader(header: SessionHeader): void {
    if (this.isInitialized) return;
    const sanitized = redactValue(header, this.customRedactPatterns);
    appendFileSync(this.filePath, `${JSON.stringify(sanitized)}\n`, "utf8");
    this.isInitialized = true;
  }

  recordCall(call: Call): void {
    const sanitized = redactValue(call, this.customRedactPatterns);
    const record = {
      type: "call" as const,
      call: sanitized
    };
    appendFileSync(this.filePath, `${JSON.stringify(record)}\n`, "utf8");
  }
}

export function readSessionFile(filePath: string): Session | null {
  if (!existsSync(filePath)) {
    return null;
  }

  const raw = readFileSync(filePath, "utf8");
  const lines = raw.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return null;
  }

  let session: Session | null = null;

  for (const line of lines) {
    try {
      const record = JSON.parse(line) as SessionRecord;
      if (record.type === "header") {
        session = {
          id: record.id,
          startedAt: record.startedAt,
          provider: record.provider,
          model: record.model,
          title: record.title,
          calls: [],
          metadata: record.metadata
        };
      } else if (record.type === "call" && session) {
        session.calls.push(record.call);
      }
    } catch {
      continue;
    }
  }

  return session;
}

export function listSessions(sessionDir?: string): Session[] {
  const dir = sessionDir
    ? resolve(process.cwd(), sessionDir)
    : resolve(process.cwd(), ".agentlog", "sessions");

  if (!existsSync(dir)) {
    return [];
  }

  const files = readdirSync(dir).filter((file) => file.endsWith(".ndjson"));
  const sessions: Session[] = [];

  for (const file of files) {
    const s = readSessionFile(join(dir, file));
    if (s) {
      sessions.push(s);
    }
  }

  return sessions.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

export function clearSessions(sessionDir?: string): number {
  const dir = sessionDir
    ? resolve(process.cwd(), sessionDir)
    : resolve(process.cwd(), ".agentlog", "sessions");

  if (!existsSync(dir)) {
    return 0;
  }

  const files = readdirSync(dir).filter((file) => file.endsWith(".ndjson"));
  for (const file of files) {
    unlinkSync(join(dir, file));
  }
  return files.length;
}
