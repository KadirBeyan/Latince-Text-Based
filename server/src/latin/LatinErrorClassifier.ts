import { normalizeLatin, latinSimilarity, latinEquals } from "./LatinNormalizer";

export function classifyLatinError(playerAnswer: string, expectedAnswer: string): string[] {
  const tags: string[] = [];

  const normPlayer = normalizeLatin(playerAnswer);
  const normExpected = normalizeLatin(expectedAnswer);

  if (!normPlayer) {
    tags.push("empty-answer");
    return tags;
  }

  if (normPlayer.length < 3) {
    tags.push("too-short");
  }

  // Word set checks
  const playerWords = normPlayer.split(/\s+/);
  const expectedWords = normExpected.split(/\s+/);

  const hasSumInExpected = expectedWords.includes("sum");
  const hasSumInPlayer = playerWords.includes("sum");
  if (hasSumInExpected && !hasSumInPlayer) {
    tags.push("missing-sum");
  }

  const hasGreetingInExpected = expectedWords.includes("salve") || expectedWords.includes("salvete");
  const hasGreetingInPlayer = playerWords.includes("salve") || playerWords.includes("salvete");
  if (hasGreetingInExpected && !hasGreetingInPlayer) {
    tags.push("missing-greeting");
  }

  // Spelling / form / word-order variations
  if (!latinEquals(playerAnswer, expectedAnswer)) {
    const similarity = latinSimilarity(playerAnswer, expectedAnswer);
    if (similarity >= 0.75) {
      // Check if it's just a word order variant
      const sortedPlayer = [...playerWords].sort().join(" ");
      const sortedExpected = [...expectedWords].sort().join(" ");
      if (sortedPlayer === sortedExpected) {
        tags.push("word-order-variant");
      } else {
        tags.push("spelling-or-form-error");
      }
    }
  }

  return tags;
}
