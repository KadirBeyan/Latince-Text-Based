export interface NormalizeOptions {
  ignoreCase?: boolean;
  stripPunctuation?: boolean;
  stripMacrons?: boolean;
  normalizeWhitespace?: boolean;
  tolerateIU?: boolean;
  tolerateVU?: boolean;
}

const DEFAULT_OPTIONS: Required<NormalizeOptions> = {
  ignoreCase: true,
  stripPunctuation: true,
  stripMacrons: true,
  normalizeWhitespace: true,
  tolerateIU: false,
  tolerateVU: false,
};

const MACRON_MAP: Record<string, string> = {
  "ā": "a",
  "ē": "e",
  "ī": "i",
  "ō": "o",
  "ū": "u",
  "ȳ": "y",
  "Ā": "a",
  "Ē": "e",
  "Ī": "i",
  "Ō": "o",
  "Ū": "u",
  "Ȳ": "y",
};

export function normalizeLatin(input: string, options?: NormalizeOptions): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let result = input;

  if (opts.ignoreCase) {
    result = result.toLocaleLowerCase("en-US");
  }

  if (opts.stripMacrons) {
    // Replace characters from the mapping
    for (const [macron, clean] of Object.entries(MACRON_MAP)) {
      // Use case-insensitive/sensitive replacement based on ignoreCase
      const target = opts.ignoreCase ? macron.toLocaleLowerCase("en-US") : macron;
      result = result.replace(new RegExp(target, "g"), clean);
    }
    // Also remove combined combining macron character (U+0304) if present
    result = result.normalize("NFD").replace(/\u0304/g, "").normalize("NFC");
  }

  if (opts.tolerateIU) {
    // Treat J/j as I/i
    result = result.replace(/j/g, "i").replace(/J/g, "I");
  }

  if (opts.tolerateVU) {
    // Treat V/v as U/u
    result = result.replace(/v/g, "u").replace(/V/g, "U");
  }

  if (opts.stripPunctuation) {
    // Strip punctuation characters, keep letters, digits, and spaces
    result = result.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?¿¡"'+=\[\]{}<>|\\’““”‘’«»]/g, "");
  }

  if (opts.normalizeWhitespace) {
    result = result.trim().replace(/\s+/g, " ");
  }

  return result;
}

export function normalizeLatinMany(inputs: string[], options?: NormalizeOptions): string[] {
  return inputs.map((input) => normalizeLatin(input, options));
}

export function latinEquals(a: string, b: string, options?: NormalizeOptions): boolean {
  return normalizeLatin(a, options) === normalizeLatin(b, options);
}

export function latinSimilarity(a: string, b: string, options?: NormalizeOptions): number {
  const normA = normalizeLatin(a, options);
  const normB = normalizeLatin(b, options);

  if (normA.length === 0 && normB.length === 0) {
    return 1.0;
  }
  if (normA.length === 0 || normB.length === 0) {
    return 0.0;
  }

  const distance = levenshteinDistance(normA, normB);
  const maxLength = Math.max(normA.length, normB.length);
  return 1.0 - distance / maxLength;
}

function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // deletion
          dp[i][j - 1] + 1,    // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }

  return dp[m][n];
}
