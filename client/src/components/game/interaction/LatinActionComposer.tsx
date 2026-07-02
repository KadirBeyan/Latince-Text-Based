import React, { useState } from "react";
import type { InteractionIntent } from "../../../types/gameTypes";

interface LatinActionComposerProps {
  intent: InteractionIntent;
  onSubmitText: (text: string) => void;
  onShowHint?: () => void;
  isLoading?: boolean;
  className?: string;
}

export const LatinActionComposer: React.FC<LatinActionComposerProps> = ({
  intent,
  onSubmitText,
  onShowHint,
  isLoading = false,
  className = ""
}) => {
  const [text, setText] = useState("");
  const [showHintText, setShowHintText] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSubmitText(text.trim());
    setText("");
  };

  return (
    <div className={`latin-action-composer p-5 rounded-xl border space-y-4 ${className}`}>
      <div className="space-y-1">
        <span className="latin-composer-kicker text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded">
          Latince Konuş
        </span>
        <h4 className="latin-composer-title text-sm font-semibold mt-2">
          Niyetin: <span>{intent.playerIntentTr || intent.labelTr}</span>
        </h4>
        {intent.descriptionTr && (
          <p className="latin-composer-description text-xs leading-relaxed">{intent.descriptionTr}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="latin-input" className="latin-composer-label text-xs font-semibold uppercase tracking-wider">
            Bunu Latince söyle:
          </label>
          <div className="relative">
            <textarea
              id="latin-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Cümleni buraya yaz..."
              rows={2}
              className="latin-composer-textarea w-full p-3 rounded-lg border text-sm focus:outline-none resize-none font-serif transition-all duration-300"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex gap-2.5 justify-end">
          {onShowHint && (
            <button
              type="button"
              onClick={() => {
                setShowHintText(!showHintText);
                onShowHint();
              }}
              className="latin-composer-secondary px-3.5 py-2 border text-xs font-semibold rounded-lg transition-all"
            >
              İpucu İste
            </button>
          )}
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="latin-composer-submit px-5 py-2 text-sm font-semibold rounded-lg shadow transition-all duration-300"
          >
            {isLoading ? "Değerlendiriliyor..." : "Söyle"}
          </button>
        </div>
      </form>

      {showHintText && (intent.grammarFocusIds || intent.vocabularyFocusIds) && (
        <div className="latin-composer-hint p-3 rounded-lg border text-xs space-y-1">
          <p className="font-semibold">Gramer & Kelime İpucu:</p>
          <p>
            Hedef Yapılar: {[...(intent.grammarFocusIds || []), ...(intent.vocabularyFocusIds || [])].join(", ")}
          </p>
          {intent.targetMeaningTr && (
            <p className="latin-composer-hint-muted text-[10px]">Hedeflenen Anlam: {intent.targetMeaningTr}</p>
          )}
        </div>
      )}
    </div>
  );
};
