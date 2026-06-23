import type { LatinDetectedError, LatinDifficultyResult } from "./latinTypes";

export type ID = string;

export type LlmProvider = "ollama" | "lmstudio" | "openai" | "custom";

export type LlmProviderConfig = {
  provider: LlmProvider;
  baseUrl: string;
  apiKey?: string;
  model: string;
  temperature?: number;
  timeoutMs?: number;
};

export type GameAction =
  | { type: "CHOICE_SELECT"; choiceId: string }
  | { type: "TEXT_SUBMIT"; text: string }
  | { type: "REQUEST_HINT" }
  | { type: "USE_ITEM"; itemId: string }
  | { type: "START_QUEST"; questId: string }
  | { type: "OPEN_JOURNAL" }
  | { type: "INTENT_SELECT"; saveId: string; sceneId: string; intentId: string };

export type SceneChoice = {
  id: string;
  label: string;
  description?: string;
  conditions?: Condition[];
  effects?: Effect[];
  nextSceneId?: string;
};

export type TextChallenge = {
  id: string;
  prompt: string;
  expectedAnswers?: string[];
  acceptedVariants?: string[];
  strictness?: "loose" | "normal" | "strict";
  evaluationMode?: "deterministic" | "llm-assisted" | "hybrid";
  successEffects?: Effect[];
  failureEffects?: Effect[];
  successNextSceneId?: string;
  failureNextSceneId?: string;
};

export type Scene = {
  id: string;
  title: string;
  locationId?: string;
  description: string;
  objective?: string;
  inputMode: "choice" | "text" | "hybrid" | "dialogue-response" | "hybrid-dialogue";
  choices?: SceneChoice[];
  textChallenge?: TextChallenge | null;
  dialogueChallenge?: DialogueResponseChallenge | null;
  hybridDialogue?: HybridDialogueConfig | null;
  npcIds?: string[];
  conditions?: Condition[];
  effects?: Effect[];
  rewards?: Effect[];
  onEnterEvents?: unknown[];
  learningFocus?: { grammarIds: string[]; vocabularyIds: string[]; skillIds: string[]; difficulty: "intro" | "practice" | "review" | "challenge" };
  pedagogy?: { explanationBefore?: string; explanationAfter?: string; commonMistakes?: string[]; hintLevels?: string[] };
  reviewTags?: string[];
  interactionModel?: SceneInteractionModel;
  dialogueSequence?: DialogueSequence;
  revisitVariants?: RevisitVariant[];
};

export type Campaign = {
  id: string;
  title: string;
  description?: string;
  startChapterId: string;
  chapters: Chapter[];
};

export type Chapter = {
  id: string;
  title: string;
  description?: string;
  startQuestId: string;
  quests: Quest[];
};

export type Quest = {
  id: string;
  title: string;
  description?: string;
  startSceneId: string;
  scenes: Scene[];
  rewards?: Effect[];
  statusConditions?: Condition[];
};

export type ValidationIssue = { severity: "error" | "warning"; code: string; message: string; path: string; refId?: string };
export type ValidationResult = { ok: boolean; errors: ValidationIssue[]; warnings: ValidationIssue[] };
export type GrammarTopic = { id: string; title: string; titleTr: string; level: string | number; explanation: string; examples: string[]; tags: string[] };
export type VocabularyItem = { id: string; latin: string; turkish: string; pos: string; gender: string | null; declension: string | null; principalParts: string[]; level: string | number; tags: string[]; examples: string[] };

export type InventoryStack = {
  itemId: string;
  quantity: number;
};

export type PlayerSkill = {
  skillId: string;
  level: number;
  unlocked?: boolean;
};

export type JournalEntry = {
  id?: string;
  title: string;
  text?: string;
  body?: string;
  createdAt?: string;
  timestamp?: string;
};

export type DialogueEntry = {
  id?: string;
  speakerId: string;
  text: string;
  language?: "tr" | "la" | "system" | "en" | string;
  timestamp?: string;
};

export type LatinEvaluation = {
  isCorrect: boolean;
  score: number;
  mode: "exact" | "similarity" | "llm" | "fallback" | string;
  feedbackTr: string;
  correctedLatin?: string;
  errorTags: string[];
  grammarNotes: string[];
  vocabularyNotes: string[];
  confidence: number;
  analysisSummary?: string;
  detectedErrors?: LatinDetectedError[];
  difficulty?: LatinDifficultyResult;
};

export type GameEvent = {
  id: string;
  type: string;
  timestamp?: string;
  payload?: Record<string, unknown>;
};

export type MasteryTargetType = "grammar" | "vocabulary" | "skill";

export type MasteryState = {
  targetId: string;
  targetType: MasteryTargetType;
  seenCount: number;
  correctCount: number;
  wrongCount: number;
  mastery: number;
  lastSeenAt?: string;
  lastReviewedAt?: string;
  nextReviewAt?: string;
};

export type SessionSummary = {
  completedScenes: number;
  correctAnswers: number;
  wrongAnswers: number;
  xpGained: number;
  currencyGained: number;
  newSkills: string[];
  newItems: string[];
  improvedMastery: Array<{
    targetId: string;
    targetType: MasteryTargetType;
    before?: number;
    after: number;
  }>;
  weakTags: string[];
  reviewSuggestions: string[];
};

export type RewardBundle = {
  xp?: number;
  currency?: number;
  items?: InventoryStack[];
  skillIncrements?: Array<{ skillId: string; amount: number }>;
  masteryTargets?: Array<{ targetId: string; targetType: MasteryTargetType; amount: number }>;
};

export type PlayerSummary = {
  id?: string;
  playerName?: string;
  name?: string;
  level: number;
  xp: number;
  currency?: number;
  streak?: {
    current: number;
    best: number;
    lastActiveDate?: string;
  };
};

export interface NpcMemory {
  npcId: string;
  facts: NpcMemoryFact[];
  relationship: NpcRelationship;
  lastInteractionAt?: string;
}

export interface NpcMemoryFact {
  id: string;
  text: string;
  importance: number; // 1-100
  createdAt: string;
  relatedQuestId?: string;
  relatedSceneId?: string;
  tags?: string[];
}

export interface NpcRelationship {
  trust: number;       // 0-100
  respect: number;     // 0-100
  familiarity: number; // 0-100
}

export interface LocationState {
  locationId: string;
  discovered: boolean;
  visitCount: number;
  flags: Record<string, boolean | string | number>;
  mood?: "calm" | "busy" | "tense" | "festive" | "dangerous" | "scholarly";
  lastVisitedAt?: string;
}

export interface WorldEvent {
  id: string;
  type: "rumor" | "news" | "location" | "npc" | "quest" | "system";
  title: string;
  text: string;
  createdAt: string;
  expiresAt?: string;
  relatedLocationId?: string;
  relatedNpcId?: string;
  relatedQuestId?: string;
  importance: number;
  seen?: boolean;
}

export interface ChapterProgress {
  chapterId: string;
  unlocked: boolean;
  completed: boolean;
  completedAt?: string;
  completedSceneIds: string[];
  completedQuestIds: string[];
  progressPercent: number;
}

export interface SideQuestSuggestion {
  id: string;
  templateId: string;
  title: string;
  reason: string;
  relatedGrammarIds: string[];
  relatedVocabularyIds: string[];
  relatedErrorTags: string[];
  suggestedLocationId?: string;
  suggestedNpcId?: string;
  difficulty: "intro" | "practice" | "review" | "challenge";
  createdAt: string;
  status: "suggested" | "accepted" | "dismissed" | "expired";
}

export interface SideQuestTemplate {
  id: string;
  title: string;
  description: string;
  trigger: {
    weakGrammarIds?: string[];
    weakVocabularyIds?: string[];
    errorTags?: string[];
    minLevel?: number;
    locationId?: string;
    npcId?: string;
  };
  suggestedLocationId: string;
  suggestedNpcId?: string;
  difficulty: "intro" | "practice" | "review" | "challenge";
  learningFocus: {
    grammarIds: string[];
    vocabularyIds: string[];
    skillIds: string[];
  };
  reasonTemplate: string;
}

export type Condition =
  | { type: "HAS_ITEM"; itemId: string; quantity?: number }
  | { type: "HAS_SKILL"; skillId: string; minLevel?: number }
  | { type: "FLAG_EQUALS"; key: string; value: boolean | string | number }
  | { type: "QUEST_STATUS"; questId: string; status: string }
  | { type: "MIN_LEVEL"; level: number }
  | { type: "SCENE_VISITED"; sceneId: string }
  | { type: "SCENE_COMPLETED"; sceneId: string }
  | { type: "NPC_RELATION_MIN"; npcId: string; field: "trust" | "respect" | "familiarity"; value: number }
  | { type: "NPC_MEMORY_HAS_TAG"; npcId: string; tag: string }
  | { type: "LOCATION_DISCOVERED"; locationId: string }
  | { type: "LOCATION_FLAG_EQUALS"; locationId: string; key: string; value: boolean | string | number }
  | { type: "NARRATIVE_FLAG_EQUALS"; key: string; value: boolean | string | number }
  | { type: "SCENE_VISIT_COUNT_MIN"; sceneId: string; count: number }
  | { type: "SCENE_LOCAL_FLAG_EQUALS"; sceneId: string; key: string; value: boolean | string | number }
  | { type: "SCENE_INTENT_RESOLVED"; sceneId: string; intentId: string }
  | { type: "SCENE_INSPECTED"; sceneId: string; inspectId: string }
  | { type: "SCENE_LISTENED"; sceneId: string; listenId: string }
  | { type: "SCENE_READ"; sceneId: string; readId: string }
  | { type: "SCENE_CLUE_DISCOVERED"; sceneId: string; clueId: string }
  | { type: "SCENE_VOCAB_DISCOVERED"; sceneId: string; vocabularyId: string }
  | { type: "NPC_INTERACTION_COUNT_MIN"; npcId: string; count: number };

export type Effect =
  | { type: "ADD_XP"; amount: number }
  | { type: "ADD_CURRENCY"; amount: number }
  | { type: "REMOVE_CURRENCY"; amount: number }
  | { type: "APPLY_REWARD_BUNDLE"; reward: RewardBundle }
  | { type: "ADD_ITEM"; itemId: string; quantity?: number }
  | { type: "REMOVE_ITEM"; itemId: string; quantity?: number }
  | { type: "SET_FLAG"; key: string; value: boolean | string | number }
  | { type: "UNLOCK_SKILL"; skillId: string }
  | { type: "INCREMENT_SKILL"; skillId: string; amount?: number }
  | { type: "START_QUEST"; questId: string }
  | { type: "COMPLETE_QUEST"; questId: string }
  | { type: "FAIL_QUEST"; questId: string }
  | { type: "ADD_JOURNAL_ENTRY"; title: string; body: string; sceneId?: string; questId?: string }
  | { type: "ADD_DIALOGUE_ENTRY"; speakerId: string; text: string; language: string; sceneId?: string }
  | { type: "MARK_SCENE_COMPLETED"; sceneId?: string }
  | { type: "GO_TO_SCENE"; sceneId: string }
  | { type: "ADD_NPC_MEMORY"; npcId: string; text: string; importance?: number; tags?: string[] }
  | { type: "UPDATE_NPC_RELATIONSHIP"; npcId: string; delta: Partial<NpcRelationship>; reason?: string }
  | { type: "DISCOVER_LOCATION"; locationId: string }
  | { type: "SET_LOCATION_FLAG"; locationId: string; key: string; value: boolean | string | number }
  | { type: "SET_LOCATION_MOOD"; locationId: string; mood: "calm" | "busy" | "tense" | "festive" | "dangerous" | "scholarly" }
  | { type: "ADD_WORLD_EVENT"; event: Omit<WorldEvent, "id" | "createdAt"> }
  | { type: "SET_NARRATIVE_FLAG"; key: string; value: boolean | string | number }
  | { type: "UNLOCK_CHAPTER"; chapterId: string }
  | { type: "COMPLETE_CHAPTER"; chapterId: string }
  | { type: "SET_SCENE_LOCAL_FLAG"; sceneId: string; key: string; value: boolean | string | number }
  | { type: "ADD_SCENE_CLUE"; sceneId: string; clueId: string }
  | { type: "MARK_SCENE_INSPECTED"; sceneId: string; inspectId: string; vocabularyIds?: string[]; grammarIds?: string[]; clueIds?: string[] }
  | { type: "MARK_SCENE_LISTENED"; sceneId: string; listenId: string; vocabularyIds?: string[]; grammarIds?: string[]; clueIds?: string[] }
  | { type: "MARK_SCENE_READ"; sceneId: string; readId: string; vocabularyIds?: string[]; grammarIds?: string[]; clueIds?: string[] }
  | { type: "ADD_SCENE_DISCOVERED_VOCAB"; sceneId: string; vocabularyId: string }
  | { type: "ADD_SCENE_DISCOVERED_GRAMMAR"; sceneId: string; grammarId: string }
  | { type: "INCREMENT_NPC_INTERACTION_COUNT"; npcId: string };

export type GameState = {
  saveId: string;
  player?: PlayerSummary;
  currentCampaign?: Campaign;
  currentChapter?: Chapter;
  currentQuest?: Quest;
  currentScene: Scene;
  availableChoices: SceneChoice[];
  inventory: InventoryStack[];
  skills: PlayerSkill[];
  journalEntries: JournalEntry[];
  dialogueLog: DialogueEntry[];
  recentEvents: GameEvent[];
  uiHints?: string[];
  masteryStates?: MasteryState[];
  reviewSuggestions?: string[];
  npcMemories?: NpcMemory[];
  locationStates?: LocationState[];
  worldEvents?: WorldEvent[];
  sideQuestSuggestions?: SideQuestSuggestion[];
  narrativeFlags?: Record<string, boolean | string | number>;
  generatedQuests?: GeneratedQuest[];
  assessmentProfile?: AssessmentProfile;
  learningPath?: LearningPath;
  achievements?: AchievementState[];
  analyticsSummary?: Partial<LearningAnalyticsSummary>;
  chapterProgress?: Record<string, ChapterProgress>;
  unlockedChapters?: string[];
  activeInteraction?: ActiveInteractionState;
  livingScene?: ActiveLivingSceneView;
};

export type SaveSummary = {
  id: string;
  playerName: string;
  level?: number;
  xp?: number;
  updatedAt?: string;
};

export type NarrationResult = {
  narrationTr: string;
  npcLineLatin?: string;
  npcLineTr?: string;
  objectiveReminderTr?: string;
  mode: "llm" | "fallback";
  worldMoodTr?: string;
};

export type HintResult = {
  hintTr: string;
  miniExampleLatin?: string;
  miniExampleTr?: string;
  mode?: "llm" | "fallback";
};

export function isLatinEvaluation(value: unknown): value is LatinEvaluation {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value as Partial<LatinEvaluation>;
  return typeof candidate.isCorrect === "boolean" && typeof candidate.score === "number" && typeof candidate.feedbackTr === "string";
}

export type GeneratedQuest = {
  id: string;
  sourceSuggestionId?: string;
  sourceTemplateId?: string;
  title: string;
  description: string;
  locationId: string;
  npcIds: string[];
  scenes: Scene[];
  status: "draft" | "active" | "completed" | "failed" | "dismissed" | "expired";
  difficulty: "intro" | "practice" | "review" | "challenge";
  learningFocus: {
    grammarIds: string[];
    vocabularyIds: string[];
    skillIds: string[];
  };
  reason: string;
  createdAt: string;
  expiresAt?: string;
  validation: ValidationResult;
  metadata?: {
    generatedBy: "template" | "llm" | "hybrid";
    playerLevel?: number;
    relatedErrorTags?: string[];
    relatedMasteryTargets?: string[];
    relatedNpcRelationship?: {
      npcId: string;
      trust?: number;
      respect?: number;
      familiarity?: number;
    };
  };
};

export type QuestTemplate = {
  id: string;
  titleTemplate: string;
  descriptionTemplate: string;
  category: "chapter-review" | "npc-favor" | "location-rumor" | "grammar-remediation" | "vocabulary-practice" | "review" | "grammar-practice" | "npc-relationship" | "location-event";
  trigger: {
    weakGrammarIds?: string[];
    weakVocabularyIds?: string[];
    errorTags?: string[];
    minLevel?: number;
    maxLevel?: number;
    locationId?: string;
    npcId?: string;
    relationshipMin?: {
      npcId: string;
      field: "trust" | "respect" | "familiarity";
      value: number;
    };
    worldEventTypes?: string[];
  };
  suggestedLocationId: string;
  suggestedNpcId?: string;
  difficulty: "intro" | "practice" | "review" | "challenge";
  learningFocus: {
    grammarIds: string[];
    vocabularyIds: string[];
    skillIds: string[];
  };
  scenePlan: QuestScenePlan[];
  rewardProfile: "small" | "normal" | "review" | "challenge";
  reasonTemplate: string;
};

export type QuestScenePlan = {
  role: "intro" | "practice" | "challenge" | "resolution";
  inputMode: "choice" | "text" | "hybrid";
  objectiveTemplate: string;
  expectedAnswerTemplates?: string[];
  choiceTemplates?: {
    label: string;
    description?: string;
    correctness?: "neutral" | "good" | "bad";
  }[];
};

export type QuestTemplateRenderContext = {
  playerName: string;
  npcName?: string;
  locationName?: string;
  grammarLabels: string[];
  vocabularyLabels: string[];
  weakTags: string[];
};


export type AssessmentLevel = "A0" | "A1" | "A2" | "B1" | "B2" | "unknown";
export type AssessmentQuestionType = "multiple-choice" | "latin-input" | "translate-to-latin" | "translate-to-turkish" | "parse-word" | "fill-blank";
export type AssessmentAttemptType = "placement" | "challenge" | "diagnostic" | "quick-check";
export type AssessmentDifficulty = "intro" | "practice" | "review" | "challenge";
export type AssessmentProfile = { estimatedLevel: AssessmentLevel; confidence: number; strengths: string[]; weaknesses: string[]; grammarScores: Record<string, number>; vocabularyScores: Record<string, number>; skillScores: Record<string, number>; lastUpdatedAt: string; placementCompleted: boolean };
export type AssessmentQuestion = { id: string; type: AssessmentQuestionType; promptTr: string; latinText?: string; choices?: string[]; expectedAnswers?: string[]; grammarIds: string[]; vocabularyIds: string[]; skillIds: string[]; difficulty: AssessmentDifficulty; level: Exclude<AssessmentLevel, "unknown"> };
export type AssessmentAnswer = { questionId: string; answerText?: string; selectedChoice?: string; isCorrect: boolean; score: number; feedbackTr: string; errorTags: string[]; answeredAt: string; analysisSummary?: string };
export type AssessmentResult = { score: number; accuracy: number; estimatedLevel: AssessmentLevel; grammarBreakdown: Record<string, number>; vocabularyBreakdown: Record<string, number>; skillBreakdown: Record<string, number>; errorTagCounts: Record<string, number>; strengths: string[]; weaknesses: string[]; recommendations: string[] };
export type AssessmentAttempt = { id: string; type: AssessmentAttemptType; title: string; startedAt: string; completedAt?: string; status: "in-progress" | "completed" | "abandoned"; questions: AssessmentQuestion[]; answers: AssessmentAnswer[]; result?: AssessmentResult };
export type LearningPathStep = { id: string; type: "quest" | "generated-quest" | "exercise" | "review" | "challenge"; title: string; reasonTr: string; priority: number; grammarIds: string[]; vocabularyIds: string[]; skillIds: string[]; status: "pending" | "active" | "completed" | "dismissed"; targetId?: string };
export type LearningPath = { id: string; createdAt: string; updatedAt: string; title: string; summaryTr: string; steps: LearningPathStep[] };
export type AchievementState = { id: string; title: string; description: string; unlocked: boolean; unlockedAt?: string; progress?: number; maxProgress?: number };
export type LearningAnalyticsSummary = { xpGained: number; currencyGained: number; completedScenes: number; completedQuests: number; correctAnswers: number; wrongAnswers: number; accuracy: number; mostPracticedGrammarIds: string[]; weakestGrammarIds: string[]; strongestGrammarIds: string[]; mostCommonErrorTags: Array<{ tag: string; count: number }>; masteryChanges: Array<{ targetId: string; targetType: MasteryTargetType; before?: number; after: number }> };
export type AnalyticsSnapshot = { id: string; createdAt: string; range: "session" | "daily" | "weekly" | "all-time"; summary: LearningAnalyticsSummary };

export type DialogueReaction = {
  npcLineLatin?: string;
  npcLineTr?: string;
  feedbackTr?: string;
  hintTr?: string;
};

export type DialogueResponseChallenge = {
  mode: "dialogue-response";
  speakerNpcId?: string;
  npcPromptLatin?: string;
  npcPromptTr?: string;
  playerIntentTr: string;
  targetMeaningTr: string;
  canonicalAnswers: string[];
  acceptedVariants?: string[];
  rejectedMeanings?: {
    meaningTr: string;
    exampleLatin?: string;
    reasonTr: string;
  }[];
  grammarFocusIds?: string[];
  vocabularyFocusIds?: string[];
  expectedLevel?: "A0" | "A1" | "A2" | "B1" | "B2";
  evaluation?: {
    allowEquivalentMeaning: boolean;
    allowWordOrderVariation: boolean;
    requireContextMatch: boolean;
    useLlmSemanticJudge: boolean;
    minimumConfidence: number;
    allowAdvancedCorrectAnswer?: boolean;
  };
  reactions?: {
    correct?: DialogueReaction;
    equivalentCorrect?: DialogueReaction;
    acceptableVariant?: DialogueReaction;
    nearMiss?: DialogueReaction;
    wrong?: DialogueReaction;
    contextWrong?: DialogueReaction;
  };
  retryAllowed?: boolean;
  maxAttempts?: number;
  successNextSceneId?: string;
  failureNextSceneId?: string;
  successEffects?: Effect[];
  failureEffects?: Effect[];
};

export type HybridDialogueConfig = {
  speakerNpcId?: string;
  npcPromptLatin?: string;
  npcPromptTr?: string;
  intents: DialogueIntent[];
};

export type DialogueIntent = {
  id: string;
  labelTr: string;
  targetMeaningTr: string;
  canonicalAnswers: string[];
  grammarFocusIds?: string[];
  vocabularyFocusIds?: string[];
};

export type LatinResponseVerdict =
  | "exact_correct"
  | "equivalent_correct"
  | "acceptable_variant"
  | "near_miss"
  | "context_wrong"
  | "grammar_wrong"
  | "meaning_wrong"
  | "wrong";

export type DialogueEvaluationResult = {
  verdict: LatinResponseVerdict;
  acceptedAsCorrect: boolean;
  confidence: number;
  meaningMatches: boolean;
  grammarOk: boolean;
  contextOk: boolean;
  levelAppropriate: boolean;
  normalizedAnswer: string;
  matchedCanonicalAnswer?: string;
  matchedVariant?: string;
  detectedMeaningTr?: string;
  targetMeaningTr: string;
  errors: {
    code: string;
    messageTr: string;
    severity: "info" | "warning" | "error";
    span?: string;
  }[];
  feedbackTr: string;
  grammarNoteTr?: string;
  vocabularyNoteTr?: string;
  contextNoteTr?: string;
  npcReaction?: DialogueReaction;
  debug?: {
    source: "exact" | "variant" | "morphology" | "llm" | "fallback";
    rawLlm?: unknown;
  };
};

export type InteractionVerb =
  | "speak"
  | "ask"
  | "inspect"
  | "listen"
  | "wait"
  | "approach"
  | "leave"
  | "persuade"
  | "bargain"
  | "remember"
  | "read"
  | "offer"
  | "take"
  | "give"
  | "follow"
  | "challenge"
  | "apologize"
  | "thank"
  | "custom";

export type InteractionTone =
  | "neutral"
  | "polite"
  | "bold"
  | "curious"
  | "cautious"
  | "friendly"
  | "formal"
  | "rude"
  | "secretive";

export type ConsequencePresentation = {
  id: string;
  kind:
    | "relationship"
    | "memory"
    | "location"
    | "world"
    | "quest"
    | "reward"
    | "knowledge"
    | "unlock"
    | "latin";
  titleTr: string;
  bodyTr?: string;
  valueTr?: string;
  tone: "success" | "warning" | "danger" | "gold" | "muted";
  hidden?: boolean;
};

export type InteractionResolution = {
  resultNarrationTr?: string;
  resultNarrationLatin?: string;
  revealedTextTr?: string;
  revealedLatin?: string;
  npcReactionLatin?: string;
  npcReactionTr?: string;
  consequences?: ConsequencePresentation[];
};

export type FailureBranch = {
  verdict:
    | "near_miss"
    | "context_wrong"
    | "grammar_wrong"
    | "meaning_wrong"
    | "wrong";
  npcReactionLatin?: string;
  npcReactionTr?: string;
  narrationTr?: string;
  options?: InteractionIntent[];
  nextSceneId?: string;
  retryAllowed?: boolean;
};

export type InteractionIntent = {
  id: string;
  labelTr: string;
  descriptionTr?: string;

  verb: InteractionVerb;
  tone?: InteractionTone;

  requiresLatin: boolean;

  speakerNpcId?: string;
  targetNpcId?: string;

  targetMeaningTr?: string;
  playerIntentTr?: string;

  canonicalAnswers?: string[];
  acceptedVariants?: string[];
  rejectedMeanings?: {
    meaningTr: string;
    exampleLatin?: string;
    reasonTr: string;
  }[];

  grammarFocusIds?: string[];
  vocabularyFocusIds?: string[];
  skillFocusIds?: string[];

  conditions?: Condition[];
  effects?: Effect[];

  successNextSceneId?: string;
  failureNextSceneId?: string;
  nextSceneId?: string;

  previewConsequenceTr?: string;
  hiddenConsequence?: boolean;

  failureBehavior?: "retry" | "branch" | "soft-fail" | "continue";

  responseReactions?: {
    correct?: DialogueReaction;
    equivalentCorrect?: DialogueReaction;
    acceptableVariant?: DialogueReaction;
    nearMiss?: DialogueReaction;
    wrong?: DialogueReaction;
    contextWrong?: DialogueReaction;
  };

  resolution?: InteractionResolution;
  failureBranches?: FailureBranch[];
};

export type SceneInteractionModel = {
  mode: "interaction-loop";

  openingNarrationTr?: string;
  openingNarrationLatin?: string;

  activeNpcId?: string;
  npcLineLatin?: string;
  npcLineTr?: string;

  intents: InteractionIntent[];

  defaultIntentId?: string;

  afterIntentResolution?: {
    showConsequences: boolean;
    showNextActions: boolean;
    autoContinueOnSuccess?: boolean;
  };
};

export type ActiveInteractionState = {
  sceneId: string;
  selectedIntentId?: string;
  selectedAt?: string;
  attempts: Record<string, number>;
  resolvedIntentIds: string[];
  activeTurnIndex?: number;
  tempOptions?: InteractionIntent[];
};

export type DialogueSequenceTurn = {
  id: string;
  speakerNpcId: string;
  npcLineLatin?: string;
  npcLineTr?: string;
  intents: InteractionIntent[];
  requiredIntentId?: string;
  completionCondition?: Condition[];
};

export type DialogueSequence = {
  id: string;
  activeTurnIndex?: number;
  turns: DialogueSequenceTurn[];
  completionEffects?: Effect[];
  completionNextSceneId?: string;
};

export interface LivingSceneState {
  sceneId: string;
  visitCount: number;
  lastVisitedAt?: string;
  localFlags: Record<string, boolean | string | number>;
  resolvedIntentIds: string[];
  inspectedIds: string[];
  listenedIds: string[];
  readIds: string[];
  discoveredClueIds: string[];
  discoveredVocabularyIds: string[];
  discoveredGrammarIds: string[];
}

export interface RevisitVariant {
  id: string;
  conditions: Condition[];
  descriptionOverride?: string;
  titleOverride?: string;
  choicesOverride?: SceneChoice[];
  effects?: Effect[];
}

export interface NpcMemoryReaction {
  npcId: string;
  npcName: string;
  reactionType: "friendly" | "strict" | "amused" | "neutral" | string;
  text: string;
  referencedFactId?: string;
}

export interface ActiveLivingSceneView {
  sceneId: string;
  visitCount: number;
  isRevisit: boolean;
  activeVariantId?: string;
  localFlags: Record<string, boolean | string | number>;
  inspectedIds: string[];
  listenedIds: string[];
  readIds: string[];
  discoveredClueIds: string[];
  discoveredVocabularyIds: string[];
  discoveredGrammarIds: string[];
  npcReactions: NpcMemoryReaction[];
  ambientActions: InteractionIntent[];
}

