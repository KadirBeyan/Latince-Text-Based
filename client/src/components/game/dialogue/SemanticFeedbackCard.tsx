import React from "react";
import { CheckCircle, Info, WarningCircle, XCircle } from "@phosphor-icons/react";

export type DialogueEvaluationResult = {
  verdict: string;
  acceptedAsCorrect: boolean;
  confidence: number;
  detectedMeaningTr?: string;
  targetMeaningTr: string;
  errors: Array<{ code: string; messageTr: string; severity: string }>;
  feedbackTr: string;
  grammarNoteTr?: string;
  vocabularyNoteTr?: string;
  contextNoteTr?: string;
  matchedCanonicalAnswer?: string;
  matchedVariant?: string;
  suggestedBetterAnswers?: string[];
  npcReactionTr?: string;
  npcReactionLatin?: string;
};

const verdictCopy: Record<string, { title: string; message: string; tone: "success" | "warning" | "error" | "gold"; icon: typeof CheckCircle }> = {
  exact_correct: { title: "Recte!", message: "Cevabın doğru.", tone: "success", icon: CheckCircle },
  equivalent_correct: { title: "Recte!", message: "Aynı anlamı farklı ve doğru bir yapıyla verdin.", tone: "gold", icon: CheckCircle },
  acceptable_variant: { title: "Bene.", message: "Cevabın sahne bağlamında kabul edilebilir.", tone: "success", icon: CheckCircle },
  near_miss: { title: "Paene recte.", message: "Anlam yaklaşıyor ama şu noktayı düzeltmelisin.", tone: "warning", icon: WarningCircle },
  context_wrong: { title: "Non hoc loco.", message: "Cümle Latince olabilir ama bu bağlamda doğru değil.", tone: "warning", icon: Info },
  grammar_wrong: { title: "Forma corrigenda.", message: "Biçimi düzeltmen gerekiyor.", tone: "error", icon: WarningCircle },
  meaning_wrong: { title: "Non ita.", message: "Bu cevap istenen anlamı vermiyor.", tone: "error", icon: XCircle },
  wrong: { title: "Non ita.", message: "Bu cevap sahnede kabul edilmedi.", tone: "error", icon: XCircle },
};

export function SemanticFeedbackCard({
  evaluation,
  onContinue,
  onRetry,
  retryAllowed
}: {
  evaluation: DialogueEvaluationResult;
  onContinue?: () => void;
  onRetry?: () => void;
  retryAllowed?: boolean;
}) {
  const copy = verdictCopy[evaluation.verdict] ?? (evaluation.acceptedAsCorrect ? verdictCopy.exact_correct : verdictCopy.wrong);
  const isCorrect = evaluation.acceptedAsCorrect;
  const isNearMiss = evaluation.verdict === "near_miss";
  const Icon = copy.icon;
  const cardClass = `semantic-feedback-card panel-card feedback-${copy.tone}`;
  const statusClass = `feedback-status ${copy.tone === "gold" ? "success" : copy.tone}`;

  return (
    <div className={cardClass}>
      <div className={statusClass}>
        <Icon size={32} weight="duotone" />
        <div>
          <h3>{copy.title}</h3>
          <span className="verdict-tag">{evaluation.verdict.replace("_", " ").toUpperCase()}</span>
          {import.meta.env.DEV ? <span className="verdict-confidence">{Math.round(evaluation.confidence * 100)}% confidence</span> : null}
        </div>
      </div>

      <div className="feedback-content">
        <p className="feedback-message">{evaluation.feedbackTr || copy.message}</p>
        <p className="feedback-message muted-feedback-copy">{copy.message}</p>
        {(evaluation.npcReactionLatin || evaluation.npcReactionTr) && (
          <div className="npc-reaction-link">
            {evaluation.npcReactionLatin ? <strong>“{evaluation.npcReactionLatin}”</strong> : null}
            {evaluation.npcReactionTr ? <span>{evaluation.npcReactionTr}</span> : null}
          </div>
        )}
        
        {evaluation.detectedMeaningTr && (
          <p className="detected-meaning">Yazdığınız anlam: <em>“{evaluation.detectedMeaningTr}”</em></p>
        )}

        {(evaluation.matchedCanonicalAnswer || evaluation.matchedVariant) && isCorrect && (
          <p className="canonical-suggestion">Eşleşen cevap: <strong>{evaluation.matchedVariant ?? evaluation.matchedCanonicalAnswer}</strong></p>
        )}

        {evaluation.errors && evaluation.errors.length > 0 && (
          <div className="feedback-errors">
            <strong>Hatalar:</strong>
            <ul>
              {evaluation.errors.map((err, idx) => (
                <li key={idx} className={`error-item ${err.severity}`}>
                  [{err.code}] {err.messageTr}
                </li>
              ))}
            </ul>
          </div>
        )}

        {(evaluation.grammarNoteTr || evaluation.vocabularyNoteTr || evaluation.contextNoteTr) && (
          <div className="pedagogical-notes">
            {evaluation.grammarNoteTr && <p className="note-grammar"><strong>Dilbilgisi:</strong> {evaluation.grammarNoteTr}</p>}
            {evaluation.vocabularyNoteTr && <p className="note-vocab"><strong>Kelime Bilgisi:</strong> {evaluation.vocabularyNoteTr}</p>}
            {evaluation.contextNoteTr && <p className="note-context"><strong>Bağlam:</strong> {evaluation.contextNoteTr}</p>}
          </div>
        )}
        {evaluation.suggestedBetterAnswers && evaluation.suggestedBetterAnswers.length > 0 ? (
          <details className="better-answers">
            <summary>Daha iyi cevaplar</summary>
            <ul>{evaluation.suggestedBetterAnswers.map((answer) => <li key={answer}>{answer}</li>)}</ul>
          </details>
        ) : null}
      </div>

      <div className="feedback-actions">
        {isCorrect ? (
          <button type="button" className="composer-button send-btn" onClick={onContinue}>Devam Et</button>
        ) : (
          <>
            {retryAllowed ? (
              <button type="button" className="composer-button hint-btn retry-emphasis" onClick={onRetry}>Iterum Tenta</button>
            ) : (
              <button type="button" className="composer-button send-btn" onClick={onContinue}>Devam Et</button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
