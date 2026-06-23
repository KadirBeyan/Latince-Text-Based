import { useMemo, useState } from "react";
import type { GameEvent } from "../../../types/gameTypes";
import { useGameStore } from "../../../stores/gameStore";
import { SemanticFeedbackCard } from "./SemanticFeedbackCard";

function wasDismissed(eventId: string): boolean {
  try {
    return window.sessionStorage.getItem(`via-prima:dialogue-feedback:${eventId}`) === "dismissed";
  } catch {
    return false;
  }
}

function rememberDismissed(eventId: string): void {
  try {
    window.sessionStorage.setItem(`via-prima:dialogue-feedback:${eventId}`, "dismissed");
  } catch {
    // Ephemeral feedback still works without browser storage.
  }
}

export function DialogueTransitionFeedback() {
  const { gameState } = useGameStore();
  const event = useMemo<GameEvent | undefined>(() => [...(gameState?.recentEvents ?? [])]
    .reverse()
    .find((candidate) => candidate.type === "DIALOGUE_RESPONSE_EVALUATED" && candidate.payload?.sceneId !== gameState?.currentScene.id), [gameState]);
  const [dismissedEventId, setDismissedEventId] = useState<string | null>(null);

  if (!event || dismissedEventId === event.id || wasDismissed(event.id)) return null;

  const dismiss = () => {
    rememberDismissed(event.id);
    setDismissedEventId(event.id);
  };

  return (
    <section className="dialogue-transition-feedback" aria-label="Diyalog sonucu">
      <SemanticFeedbackCard
        evaluation={event.payload as any}
        onContinue={dismiss}
        retryAllowed={false}
      />
    </section>
  );
}
