export function normalizeLatinText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/j/g, "i")
    .replace(/v/g, "u")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function normalizeLatinToken(value: string): string {
  return normalizeLatinText(value).replace(/\s+/g, "");
}

export function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function countBy<T extends string>(values: T[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const value of values) out[value] = (out[value] || 0) + 1;
  return out;
}
