import type { Scene } from "../../game/types/gameTypes";

export type GraphBranchDraftRequest = {
  sourceSceneId: string;
  branchPurpose: "review" | "failure recovery" | "optional side path" | "NPC dialogue" | "challenge";
  grammarIds?: string[];
  vocabularyIds?: string[];
  targetDifficulty?: "intro" | "practice" | "review" | "challenge";
  sceneCount?: number;
};

export type GraphBranchDraft = {
  sourceSceneId: string;
  scenes: Partial<Scene>[];
  warnings: string[];
  autoSaved: false;
};

export class GraphBranchDraftService {
  async generateBranchDraft(request: GraphBranchDraftRequest): Promise<GraphBranchDraft> {
    const count = Math.max(2, Math.min(5, request.sceneCount ?? 2));
    return {
      sourceSceneId: request.sourceSceneId,
      autoSaved: false,
      warnings: ["LLM branch draft endpoint hazir; otomatik graph degisikligi yapmaz. Provider entegrasyonu sonraki katmanda etkinlestirilecek."],
      scenes: Array.from({ length: count }, (_, index) => ({
        id: `${request.sourceSceneId}_${request.branchPurpose.replace(/\s+/g, "_").toLowerCase()}_${index + 1}`,
        title: `Draft ${request.branchPurpose} ${index + 1}`,
        inputMode: index === count - 1 ? "choice" : "text",
        choices: [],
        textChallenge: null,
        conditions: [],
        effects: [],
        rewards: [],
        onEnterEvents: [],
        learningFocus: { grammarIds: request.grammarIds ?? [], vocabularyIds: request.vocabularyIds ?? [], skillIds: [], difficulty: request.targetDifficulty ?? "practice" },
      })),
    };
  }

  validateBranchDraft(draft: GraphBranchDraft): { ok: boolean; errors: string[] } {
    const ids = draft.scenes.map((scene) => scene.id).filter(Boolean);
    return { ok: ids.length === new Set(ids).size && ids.length === draft.scenes.length, errors: ids.length === new Set(ids).size ? [] : ["Draft scene id listesinde tekrar var."] };
  }

  async applyBranchDraft(): Promise<never> {
    throw new Error("Branch draft apply requires explicit save integration and is disabled in Stage 14 read-only preview.");
  }
}
