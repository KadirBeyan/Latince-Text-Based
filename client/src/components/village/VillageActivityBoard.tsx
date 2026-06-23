import { VillageActivity, SceneChoice } from "../../types/gameTypes";
import { getSkillLabel } from "../../utils/displayLabels";

interface VillageActivityBoardProps {
  activities: VillageActivity[];
  availableChoices: SceneChoice[];
  onSubmitChoice: (choiceId: string) => Promise<void>;
  onStartConversation: (flowId: string) => Promise<void>;
  actionsUsed: number;
  maxActions: number;
}

export function VillageActivityBoard({
  activities,
  availableChoices,
  onSubmitChoice,
  onStartConversation,
  actionsUsed,
  maxActions
}: VillageActivityBoardProps) {
  const isOutOfActions = actionsUsed >= maxActions;

  if (activities.length === 0) {
    return (
      <div className="village-panel-card activity-board-empty">
        <h4>ETKİNLİKLER</h4>
        <p className="empty-text">Bu vakitte burada yapılabilecek başka bir iş kalmadı. Zamanı ilerletebilir veya başka bir yere gidebilirsin.</p>
      </div>
    );
  }

  const getLifePathLabel = (pathId: string) => {
    const labels: Record<string, string> = {
      ludus: "Gladyatör / Okul (Ludus)",
      castra: "Askeri / Ordu (Castra)",
      mercatura: "Ticaret / Pazar (Mercatura)",
      scriptura: "Bürokrasi / Yazıcı (Scriptura)",
      templum: "Rahiplik / Din (Templum)",
      villa: "Tarım / Malikane (Villa)"
    };
    return labels[pathId] || pathId;
  };

  return (
    <div className="village-panel-card">
      <h3 className="village-panel-title">YAPILABİLECEK ETKİNLİKLER</h3>
      {isOutOfActions && (
        <div className="village-alert-warning">
          Enerjin kalmadı! Yeni bir işe başlamak için dinlenmeli veya evinde uyumalısın.
        </div>
      )}
      <div className="village-activity-list">
        {activities.map((activity) => {
          const choiceId = `activity_${activity.id}`;
          const choiceExists = availableChoices.some((c) => c.id === choiceId);
          const isDisabled = isOutOfActions || !choiceExists;

          return (
            <div
              key={activity.id}
              className={`village-activity-card ${isDisabled ? "disabled" : "clickable"}`}
              onClick={() => {
                if (!isDisabled) {
                  if (activity.conversationFlowId) {
                    onStartConversation(activity.conversationFlowId);
                  } else {
                    onSubmitChoice(choiceId);
                  }
                }
              }}
            >
              <div className="activity-main-info">
                <h4 className="activity-title">{activity.titleTr}</h4>
                <p className="activity-desc">{activity.descriptionTr}</p>
              </div>

              <div className="activity-footer">
                {activity.suggestedSkills && activity.suggestedSkills.length > 0 && (
                  <div className="activity-badge-group">
                    <span className="badge-label">Önerilen Yetenek:</span>
                    {activity.suggestedSkills.map((s) => (
                      <span key={s} className="activity-badge badge-skill">
                        {getSkillLabel(s)}
                      </span>
                    ))}
                  </div>
                )}

                {activity.lifePathHints && Object.keys(activity.lifePathHints).length > 0 && (
                  <div className="activity-badge-group">
                    <span className="badge-label">Yol Eğilimi:</span>
                    {Object.entries(activity.lifePathHints).map(([pathId, val]) => (
                      <span key={pathId} className="activity-badge badge-path">
                        {getLifePathLabel(pathId)} (+{val})
                      </span>
                    ))}
                  </div>
                )}

                <div className="activity-tags">
                  {activity.tags.map((tag) => (
                    <span key={tag} className="activity-tag">
                      #{tag}
                    </span>
                  ))}
                  {!activity.repeatable && (
                    <span className="activity-tag tag-once">Tek Seferlik</span>
                  )}
                  {activity.cooldownDays && activity.cooldownDays > 0 ? (
                    <span className="activity-tag tag-cooldown">{activity.cooldownDays} Gün Bekleme</span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
