import { SceneChoice } from "../../types/gameTypes";
import { getLocationLabel } from "../../utils/displayLabels";

interface VillageLocationListProps {
  availableChoices: SceneChoice[];
  onSubmitChoice: (choiceId: string) => Promise<void>;
  currentLocationId?: string;
}

export function VillageLocationList({
  availableChoices,
  onSubmitChoice,
  currentLocationId
}: VillageLocationListProps) {
  const travelChoices = availableChoices.filter((choice) => choice.id.startsWith("travel_"));

  if (travelChoices.length === 0) {
    return null;
  }

  // Descriptions for each location to make the map/list feel premium
  const locationDescriptions: Record<string, string> = {
    home_hut: "Ailenle yaşadığın mütevazı saman damlı kulübe.",
    village_path: "Köyün kalbi; köylülerin karşılaştığı ana yol.",
    village_market: "Köylülerin mahsullerini sattığı ufak pazar yeri.",
    field_edge: "Bereketli buğday tarlalarının bittiği dik yamaç.",
    teacher_corner: "Magister'in çocuklara ders verdiği çınar altı.",
    veteran_bench: "Eski emekli askerlerin anılarını tazelediği gölgelik.",
    scribe_table: "Latince evrakları yazan memurun çalışma masası.",
    shrine: "Yerel tanrılara adaklar sunulan mermer sunak."
  };

  const getLocIdFromChoiceId = (choiceId: string) => {
    return choiceId.replace("travel_", "");
  };

  return (
    <div className="village-panel-card">
      <h3 className="village-panel-title">HİZLI SEYAHAT (Vias Vicus)</h3>
      <p className="village-panel-subtitle">Köyün diğer kısımlarına geçiş yapabilirsin.</p>
      <div className="village-location-grid">
        {travelChoices.map((choice) => {
          const locId = getLocIdFromChoiceId(choice.id);
          const name = getLocationLabel(locId);
          const desc = locationDescriptions[locId] || choice.description;

          return (
            <div
              key={choice.id}
              className="village-location-card clickable"
              onClick={() => onSubmitChoice(choice.id)}
            >
              <div className="location-card-header">
                <span className="location-icon">🏛️</span>
                <h4 className="location-name">{name}</h4>
              </div>
              <p className="location-desc">{desc}</p>
              <span className="travel-action-text">Seyahat Et →</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
