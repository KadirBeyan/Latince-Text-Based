import { TRAITS } from "../../types/characterTypes";
import { useCharacterCreationStore } from "../../stores/characterCreationStore";
import { TraitCard } from "./TraitCard";

export function TraitSelectionStep() {
  const { traits, toggleTrait } = useCharacterCreationStore();
  return (
    <div className="creation-step">
      <p className="eyebrow">IV · Ingenium</p>
      <h2>İki eğilim seç</h2>
      <p>Bu eğilimler ilk köy ilişkilerinde küçük ton farkları ve ileride condition/effect kapıları için temel oluşturur.</p>
      <div className="creation-card-grid trait-grid">
        {TRAITS.map((trait) => <TraitCard key={trait.id} trait={trait} selected={traits.includes(trait.id)} disabled={traits.length >= 2} onToggle={() => toggleTrait(trait.id)} />)}
      </div>
    </div>
  );
}
