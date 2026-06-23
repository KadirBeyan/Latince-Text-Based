import type { PlayerSave, Scene } from "../types/gameTypes";
import type { NpcDefinition } from "../types/contentTypes";
import type { LlmClient } from "../../llm/LlmClient";
import type { SceneNarrationResult } from "../../llm/LlmTypes";
import { LocationStateSystem } from "./LocationStateSystem";
import { WorldEventSystem } from "./WorldEventSystem";
import { NpcMemorySystem } from "./NpcMemorySystem";
import { ContentLoader } from "../content/ContentLoader";
import { checkTextAgainstLevel } from "../../latin/LatinGrammarGatekeeper";

export interface NarrationSystemResult {
  narrationTr: string;
  npcLineLatin?: string;
  npcLineTr?: string;
  objectiveReminderTr: string;
  mode: "llm" | "fallback";
  worldMoodTr?: string;
}

export class NarrationSystem {
  constructor(private readonly contentLoader: ContentLoader) {}

  async generateNarration(
    save: PlayerSave,
    scene: Scene,
    npcProfiles: NpcDefinition[],
    llmClient?: LlmClient
  ): Promise<NarrationSystemResult> {
    if (llmClient) {
      try {
        const locationSystem = new LocationStateSystem();
        const worldEventSystem = new WorldEventSystem();
        const memorySystem = new NpcMemorySystem();

        const locationState = scene.locationId ? locationSystem.getLocationState(save, scene.locationId) : undefined;
        const activeEvents = worldEventSystem.getActiveWorldEvents(save).map(e => `${e.title}: ${e.text}`);
        const importantFacts = scene.npcIds ? scene.npcIds.flatMap(npcId => 
          memorySystem.getImportantFacts({ save, npcId, limit: 3 }).map(f => `${npcId}: ${f.text}`)
        ) : [];

        const result: SceneNarrationResult = await llmClient.generateSceneNarration({
          sceneDescription: scene.description,
          sceneObjective: scene.objective ?? "",
          npcProfiles: npcProfiles.map((n) => ({
            id: n.id,
            name: n.name,
            description: n.description,
          })),
          playerName: save.playerName,
          playerLevel: save.level,
          unlockedSkills: save.skills.filter((s) => s.unlocked).map((s) => s.skillId),
          locationState: locationState ? {
            locationId: locationState.locationId,
            mood: locationState.mood,
            visitCount: locationState.visitCount
          } : undefined,
          activeWorldEvents: activeEvents,
          importantNpcMemoryFacts: importantFacts,
          narrativeFlags: save.narrativeFlags
        });

        const npcLineLatin = this.gateLatinLine(result.npcLineLatin, save, scene, "Salve.");
        return {
          narrationTr: result.narrationTr,
          npcLineLatin,
          npcLineTr: result.npcLineTr,
          objectiveReminderTr: result.objectiveReminderTr,
          mode: "llm",
          worldMoodTr: result.worldMoodTr
        };
      } catch (error) {
        console.error("LLM Narration error, falling back:", error);
      }
    }

    // Deterministic fallback
    return {
      narrationTr: scene.description,
      objectiveReminderTr: scene.objective ?? "",
      mode: "fallback",
      worldMoodTr: undefined
    };
  }

  private gateLatinLine(line: string | undefined, save: PlayerSave, scene: Scene, fallback: string): string | undefined {
    if (!line?.trim()) return undefined;
    try {
      const gate = checkTextAgainstLevel({ text: line, contentLoader: this.contentLoader, playerLevel: save.level, allowedGrammarIds: scene.learningFocus?.grammarIds ?? [], knownVocabularyIds: scene.learningFocus?.vocabularyIds, maxSentenceLength: save.level <= 1 ? 6 : 10 });
      return gate.ok ? line : gate.safeSuggestion || fallback;
    } catch {
      return fallback;
    }
  }
}
