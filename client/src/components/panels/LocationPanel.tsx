import { Bank, Books, CastleTurret, HouseLine, Scales } from "@phosphor-icons/react";
import { useGameStore } from "../../stores/gameStore";

const locations = [
  { id: "home_hut", label: "Ev", note: "Aile ve ocak.", Icon: HouseLine },
  { id: "village_path", label: "Köy Yolu", note: "Geçiş ve karşılaşma.", Icon: Scales },
  { id: "field_edge", label: "Tarla", note: "Emek ve dikkat.", Icon: CastleTurret },
  { id: "village_market", label: "Pazar", note: "Ticaret ve söz.", Icon: Scales },
  { id: "teacher_corner", label: "Magister", note: "Harf ve Latince.", Icon: Bank },
  { id: "veteran_bench", label: "Veteran", note: "Disiplin ve hikaye.", Icon: CastleTurret },
  { id: "scribe_table", label: "Scriba", note: "Yazı ve tabula.", Icon: Books },
  { id: "shrine", label: "Sunak", note: "Pietas ve ritüel.", Icon: HouseLine },
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
