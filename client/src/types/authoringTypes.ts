import type { LlmProviderConfig, Scene } from "./gameTypes";

export type AuthoringContentKind = "campaign" | "chapter" | "quest" | "scene" | "npc" | "location" | "grammar" | "vocabulary" | "assessment-question" | "quest-template" | "village-activity" | "conversation";

export type AuthoringIssue = {
  id: string;
  severity: "error" | "warning" | "info";
  code: string;
  messageTr: string;
  path?: string;
  contentId?: string;
  kind?: AuthoringContentKind;
  fixSuggestionTr?: string;
  relatedIds?: string[];
};

export type AuthoringValidationResult = { ok: boolean; errors: AuthoringIssue[]; warnings: AuthoringIssue[]; info: AuthoringIssue[]; score: number };
export type AuthoringDocument = { id: string; kind: AuthoringContentKind; title: string; path: string; data: any; updatedAt?: string; validation?: AuthoringValidationResult; hasOverride?: boolean; overridePath?: string; sourcePath?: string };
export type ContentOverrideEntry = { relativePath: string; overridePath: string; sourcePath: string; updatedAt?: string; size?: number };
export type AuthoringTreeNode = { id: string; kind: AuthoringContentKind | "folder"; title: string; path?: string; children?: AuthoringTreeNode[]; issueCount?: number; warningCount?: number };
export type AuthoringSaveResult = { ok: boolean; document?: AuthoringDocument; validation: AuthoringValidationResult; backupPath?: string; savedTo?: "override" | "source"; path?: string; defaultPath?: string; overridePath?: string };
export type AuthoringReferenceOption = { id: string; label: string };
export type AuthoringReferences = {
  scenes: Array<AuthoringReferenceOption & { title: string; questId: string; chapterId: string }>;
  quests: Array<AuthoringReferenceOption & { title: string; chapterId: string }>;
  chapters: Array<AuthoringReferenceOption & { title: string; campaignId: string }>;
  npcs: Array<AuthoringReferenceOption & { name: string }>;
  locations: Array<AuthoringReferenceOption & { title: string }>;
  grammar: AuthoringReferenceOption[];
  vocabulary: AuthoringReferenceOption[];
  skills: AuthoringReferenceOption[];
};
export type LlmDraftKind = "scene" | "quest" | "npc" | "location" | "grammar-explanation" | "assessment-question" | "review-quest";
export type LlmDraftRequest = { kind: LlmDraftKind; chapterId?: string; questId?: string; locationId?: string; npcIds?: string[]; grammarIds?: string[]; vocabularyIds?: string[]; difficulty?: "intro" | "practice" | "review" | "challenge"; promptTr: string; constraints?: string[]; llmConfig?: LlmProviderConfig };
export type LlmDraftResult = { ok: boolean; kind: LlmDraftKind; generatedBy: "llm" | "fallback"; fallbackReason?: string; draft: unknown; sanitizedDraft?: any; validation: AuthoringValidationResult; latinGate?: unknown; warnings: string[] };
export type AuthoringMetrics = { totals: Record<string, number>; validationScore: number; errors: number; warnings: number; info: number; difficultyDistribution: Record<string, number>; chapterScores: Array<{ chapterId: string; title: string; score: number; errors: number; warnings: number }>; kindIssueCounts: Record<string, number>; topIssueCodes: Array<{ code: string; count: number }>; unusedVocabularyFocus: string[]; unrepresentedGrammarFocus: string[]; rawJsonFieldCount?: number; overrideContentCount?: number; previewSessionsActive?: number; validationFieldFocusSupport?: string; topFieldPaths?: Array<{ path: string; count: number }> };
export type AuthoringBackup = { path: string; sourceHint: string; createdAt: string; size: number };
export type ScenePreviewResult = { mode: "preview"; saveId: string | null; scene: Scene; renderedAt: string };
export type PreviewSessionResult = { previewId: string; mode: "preview"; state: any; save: any; source: { kind: "scene" | "quest" | "chapter"; id: string }; expiresAt: string; recentEvents: any[]; stateDiff: any; warnings: string[] };
