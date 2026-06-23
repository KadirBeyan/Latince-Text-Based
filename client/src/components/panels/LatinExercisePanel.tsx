import { useMemo, useState } from "react";
import { Cards, Eye, Sparkle } from "@phosphor-icons/react";
import { generateExercises } from "../../api/latinApi";
import { useGameStore } from "../../stores/gameStore";
import { isLatinEvaluation } from "../../types/gameTypes";
import type { LatinExercise } from "../../types/latinTypes";

export function LatinExercisePanel() {
  const { gameState } = useGameStore();
  const [exercises, setExercises] = useState<LatinExercise[]>([]);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latestEvaluation = useMemo(() => {
    const event = [...(gameState?.recentEvents ?? [])].reverse().find((candidate) => candidate.type === "TEXT_EVALUATED");
    return isLatinEvaluation(event?.payload?.evaluation) ? event.payload.evaluation : null;
  }, [gameState?.recentEvents]);
  const weakGrammar = (gameState?.masteryStates ?? []).filter((state) => state.targetType === "grammar" && state.mastery < 60).map((state) => state.targetId);
  const grammarIds = weakGrammar.length ? weakGrammar.slice(0, 3) : gameState?.currentScene.learningFocus?.grammarIds ?? ["greetings"];
  const vocabularyIds = gameState?.currentScene.learningFocus?.vocabularyIds ?? [];

  const requestExercises = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await generateExercises({ grammarIds, vocabularyIds, errorTags: latestEvaluation?.errorTags ?? [], count: 4, difficulty: "review" });
      setExercises(result.exercises);
      setRevealed({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Alıştırma üretilemedi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel-card latin-exercise-panel">
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Exercitia</p>
        <h3>Alıştırmalar</h3>
      </div>
      <button type="button" onClick={() => void requestExercises()} disabled={loading} className="icon-button-label">
        <Sparkle size={16} weight="bold" aria-hidden="true" /> {loading ? "Üretiliyor" : "Alıştırma üret"}
      </button>
      {error ? <p className="danger">{error}</p> : null}
      <div className="latin-exercise-list">
        {exercises.map((exercise) => (
          <article key={exercise.id} className="latin-exercise-card">
            <header><Cards size={18} weight="duotone" aria-hidden="true" /><strong>{exercise.type}</strong></header>
            <p>{exercise.promptTr}</p>
            {exercise.choices?.length ? <div className="choice-chip-row">{exercise.choices.map((choice) => <span key={choice}>{choice}</span>)}</div> : null}
            {revealed[exercise.id] ? <p className="latin-small">{exercise.expectedAnswers.join(" / ")}</p> : null}
            <button type="button" onClick={() => setRevealed((current) => ({ ...current, [exercise.id]: !current[exercise.id] }))} className="icon-button-label secondary-action">
              <Eye size={16} weight="bold" aria-hidden="true" /> {revealed[exercise.id] ? "Gizle" : "Cevap"}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
