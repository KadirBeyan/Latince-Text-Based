import React from "react";
import type { InteractionResolution } from "../../../types/gameTypes";
import { ConsequencePanel } from "./ConsequencePanel";

interface ObservationResultCardProps {
  resolution: InteractionResolution;
  className?: string;
}

export const ObservationResultCard: React.FC<ObservationResultCardProps> = ({ resolution, className = "" }) => {
  return (
    <div className={`p-4 rounded-xl border border-teal-900/40 bg-teal-950/10 text-gray-200 space-y-3 shadow-md ${className}`}>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0" />
        <h4 className="text-sm font-semibold text-teal-300">Gözlem & Sonuç</h4>
      </div>

      {resolution.resultNarrationTr && (
        <p className="text-sm text-gray-300 pl-3 border-l-2 border-teal-800/40 leading-relaxed">
          {resolution.resultNarrationTr}
        </p>
      )}

      {resolution.revealedLatin && (
        <div className="pl-3 py-1 space-y-1">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Açığa Çıkan Yazı</p>
          <p className="text-lg font-serif italic text-teal-100 tracking-wide">“{resolution.revealedLatin}”</p>
          {resolution.revealedTextTr && (
            <p className="text-xs text-gray-400">({resolution.revealedTextTr})</p>
          )}
        </div>
      )}

      {resolution.npcReactionLatin && (
        <div className="pl-3 space-y-1 border-l-2 border-indigo-800/30">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">NPC Tepkisi</p>
          <p className="text-base font-serif italic text-gray-200">“{resolution.npcReactionLatin}”</p>
          {resolution.npcReactionTr && (
            <p className="text-xs text-gray-400">({resolution.npcReactionTr})</p>
          )}
        </div>
      )}

      {resolution.consequences && resolution.consequences.length > 0 && (
        <ConsequencePanel consequences={resolution.consequences} />
      )}
    </div>
  );
};
