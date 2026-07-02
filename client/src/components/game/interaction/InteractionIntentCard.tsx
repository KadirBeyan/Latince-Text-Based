import React from "react";
import type { InteractionIntent } from "../../../types/gameTypes";
import { ActionVerbBadge, getIntentRoleMeta } from "./ActionVerbBadge";

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
  const role = getIntentRoleMeta(intent.verb, intent.requiresLatin);
  const behaviorLabel = intent.requiresLatin
    ? "Cevap ister"
    : intent.nextSceneId || intent.successNextSceneId
      ? "Sahne geçişi"
      : ["approach", "persuade", "bargain", "challenge"].includes(intent.verb)
        ? "Riskli"
        : "Anında çözülür";

  return (
    <button
      onClick={() => {
        if (!isLocked) onSelect();
      }}
      disabled={isLocked}
      className={`interaction-intent-card interaction-intent-card--${role.tone} w-full p-4 rounded-xl border transition-all duration-300 text-left ${isLocked ? "is-locked cursor-not-allowed opacity-55" : "active:scale-[0.99]"} ${className}`}
    >
      <div className="interaction-intent-topline">
        <div className="interaction-intent-role-row">
          <span className={`interaction-role-badge interaction-role-badge--${role.tone}`}>{role.label}</span>
          <ActionVerbBadge verb={intent.verb} />
        </div>
        {isLocked ? (
          <span className="interaction-intent-status interaction-intent-status--locked text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border">
            Kilitli
          </span>
        ) : (
          <span className={`interaction-intent-status interaction-intent-status--${role.tone} text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded border`}>
            {behaviorLabel}
          </span>
        )}
      </div>
      <p className="interaction-intent-title text-sm font-semibold leading-snug">{intent.labelTr}</p>
      {intent.descriptionTr && (
        <p className="interaction-intent-description text-xs mt-1">{intent.descriptionTr}</p>
      )}
      {intent.previewConsequenceTr && !isLocked && (
        <p className="interaction-intent-preview text-[10px] font-medium mt-2">
          Olası Sonuç: {intent.previewConsequenceTr}
        </p>
      )}
    </button>
  );
};
