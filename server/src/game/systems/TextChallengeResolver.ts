import type { ContentLoader } from "../content/ContentLoader";
import type { PlayerSave, Scene, TextChallenge } from "../types/gameTypes";
import type { LlmClient } from "../../llm/LlmClient";
import { evaluateTextChallenge } from "../../latin/LatinEvaluator";

export class TextChallengeResolver {
  constructor(private readonly contentLoader: ContentLoader) {}

  evaluate(save: PlayerSave, scene: Scene, challenge: TextChallenge, text: string, llmClient?: LlmClient) {
    return evaluateTextChallenge({
      playerAnswer: text,
      expectedAnswers: [...challenge.expectedAnswers, ...(challenge.acceptedVariants ?? [])],
      prompt: challenge.prompt,
      sceneId: scene.id,
      questId: save.currentQuestId,
      playerLevel: save.level,
      unlockedSkills: save.skills.filter((s) => s.unlocked).map((s) => s.skillId),
      context: { strictness: challenge.strictness, evaluationMode: challenge.evaluationMode },
      llmClient: challenge.evaluationMode === "deterministic" ? undefined : llmClient,
      contentLoader: this.contentLoader,
    });
  }
}
