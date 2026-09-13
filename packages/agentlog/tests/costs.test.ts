import { describe, it, expect } from "bun:test";
import { calculateCost, findPricing } from "../src/costs";

describe("costs", () => {
  it("finds exact and partial matches", () => {
    const p1 = findPricing("claude-opus-4-5");
    expect(p1?.input).toBe(15);
    expect(p1?.output).toBe(75);

    const p2 = findPricing("gpt-4o-2024-08-06");
    expect(p2?.input).toBe(5);
    expect(p2?.output).toBe(15);
  });

  it("calculates cost accurately", () => {
    const cost = calculateCost("claude-3-5-sonnet", {
      promptTokens: 100_000,
      completionTokens: 50_000,
      totalTokens: 150_000
    });
    expect(cost).toBe(0.3 + 0.75);
  });

  it("returns null for unknown models without throwing", () => {
    const cost = calculateCost("some-custom-unknown-model-xyz", {
      promptTokens: 1000,
      completionTokens: 500,
      totalTokens: 1500
    });
    expect(cost).toBeNull();
  });
});
