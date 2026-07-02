import React from "react";
import type { ConsequencePresentation } from "../../../types/gameTypes";
import { ConsequencePanel } from "./ConsequencePanel";

interface NextActionsPanelProps {
  consequences?: ConsequencePresentation[];
  onContinue?: () => void;
  className?: string;
}

export const NextActionsPanel: React.FC<NextActionsPanelProps> = ({
  consequences = [],
  onContinue,
  className = ""
}) => {
  const hasConsequences = consequences && consequences.filter(c => !c.hidden).length > 0;

  if (!hasConsequences && !onContinue) return null;

  return (
    <div
      className={`next-actions-panel p-4 rounded-xl space-y-3.5 animate-fadeIn ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="next-actions-dot w-2 h-2 rounded-full animate-pulse" />
          <span className="next-actions-label text-xs font-bold tracking-wider uppercase">
            Eylem Başarıyla Tamamlandı
          </span>
        </div>
      </div>

      {hasConsequences && (
        <div className="next-actions-divider pt-2">
          <ConsequencePanel consequences={consequences} />
        </div>
      )}

      {onContinue && (
        <div className="flex justify-end pt-1">
          <button
            onClick={onContinue}
            className="next-actions-button px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-300 active:scale-[0.98]"
          >
            Devam Et
          </button>
        </div>
      )}
    </div>
  );
};
