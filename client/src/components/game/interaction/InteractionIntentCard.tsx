import React from "react";
import type { InteractionIntent } from "../../../types/gameTypes";
import { ActionVerbBadge } from "./ActionVerbBadge";

interface InteractionIntentCardProps {
  intent: InteractionIntent;
  isLocked: boolean;
  onSelect: () => void;
  className?: string;
}

export const InteractionIntentCard: React.FC<InteractionIntentCardProps> = ({
  intent,
  isLocked,
  onSelect,
  className = ""
}) => {
  return (
    <button
      onClick={() => {
        if (!isLocked) onSelect();
      }}
      disabled={isLocked}
      className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 text-left ${
        isLocked
          ? "border-gray-800/40 bg-gray-950/20 text-gray-500 cursor-not-allowed opacity-55"
          : "border-gray-800 bg-gray-900/60 hover:bg-gray-800/40 hover:border-gray-700/80 active:scale-[0.99] text-gray-200"
      } ${className}`}
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <ActionVerbBadge verb={intent.verb} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold leading-snug">{intent.labelTr}</p>
          {intent.descriptionTr && (
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{intent.descriptionTr}</p>
          )}
          {intent.previewConsequenceTr && !isLocked && (
            <p className="text-[10px] text-teal-400 font-medium mt-1">
              Olası Sonuç: {intent.previewConsequenceTr}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-3">
        {isLocked ? (
          <span className="text-[10px] uppercase font-bold tracking-wider text-rose-500 bg-rose-950/20 border border-rose-900/30 px-1.5 py-0.5 rounded">
            Kilitli
          </span>
        ) : (
          <span
            className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border ${
              intent.requiresLatin
                ? "text-blue-300 bg-blue-950/30 border-blue-900/30"
                : "text-teal-300 bg-teal-950/30 border-teal-900/30"
            }`}
          >
            {intent.requiresLatin ? "Latince Söyle" : "Eylem"}
          </span>
        )}
      </div>
    </button>
  );
};
