import { createContext, createElement, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { NarrativeMoment } from "../types/narrativeTypes";
import { narrativePriorityRank } from "../utils/narrativeMomentMapper";

const SEEN_KEY = "via-prima:seen-cinematic-moment-ids";
const HISTORY_LIMIT = 50;
const OVERLAY_QUEUE_LIMIT = 5;

type CinematicContextValue = {
  queue: NarrativeMoment[];
  activeMoment?: NarrativeMoment;
  history: NarrativeMoment[];
  isPlaying: boolean;
  reducedMotion: boolean;
  mutedCinematics: boolean;
  seenMomentIds: string[];
  enqueueMoment: (moment: NarrativeMoment) => void;
  enqueueMoments: (moments: NarrativeMoment[]) => void;
  playNext: () => void;
  dismissActive: () => void;
  clearQueue: () => void;
  markSeen: (momentId: string) => void;
  setMutedCinematics: (value: boolean) => void;
  setReducedMotion: (value: boolean) => void;
};

const CinematicContext = createContext<CinematicContextValue | null>(null);

function readSeen(): string[] {
  try {
    const raw = window.localStorage.getItem(SEEN_KEY);
    return raw ? JSON.parse(raw) as string[] : [];
  } catch {
    return [];
  }
}

function writeSeen(ids: string[]): void {
  try {
    window.localStorage.setItem(SEEN_KEY, JSON.stringify(ids.slice(-500)));
  } catch {
    // Cinematic dedupe is an enhancement; gameplay does not depend on storage.
  }
}

function shouldOverlay(moment: NarrativeMoment): boolean {
  return moment.priority === "high" || moment.priority === "critical";
}

function sortQueue(queue: NarrativeMoment[]): NarrativeMoment[] {
  return [...queue].sort((a, b) => narrativePriorityRank(b.priority) - narrativePriorityRank(a.priority));
}

export function CinematicStoreProvider({ children }: { children: ReactNode }) {
  const [queue, setQueue] = useState<NarrativeMoment[]>([]);
  const [activeMoment, setActiveMoment] = useState<NarrativeMoment | undefined>();
  const [history, setHistory] = useState<NarrativeMoment[]>([]);
  const [seenMomentIds, setSeenMomentIds] = useState<string[]>(() => readSeen());
  const [mutedCinematics, setMutedCinematics] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const markSeen = useCallback((momentId: string) => {
    setSeenMomentIds((current) => {
      if (current.includes(momentId)) return current;
      const next = [...current, momentId];
      writeSeen(next);
      return next;
    });
  }, []);

  const enqueueMoment = useCallback((moment: NarrativeMoment) => {
    setSeenMomentIds((currentSeen) => {
      if (currentSeen.includes(moment.id)) return currentSeen;
      const nextSeen = [...currentSeen, moment.id];
      writeSeen(nextSeen);
      setHistory((current) => [moment, ...current.filter((item) => item.id !== moment.id)].slice(0, HISTORY_LIMIT));
      if (!mutedCinematics && shouldOverlay(moment)) {
        setQueue((current) => sortQueue([...current.filter((item) => item.id !== moment.id), moment]).slice(0, OVERLAY_QUEUE_LIMIT));
      }
      return nextSeen;
    });
  }, [mutedCinematics]);

  const enqueueMoments = useCallback((moments: NarrativeMoment[]) => {
    moments.forEach(enqueueMoment);
  }, [enqueueMoment]);

  const playNext = useCallback(() => {
    setQueue((current) => {
      if (activeMoment || current.length === 0) return current;
      const [next, ...rest] = sortQueue(current);
      setActiveMoment(next);
      return rest;
    });
  }, [activeMoment]);

  const dismissActive = useCallback(() => {
    setActiveMoment(undefined);
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
    setActiveMoment(undefined);
  }, []);

  const value = useMemo(() => ({
    queue,
    activeMoment,
    history,
    isPlaying: Boolean(activeMoment),
    reducedMotion,
    mutedCinematics,
    seenMomentIds,
    enqueueMoment,
    enqueueMoments,
    playNext,
    dismissActive,
    clearQueue,
    markSeen,
    setMutedCinematics,
    setReducedMotion,
  }), [queue, activeMoment, history, reducedMotion, mutedCinematics, seenMomentIds, enqueueMoment, enqueueMoments, playNext, dismissActive, clearQueue, markSeen]);

  return createElement(CinematicContext.Provider, { value }, children);
}

export function useCinematicStore(): CinematicContextValue {
  const context = useContext(CinematicContext);
  if (!context) {
    throw new Error("useCinematicStore must be used inside CinematicStoreProvider.");
  }
  return context;
}
