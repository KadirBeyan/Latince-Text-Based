import { VillageLifeState } from "../../types/gameTypes";
import { getSpeakerLabel } from "../../utils/displayLabels";
import { getFullActivityDetails } from "./villageActivitiesMap";

interface VillageDaySummaryProps {
  villageLife: VillageLifeState;
}

export function VillageDaySummary({ villageLife }: VillageDaySummaryProps) {
  const history = villageLife.routineHistory || [];
  
  // Show past completed days
  const completedDays = history.filter((h) => h.dayNumber < villageLife.dayState.dayNumber);

  if (completedDays.length === 0) {
    return null;
  }

  const getLifePathTitle = (pathId: string) => {
    const titles: Record<string, string> = {
      ludus: "Gladyatörlük",
      castra: "Askerlik",
      mercatura: "Ticaret",
      scriptura: "Yazıcılık",
      templum: "Rahiplik",
      villa: "Tarım"
    };
    return titles[pathId] || pathId;
  };

  return (
    <div className="village-panel-card">
      <h3 className="village-panel-title">GEÇMİŞ GÜNLERİN GÜNCESİ (Fasti)</h3>
      <p className="village-panel-subtitle">Köydeki önceki günlerde tamamladığın işler.</p>
      <div className="village-day-history-list">
        {completedDays.map((entry) => {
          // Find full activity details for display
          const activitiesText = entry.activityIds
            .map((id) => getFullActivityDetails(id).titleTr)
            .join(", ");

          return (
            <div key={entry.dayNumber} className="village-day-history-card">
              <div className="history-card-header">
                <span className="history-day-label">DIES {entry.dayNumber}</span>
              </div>
              
              <p className="history-summary">{entry.summaryTr}</p>
              
              {entry.activityIds.length > 0 && (
                <div className="history-details-row">
                  <span className="details-label">Yapılanlar:</span>
                  <span className="details-value">{activitiesText}</span>
                </div>
              )}

              {entry.notableNpcIds.length > 0 && (
                <div className="history-details-row">
                  <span className="details-label">Görüşülenler:</span>
                  <span className="details-value">
                    {entry.notableNpcIds.map((n) => getSpeakerLabel(n)).join(", ")}
                  </span>
                </div>
              )}

              {entry.lifePathChanges && Object.keys(entry.lifePathChanges).length > 0 && (
                <div className="history-path-row">
                  {Object.entries(entry.lifePathChanges).map(([pathId, amt]) => (
                    <span key={pathId} className="history-path-change-badge">
                      {getLifePathTitle(pathId)} +{amt}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
