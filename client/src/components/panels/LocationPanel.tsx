import { Bank, Books, CastleTurret, HouseLine, Scales } from "@phosphor-icons/react";
import { useGameStore } from "../../stores/gameStore";

const locations = [
  { id: "ludus_room", label: "Ludus", note: "Zihnini eğit.", Icon: Bank },
  { id: "forum", label: "Forum", note: "Konuş ve ikna et.", Icon: Scales },
  { id: "domus", label: "Domus", note: "Dinlen ve düşün.", Icon: HouseLine },
  { id: "castra", label: "Castra", note: "Disiplin ve görev.", Icon: CastleTurret },
  { id: "bibliotheca", label: "Bibliotheca", note: "Çalış ve keşfet.", Icon: Books },
];

export function LocationPanel() {
  const { gameState } = useGameStore();
  const currentLocation = gameState?.currentScene.locationId;

  return (
    <section className="panel-card location-panel">
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Loci</p>
        <h3>Konumlar</h3>
      </div>
      <div className="location-list">
        {locations.map(({ id, label, note, Icon }) => (
          <div className={currentLocation === id ? "location-row active" : "location-row"} key={id}>
            <Icon size={22} weight="duotone" aria-hidden="true" />
            <span>{label}</span>
            <small>{note}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
