import type { LatinDifficultyResult } from "../../types/latinTypes";

const levelLabels: Record<string, string> = { A1: "A1", A2: "A2", B1: "B1", B2: "B2", unknown: "?" };

export function LatinDifficultyBadge({ difficulty }: { difficulty?: LatinDifficultyResult }) {
  if (!difficulty) return null;
  return (
    <details className={`latin-difficulty-badge level-${difficulty.level.toLowerCase()}`}>
      <summary><strong>{levelLabels[difficulty.level] || difficulty.level}</strong><span>{difficulty.score}/100</span></summary>
      <ul>
        {difficulty.reasons.map((reason) => <li key={reason}>{reason}</li>)}
      </ul>
    </details>
  );
}
