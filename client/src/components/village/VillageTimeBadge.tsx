import { VillageTimeOfDay } from "../../types/gameTypes";

interface VillageTimeBadgeProps {
  dayNumber: number;
  timeOfDay: VillageTimeOfDay;
  actionsUsed: number;
  maxActions: number;
}

export function VillageTimeBadge({ dayNumber, timeOfDay, actionsUsed, maxActions }: VillageTimeBadgeProps) {
  const getPeriodLabel = (time: VillageTimeOfDay) => {
    switch (time) {
      case "mane":
        return { text: "SABAH", latin: "Mane", className: "village-time--mane", desc: "Güne dinç başla. Eğitim ve tarlalar canlanıyor." };
      case "meridies":
        return { text: "ÖĞLE", latin: "Meridies", className: "village-time--meridies", desc: "Günün ortası. Köy pazarı hareketli." };
      case "vesper":
        return { text: "AKŞAM", latin: "Vesper", className: "village-time--vesper", desc: "Gün batımı. İnsanlar dinleniyor, tapınak sakin." };
      case "nox":
        return { text: "GECE", latin: "Nox", className: "village-time--nox", desc: "Karanlık çöktü. Eve dönme ve uyuma vakti." };
    }
  };

  const period = getPeriodLabel(timeOfDay);
  const remainingActions = Math.max(0, maxActions - actionsUsed);

  return (
    <div className={`village-time-badge ${period.className}`}>
      <div className="village-time-header">
        <span className="village-time-day-label">DIES {dayNumber}</span>
        <div className="village-time-period-group">
          <span className="village-time-period-latin">{period.latin}</span>
          <span className="village-time-period-tr">{period.text}</span>
        </div>
      </div>
      <p className="village-time-desc">{period.desc}</p>
      
      <div className="village-action-dots-container">
        <span className="village-actions-label">Enerji:</span>
        <div className="village-action-dots">
          {Array.from({ length: maxActions }).map((_, idx) => (
            <div
              key={idx}
              className={`village-action-dot ${idx < actionsUsed ? "used" : "available"}`}
              title={idx < actionsUsed ? "Harcanan Eylem" : "Kullanılabilir Eylem"}
            />
          ))}
        </div>
        <span className="village-actions-fraction">
          ({remainingActions} / {maxActions})
        </span>
      </div>
    </div>
  );
}
