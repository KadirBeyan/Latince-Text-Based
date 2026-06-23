import type { CharacterTrait } from "../../types/characterTypes";

export function TraitCard({ trait, selected, disabled, onToggle }: { trait: { id: CharacterTrait; title: string; description: string }; selected: boolean; disabled: boolean; onToggle: () => void }) {
  return (
    <button type="button" className={`creation-card trait-card ${selected ? "selected" : ""}`} disabled={disabled && !selected} onClick={onToggle}>
      <strong>{trait.title}</strong>
      <span>{trait.description}</span>
    </button>
  );
}
