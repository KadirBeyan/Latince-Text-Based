import type { PlayerSave, Scene } from "../types/gameTypes";
import type { LlmClient } from "../../llm/LlmClient";
import type { NpcReplyResult } from "../../llm/LlmTypes";
import type { LatinEvaluationResult } from "../../latin/LatinEvaluator";
import { ContentLoader } from "../content/ContentLoader";
import { NpcMemorySystem } from "./NpcMemorySystem";
import { NpcRelationshipSystem } from "./NpcRelationshipSystem";
import { LocationStateSystem } from "./LocationStateSystem";
import { WorldEventSystem } from "./WorldEventSystem";
import { checkTextAgainstLevel } from "../../latin/LatinGrammarGatekeeper";

export class NpcDialogueSystem {
  constructor(private readonly contentLoader: ContentLoader) {}

  async generateNpcReply(
    save: PlayerSave,
    scene: Scene,
    playerText: string,
    evaluation: LatinEvaluationResult,
    llmClient?: LlmClient
  ): Promise<NpcReplyResult> {
    const npcId = scene.npcIds[0];
    
    // Find NPC definition or create a default one
    const npcs = this.contentLoader.getContent().npcs || [];
    const npcDef = npcs.find((n) => n.id === npcId) || {
      id: "system",
      name: "Magister Aelius",
      description: "A calm teacher who insists that every first lesson begins with a greeting.",
    };

    if (llmClient) {
      try {
        const memorySystem = new NpcMemorySystem();
        const relationshipSystem = new NpcRelationshipSystem();
        const locationSystem = new LocationStateSystem();
        const worldEventSystem = new WorldEventSystem();

        const memoryFacts = npcId ? memorySystem.getImportantFacts({ save, npcId, limit: 5 }).map(f => f.text) : [];
        const relationship = npcId ? relationshipSystem.getRelationship(save, npcId) : undefined;
        const locationState = scene.locationId ? locationSystem.getLocationState(save, scene.locationId) : undefined;
        const activeEvents = worldEventSystem.getActiveWorldEvents(save).map(e => `${e.title}: ${e.text}`);
        const weakTargets = save.masteryStates.filter(m => m.mastery < 40).map(m => m.targetId);
        
        // Recent choices (last 3 action.choice_selected)
        const recentChoices = save.eventLog
          .filter(e => e.type === "action.choice_selected")
          .slice(-3)
          .map(e => e.payload.choiceId as string);
          
        // Recent evaluations (last 3 TEXT_EVALUATED results)
        const recentEvaluations = save.eventLog
          .filter(e => e.type === "TEXT_EVALUATED")
          .slice(-3)
          .map(e => {
            const payload = e.payload as any;
            return `Cevap: "${payload.playerAnswer}", Doğru mu: ${payload.evaluation?.isCorrect ?? false}`;
          });

        const suggestions = save.activeSideQuestSuggestions
          .filter(s => s.status === "suggested" || s.status === "accepted")
          .map(s => s.title);

        const reply = await llmClient.generateNpcReply({
          npcName: npcDef.name,
          npcDescription: npcDef.description,
          playerText,
          evaluation,
          playerLevel: save.level,
          npcMemoryFacts: memoryFacts,
          npcRelationship: relationship,
          locationState: locationState ? {
            locationId: locationState.locationId,
            mood: locationState.mood,
            visitCount: locationState.visitCount
          } : undefined,
          activeWorldEvents: activeEvents,
          sideQuestSuggestions: suggestions,
          playerWeakMasteryTargets: weakTargets,
          recentChoices,
          recentEvaluations
        });
        return { ...reply, npcLineLatin: this.gateLatinLine(reply.npcLineLatin, save, scene, evaluation.isCorrect ? "Optime." : "Tenta denuo.") };
      } catch (error) {
        console.error("LLM NPC reply generation failed, using fallback:", error);
      }
    }

    // Deterministic fallback based on evaluation result
    if (evaluation.isCorrect) {
      return {
        npcLineLatin: "Optime! Recte respondisti.",
        npcLineTr: "Harika! Doğru cevap verdin.",
        tone: "positive",
        memoryReferenceUsed: false
      };
    } else {
      return {
        npcLineLatin: "Non est recte. Tenta denuo.",
        npcLineTr: "Doğru değil. Tekrar dene.",
        tone: "encouraging",
        memoryReferenceUsed: false
      };
    }
  }

  private gateLatinLine(line: string, save: PlayerSave, scene: Scene, fallback: string): string {
    try {
      const gate = checkTextAgainstLevel({ text: line, contentLoader: this.contentLoader, playerLevel: save.level, allowedGrammarIds: scene.learningFocus?.grammarIds ?? [], knownVocabularyIds: scene.learningFocus?.vocabularyIds, maxSentenceLength: save.level <= 1 ? 6 : 10 });
      return gate.ok ? line : gate.safeSuggestion || fallback;
    } catch {
      return fallback;
    }
  }
}
