import React from "react";
import type { InteractionResolution } from "../../../types/gameTypes";
import { ConsequencePanel } from "./ConsequencePanel";

interface ObservationResultCardProps {
  resolution: InteractionResolution;
  className?: string;
}

export const ObservationResultCard: React.FC<ObservationResultCardProps> = ({ resolution, className = "" }) => {
  return (
    <div className={`observation-result-card p-4 rounded-xl space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="observation-result-dot w-2.5 h-2.5 rounded-full shrink-0" />
        <h4 className="observation-result-title text-sm font-semibold">Gözlem & Sonuç</h4>
      </div>

      {resolution.resultNarrationTr && (
        <p className="observation-result-copy text-sm pl-3 leading-relaxed">
          {resolution.resultNarrationTr}
        </p>
      )}

      {resolution.revealedLatin && (
        <div className="pl-3 py-1 space-y-1">
          <p className="observation-result-label text-xs font-semibold uppercase tracking-wider">Açığa Çıkan Yazı</p>
          <p className="observation-result-latin text-lg font-serif italic tracking-wide">“{resolution.revealedLatin}”</p>
          {resolution.revealedTextTr && (
            <p className="observation-result-muted text-xs">({resolution.revealedTextTr})</p>
          )}
        </div>
      )}

      {resolution.npcReactionLatin && (
        <div className="observation-result-reaction pl-3 space-y-1">
          <p className="observation-result-label text-xs font-semibold uppercase tracking-wider">NPC Tepkisi</p>
          <p className="observation-result-latin text-base font-serif italic">“{resolution.npcReactionLatin}”</p>
          {resolution.npcReactionTr && (
            <p className="observation-result-muted text-xs">({resolution.npcReactionTr})</p>
          )}
        </div>
      )}

      {resolution.consequences && resolution.consequences.length > 0 && (
        <ConsequencePanel consequences={resolution.consequences} />
      )}
    </div>
  );
};
