import { useEffect, useMemo, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { analyzeSentence } from "../../api/latinApi";
import { useGameStore } from "../../stores/gameStore";
import { isLatinEvaluation } from "../../types/gameTypes";
import type { LatinSentenceAnalysis } from "../../types/latinTypes";
import { LatinDifficultyBadge } from "./LatinDifficultyBadge";

function featureText(features?: Record<string, string | undefined>) {
  if (!features) return "";
  return Object.entries(features).filter(([, value]) => Boolean(value)).map(([key, value]) => `${key}: ${value}`).join(", ");
}

export function LatinAnalysisPanel() {
  const { gameState } = useGameStore();
  const event = useMemo(() => [...(gameState?.recentEvents ?? [])].reverse().find((candidate) => candidate.type === "TEXT_EVALUATED"), [gameState?.recentEvents]);
  const evaluation = isLatinEvaluation(event?.payload?.evaluation) ? event.payload.evaluation : null;
  const playerAnswer = typeof event?.payload?.playerAnswer === "string" ? event.payload.playerAnswer : "";
  const [analysis, setAnalysis] = useState<LatinSentenceAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const playerLevel = gameState?.player?.level;
  const grammarIds = gameState?.currentScene.learningFocus?.grammarIds ?? [];
  const vocabularyIds = gameState?.currentScene.learningFocus?.vocabularyIds ?? [];

  useEffect(() => {
    setAnalysis(null);
    setError(null);
    if (!playerAnswer.trim()) return;
    void analyzeSentence({ text: playerAnswer, playerLevel, unlockedGrammarIds: grammarIds, knownVocabularyIds: vocabularyIds })
      .then(setAnalysis)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Analiz alınamadı."));
  }, [playerAnswer, playerLevel, grammarIds.join("|"), vocabularyIds.join("|")]);

  return (
    <section className="panel-card latin-analysis-panel">
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Lingua</p>
        <h3>Latin Analizi</h3>
      </div>
      {!evaluation ? <p className="empty-state">Henüz değerlendirilen Latince cevap yok.</p> : null}
      {evaluation ? (
        <div className="latin-analysis-stack">
          {evaluation.analysisSummary ? <p>{evaluation.analysisSummary}</p> : null}
          <LatinDifficultyBadge difficulty={evaluation.difficulty || analysis?.difficulty} />
          {evaluation.detectedErrors?.length ? (
            <ul className="latin-error-list">
              {evaluation.detectedErrors.map((detectedError, index) => <li key={`${detectedError.tag}-${index}`}>{detectedError.messageTr}</li>)}
            </ul>
          ) : null}
          {error ? <p className="danger">{error}</p> : null}
          {analysis ? (
            <details className="latin-token-details" open>
              <summary><MagnifyingGlass size={16} weight="bold" /> Tokenler</summary>
              <div className="latin-token-list">
                {analysis.words.map((word) => (
                  <div key={`${word.token.index}-${word.token.raw}`} className="latin-token-row">
                    <strong>{word.token.raw}</strong>
                    <span>{word.best?.lemma ?? "?"}</span>
                    <small>{word.best ? `${word.best.pos}${featureText(word.best.features) ? ` | ${featureText(word.best.features)}` : ""}` : "Çözümlenemedi"}</small>
                  </div>
                ))}
              </div>
            </details>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
