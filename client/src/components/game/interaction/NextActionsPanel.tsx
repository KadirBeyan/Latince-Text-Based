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
      className={`p-4 rounded-xl border border-teal-900/35 bg-teal-950/5 space-y-3.5 shadow-sm animate-fadeIn ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-xs font-bold tracking-wider text-teal-400 uppercase">
            Eylem Başarıyla Tamamlandı
          </span>
        </div>
      </div>

      {hasConsequences && (
        <div className="border-t border-teal-900/20 pt-2">
          <ConsequencePanel consequences={consequences} />
        </div>
      )}

      {onContinue && (
        <div className="flex justify-end pt-1">
          <button
            onClick={onContinue}
            className="px-5 py-2 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:shadow-teal-900/30 transition-all duration-300 active:scale-[0.98]"
          >
            Devam Et
          </button>
        </div>
      )}
    </div>
  );
};
