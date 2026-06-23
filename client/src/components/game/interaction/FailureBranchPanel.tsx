import React from "react";
import type { FailureBranch, InteractionIntent } from "../../../types/gameTypes";
import { ActionVerbBadge } from "./ActionVerbBadge";

interface FailureBranchPanelProps {
  branch: FailureBranch;
  onSelectIntent?: (intentId: string) => void;
  onRetry?: () => void;
  className?: string;
}

export const FailureBranchPanel: React.FC<FailureBranchPanelProps> = ({
  branch,
  onSelectIntent,
  onRetry,
  className = ""
}) => {
  return (
    <div className={`p-4 rounded-xl border border-rose-900/50 bg-rose-950/15 text-gray-200 space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
        <h4 className="text-sm font-semibold text-rose-300">Magister Tepki Verdi</h4>
      </div>

      {branch.npcReactionLatin && (
        <div className="space-y-1 pl-3 border-l-2 border-rose-800/40">
          <p className="text-base font-serif italic text-rose-200">“{branch.npcReactionLatin}”</p>
          {branch.npcReactionTr && (
            <p className="text-xs text-rose-300/80">({branch.npcReactionTr})</p>
          )}
        </div>
      )}

      {branch.narrationTr && (
        <p className="text-xs text-gray-400 font-medium pl-3">{branch.narrationTr}</p>
      )}

      {/* Temporary next action options or retry buttons */}
      <div className="flex flex-col gap-2 mt-2">
        {branch.options && branch.options.length > 0 ? (
          <>
            <p className="text-xs text-rose-300 font-semibold mb-1">Ne yapmak istersin?</p>
            {branch.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSelectIntent?.(opt.id)}
                className="flex items-center justify-between p-2.5 rounded-lg border border-rose-800/40 bg-rose-950/20 text-sm font-medium text-rose-200 hover:bg-rose-900/35 transition-all text-left"
              >
                <div className="flex items-center gap-2">
                  <ActionVerbBadge verb={opt.verb} />
                  <span>{opt.labelTr}</span>
                </div>
                {opt.requiresLatin && (
                  <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded">
                    Latince
                  </span>
                )}
              </button>
            ))}
          </>
        ) : (
          branch.retryAllowed !== false && (
            <button
              onClick={onRetry}
              className="mt-2 px-4 py-2 bg-rose-900/40 border border-rose-700/50 hover:bg-rose-800/50 text-rose-100 text-sm font-semibold rounded-lg transition-all"
            >
              Tekrar Dene
            </button>
          )
        )}
      </div>
    </div>
  );
};
