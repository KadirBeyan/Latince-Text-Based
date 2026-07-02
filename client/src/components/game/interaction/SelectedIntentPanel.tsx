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
    <div className={`selected-intent-panel flex items-center justify-between p-3 rounded-lg border ${className}`}>
      <div className="flex items-center gap-2">
        <ActionVerbBadge verb={intent.verb} />
        <div>
          <p className="selected-intent-title text-sm font-semibold">{intent.labelTr}</p>
          {intent.descriptionTr && <p className="selected-intent-description text-xs">{intent.descriptionTr}</p>}
        </div>
      </div>
      <button
        onClick={onClear}
        className="selected-intent-clear px-2 py-1 text-xs rounded border transition-all"
      >
        Vazgeç
      </button>
    </div>
  );
};
