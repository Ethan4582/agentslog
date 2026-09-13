import type { TokenUsage } from "./capture/session";

export interface ModelPricing {
  readonly input: number;
  readonly output: number;
}

export const PRICING: Readonly<Record<string, ModelPricing>> = {
  "claude-opus-4-5": { input: 15, output: 75 },
  "claude-sonnet-4-6": { input: 3, output: 15 },
  "claude-3-5-sonnet": { input: 3, output: 15 },
  "claude-3-opus": { input: 15, output: 75 },
  "claude-3-haiku": { input: 0.25, output: 1.25 },
  "gpt-4o": { input: 5, output: 15 },
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4-turbo": { input: 10, output: 30 },
  "gemini-1.5-pro": { input: 3.5, output: 10.5 },
  "gemini-1.5-flash": { input: 0.075, output: 0.3 },
  "deepseek-chat": { input: 0.14, output: 0.28 },
  "deepseek-coder": { input: 0.14, output: 0.28 }
};

export function findPricing(model: string): ModelPricing | null {
  const normalized = model.toLowerCase();
  if (normalized in PRICING) {
    return PRICING[normalized];
  }
  for (const key of Object.keys(PRICING)) {
    if (normalized.includes(key)) {
      return PRICING[key];
    }
  }
  return null;
}

export function calculateCost(model: string, usage: TokenUsage): number | null {
  const pricing = findPricing(model);
  if (!pricing) {
    return null;
  }
  const inputCost = (usage.promptTokens / 1_000_000) * pricing.input;
  const outputCost = (usage.completionTokens / 1_000_000) * pricing.output;
  return Number((inputCost + outputCost).toFixed(6));
}
