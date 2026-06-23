import type { Effect, ConsequencePresentation } from "../types/gameTypes";

export function mapEffectsToConsequences(effects: Effect[]): ConsequencePresentation[] {
  const consequences: ConsequencePresentation[] = [];

  for (const [idx, effect] of effects.entries()) {
    const id = `effect_${effect.type}_${idx}`;
    switch (effect.type) {
      case "ADD_XP":
        consequences.push({
          id,
          kind: "reward",
          titleTr: "Deneyim Kazandın",
          bodyTr: `Maceranda ilerleme kaydettin.`,
          valueTr: `+${effect.amount} XP`,
          tone: "success"
        });
        break;
      case "ADD_CURRENCY":
        consequences.push({
          id,
          kind: "reward",
          titleTr: "Denarius Kazandın",
          bodyTr: `Kesene yeni paralar eklendi.`,
          valueTr: `+${effect.amount} Denarii`,
          tone: "gold"
        });
        break;
      case "REMOVE_CURRENCY":
        consequences.push({
          id,
          kind: "reward",
          titleTr: "Para Harcadın",
          bodyTr: `Ödeme yapıldı.`,
          valueTr: `-${effect.amount} Denarii`,
          tone: "warning"
        });
        break;
      case "ADD_ITEM":
        consequences.push({
          id,
          kind: "reward",
          titleTr: "Yeni Eşya",
          bodyTr: `Envanterine eklendi.`,
          valueTr: `${effect.itemId} (x${effect.quantity ?? 1})`,
          tone: "success"
        });
        break;
      case "REMOVE_ITEM":
        consequences.push({
          id,
          kind: "reward",
          titleTr: "Eşya Kaybettin",
          bodyTr: `Envanterinden çıkarıldı.`,
          valueTr: `${effect.itemId} (x${effect.quantity ?? 1})`,
          tone: "danger"
        });
        break;
      case "UNLOCK_SKILL":
        consequences.push({
          id,
          kind: "unlock",
          titleTr: "Yeni Yetenek Açıldı",
          bodyTr: `Yeni bir yetenek edindin.`,
          valueTr: effect.skillId,
          tone: "success"
        });
        break;
      case "INCREMENT_SKILL":
        consequences.push({
          id,
          kind: "unlock",
          titleTr: "Yetenek Gelişti",
          bodyTr: `Yeteneğin güçlendi.`,
          valueTr: `${effect.skillId} +${effect.amount ?? 1}`,
          tone: "success"
        });
        break;
      case "START_QUEST":
        consequences.push({
          id,
          kind: "quest",
          titleTr: "Yeni Görev",
          bodyTr: `Yeni bir maceraya atıldın.`,
          valueTr: effect.questId,
          tone: "success"
        });
        break;
      case "COMPLETE_QUEST":
        consequences.push({
          id,
          kind: "quest",
          titleTr: "Görev Tamamlandı",
          bodyTr: `Bir macerayı başarıyla tamamladın!`,
          valueTr: effect.questId,
          tone: "success"
        });
        break;
      case "FAIL_QUEST":
        consequences.push({
          id,
          kind: "quest",
          titleTr: "Görev Başarısız",
          bodyTr: `Macerada başarısız oldun.`,
          valueTr: effect.questId,
          tone: "danger"
        });
        break;
      case "ADD_JOURNAL_ENTRY":
        consequences.push({
          id,
          kind: "knowledge",
          titleTr: effect.title,
          bodyTr: effect.body,
          tone: "success"
        });
        break;
      case "UPDATE_NPC_RELATIONSHIP": {
        const deltas: string[] = [];
        if (effect.delta.trust !== undefined) deltas.push(`Güven: ${effect.delta.trust > 0 ? "+" : ""}${effect.delta.trust}`);
        if (effect.delta.respect !== undefined) deltas.push(`Saygı: ${effect.delta.respect > 0 ? "+" : ""}${effect.delta.respect}`);
        if (effect.delta.familiarity !== undefined) deltas.push(`Tanışıklık: ${effect.delta.familiarity > 0 ? "+" : ""}${effect.delta.familiarity}`);
        consequences.push({
          id,
          kind: "relationship",
          titleTr: `${effect.npcId} ile İlişkin Değişti`,
          bodyTr: effect.reason || "Kişisel etkileşim.",
          valueTr: deltas.join(", "),
          tone: "success"
        });
        break;
      }
      case "ADD_NPC_MEMORY":
        consequences.push({
          id,
          kind: "memory",
          titleTr: `${effect.npcId} Seni Hatırlayacak`,
          bodyTr: effect.text,
          tone: "muted"
        });
        break;
      case "DISCOVER_LOCATION":
        consequences.push({
          id,
          kind: "location",
          titleTr: "Yeni Bölge Keşfedildi",
          bodyTr: `Haritada yeni bir yer açıldı!`,
          valueTr: effect.locationId,
          tone: "success"
        });
        break;
    }
  }

  return consequences;
}
