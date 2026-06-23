import { VillageDayState } from "../../types/gameTypes";
import { getFullActivityDetails } from "./villageActivitiesMap";

interface VillageRoutineTimelineProps {
  dayState: VillageDayState;
}

export function VillageRoutineTimeline({ dayState }: VillageRoutineTimelineProps) {
  // Find full activity details for completed activities today
  const completedToday = dayState.completedDailyActivityIds.map((id) => {
    return getFullActivityDetails(id);
  });

  return (
    <div className="village-panel-card">
      <h3 className="village-panel-title">BUGÜNKÜ GÜNLÜK AKIŞ (Hodie)</h3>
      <p className="village-panel-subtitle">Günlük rutininde gerçekleştirdiğin eylemler.</p>
      
      {completedToday.length === 0 ? (
        <p className="empty-text">Henüz bugün bir iş yapmadın. Sabah saatindesin.</p>
      ) : (
        <div className="village-timeline">
          {completedToday.map((act, index) => (
            <div key={`${act.id}-${index}`} className="village-timeline-item">
              <div className="timeline-marker-line">
                <div className="timeline-marker" />
              </div>
              <div className="timeline-content">
                <span className="timeline-time-label">Eylem {index + 1}</span>
                <h4 className="timeline-act-title">{act.titleTr}</h4>
                {act.descriptionTr ? <p className="timeline-act-desc">{act.descriptionTr}</p> : null}
              </div>
            </div>
          ))}
          {dayState.actionsUsedThisPeriod < dayState.maxActionsPerPeriod && (
            <div className="village-timeline-item timeline-next-up">
              <div className="timeline-marker-line">
                <div className="timeline-marker pulse" />
              </div>
              <div className="timeline-content">
                <span className="timeline-time-label">Sonraki Adım</span>
                <p className="timeline-act-desc text-muted">Bir etkinlik seç veya zamanı ilerlet...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
