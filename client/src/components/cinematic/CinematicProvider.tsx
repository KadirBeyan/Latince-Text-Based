import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useCinematicStore } from "../../stores/cinematicStore";
import { useGameStore } from "../../stores/gameStore";
import { useSettingsStore } from "../../stores/settingsStore";
import type { NarrativeMoment } from "../../types/narrativeTypes";
import { mapEventsToNarrativeMoments } from "../../utils/narrativeMomentMapper";
import { ChapterCompleteOverlay } from "./ChapterCompleteOverlay";
import { ChapterIntroOverlay } from "./ChapterIntroOverlay";
import { CinematicOverlay } from "./CinematicOverlay";
import { LevelUpOverlay } from "./LevelUpOverlay";
import { LocationDiscoveredOverlay } from "./LocationDiscoveredOverlay";
import { NarrativeToast } from "./NarrativeToast";
import { QuestCompleteOverlay } from "./QuestCompleteOverlay";
import { RelationshipMomentOverlay } from "./RelationshipMomentOverlay";

function OverlayForMoment({ moment }: { moment: NarrativeMoment }) {
  if (moment.type === "chapter-start") return <ChapterIntroOverlay moment={moment} />;
  if (moment.type === "chapter-complete") return <ChapterCompleteOverlay moment={moment} />;
  if (moment.type === "quest-complete") return <QuestCompleteOverlay moment={moment} />;
  if (moment.type === "level-up") return <LevelUpOverlay moment={moment} />;
  if (moment.type === "relationship-change") return <RelationshipMomentOverlay moment={moment} />;
  if (moment.type === "location-discovered") return <LocationDiscoveredOverlay moment={moment} />;
  return <CinematicOverlay moment={moment} />;
}

export function CinematicProvider({ children }: { children: ReactNode }) {
  const { gameState } = useGameStore();
  const { settings } = useSettingsStore();
  const { activeMoment, enqueueMoments, playNext, seenMomentIds, setMutedCinematics, setReducedMotion } = useCinematicStore();
  const [toasts, setToasts] = useState<NarrativeMoment[]>([]);
  const lastProcessedEventId = useRef<string | null>(null);

  const systemReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    setMutedCinematics(!settings.cinematicOverlays);
    setReducedMotion(settings.reducedMotionMode === "on" || (settings.reducedMotionMode === "system" && systemReducedMotion));
  }, [settings.cinematicOverlays, settings.reducedMotionMode, setMutedCinematics, setReducedMotion, systemReducedMotion]);

  useEffect(() => {
    if (!gameState?.recentEvents?.length) return;
    const events = lastProcessedEventId.current
      ? gameState.recentEvents.slice(gameState.recentEvents.findIndex((event) => event.id === lastProcessedEventId.current) + 1)
      : gameState.recentEvents.slice(-8);
    lastProcessedEventId.current = gameState.recentEvents[gameState.recentEvents.length - 1]?.id ?? null;
    if (events.length === 0) return;
    const moments = mapEventsToNarrativeMoments(events, gameState, seenMomentIds);
    enqueueMoments(moments);
    if (settings.narrativeToasts) {
      const toastMoments = moments.filter((moment) => moment.priority === "low" || moment.priority === "normal" || !settings.cinematicOverlays);
      setToasts((current) => [...toastMoments, ...current].slice(0, 4));
    }
  }, [gameState, enqueueMoments, seenMomentIds, settings.narrativeToasts, settings.cinematicOverlays]);

  useEffect(() => {
    if (!activeMoment) playNext();
  }, [activeMoment, playNext]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = window.setTimeout(() => setToasts((current) => current.slice(0, -1)), 4200);
    return () => window.clearTimeout(timer);
  }, [toasts]);

  return (
    <>
      {children}
      {activeMoment && settings.cinematicOverlays ? <OverlayForMoment moment={activeMoment} /> : null}
      {settings.narrativeToasts && toasts.length > 0 ? (
        <div className="narrative-toast-stack" aria-live="polite">
          {toasts.map((moment) => <NarrativeToast key={moment.id} moment={moment} onDismiss={(id) => setToasts((current) => current.filter((item) => item.id !== id))} />)}
        </div>
      ) : null}
    </>
  );
}
