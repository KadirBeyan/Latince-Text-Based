import { Coins, Sparkle, TreasureChest, Trophy } from "@phosphor-icons/react";
import type { NarrativeMoment } from "../../types/narrativeTypes";

export function RewardReveal({ rewardSummary, reducedMotion = false }: { rewardSummary?: NarrativeMoment["rewardSummary"]; reducedMotion?: boolean }) {
  if (!rewardSummary) return null;
  const rows: Array<{ key: string; label: string; value: string; icon: typeof Sparkle }> = [];
  if (rewardSummary.xp) rows.push({ key: "xp", label: "XP", value: `+${rewardSummary.xp}`, icon: Sparkle });
  if (rewardSummary.currency) rows.push({ key: "currency", label: "Denarii", value: `+${rewardSummary.currency}`, icon: Coins });
  rewardSummary.items?.forEach((item, index) => rows.push({ key: `item-${index}`, label: "Eşya", value: item, icon: TreasureChest }));
  rewardSummary.mastery?.forEach((item, index) => rows.push({ key: `mastery-${index}`, label: "Ustalık", value: item, icon: Trophy }));
  if (rows.length === 0) return null;
  return (
    <div className={reducedMotion ? "reward-reveal reduced" : "reward-reveal"}>
      {rows.map((row, index) => {
        const Icon = row.icon;
        return (
          <div className="reward-reveal-item" style={{ animationDelay: reducedMotion ? "0ms" : `${index * 90}ms` }} key={row.key}>
            <Icon size={18} weight="duotone" aria-hidden="true" />
            <span>{row.label}</span>
            <strong>{row.value}</strong>
          </div>
        );
      })}
    </div>
  );
}
