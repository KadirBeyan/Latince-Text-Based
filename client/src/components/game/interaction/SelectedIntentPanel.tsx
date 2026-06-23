import React from "react";
import type { InteractionIntent } from "../../../types/gameTypes";
import { ActionVerbBadge } from "./ActionVerbBadge";

interface SelectedIntentPanelProps {
  intent: InteractionIntent;
  onClear: () => void;
  className?: string;
}

export const SelectedIntentPanel: React.FC<SelectedIntentPanelProps> = ({ intent, onClear, className = "" }) => {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border border-blue-900/35 bg-blue-950/20 ${className}`}>
      <div className="flex items-center gap-2">
        <ActionVerbBadge verb={intent.verb} />
        <div>
          <p className="text-sm font-semibold text-gray-200">{intent.labelTr}</p>
          {intent.descriptionTr && <p className="text-xs text-gray-400">{intent.descriptionTr}</p>}
        </div>
      </div>
      <button
        onClick={onClear}
        className="px-2 py-1 text-xs text-gray-400 hover:text-rose-400 bg-gray-900/60 rounded border border-gray-800 transition-all"
      >
        Vazgeç
      </button>
    </div>
  );
};
