import React from "react";
import type { InteractionVerb } from "../../../types/gameTypes";

interface ActionVerbBadgeProps {
  verb: InteractionVerb;
  className?: string;
}

export type IntentRole = "explore" | "latin" | "skill" | "advance";
export type IntentRoleMeta = {
  label: string;
  tone: "gold" | "green" | "red" | "bronze" | "muted";
};

const verbConfig: Record<InteractionVerb, { label: string; tone: "gold" | "green" | "red" | "bronze" | "muted" }> = {
  speak: { label: "Konuş", tone: "gold" },
  ask: { label: "Sor", tone: "gold" },
  inspect: { label: "İncele", tone: "green" },
  listen: { label: "Dinle", tone: "green" },
  wait: { label: "Bekle", tone: "muted" },
  approach: { label: "Yaklaş", tone: "bronze" },
  leave: { label: "Ayrıl", tone: "red" },
  persuade: { label: "İkna Et", tone: "gold" },
  bargain: { label: "Pazarlık Yap", tone: "gold" },
  remember: { label: "Hatırla", tone: "bronze" },
  read: { label: "Oku", tone: "bronze" },
  offer: { label: "Sun", tone: "gold" },
  take: { label: "Al", tone: "green" },
  give: { label: "Ver", tone: "green" },
  follow: { label: "Takip Et", tone: "bronze" },
  challenge: { label: "Meydan Oku", tone: "red" },
  apologize: { label: "Özür Dile", tone: "muted" },
  thank: { label: "Teşekkür Et", tone: "green" },
  custom: { label: "Eylem", tone: "bronze" }
};

const roleConfig: Record<IntentRole, IntentRoleMeta> = {
  explore: { label: "Keşif", tone: "green" },
  latin: { label: "Latince", tone: "red" },
  skill: { label: "Beceri", tone: "gold" },
  advance: { label: "İlerle", tone: "bronze" }
};

export function getIntentRole(verb: InteractionVerb, requiresLatin: boolean): IntentRole {
  if (requiresLatin) return "latin";
  if (["inspect", "listen", "read", "remember"].includes(verb)) return "explore";
  if (["approach", "persuade", "bargain", "challenge", "offer", "take", "give"].includes(verb)) return "skill";
  return "advance";
}

export function getIntentRoleMeta(verb: InteractionVerb, requiresLatin: boolean): IntentRoleMeta {
  return roleConfig[getIntentRole(verb, requiresLatin)];
}

export function getVerbLabel(verb: InteractionVerb): string {
  return (verbConfig[verb] || verbConfig.custom).label;
}

export const ActionVerbBadge: React.FC<ActionVerbBadgeProps> = ({ verb, className = "" }) => {
  const config = verbConfig[verb] || verbConfig.custom;
  return (
    <span
      className={`action-verb-badge action-verb-badge--${config.tone} inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${className}`}
    >
      {config.label}
    </span>
  );
};
