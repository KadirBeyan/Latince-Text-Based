export function extractFirstJsonObject(text: string): string | null {
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
    return text.substring(firstBrace, lastBrace + 1);
  }
  return null;
}

export function repairCommonJsonIssues(text: string): string {
  let cleaned = text;

  // 1. Remove markdown code blocks if present
  cleaned = cleaned.replace(/```json\s*/gi, "");
  cleaned = cleaned.replace(/```\s*/g, "");

  // 2. Remove trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,\s*([}\]])/g, "$1");

  return cleaned.trim();
}

export function safeJsonParse<T>(text: string): T | null {
  if (!text) return null;

  try {
    // Attempt standard parse first
    return JSON.parse(text) as T;
  } catch {
    // Attempt cleaning code blocks and trailing commas
    const cleaned = repairCommonJsonIssues(text);
    try {
      return JSON.parse(cleaned) as T;
    } catch {
      // Attempt extracting first JSON object
      const extracted = extractFirstJsonObject(cleaned);
      if (extracted) {
        try {
          return JSON.parse(extracted) as T;
        } catch {
          // If still fails, try cleaning trailing commas again on extracted JSON
          try {
            const doubleCleaned = repairCommonJsonIssues(extracted);
            return JSON.parse(doubleCleaned) as T;
          } catch {
            return null;
          }
        }
      }
    }
  }

  return null;
}
