export type Role = "system" | "user" | "assistant" | "tool";

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface Tool {
  name: string;
  description?: string;
  parameters?: Record<string, unknown>;
}

export interface TextContentBlock {
  type: "text";
  text: string;
}

export interface ToolUseContentBlock {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ToolResultContentBlock {
  type: "tool_result";
  toolCallId: string;
  content: string;
}

export type ContentBlock =
  | TextContentBlock
  | ToolUseContentBlock
  | ToolResultContentBlock;

export interface Message {
  role: Role;
  content: string | ContentBlock[];
}

export interface CallInput {
  system?: string;
  messages: Message[];
  tools?: Tool[];
}

export interface CallOutput {
  content: ContentBlock[];
  stopReason: string;
  usage: TokenUsage;
}

export interface Call {
  id: string;
  timestamp: string;
  durationMs: number;
  input: CallInput;
  output: CallOutput;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface SessionHeader {
  type: "header";
  id: string;
  startedAt: string;
  provider: string;
  model: string;
  title?: string;
  metadata?: Record<string, unknown>;
}

export interface SessionCallRecord {
  type: "call";
  call: Call;
}

export type SessionRecord = SessionHeader | SessionCallRecord;

export interface Session {
  id: string;
  startedAt: string;
  provider: string;
  model: string;
  title?: string;
  calls: Call[];
  metadata?: Record<string, unknown>;
}
