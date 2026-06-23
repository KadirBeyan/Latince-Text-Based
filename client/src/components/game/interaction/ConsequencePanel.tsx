import React from "react";
import type { ConsequencePresentation } from "../../../types/gameTypes";

interface ConsequencePanelProps {
  consequences: ConsequencePresentation[];
  className?: string;
}

const toneClasses: Record<ConsequencePresentation["tone"], { bg: string; border: string; text: string; dot: string }> = {
  success: {
    bg: "bg-emerald-950/20",
    border: "border-emerald-800/40",
    text: "text-emerald-300",
    dot: "bg-emerald-500"
  },
  warning: {
    bg: "bg-amber-950/20",
    border: "border-amber-800/40",
    text: "text-amber-300",
    dot: "bg-amber-500"
  },
  danger: {
    bg: "bg-rose-950/20",
    border: "border-rose-800/40",
    text: "text-rose-300",
    dot: "bg-rose-500"
  },
  gold: {
    bg: "bg-yellow-950/20",
    border: "border-yellow-800/40",
    text: "text-yellow-300",
    dot: "bg-yellow-500"
  },
  muted: {
    bg: "bg-gray-900/40",
    border: "border-gray-800/45",
    text: "text-gray-400",
    dot: "bg-gray-500"
  }
};

export const ConsequencePanel: React.FC<ConsequencePanelProps> = ({ consequences, className = "" }) => {
  if (!consequences || consequences.length === 0) return null;

  return (
    <div className={`space-y-2 mt-3 ${className}`}>
      <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2">Sonuçlar</h4>
      <div className="grid grid-cols-1 gap-2">
        {consequences.filter(c => !c.hidden).map((cons) => {
          const config = toneClasses[cons.tone] || toneClasses.muted;
          return (
            <div
              key={cons.id}
              className={`flex items-start gap-3 p-2.5 rounded-lg border ${config.bg} ${config.border} transition-all duration-300 hover:scale-[1.01]`}
            >
              <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${config.dot}`} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <p className="text-sm font-semibold text-gray-200">{cons.titleTr}</p>
                  {cons.valueTr && (
                    <span className={`text-xs font-mono font-bold shrink-0 ${config.text}`}>
                      {cons.valueTr}
                    </span>
                  )}
                </div>
                {cons.bodyTr && <p className="text-xs text-gray-400 mt-0.5">{cons.bodyTr}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
