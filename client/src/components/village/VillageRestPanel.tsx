import { SceneChoice } from "../../types/gameTypes";

interface VillageRestPanelProps {
  availableChoices: SceneChoice[];
  onSubmitChoice: (choiceId: string) => Promise<void>;
  locationId?: string;
  dayNumber: number;
}

export function VillageRestPanel({
  availableChoices,
  onSubmitChoice,
  locationId,
  dayNumber
}: VillageRestPanelProps) {
  const advanceTimeChoice = availableChoices.find((c) => c.id === "action_advance_time");
  const startNewDayChoice = availableChoices.find((c) => c.id === "action_start_new_day");
  const finishVillageChoice = availableChoices.find((c) => c.id === "action_finish_village");

  if (!advanceTimeChoice && !startNewDayChoice && !finishVillageChoice) {
    return null;
  }

  return (
    <div className="village-panel-card rest-panel-card">
      <h3 className="village-panel-title">ZAMAN VE DİNLENME (Otium)</h3>
      <p className="village-panel-subtitle">Günün vaktini değiştirebilir veya günün sonuna gelindiğinde uyuyup yeni bir güne başlayabilirsin.</p>
      
      <div className="rest-actions-row">
        {advanceTimeChoice && (
          <button
            className="vp-btn vp-btn--primary rest-button"
            onClick={() => onSubmitChoice(advanceTimeChoice.id)}
          >
            <span>⏳ Zamanı İlerlet</span>
            <small>Bir sonraki vakte geçer</small>
          </button>
        )}

        {startNewDayChoice && (
          <button
            className="vp-btn vp-btn--secondary rest-button sleep-button"
            onClick={() => onSubmitChoice(startNewDayChoice.id)}
          >
            <span>🛌 Uyu ve Günü Kapat</span>
            <small>Yeni günü başlatır (Mane)</small>
          </button>
        )}
      </div>

      {startNewDayChoice && locationId !== "home_hut" && (
        <p className="rest-notice-text">
          ⚠️ Günü tamamlayıp uyumak için <strong>Casa (Ev)</strong> bölgesine gitmelisin.
        </p>
      )}

      {finishVillageChoice && (
        <div className="finish-village-section">
          <div className="divider-line" />
          <p className="finish-text">
            🎉 Köyde en az 3 gün geçirdin ve geleceğine yön vermeye hazırsın!
          </p>
          <button
            className="vp-btn vp-btn--gold finish-button"
            style={{ width: "100%", padding: "16px", fontSize: "1.1rem" }}
            onClick={() => onSubmitChoice(finishVillageChoice.id)}
          >
            <strong>🏛️ Köyden Ayrıl ve Yolunu Seç</strong>
          </button>
        </div>
      )}
    </div>
  );
}
