import { ORIGINS } from "../../types/characterTypes";
import { useCharacterCreationStore } from "../../stores/characterCreationStore";
import { OriginCard } from "./OriginCard";

export function CharacterOriginStep() {
  const { origin, setOrigin } = useCharacterCreationStore();
  return (
    <div className="creation-step">
      <p className="eyebrow">II · Kökenin</p>
      <h2>Hangi evin gölgesinde büyüdün?</h2>
      <div className="creation-card-grid origin-grid">
        {ORIGINS.map((item) => <OriginCard key={item.id} origin={item} selected={origin === item.id} onSelect={() => setOrigin(item.id)} />)}
      </div>
    </div>
  );
}
