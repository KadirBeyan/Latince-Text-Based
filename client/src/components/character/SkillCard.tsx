import type { RpgSkillId } from "../../types/characterTypes";

export function SkillCard({ id, title, description, value, bonus, remaining, onAdjust }: { id: RpgSkillId; title: string; description: string; value: number; bonus: number; remaining: number; onAdjust: (delta: 1 | -1) => void }) {
  const finalValue = Math.min(3, value + bonus);
  return (
    <div className="creation-card skill-card-creation">
      <div>
        <strong>{title}</strong>
        <span>{description}</span>
      </div>
      <div className="skill-stepper" aria-label={`${title} puanı`}>
        <button type="button" onClick={() => onAdjust(-1)} disabled={value <= 0}>-</button>
        <b>{value}</b>
        <button type="button" onClick={() => onAdjust(1)} disabled={value >= 3 || remaining <= 0}>+</button>
      </div>
      <small>Final {finalValue}{bonus ? ` · köken +${bonus}` : ""}</small>
    </div>
  );
}
