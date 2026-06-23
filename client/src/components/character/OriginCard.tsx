import type { CharacterOrigin, RpgSkillId } from "../../types/characterTypes";

export function OriginCard({ origin, selected, onSelect }: { origin: { id: CharacterOrigin; title: string; story: string; skillBonuses: Partial<Record<RpgSkillId, number>>; pathText: string }; selected: boolean; onSelect: () => void }) {
  return (
    <button type="button" className={`creation-card ${selected ? "selected" : ""}`} onClick={onSelect}>
      <strong>{origin.title}</strong>
      <span>{origin.story}</span>
      <small>{Object.entries(origin.skillBonuses).map(([skill, value]) => `${skill} +${value}`).join(" · ") || "Bonus yok"}</small>
      <em>{origin.pathText}</em>
    </button>
  );
}
