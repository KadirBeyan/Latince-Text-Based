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
    <div className={`p-5 rounded-xl border border-blue-900/40 bg-blue-950/10 space-y-4 shadow-md ${className}`}>
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400 bg-blue-950/50 px-2 py-0.5 rounded">
          Latince Konuş
        </span>
        <h4 className="text-sm font-semibold text-gray-200 mt-2">
          Niyetin: <span className="text-blue-300">{intent.playerIntentTr || intent.labelTr}</span>
        </h4>
        {intent.descriptionTr && (
          <p className="text-xs text-gray-400 leading-relaxed">{intent.descriptionTr}</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="latin-input" className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            Bunu Latince söyle:
          </label>
          <div className="relative">
            <textarea
              id="latin-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Cümleni buraya yaz..."
              rows={2}
              className="w-full p-3 rounded-lg border border-blue-800/40 bg-gray-950/60 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none font-serif placeholder-gray-600 transition-all duration-300"
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
              className="px-3.5 py-2 border border-blue-800/40 bg-blue-950/20 hover:bg-blue-900/30 text-blue-300 text-xs font-semibold rounded-lg transition-all"
            >
              İpucu İste
            </button>
          )}
          <button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="px-5 py-2 bg-blue-700 hover:bg-blue-600 disabled:bg-gray-800 disabled:text-gray-500 text-white text-sm font-semibold rounded-lg shadow transition-all duration-300"
          >
            {isLoading ? "Değerlendiriliyor..." : "Söyle"}
          </button>
        </div>
      </form>

      {showHintText && (intent.grammarFocusIds || intent.vocabularyFocusIds) && (
        <div className="p-3 rounded-lg border border-blue-900/30 bg-blue-950/15 text-xs text-blue-300 space-y-1">
          <p className="font-semibold text-blue-200">Gramer & Kelime İpucu:</p>
          <p>
            Hedef Yapılar: {[...(intent.grammarFocusIds || []), ...(intent.vocabularyFocusIds || [])].join(", ")}
          </p>
          {intent.targetMeaningTr && (
            <p className="text-[10px] text-gray-500">Hedeflenen Anlam: {intent.targetMeaningTr}</p>
          )}
        </div>
      )}
    </div>
  );
};
