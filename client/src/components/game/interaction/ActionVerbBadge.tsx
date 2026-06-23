import React from "react";
import type { InteractionVerb } from "../../../types/gameTypes";

interface ActionVerbBadgeProps {
  verb: InteractionVerb;
  className?: string;
}

const verbConfig: Record<InteractionVerb, { label: string; bgColor: string; textColor: string }> = {
  speak: { label: "Konuş", bgColor: "bg-blue-900/40 border-blue-700/50", textColor: "text-blue-200" },
  ask: { label: "Sor", bgColor: "bg-indigo-900/40 border-indigo-700/50", textColor: "text-indigo-200" },
  inspect: { label: "İncele", bgColor: "bg-emerald-900/40 border-emerald-700/50", textColor: "text-emerald-200" },
  listen: { label: "Dinle", bgColor: "bg-teal-900/40 border-teal-700/50", textColor: "text-teal-200" },
  wait: { label: "Bekle", bgColor: "bg-gray-800/60 border-gray-700/50", textColor: "text-gray-300" },
  approach: { label: "Yaklaş", bgColor: "bg-purple-900/40 border-purple-700/50", textColor: "text-purple-200" },
  leave: { label: "Ayrıl", bgColor: "bg-rose-900/40 border-rose-700/50", textColor: "text-rose-200" },
  persuade: { label: "İkna Et", bgColor: "bg-amber-900/40 border-amber-700/50", textColor: "text-amber-200" },
  bargain: { label: "Pazarlık Yap", bgColor: "bg-yellow-900/30 border-yellow-700/40", textColor: "text-yellow-200" },
  remember: { label: "Hatırla", bgColor: "bg-violet-900/40 border-violet-700/50", textColor: "text-violet-200" },
  read: { label: "Oku", bgColor: "bg-cyan-900/40 border-cyan-700/50", textColor: "text-cyan-200" },
  offer: { label: "Sun", bgColor: "bg-orange-900/40 border-orange-700/50", textColor: "text-orange-200" },
  take: { label: "Al", bgColor: "bg-sky-900/40 border-sky-700/50", textColor: "text-sky-200" },
  give: { label: "Ver", bgColor: "bg-lime-900/40 border-lime-700/50", textColor: "text-lime-200" },
  follow: { label: "Takip Et", bgColor: "bg-fuchsia-900/40 border-fuchsia-700/50", textColor: "text-fuchsia-200" },
  challenge: { label: "Meydan Oku", bgColor: "bg-red-900/40 border-red-700/50", textColor: "text-red-200" },
  apologize: { label: "Özür Dile", bgColor: "bg-stone-800/60 border-stone-700/50", textColor: "text-stone-300" },
  thank: { label: "Teşekkür Et", bgColor: "bg-emerald-950/40 border-emerald-800/40", textColor: "text-emerald-300" },
  custom: { label: "Eylem", bgColor: "bg-neutral-800/60 border-neutral-700/50", textColor: "text-neutral-300" }
};

export const ActionVerbBadge: React.FC<ActionVerbBadgeProps> = ({ verb, className = "" }) => {
  const config = verbConfig[verb] || verbConfig.custom;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${config.bgColor} ${config.textColor} ${className}`}
    >
      {config.label}
    </span>
  );
};
