export type SceneGraphScope =
  | { type: "campaign"; campaignId: string }
  | { type: "chapter"; chapterId: string }
  | { type: "quest"; questId: string }
  | { type: "scene-neighborhood"; sceneId: string; depth: number };

export type SceneGraphNodeType = "chapter-start" | "quest-start" | "scene" | "choice-scene" | "text-challenge-scene" | "hybrid-scene" | "review-scene" | "completion-scene" | "dead-end" | "missing-scene";
export type SceneGraphEdgeType = "next" | "choice" | "success" | "failure" | "effect-go-to" | "quest-start" | "chapter-start" | "condition-locked" | "completion";
export type SceneGraphIssue = { id: string; severity: "error" | "warning" | "info"; code: "broken-link" | "unreachable-scene" | "dead-end" | "missing-success-path" | "missing-failure-path" | "chapter-cross-link" | "quest-cross-link" | "cycle-detected" | "missing-completion" | "invalid-condition" | "invalid-effect-target"; messageTr: string; sceneId?: string; edgeId?: string; targetId?: string };
export type SceneGraphNode = { id: string; sceneId?: string; type: SceneGraphNodeType; title: string; titleLatin?: string; subtitle?: string; chapterId?: string; questId?: string; locationId?: string; npcIds: string[]; inputMode?: "choice" | "text" | "hybrid" | "dialogue-response" | "hybrid-dialogue"; learningFocus?: { grammarIds: string[]; vocabularyIds: string[]; skillIds: string[] }; status: { reachable: boolean; hasErrors: boolean; hasWarnings: boolean; isStart: boolean; isCompletion: boolean; isDeadEnd: boolean; isMissing: boolean }; issueCounts: { errors: number; warnings: number; info: number }; position?: { x: number; y: number } };
export type SceneGraphEdge = { id: string; source: string; target: string; type: SceneGraphEdgeType; label?: string; sourceHandle?: string; targetHandle?: string; conditionSummary?: string; choiceId?: string; effectId?: string; status: { valid: boolean; hasCondition: boolean; isBroken: boolean }; issues: SceneGraphIssue[] };
export type SceneGraph = { scope: SceneGraphScope; nodes: SceneGraphNode[]; edges: SceneGraphEdge[]; issues: SceneGraphIssue[]; stats: { nodeCount: number; edgeCount: number; reachableCount: number; unreachableCount: number; deadEndCount: number; brokenLinkCount: number; cycleCount: number; completionPathCount: number } };
export type SceneGraphEditEdgeRequest = { sourceSceneId: string; edgeKind: "next" | "choice" | "success" | "failure" | "effect-go-to"; choiceId?: string; effectId?: string; newTargetSceneId: string };
export type SceneGraphBranchDraftRequest = { sourceSceneId: string; branchPurpose: "review" | "failure recovery" | "optional side path" | "NPC dialogue" | "challenge"; grammarIds?: string[]; vocabularyIds?: string[]; targetDifficulty?: "intro" | "practice" | "review" | "challenge"; sceneCount?: number };
