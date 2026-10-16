// Counts [bracket] placeholders in the text values only,
// so the brackets of lists or other data are never counted
export function countPlaceholders(value: unknown): number {
  if (typeof value === "string") {
    return (value.match(/\[[^\]\n]+\]/g) ?? []).length;
  }
  if (Array.isArray(value)) {
    return value.reduce<number>((n, v) => n + countPlaceholders(v), 0);
  }
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).reduce<number>(
      (n, v) => n + countPlaceholders(v),
      0
    );
  }
  return 0;
}