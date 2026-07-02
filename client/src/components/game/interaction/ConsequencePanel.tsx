import React from "react";
import type { ConsequencePresentation } from "../../../types/gameTypes";

interface ConsequencePanelProps {
  consequences: ConsequencePresentation[];
  className?: string;
}

const toneClasses: Record<ConsequencePresentation["tone"], { item: string; value: string; dot: string }> = {
  success: {
    item: "consequence-item--success",
    value: "consequence-value--success",
    dot: "consequence-dot--success"
  },
  warning: {
    item: "consequence-item--warning",
    value: "consequence-value--warning",
    dot: "consequence-dot--warning"
  },
  danger: {
    item: "consequence-item--danger",
    value: "consequence-value--danger",
    dot: "consequence-dot--danger"
  },
  gold: {
    item: "consequence-item--gold",
    value: "consequence-value--gold",
    dot: "consequence-dot--gold"
  },
  muted: {
    item: "consequence-item--muted",
    value: "consequence-value--muted",
    dot: "consequence-dot--muted"
  }
};

export const ConsequencePanel: React.FC<ConsequencePanelProps> = ({ consequences, className = "" }) => {
  if (!consequences || consequences.length === 0) return null;

  return (
    <div className={`space-y-2 mt-3 ${className}`}>
      <h4 className="consequence-heading text-xs uppercase tracking-wider font-semibold mb-2">Sonuçlar</h4>
      <div className="grid grid-cols-1 gap-2">
        {consequences.filter(c => !c.hidden).map((cons) => {
          const config = toneClasses[cons.tone] || toneClasses.muted;
          return (
            <div
              key={cons.id}
              className={`consequence-item flex items-start gap-3 p-2.5 rounded-lg border ${config.item} transition-all duration-300 hover:scale-[1.01]`}
            >
              <span className={`consequence-dot w-2 h-2 rounded-full mt-1.5 shrink-0 ${config.dot}`} />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                  <p className="consequence-title text-sm font-semibold">{cons.titleTr}</p>
                  {cons.valueTr && (
                    <span className={`text-xs font-mono font-bold shrink-0 ${config.value}`}>
                      {cons.valueTr}
                    </span>
                  )}
                </div>
                {cons.bodyTr && <p className="consequence-copy text-xs mt-0.5">{cons.bodyTr}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
