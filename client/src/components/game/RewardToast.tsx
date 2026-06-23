import React, { useEffect } from "react";
import { Backpack, Coins, Gift, LockOpen, Shield, Sparkle, Trophy, X } from "@phosphor-icons/react";
import { useGameStore } from "../../stores/gameStore";
import type { GameEvent } from "../../types/gameTypes";

interface ToastItemProps {
  toast: GameEvent;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  let Icon = Gift;
  let title = "Ödül Kazanıldı";
  let description = "";

  const payload = toast.payload as any;

  switch (toast.type) {
    case "ITEM_ADDED":
      Icon = Backpack;
      title = "Eşya Eklendi";
      description = `${payload?.quantity ?? 1}x ${payload?.itemId ?? "Bilinmeyen Eşya"}`;
      break;
    case "SKILL_UNLOCKED":
      Icon = LockOpen;
      title = "Yeni Yetenek";
      description = `${payload?.skillId ?? "Yetenek"} kilidi açıldı!`;
      break;
    case "SKILL_INCREMENTED":
      Icon = Shield;
      title = "Yetenek Gelişti";
      description = `${payload?.skillId ?? "Yetenek"} seviyesi yükseldi!`;
      break;
    case "CURRENCY_ADDED":
      Icon = Coins;
      title = "Denarii Kazanıldı";
      description = `+${payload?.amount ?? 0} Denarii`;
      break;
    case "REWARD_BUNDLE_APPLIED":
      Icon = Trophy;
      title = "Ödül Paketi";
      description = "Yeni ödüller envanterine eklendi.";
      break;
    case "XP_ADDED":
      Icon = Sparkle;
      title = "Tecrübe Puanı";
      description = `+${payload?.amount ?? 0} XP`;
      break;
  }

  return (
    <div 
      className="reward-toast-item gold-frame bg-stone-950/90 text-stone-100 flex items-start gap-3 p-3 shadow-lg cursor-pointer animate-toast-in hover:brightness-125"
      onClick={() => onDismiss(toast.id)}
    >
      <span className="toast-icon"><Icon size={24} weight="duotone" aria-hidden="true" /></span>
      <div className="flex-1">
        <h4 className="toast-title text-gold font-serif text-xs font-bold leading-tight">{title.toUpperCase()}</h4>
        <p className="toast-desc text-stone-300 text-[11px] mt-0.5 leading-snug">{description}</p>
      </div>
      <button className="toast-close" type="button" aria-label="Bildirimi kapat"><X size={15} weight="bold" /></button>
    </div>
  );
};

export const RewardToast: React.FC = () => {
  const { rewardToasts, dismissToast } = useGameStore();

  if (rewardToasts.length === 0) return null;

  return (
    <div className="reward-toast-container fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-auto">
      {rewardToasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
};
