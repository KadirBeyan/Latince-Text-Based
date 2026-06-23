import type { Effect, ConsequencePresentation } from "../types/gameTypes";

export function mapLivingEffectsToConsequences(effects: Effect[]): ConsequencePresentation[] {
  const consequences: ConsequencePresentation[] = [];

  for (const [idx, effect] of effects.entries()) {
    const id = `living_effect_${effect.type}_${idx}`;
    switch (effect.type) {
      case "ADD_SCENE_CLUE":
        consequences.push({
          id,
          kind: "knowledge",
          titleTr: "Yeni İpucu",
          bodyTr: `Mekanda önemli bir detay buldun: ${effect.clueId}`,
          tone: "success"
        });
        break;
      case "MARK_SCENE_INSPECTED":
        consequences.push({
          id,
          kind: "knowledge",
          titleTr: "Gözlem Yapıldı",
          bodyTr: `Çevredeki nesneleri başarıyla inceledin.`,
          valueTr: effect.inspectId,
          tone: "success"
        });
        break;
      case "MARK_SCENE_LISTENED":
        consequences.push({
          id,
          kind: "knowledge",
          titleTr: "Sesler Dinlendi",
          bodyTr: `Çevredeki konuşmaları ve fısıltıları dinledin.`,
          valueTr: effect.listenId,
          tone: "success"
        });
        break;
      case "MARK_SCENE_READ":
        consequences.push({
          id,
          kind: "knowledge",
          titleTr: "Yazı Okundu",
          bodyTr: `Mekandaki tabelayı veya yazıtı okudun.`,
          valueTr: effect.readId,
          tone: "success"
        });
        break;
      case "ADD_SCENE_DISCOVERED_VOCAB":
        consequences.push({
          id,
          kind: "unlock",
          titleTr: "Kelime Keşfi",
          bodyTr: `Bu mekanda yeni bir Latince kelime keşfettin!`,
          valueTr: effect.vocabularyId,
          tone: "success"
        });
        break;
      case "ADD_SCENE_DISCOVERED_GRAMMAR":
        consequences.push({
          id,
          kind: "unlock",
          titleTr: "Gramer Keşfi",
          bodyTr: `Bu mekanda yeni bir Latince dil bilgisi kuralı keşfettin!`,
          valueTr: effect.grammarId,
          tone: "success"
        });
        break;
      case "INCREMENT_NPC_INTERACTION_COUNT":
        consequences.push({
          id,
          kind: "relationship",
          titleTr: "NPC Etkileşimi",
          bodyTr: `NPC ile kurduğun diyalog hafızasında yer edindi.`,
          valueTr: effect.npcId,
          tone: "muted"
        });
        break;
    }
  }

  return consequences;
}
