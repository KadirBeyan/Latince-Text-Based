export type NarrativeMomentType =
  | "scene-enter"
  | "scene-complete"
  | "dialogue-response-correct"
  | "dialogue-response-near-miss"
  | "dialogue-response-wrong"
  | "quest-start"
  | "quest-complete"
  | "chapter-start"
  | "chapter-complete"
  | "level-up"
  | "mastery-up"
  | "relationship-change"
  | "npc-memory-added"
  | "location-discovered"
  | "world-event"
  | "reward"
  | "dynamic-quest-generated";

export type NarrativeMomentTone = "gold" | "success" | "warning" | "danger" | "muted" | "roman";
export type NarrativeMomentPriority = "low" | "normal" | "high" | "critical";

export type NarrativeMoment = {
  id: string;
  type: NarrativeMomentType;
  titleTr: string;
  subtitleTr?: string;
  latinLine?: string;
  bodyTr?: string;
  icon?: string;
  tone: NarrativeMomentTone;
  priority: NarrativeMomentPriority;
  createdAt: string;
  relatedSceneId?: string;
  relatedQuestId?: string;
  relatedChapterId?: string;
  relatedNpcId?: string;
  relatedLocationId?: string;
  rewardSummary?: {
    xp?: number;
    currency?: number;
    items?: string[];
    mastery?: string[];
  };
};
