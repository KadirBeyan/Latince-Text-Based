import type { LatinEvaluationResult } from "../../latin/LatinEvaluator";
import type { MasteryState, MasteryTargetType, PlayerSave, Scene } from "../types/gameTypes";

export class MasterySystem {
  recordExposure({ save, targets }: { save: PlayerSave; targets: Array<{ targetId: string; targetType: MasteryTargetType }> }): PlayerSave {
    return targets.reduce((current, target) => this.touch(current, target.targetId, target.targetType), save);
  }

  recordEvaluation({ save, evaluation, scene }: { save: PlayerSave; evaluation: LatinEvaluationResult; scene: Scene }): PlayerSave {
    if (!scene.learningFocus) return save;
    const targets = [
      ...scene.learningFocus.grammarIds.map(targetId => ({ targetId, targetType: "grammar" as const })),
      ...scene.learningFocus.vocabularyIds.map(targetId => ({ targetId, targetType: "vocabulary" as const })),
      ...scene.learningFocus.skillIds.map(targetId => ({ targetId, targetType: "skill" as const }))
    ];
    const amount = evaluation.isCorrect ? ({ exact: 14, similarity: 9, llm: 8, fallback: 5 }[evaluation.mode] ?? 12) : 0;
    return targets.reduce((current, target) => this.updateMastery({ save: current, ...target, isCorrect: evaluation.isCorrect, amount }), save);
  }

  updateMastery({ save, targetId, targetType, isCorrect, amount = 12 }: { save: PlayerSave; targetId: string; targetType: MasteryTargetType; isCorrect: boolean; amount?: number }): PlayerSave {
    const existing = this.getMastery({ save, targetId, targetType });
    const now = new Date().toISOString();
    const next: MasteryState = { targetId, targetType, seenCount: (existing?.seenCount ?? 0) + 1, correctCount: (existing?.correctCount ?? 0) + (isCorrect ? 1 : 0), wrongCount: (existing?.wrongCount ?? 0) + (isCorrect ? 0 : 1), mastery: Math.min(100, Math.max(0, (existing?.mastery ?? 0) + (isCorrect ? amount : 0))), lastSeenAt: now, lastReviewedAt: now, nextReviewAt: new Date(Date.now() + (isCorrect ? 3 : 1) * 86400000).toISOString() };
    return { ...save, masteryStates: [...save.masteryStates.filter(x => !(x.targetId === targetId && x.targetType === targetType)), next] };
  }

  getMastery({ save, targetId, targetType }: { save: PlayerSave; targetId: string; targetType: MasteryTargetType }): MasteryState | undefined { return save.masteryStates.find(x => x.targetId === targetId && x.targetType === targetType); }
  getWeakTargets(save: PlayerSave): MasteryState[] { return save.masteryStates.filter(x => x.seenCount > 0 && x.mastery < 50).sort((a,b) => a.mastery-b.mastery); }
  getStrongTargets(save: PlayerSave): MasteryState[] { return save.masteryStates.filter(x => x.mastery >= 75).sort((a,b) => b.mastery-a.mastery); }
  private touch(save: PlayerSave, targetId: string, targetType: MasteryTargetType): PlayerSave { const existing=this.getMastery({save,targetId,targetType}); const now=new Date().toISOString(); const next:MasteryState={targetId,targetType,seenCount:(existing?.seenCount??0)+1,correctCount:existing?.correctCount??0,wrongCount:existing?.wrongCount??0,mastery:existing?.mastery??0,lastSeenAt:now}; return {...save,masteryStates:[...save.masteryStates.filter(x=>!(x.targetId===targetId&&x.targetType===targetType)),next]}; }
}
