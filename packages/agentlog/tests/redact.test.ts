import { describe, it, expect } from "bun:test";
import { redactString, redactValue } from "../src/capture/redact";

describe("redaction", () => {
  it("redacts standard api keys", () => {
    const raw = "My key is sk-proj12345678901234567890abcdef and secret";
    const cleaned = redactString(raw);
    expect(cleaned).not.toContain("sk-proj12345678901234567890abcdef");
    expect(cleaned).toContain("[REDACTED]");
  });

  it("redacts bearer tokens", () => {
    const raw = "Authorization: Bearer mySecretTokenWithLongChars1234567890";
    const cleaned = redactString(raw);
    expect(cleaned).not.toContain("mySecretTokenWithLongChars1234567890");
    expect(cleaned).toContain("[REDACTED]");
  });

  it("redacts email addresses", () => {
    const raw = "Contact engineering at dev.lead@company.internal for info";
    const cleaned = redactString(raw);
    expect(cleaned).not.toContain("dev.lead@company.internal");
    expect(cleaned).toContain("[REDACTED]");
  });

  it("redacts nested objects and arrays", () => {
    const payload = {
      user: "dev.user@example.com",
      secrets: ["sk-abcdef12345678901234567890", "ok_val"],
      meta: {
        token: "Bearer token_value_with_enough_length_12345"
      }
    };

    const redacted = redactValue(payload);
    expect(redacted.user).toBe("[REDACTED]");
    expect(redacted.secrets[0]).toBe("[REDACTED]");
    expect(redacted.secrets[1]).toBe("ok_val");
    expect(redacted.meta.token).toContain("[REDACTED]");
  });
});
