"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "What exactly is agent-logs?",
    answer:
      "agent-logs is a lightweight, zero-config TypeScript/JavaScript developer tool for capturing and exporting AI agent sessions. It wraps your existing SDK clients in one line, records prompt iterations and tool invocations locally to newline-delimited JSON (.ndjson), and exports them into standalone, beautiful HTML reports."
  },
  {
    question: "How does the one-line wrap() function work?",
    answer:
      "The wrap() function returns a transparent Proxy around your Anthropic, OpenAI, or Vercel AI SDK client. It intercepts method invocations (such as messages.create or chat.completions.create), records latency, token counts, and tool calls, scrubs sensitive data, and appends the trace to your local session directory without mutating responses or adding latency."
  },
  {
    question: "Where are my session traces stored?",
    answer:
      "All session traces are saved strictly on your local filesystem under .agentlog/sessions/<session-id>.ndjson in the project root. agent-logs does not run any background daemon, does not require an account, and sends zero telemetry to remote servers."
  },
  {
    question: "How does secret redaction work?",
    answer:
      "Before any text is written to disk or exported, agent-logs runs an automated redaction engine that identifies and sanitizes OpenAI keys, Anthropic keys, GitHub tokens, Bearer tokens, email addresses, and credit cards. You can also specify custom regex patterns in your agentlog.config.ts."
  },
  {
    question: "What are the four log types supported?",
    answer:
      "agent-logs supports: (1) Interview Log — a story-driven narrative highlighting problem framing, decisions, and tool usage; (2) Debug Log — dense telemetry with millisecond timing and raw request/response payloads; (3) Audit Log — a formal compliance ledger with exact model versions and itemized token costs; and (4) Portfolio Log — an outcome-focused summary for engineering showcases."
  },
  {
    question: "Can I use agent-logs with local models like Ollama or vLLM?",
    answer:
      "Yes. The OpenAI adapter automatically detects any custom baseURL (such as http://localhost:11434/v1 for Ollama or http://localhost:8000/v1 for vLLM) and logs all local inference turns seamlessly."
  },
  {
    question: "What license is agent-logs released under?",
    answer:
      "agent-logs is released under the MIT License. You are free to inspect, modify, and self-host for personal or commercial use."
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section className="mx-auto max-w-4xl px-6 py-28 border-t border-[#222222] text-left">
      <h2 className="type-h2 mb-12 text-white">Frequently Asked Questions</h2>

      <div className="divide-y divide-[#242424] border-y border-[#242424]">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={item.question} className="py-5">
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="flex w-full items-center justify-between text-left transition-colors hover:text-white cursor-pointer"
              >
                <span className="text-[17px] font-medium text-[#ededed]">
                  {item.question}
                </span>
                <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center text-[20px] font-light text-[#888888]">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className="mt-3.5 pr-8 text-[15px] leading-relaxed text-[#9ca3af]">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
