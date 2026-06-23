import React from "react";

export function DialogueIntentCard({
  intentTr,
  targetMeaningTr,
  grammarFocusIds = [],
  vocabularyFocusIds = []
}: {
  intentTr: string;
  targetMeaningTr: string;
  grammarFocusIds?: string[];
  vocabularyFocusIds?: string[];
}) {
  return (
    <div className="dialogue-intent-card panel-card">
      <div className="intent-eyebrow">NİYET</div>
      <p className="intent-prompt">{intentTr}</p>
      <p className="intent-target-meaning">Söylemek istediğin şey: <strong>{targetMeaningTr}</strong></p>
      
      {((grammarFocusIds && grammarFocusIds.length > 0) || (vocabularyFocusIds && vocabularyFocusIds.length > 0)) && (
        <div className="intent-focus-badges">
          {(grammarFocusIds || []).map(g => (
            <span key={g} className="focus-badge grammar-badge">Opus: {g}</span>
          ))}
          {(vocabularyFocusIds || []).map(v => (
            <span key={v} className="focus-badge vocabulary-badge">Verbum: {v}</span>
          ))}
        </div>
      )}
    </div>
  );
}
