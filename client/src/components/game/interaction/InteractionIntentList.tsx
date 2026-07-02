import React from "react";
import type { InteractionIntent } from "../../../types/gameTypes";
import { InteractionIntentCard } from "./InteractionIntentCard";

interface InteractionIntentListProps {
  intents: InteractionIntent[];
  actionLoading: boolean;
  onSelectIntent: (intentId: string) => void;
  className?: string;
}

export const InteractionIntentList: React.FC<InteractionIntentListProps> = ({
  intents,
  actionLoading,
  onSelectIntent,
  className = ""
}) => {
  if (!intents || intents.length === 0) {
    return (
      <div className="interaction-empty-state text-center p-6 border rounded-xl text-sm italic">
        Şu anda yapılabilecek bir eylem bulunmuyor.
      </div>
    );
  }

  return (
    <div className={`space-y-2.5 ${className}`}>
      <h4 className="interaction-list-heading text-xs uppercase tracking-wider font-semibold mb-2">
        Ne yapmak istiyorsun?
      </h4>
      <div className="grid grid-cols-1 gap-2">
        {intents.map((intent, index) => {
          // If the intent has conditions that are not met, the backend would handle it or we assume it's valid
          // In this view, we disable intents when actionLoading is active.
          return (
            <InteractionIntentCard
              key={intent.id || index}
              intent={intent}
              isLocked={actionLoading}
              onSelect={() => onSelectIntent(intent.id)}
              className="animate-fadeIn"
            />
          );
        })}
      </div>
    </div>
  );
};
