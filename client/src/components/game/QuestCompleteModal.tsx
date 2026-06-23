import React from "react";
import { Scroll } from "@phosphor-icons/react";
import { useGameStore } from "../../stores/gameStore";

export const QuestCompleteModal: React.FC = () => {
  const { activeModal, activeModalEvent, gameState, closeModal } = useGameStore();

  if (activeModal !== "quest-complete" || !activeModalEvent) return null;

  const payload = activeModalEvent.payload as { questId?: string } | undefined;
  const questId = payload?.questId;

  // Try to find the completed quest details
  const quest = gameState?.currentChapter?.quests.find(q => q.id === questId)
    || gameState?.currentCampaign?.chapters.flatMap(c => c.quests).find(q => q.id === questId);

  const questTitle = quest?.title ?? questId ?? "Bilinmeyen Görev";
  const questDesc = quest?.description ?? "Bu görevi başarıyla tamamladın.";

  return (
    <div className="roman-modal-backdrop animate-fade-in">
      <div className="roman-modal-container gold-frame animate-modal-zoom">
        <div className="roman-modal-header text-center">
          <h2 className="roman-title-gold text-center">LECTIO PERFECTA</h2>
          <p className="roman-subtitle text-center">Görev Tamamlandı!</p>
        </div>

        <div className="roman-modal-body text-center">
          <div className="quest-complete-badge animate-pulse-gold">
            <Scroll size={38} weight="duotone" aria-hidden="true" />
          </div>
          <h3 className="quest-title-text mt-4">{questTitle}</h3>
          <p className="modal-description mt-2 text-stone-300">
            {questDesc}
          </p>
          
          {quest?.rewards && Array.isArray(quest.rewards) && quest.rewards.length > 0 && (
            <div className="rewards-section mt-4">
              <span className="rewards-title">KAZANILAN ÖDÜLLER</span>
              <div className="rewards-list flex justify-center gap-4 mt-2">
                {/* Rewards can be displayed in toasts, but showing them here if present is nice */}
                {quest.rewards.map((r: any, idx: number) => (
                  <div key={idx} className="reward-badge-mini gold-frame">
                    {r.type === "xp" && `+${r.amount} XP`}
                    {r.type === "currency" && `+${r.amount} Denarii`}
                    {r.type === "item" && `+${r.quantity} ${r.itemId}`}
                    {r.type === "skill" && `+${r.amount} ${r.skillId}`}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="roman-modal-footer mt-6">
          <button className="btn-roman gold-frame" onClick={closeModal}>
            DEVAM ET
          </button>
        </div>
      </div>
    </div>
  );
};
