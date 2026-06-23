import React from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { useGameStore } from "../../stores/gameStore";

export const LevelUpModal: React.FC = () => {
  const { activeModal, activeModalEvent, closeModal } = useGameStore();

  if (activeModal !== "level-up" || !activeModalEvent) return null;

  const payload = activeModalEvent.payload as { oldLevel?: number; newLevel?: number } | undefined;
  const oldLevel = payload?.oldLevel ?? 1;
  const newLevel = payload?.newLevel ?? 2;

  return (
    <div className="roman-modal-backdrop animate-fade-in">
      <div className="roman-modal-container gold-frame animate-modal-zoom">
        <div className="roman-modal-header">
          <h2 className="roman-title-gold text-center">NOVA AETAS</h2>
          <p className="roman-subtitle text-center">Seviye Atladın!</p>
        </div>

        <div className="roman-modal-body text-center">
          <div className="level-up-comparison">
            <div className="level-node old">
              <span className="level-label">ESKİ</span>
              <span className="level-val">{oldLevel}</span>
            </div>
            <div className="level-arrow"><ArrowRight size={28} weight="bold" aria-hidden="true" /></div>
            <div className="level-node new animate-pulse-gold">
              <span className="level-label">YENİ</span>
              <span className="level-val">{newLevel}</span>
            </div>
          </div>
          <p className="modal-description mt-4">
            Roma yollarındaki bilgin ve tecrüben artıyor. Yeni ufuklar seni bekliyor!
          </p>
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
