import type { PlayerSave, Scene } from "../types/gameTypes";
import type { EventBus } from "../core/EventBus";
import { NpcMemorySystem } from "./NpcMemorySystem";
import { NpcRelationshipSystem } from "./NpcRelationshipSystem";

export class NpcSceneReactionService {
  applyAnswerReaction(params: { save: PlayerSave; scene: Scene; isCorrect: boolean; text: string; errorTags?: string[]; mode: "latin" | "dialogue"; eventBus: EventBus }): PlayerSave {
    const { scene, isCorrect, text, eventBus, mode } = params;
    let nextSave = params.save;
    if (!scene.npcIds || scene.npcIds.length === 0) return nextSave;

    const relationshipSystem = new NpcRelationshipSystem();
    const memorySystem = new NpcMemorySystem();
    for (const npcId of scene.npcIds) {
      if (isCorrect) {
        nextSave = relationshipSystem.updateRelationship({
          save: nextSave,
          npcId,
          delta: { familiarity: 1, respect: npcId === "magister" ? 2 : 1 },
          reason: mode === "latin" ? "Doğru Latince cevabı verdi." : "Doğru diyalog cevabı verdi.",
          eventBus,
        });
        nextSave = memorySystem.addNpcMemoryFact({
          save: nextSave,
          npcId,
          text: mode === "latin" ? `Öğrenci bu sahnede doğru Latince cevap verdi: ${text.slice(0, 60)}` : `Öğrenci bu sahnede doğru diyalog cevabı verdi: ${text.slice(0, 60)}`,
          importance: 30,
          relatedSceneId: scene.id,
          relatedQuestId: nextSave.currentQuestId,
          tags: ["correct-answer"],
          eventBus,
        });
      } else {
        nextSave = relationshipSystem.updateRelationship({
          save: nextSave,
          npcId,
          delta: { familiarity: 1 },
          reason: mode === "latin" ? "Yanlış Latince cevabı verdi." : "Yanlış diyalog cevabı verdi.",
          eventBus,
        });
        const tags = params.errorTags ?? [];
        const tagsText = tags.length > 0 ? tags.join(", ") : "bilinmeyen konular";
        nextSave = memorySystem.addNpcMemoryFact({
          save: nextSave,
          npcId,
          text: mode === "latin" ? `Öğrenci bu sahnede ${tagsText} konusunda zorlandı.` : "Öğrenci bu sahnede diyalog cevabında zorlandı.",
          importance: 40,
          relatedSceneId: scene.id,
          relatedQuestId: nextSave.currentQuestId,
          tags: mode === "latin" ? ["struggled", ...tags] : ["struggled"],
          eventBus,
        });
      }
    }
    return nextSave;
  }
}
