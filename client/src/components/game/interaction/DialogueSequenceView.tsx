import React from "react";
import type { DialogueSequence, DialogueSequenceTurn } from "../../../types/gameTypes";

interface DialogueSequenceViewProps {
  dialogueSequence: DialogueSequence;
  activeTurnIndex: number;
  className?: string;
}

export const DialogueSequenceView: React.FC<DialogueSequenceViewProps> = ({
  dialogueSequence,
  activeTurnIndex,
  className = ""
}) => {
  const currentTurn: DialogueSequenceTurn | undefined = dialogueSequence.turns[activeTurnIndex];

  if (!currentTurn) return null;

  // Capitalize NPC ID/Name nicely for presentation
  const speakerName = currentTurn.speakerNpcId
    ? currentTurn.speakerNpcId.charAt(0).toUpperCase() + currentTurn.speakerNpcId.slice(1)
    : "Konuşmacı";

  return (
    <div
      className={`relative p-5 rounded-2xl border border-indigo-900/40 bg-gradient-to-br from-indigo-950/20 to-slate-900/30 backdrop-blur-sm space-y-4 shadow-lg animate-fadeIn ${className}`}
    >
      {/* Decorative top-left corner indicator for narrative polish */}
      <div className="absolute top-0 left-4 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-indigo-700/40 bg-indigo-950 text-[10px] font-bold tracking-widest text-indigo-300 uppercase shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
        Diyalog Adımı {activeTurnIndex + 1} / {dialogueSequence.turns.length}
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase">
            {speakerName}
          </span>
        </div>

        {currentTurn.npcLineLatin && (
          <div className="space-y-1.5 pl-3 border-l-2 border-indigo-500/40">
            <p className="text-lg font-serif italic text-indigo-100 leading-relaxed tracking-wide">
              “{currentTurn.npcLineLatin}”
            </p>
            {currentTurn.npcLineTr && (
              <p className="text-xs text-indigo-300/70 font-medium">
                ({currentTurn.npcLineTr})
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
