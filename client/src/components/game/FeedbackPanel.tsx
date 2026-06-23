import { useGameStore } from "../../stores/gameStore";
import { isLatinEvaluation } from "../../types/gameTypes";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";

const evaluationModeLabels: Record<string, string> = {
  exact: "Tam eşleşme",
  similarity: "Benzerlik",
  llm: "Yapay zekâ",
  fallback: "Yerel kontrol",
};

export function FeedbackPanel({ compact = false }: { compact?: boolean }) {
  const { gameState } = useGameStore();
  const event = [...(gameState?.recentEvents ?? [])].reverse().find((candidate) => candidate.type === "TEXT_EVALUATED");
  const evaluation = isLatinEvaluation(event?.payload?.evaluation) ? event.payload.evaluation : null;
  const title = evaluation?.mode === "fallback" ? "OBSERVATIO" : evaluation?.isCorrect ? "BENE DIXISTI!" : "ITERUM TENTA";
  const BadgeIcon = evaluation?.isCorrect ? CheckCircle : WarningCircle;

  if (!evaluation) {
    if (!compact) {
      return null;
    }
    return (
      <section className="feedback-card panel-card">
        <div className="panel-heading compact-heading">
          <p className="eyebrow">Correctio</p>
          <h3>Düzeltme</h3>
        </div>
        <p className="empty-state">Cevabını gönderdiğinde düzeltme, hata etiketleri ve önerilen tekrar burada görünecek.</p>
      </section>
    );
  }

  return (
    <section className={compact ? "feedback-card feedback-summary panel-card" : "feedback-card feedback-card-premium"}>
      <div className={evaluation.isCorrect ? "feedback-badge success" : "feedback-badge danger"} aria-label={evaluation.isCorrect ? "Doğru" : "Yanlış"}>
        <BadgeIcon size={compact ? 30 : 42} weight="duotone" aria-hidden="true" />
        {!compact ? <strong>{evaluation.score}</strong> : null}
      </div>
      <div className="feedback-main">
        <p className="eyebrow">Examen</p>
        <h3>{title}</h3>
        <p>{evaluation.feedbackTr}</p>
        {evaluation.correctedLatin ? <p className="latin-small">Doğru biçim: “{evaluation.correctedLatin}”</p> : null}
        {evaluation.detectedErrors?.length ? <p className="tag-line">Muhtemel hata: {evaluation.detectedErrors.slice(0, 2).map((error) => error.messageTr).join("; ")}</p> : null}
        {!compact ? (
          <>
            <dl>
              <div><dt>Puan</dt><dd className="feedback-score">{evaluation.score}</dd></div>
              <div><dt>Değerlendirme</dt><dd>{evaluationModeLabels[evaluation.mode] || evaluation.mode}</dd></div>
              <div><dt>Güven</dt><dd>{Math.round(evaluation.confidence * 100)}%</dd></div>
            </dl>
            {evaluation.errorTags.length > 0 ? <p className="tag-line">{evaluation.errorTags.join(", ")}</p> : null}
            {evaluation.grammarNotes.length > 0 ? <ul>{evaluation.grammarNotes.map((note) => <li key={note}>{note}</li>)}</ul> : null}
            {evaluation.vocabularyNotes.length > 0 ? <ul>{evaluation.vocabularyNotes.map((note) => <li key={note}>{note}</li>)}</ul> : null}
          </>
        ) : <span className="feedback-score">{evaluation.score} puan</span>}
      </div>
    </section>
  );
}
