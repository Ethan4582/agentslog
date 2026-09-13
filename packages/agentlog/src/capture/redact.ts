export const DEFAULT_REDACT_PATTERNS: readonly RegExp[] = [
  /sk-[a-zA-Z0-9_-]{20,}/g,
  /Bearer\s+[a-zA-Z0-9._-]{20,}/gi,
  /ghp_[a-zA-Z0-9]{36}/g,
  /xox[baprs]-[a-zA-Z0-9-]{10,}/g,
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  /\b(?:\d{4}[ -]?){3}\d{4}\b/g
];

export function redactString(
  input: string,
  customPatterns: readonly RegExp[] = []
): string {
  let result = input;
  const patterns = [...DEFAULT_REDACT_PATTERNS, ...customPatterns];
  for (const pattern of patterns) {
    const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
    const regex = new RegExp(pattern.source, flags);
    result = result.replace(regex, "[REDACTED]");
  }
  return result;
}

export function redactValue<T>(
  value: T,
  customPatterns: readonly RegExp[] = []
): T {
  if (typeof value === "string") {
    return redactString(value, customPatterns) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item: unknown) =>
      redactValue(item, customPatterns)
    ) as unknown as T;
  }
  if (value !== null && typeof value === "object") {
    const nextObj: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(
      value as Record<string, unknown>
    )) {
      nextObj[key] = redactValue(val, customPatterns);
    }
    return nextObj as unknown as T;
  }
  return value;
}
