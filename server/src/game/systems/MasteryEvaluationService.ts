import type { PlayerSave, Scene } from "../types/gameTypes";
import { EventBus } from "../core/EventBus";
import { MasterySystem } from "./MasterySystem";

export class MasteryEvaluationService {
  constructor(private readonly masterySystem = new MasterySystem()) {}

  recordEvaluationAndEmit(save: PlayerSave, evaluation: unknown, scene: Scene, eventBus: EventBus): PlayerSave {
    const beforeMastery = new Map(save.masteryStates.map(state => [`${state.targetType}:${state.targetId}`, state.mastery]));
    let nextSave = this.masterySystem.recordEvaluation({ save, evaluation: evaluation as any, scene });
    const focusGrammar = scene.learningFocus?.grammarIds || [];
    const focusVocab = scene.learningFocus?.vocabularyIds || [];
    const focusSkill = scene.learningFocus?.skillIds || [];
    for (const state of nextSave.masteryStates) {
      const before = beforeMastery.get(`${state.targetType}:${state.targetId}`);
      const isFocused = (state.targetType === "grammar" && focusGrammar.includes(state.targetId)) ||
                        (state.targetType === "vocabulary" && focusVocab.includes(state.targetId)) ||
                        (state.targetType === "skill" && focusSkill.includes(state.targetId));
      if (before !== state.mastery || (isFocused && before === undefined)) {
        nextSave = eventBus.emit(nextSave, "MASTERY_UPDATED", { targetId: state.targetId, targetType: state.targetType, before, after: state.mastery });
      }
    }
    return nextSave;
  }
}
