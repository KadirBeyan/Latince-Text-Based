export type ID = string;
export type ISODateString = string;

export type FlagValue = boolean | string | number;
export type QuestStatus = "not_started" | "active" | "completed" | "failed";

export interface InventoryStack {
  itemId: ID;
  quantity: number;
}

export interface PlayerSkill {
  skillId: ID;
  level: number;
  unlocked: boolean;
}

export type RpgSkillId =
  | "lingua"
  | "memoria"
  | "observatio"
  | "urbanitas"
  | "auctoritas"
  | "mercatura"
  | "disciplina"
  | "labor"
  | "scriptura"
  | "pietas";

export type CharacterOrigin =
  | "rural_family"
  | "trader_family"
  | "veteran_family"
  | "temple_family"
  | "scribe_family"
  | "unknown_origin";

export type CharacterTrait =
  | "curious"
  | "polite"
  | "bold"
  | "diligent"
  | "observant"
  | "practical"
  | "pious"
  | "restless";

export type LifePathId = "ludus" | "castra" | "mercatura" | "scriptura" | "templum" | "villa";

export type VillageTimeOfDay = "mane" | "meridies" | "vesper" | "nox";

export interface VillageDayState {
  dayNumber: number;
  timeOfDay: VillageTimeOfDay;
  actionsUsedThisPeriod: number;
  maxActionsPerPeriod: number;
  completedDailyActivityIds: string[];
  availableActivityIds: string[];
  dayFlags: Record<string, string | number | boolean>;
}

export interface VillageLifeState {
  dayState: VillageDayState;
  routineHistory: {
    dayNumber: number;
    activityIds: string[];
    notableNpcIds: string[];
    lifePathChanges: Record<string, number>;
    summaryTr: string;
  }[];
  availableActivities?: VillageActivity[];
  nearbyNpcs?: string[];
  ambientEvents?: VillageAmbientEvent[];
}

export interface VillageActivity {
  id: string;
  titleTr: string;
  descriptionTr: string;
  locationId: string;
  timeWindows: VillageTimeOfDay[];
  relatedNpcIds: string[];
  requiredConditions?: Condition[];
  suggestedSkills?: RpgSkillId[];
  lifePathHints?: Record<LifePathId, number>;
  sceneId: string;
  conversationFlowId?: string;
  repeatable: boolean;
  cooldownDays?: number;
  tags: string[];
}

export interface VillageAmbientEvent {
  id: string;
  titleTr: string;
  bodyTr: string;
  locationId?: string;
  timeWindows?: VillageTimeOfDay[];
  conditions?: Condition[];
  once: boolean;
  effects?: Effect[];
}

export interface CharacterProfile {
  name: string;
  displayName: string;
  origin: CharacterOrigin;
  traits: CharacterTrait[];
  skills: Record<RpgSkillId, number>;
  backgroundSummaryTr: string;
  createdAt: ISODateString;
  lifePathHints: Record<LifePathId, number>;
  knownPeople: string[];
  homeLocationId: string;
  currentLifePhase: "village_childhood" | "village_youth" | "path_selection" | "apprenticeship";
  skillProgress?: Record<RpgSkillId, number>;
}

export interface QuestState {
  questId: ID;
  status: QuestStatus;
  startedAt?: ISODateString;
  completedAt?: ISODateString;
  failedAt?: ISODateString;
}

export interface JournalEntry {
  id: ID;
  timestamp: ISODateString;
  title: string;
  body: string;
  sceneId?: ID;
  questId?: ID;
}

export interface DialogueEntry {
  id: ID;
  timestamp: ISODateString;
  speakerId: ID;
  text: string;
  language: "la" | "tr" | "en" | string;
  sceneId?: ID;
  translationTr?: string;
}

export interface GameEvent {
  id: ID;
  type: string;
  timestamp: ISODateString;
  payload: Record<string, unknown>;
}

export interface PlayerSave {
  schemaVersion: number;
  id: ID;
  playerName: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  currentCampaignId: ID;
  currentChapterId: ID;
  currentQuestId: ID;
  currentSceneId: ID;
  level: number;
  xp: number;
  currency: number;
  streak: PlayerStreak;
  masteryStates: MasteryState[];
  seenRewardEventIds: ID[];
  flags: Record<string, FlagValue>;
  inventory: InventoryStack[];
  skills: PlayerSkill[];
  questStates: Record<string, QuestState>;
  completedSceneIds: ID[];
  visitedSceneIds: ID[];
  journalEntries: JournalEntry[];
  dialogueLog: DialogueEntry[];
  eventLog: GameEvent[];
  errorMemory?: PlayerErrorMemory[];
  npcMemories: NpcMemory[];
  locationStates: LocationState[];
  worldEvents: WorldEvent[];
  activeSideQuestSuggestions: SideQuestSuggestion[];
  narrativeFlags: Record<string, FlagValue>;
  generatedQuests: GeneratedQuest[];
  assessmentProfile?: AssessmentProfile;
  assessmentAttempts: AssessmentAttempt[];
  learningPath?: LearningPath;
  achievements: AchievementState[];
  analyticsSnapshots: AnalyticsSnapshot[];
  chapterProgress?: Record<ID, ChapterProgress>;
  activeInteraction?: ActiveInteractionState;
  livingSceneStates?: Record<string, LivingSceneState>;
  characterProfile?: CharacterProfile;
  villageLife?: VillageLifeState;
  activeConversation?: ConversationRuntimeState;
}

export interface ChapterProgress {
  chapterId: ID;
  unlocked: boolean;
  completed: boolean;
  completedAt?: ISODateString;
  completedSceneIds: ID[];
  completedQuestIds: ID[];
  progressPercent: number;
}

export interface PlayerStreak { current: number; best: number; lastActiveDate?: string; }
export type MasteryTargetType = "grammar" | "vocabulary" | "skill";
export interface MasteryState { targetId: ID; targetType: MasteryTargetType; seenCount: number; correctCount: number; wrongCount: number; mastery: number; lastSeenAt?: ISODateString; lastReviewedAt?: ISODateString; nextReviewAt?: ISODateString; }
export interface RewardBundle { xp?: number; currency?: number; items?: InventoryStack[]; skillIncrements?: Array<{ skillId: ID; amount: number }>; masteryTargets?: Array<{ targetId: ID; targetType: MasteryTargetType; amount: number }>; }

export interface PlayerErrorMemory {
  tag: string;
  count: number;
  lastSeenAt: ISODateString;
  relatedSceneIds: ID[];
  relatedGrammarIds: ID[];
  relatedVocabularyIds: ID[];
}

export interface NpcMemory {
  npcId: ID;
  facts: NpcMemoryFact[];
  relationship: NpcRelationship;
  lastInteractionAt?: ISODateString;
}

export interface NpcMemoryFact {
  id: ID;
  text: string;
  importance: number; // 1-100
  createdAt: ISODateString;
  relatedQuestId?: ID;
  relatedSceneId?: ID;
  tags?: string[];
}

export interface NpcRelationship {
  trust: number;       // 0-100
  respect: number;     // 0-100
  familiarity: number; // 0-100
}

export interface LocationState {
  locationId: ID;
  discovered: boolean;
  visitCount: number;
  flags: Record<string, FlagValue>;
  mood?: "calm" | "busy" | "tense" | "festive" | "dangerous" | "scholarly";
  lastVisitedAt?: ISODateString;
}

export interface WorldEvent {
  id: ID;
  type: "rumor" | "news" | "location" | "npc" | "quest" | "system";
  title: string;
  text: string;
  createdAt: ISODateString;
  expiresAt?: ISODateString;
  relatedLocationId?: ID;
  relatedNpcId?: ID;
  relatedQuestId?: ID;
  importance: number;
  seen?: boolean;
}

export interface SideQuestSuggestion {
  id: ID;
  templateId: ID;
  title: string;
  reason: string;
  relatedGrammarIds: ID[];
  relatedVocabularyIds: ID[];
  relatedErrorTags: string[];
  suggestedLocationId?: ID;
  suggestedNpcId?: ID;
  /** @deprecated Use suggestedLocationId */
  locationId?: ID;
  /** @deprecated Use suggestedNpcId */
  npcId?: ID;
  difficulty: "intro" | "practice" | "review" | "challenge";
  createdAt: ISODateString;
  status: "suggested" | "accepted" | "dismissed" | "expired";
}

export interface SideQuestTemplate {
  id: ID;
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
  suggestedLocationId: ID;
  suggestedNpcId?: ID;
  difficulty: "intro" | "practice" | "review" | "challenge";
  learningFocus: {
    grammarIds: ID[];
    vocabularyIds: ID[];
    skillIds: ID[];
  };
  reasonTemplate: string;
}

export interface Campaign {
  id: ID;
  title: string;
  description: string;
  startChapterId: ID;
  chapters: Chapter[];
}

export interface Chapter {
  id: ID;
  title: string;
  description: string;
  startQuestId: ID;
  quests: Quest[];
}

export interface Quest {
  id: ID;
  title: string;
  description: string;
  startSceneId: ID;
  scenes: Scene[];
  rewards: Effect[];
  statusConditions: Condition[];
}

export interface Scene {
  id: ID;
  title: string;
  locationId: ID;
  npcIds: ID[];
  description: string;
  objective: string;
  inputMode: "choice" | "text" | "hybrid" | "dialogue-response" | "hybrid-dialogue";
  choices: SceneChoice[];
  textChallenge?: TextChallenge | null;
  dialogueChallenge?: DialogueResponseChallenge | null;
  hybridDialogue?: HybridDialogueConfig | null;
  conditions: Condition[];
  effects: Effect[];
  rewards: Effect[];
  onEnterEvents: GameEventTemplate[];
  successNextSceneId?: ID;
  failureNextSceneId?: ID;
  learningFocus?: LearningFocus;
  pedagogy?: Pedagogy;
  reviewTags?: string[];
  interactionModel?: SceneInteractionModel;
  dialogueSequence?: DialogueSequence;
  revisitVariants?: RevisitVariant[];
  allowCycle?: boolean;
  intentionalCycle?: boolean;
  loopPurpose?: string;
}

export interface LearningFocus {
  grammarIds: ID[];
  vocabularyIds: ID[];
  skillIds: ID[];
  difficulty: "intro" | "practice" | "review" | "challenge";
}

export interface Pedagogy {
  explanationBefore?: string;
  explanationAfter?: string;
  commonMistakes?: string[];
  hintLevels?: string[];
}

export interface SceneChoice {
  id: ID;
  label: string;
  description: string;
  conditions: Condition[];
  effects: Effect[];
  nextSceneId?: ID;
  allowCycle?: boolean;
  intentionalCycle?: boolean;
  loopPurpose?: string;
}

export interface TextChallenge {
  id: ID;
  prompt: string;
  expectedAnswers: string[];
  successEffects: Effect[];
  failureEffects: Effect[];
  successNextSceneId?: ID;
  failureNextSceneId?: ID;
  acceptedVariants?: string[];
  strictness?: "loose" | "normal" | "strict";
  evaluationMode?: "deterministic" | "llm-assisted" | "hybrid";
  allowCycle?: boolean;
  intentionalCycle?: boolean;
  loopPurpose?: string;
}

export type Condition =
  | { type: "HAS_ITEM"; itemId: ID; quantity?: number }
  | { type: "HAS_SKILL"; skillId: ID; minLevel?: number }
  | { type: "FLAG_EQUALS"; key: string; value: FlagValue }
  | { type: "QUEST_STATUS"; questId: ID; status: QuestStatus }
  | { type: "MIN_LEVEL"; level: number }
  | { type: "SCENE_VISITED"; sceneId: ID }
  | { type: "SCENE_COMPLETED"; sceneId: ID }
  | { type: "NPC_RELATION_MIN"; npcId: ID; field: "trust" | "respect" | "familiarity"; value: number }
  | { type: "NPC_MEMORY_HAS_TAG"; npcId: ID; tag: string }
  | { type: "LOCATION_DISCOVERED"; locationId: ID }
  | { type: "LOCATION_FLAG_EQUALS"; locationId: ID; key: string; value: FlagValue }
  | { type: "NARRATIVE_FLAG_EQUALS"; key: string; value: FlagValue }
  | { type: "SCENE_VISIT_COUNT_MIN"; sceneId: ID; count: number }
  | { type: "SCENE_LOCAL_FLAG_EQUALS"; sceneId: ID; key: string; value: FlagValue }
  | { type: "SCENE_INTENT_RESOLVED"; sceneId: ID; intentId: string }
  | { type: "SCENE_INSPECTED"; sceneId: ID; inspectId: string }
  | { type: "SCENE_LISTENED"; sceneId: ID; listenId: string }
  | { type: "SCENE_READ"; sceneId: ID; readId: string }
  | { type: "SCENE_CLUE_DISCOVERED"; sceneId: ID; clueId: string }
  | { type: "SCENE_VOCAB_DISCOVERED"; sceneId: ID; vocabularyId: string }
  | { type: "NPC_INTERACTION_COUNT_MIN"; npcId: ID; count: number }
  | { type: "RPG_SKILL_MIN"; payload: { skillId: RpgSkillId; value: number } }
  | { type: "VILLAGE_TIME_EQUALS"; timeOfDay: VillageTimeOfDay }
  | { type: "VILLAGE_DAY_MIN"; dayNumber: number }
  | { type: "VILLAGE_ACTIVITY_COMPLETED"; activityId: string }
  | { type: "VILLAGE_ACTIVITY_NOT_COMPLETED"; activityId: string }
  | { type: "VILLAGE_DAY_FLAG_EQUALS"; key: string; value: FlagValue }
  | { type: "VILLAGE_ACTIONS_AVAILABLE" }
  | { type: "LIFE_PATH_HINT_MIN"; path: LifePathId; value: number }
  | { type: "CHARACTER_TRAIT_HAS"; trait: CharacterTrait }
  | { type: "CHARACTER_ORIGIN_EQUALS"; origin: CharacterOrigin };

export type Effect =
  | { type: "ADD_XP"; amount: number }
  | { type: "ADD_CURRENCY"; amount: number }
  | { type: "REMOVE_CURRENCY"; amount: number }
  | { type: "APPLY_REWARD_BUNDLE"; reward: RewardBundle }
  | { type: "ADD_ITEM"; itemId: ID; quantity?: number }
  | { type: "REMOVE_ITEM"; itemId: ID; quantity?: number }
  | { type: "SET_FLAG"; key: string; value: FlagValue }
  | { type: "UNLOCK_SKILL"; skillId: ID }
  | { type: "INCREMENT_SKILL"; skillId: ID; amount?: number }
  | { type: "START_QUEST"; questId: ID }
  | { type: "COMPLETE_QUEST"; questId: ID }
  | { type: "FAIL_QUEST"; questId: ID }
  | { type: "ADD_JOURNAL_ENTRY"; title: string; body: string; sceneId?: ID; questId?: ID }
  | { type: "ADD_DIALOGUE_ENTRY"; speakerId: ID; text: string; language: string; sceneId?: ID }
  | { type: "MARK_SCENE_COMPLETED"; sceneId?: ID }
  | { type: "GO_TO_SCENE"; sceneId: ID }
  | { type: "ADD_NPC_MEMORY"; npcId: ID; text: string; importance?: number; tags?: string[] }
  | { type: "UPDATE_NPC_RELATIONSHIP"; npcId: ID; delta: Partial<NpcRelationship>; reason?: string }
  | { type: "DISCOVER_LOCATION"; locationId: ID }
  | { type: "SET_LOCATION_FLAG"; locationId: ID; key: string; value: FlagValue }
  | { type: "SET_LOCATION_MOOD"; locationId: ID; mood: "calm" | "busy" | "tense" | "festive" | "dangerous" | "scholarly" }
  | { type: "ADD_WORLD_EVENT"; event: Omit<WorldEvent, "id" | "createdAt"> }
  | { type: "SET_NARRATIVE_FLAG"; key: string; value: FlagValue }
  | { type: "UNLOCK_CHAPTER"; chapterId: ID }
  | { type: "COMPLETE_CHAPTER"; chapterId: ID }
  | { type: "SET_SCENE_LOCAL_FLAG"; sceneId: ID; key: string; value: FlagValue }
  | { type: "ADD_SCENE_CLUE"; sceneId: ID; clueId: string }
  | { type: "MARK_SCENE_INSPECTED"; sceneId: ID; inspectId: string; vocabularyIds?: string[]; grammarIds?: string[]; clueIds?: string[] }
  | { type: "MARK_SCENE_LISTENED"; sceneId: ID; listenId: string; vocabularyIds?: string[]; grammarIds?: string[]; clueIds?: string[] }
  | { type: "MARK_SCENE_READ"; sceneId: ID; readId: string; vocabularyIds?: string[]; grammarIds?: string[]; clueIds?: string[] }
  | { type: "ADD_SCENE_DISCOVERED_VOCAB"; sceneId: ID; vocabularyId: string }
  | { type: "ADD_SCENE_DISCOVERED_GRAMMAR"; sceneId: ID; grammarId: string }
  | { type: "INCREMENT_NPC_INTERACTION_COUNT"; npcId: ID }
  | { type: "INCREMENT_RPG_SKILL"; payload: { skillId: RpgSkillId; amount?: number } }
  | { type: "ADD_LIFE_PATH_HINT"; payload: { path: LifePathId; amount: number; reasonTr?: string } }
  | { type: "SET_LIFE_PHASE"; payload: { phase: CharacterProfile["currentLifePhase"] } }
  | { type: "ADVANCE_VILLAGE_TIME"; reasonTr?: string }
  | { type: "START_NEW_VILLAGE_DAY"; summaryTr?: string }
  | { type: "RECORD_VILLAGE_ACTIVITY"; payload: { activityId: string; npcIds?: string[]; lifePathChanges?: Record<string, number>; summaryTr: string } }
  | { type: "SET_VILLAGE_DAY_FLAG"; key: string; value: FlagValue }
  | { type: "ADD_DAILY_ACTIVITY"; activityId: string }
  | { type: "COMPLETE_DAILY_ACTIVITY"; activityId: string }
  | { type: "ADD_RPG_SKILL_PROGRESS"; payload: { skillId: RpgSkillId; amount: number; reasonTr?: string } };

export type GameAction =
  | { type: "CHOICE_SELECT"; choiceId: ID }
  | { type: "TEXT_SUBMIT"; text: string }
  | { type: "REQUEST_HINT" }
  | { type: "USE_ITEM"; itemId: ID }
  | { type: "START_QUEST"; questId: ID }
  | { type: "OPEN_JOURNAL" }
  | { type: "INTENT_SELECT"; saveId: string; sceneId: string; intentId: string }
  | { type: "START_CONVERSATION"; saveId: string; flowId: string; sceneId?: string }
  | { type: "CONVERSATION_OPTION_SELECT"; saveId: string; flowId: string; nodeId: string; optionId: string }
  | { type: "CONVERSATION_TEXT_SUBMIT"; saveId: string; flowId: string; nodeId: string; optionId: string; answer: string }
  | { type: "CONVERSATION_EXIT"; saveId: string; flowId: string }
  | { type: "FREEFORM_ACTION_SUBMIT"; saveId: string; sceneId?: string; flowId?: string; nodeId?: string; inputText: string };

export interface GameEventTemplate {
  type: string;
  payload: Record<string, unknown>;
}

export interface GameState {
  saveId: ID;
  player: {
    name: string;
    level: number;
    xp: number;
    currency: number;
    streak: PlayerStreak;
    characterProfile?: CharacterProfile;
  };
  currentCampaign: Campaign;
  currentChapter: Chapter;
  currentQuest: Quest;
  currentScene: Scene;
  availableChoices: SceneChoice[];
  inventory: InventoryStack[];
  skills: PlayerSkill[];
  journalEntries: JournalEntry[];
  dialogueLog: DialogueEntry[];
  recentEvents: GameEvent[];
  uiHints: string[];
  masteryStates: MasteryState[];
  reviewSuggestions: string[];
  npcMemories?: NpcMemory[];
  locationStates?: LocationState[];
  worldEvents?: WorldEvent[];
  sideQuestSuggestions?: SideQuestSuggestion[];
  narrativeFlags?: Record<string, FlagValue>;
  generatedQuests?: GeneratedQuest[];
  assessmentProfile?: AssessmentProfile;
  learningPath?: LearningPath;
  achievements?: AchievementState[];
  analyticsSummary?: Partial<LearningAnalyticsSummary>;
  chapterProgress?: Record<ID, ChapterProgress>;
  unlockedChapters?: ID[];
  activeInteraction?: ActiveInteractionState;
  livingScene?: ActiveLivingSceneView;
  villageLife?: VillageLifeState;
  activeConversation?: ConversationRuntimeState;
}

export interface SessionSummary { completedScenes: number; correctAnswers: number; wrongAnswers: number; xpGained: number; currencyGained: number; newSkills: string[]; newItems: string[]; improvedMastery: Array<{ targetId: string; targetType: MasteryTargetType; before?: number; after: number }>; weakTags: string[]; reviewSuggestions: string[]; }

export interface ValidationIssue {
  severity: "error" | "warning";
  code: string;
  path: string;
  message: string;
  refId?: string;
}

export interface ValidationResult {
  ok: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export interface GeneratedQuest {
  id: ID;
  sourceSuggestionId?: ID;
  sourceTemplateId?: ID;
  title: string;
  description: string;
  locationId: ID;
  npcIds: ID[];
  scenes: Scene[];
  status: "draft" | "active" | "completed" | "failed" | "dismissed" | "expired";
  difficulty: "intro" | "practice" | "review" | "challenge";
  learningFocus: {
    grammarIds: ID[];
    vocabularyIds: ID[];
    skillIds: ID[];
  };
  reason: string;
  createdAt: ISODateString;
  completedAt?: ISODateString;
  failedAt?: ISODateString;
  expiresAt?: ISODateString;
  validation: ValidationResult;
  metadata?: {
    generatedBy: "template" | "llm" | "hybrid";
    playerLevel?: number;
    relatedErrorTags?: string[];
    relatedMasteryTargets?: string[];
    returnContext?: {
      campaignId: ID;
      chapterId: ID;
      questId: ID;
      sceneId: ID;
    };
    relatedNpcRelationship?: {
      npcId: ID;
      trust?: number;
      respect?: number;
      familiarity?: number;
    };
  };
}

export interface QuestTemplate {
  id: ID;
  titleTemplate: string;
  descriptionTemplate: string;
  category: "chapter-review" | "npc-favor" | "location-rumor" | "grammar-remediation" | "vocabulary-practice" | "review" | "grammar-practice" | "npc-relationship" | "location-event";
  trigger: {
    weakGrammarIds?: ID[];
    weakVocabularyIds?: ID[];
    errorTags?: string[];
    minLevel?: number;
    maxLevel?: number;
    locationId?: ID;
    npcId?: ID;
    relationshipMin?: {
      npcId: ID;
      field: "trust" | "respect" | "familiarity";
      value: number;
    };
    worldEventTypes?: string[];
  };
  suggestedLocationId: ID;
  suggestedNpcId?: ID;
  difficulty: "intro" | "practice" | "review" | "challenge";
  learningFocus: {
    grammarIds: ID[];
    vocabularyIds: ID[];
    skillIds: ID[];
  };
  scenePlan: QuestScenePlan[];
  rewardProfile: "small" | "normal" | "review" | "challenge";
  reasonTemplate: string;
}

export interface QuestScenePlan {
  role: "intro" | "practice" | "challenge" | "resolution";
  inputMode: "choice" | "text" | "hybrid";
  objectiveTemplate: string;
  expectedAnswerTemplates?: string[];
  choiceTemplates?: {
    label: string;
    description?: string;
    correctness?: "neutral" | "good" | "bad";
  }[];
}

export interface QuestTemplateRenderContext {
  playerName: string;
  npcName?: string;
  locationName?: string;
  grammarLabels: string[];
  vocabularyLabels: string[];
  weakTags: string[];
}

export type AssessmentLevel = "A0" | "A1" | "A2" | "B1" | "B2" | "unknown";
export type AssessmentQuestionType = "multiple-choice" | "latin-input" | "translate-to-latin" | "translate-to-turkish" | "parse-word" | "fill-blank";
export type AssessmentDifficulty = "intro" | "practice" | "review" | "challenge";
export type AssessmentAttemptType = "placement" | "challenge" | "diagnostic" | "quick-check";

export interface AssessmentProfile {
  estimatedLevel: AssessmentLevel;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  grammarScores: Record<string, number>;
  vocabularyScores: Record<string, number>;
  skillScores: Record<string, number>;
  lastUpdatedAt: ISODateString;
  placementCompleted: boolean;
}

export interface AssessmentAttempt {
  id: ID;
  type: AssessmentAttemptType;
  title: string;
  startedAt: ISODateString;
  completedAt?: ISODateString;
  status: "in-progress" | "completed" | "abandoned";
  questions: AssessmentQuestion[];
  answers: AssessmentAnswer[];
  result?: AssessmentResult;
}

export interface AssessmentQuestion {
  id: ID;
  type: AssessmentQuestionType;
  promptTr: string;
  latinText?: string;
  choices?: string[];
  expectedAnswers?: string[];
  grammarIds: ID[];
  vocabularyIds: ID[];
  skillIds: ID[];
  difficulty: AssessmentDifficulty;
  level: Exclude<AssessmentLevel, "unknown">;
}

export interface AssessmentAnswer {
  questionId: ID;
  answerText?: string;
  selectedChoice?: string;
  isCorrect: boolean;
  score: number;
  feedbackTr: string;
  errorTags: string[];
  answeredAt: ISODateString;
  analysisSummary?: string;
}

export interface AssessmentResult {
  score: number;
  accuracy: number;
  estimatedLevel: AssessmentLevel;
  grammarBreakdown: Record<string, number>;
  vocabularyBreakdown: Record<string, number>;
  skillBreakdown: Record<string, number>;
  errorTagCounts: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface LearningPath {
  id: ID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  title: string;
  summaryTr: string;
  steps: LearningPathStep[];
}

export interface LearningPathStep {
  id: ID;
  type: "quest" | "generated-quest" | "exercise" | "review" | "challenge";
  title: string;
  reasonTr: string;
  priority: number;
  grammarIds: ID[];
  vocabularyIds: ID[];
  skillIds: ID[];
  status: "pending" | "active" | "completed" | "dismissed";
  targetId?: ID;
}

export interface AchievementState {
  id: ID;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: ISODateString;
  progress?: number;
  maxProgress?: number;
}

export interface AnalyticsSnapshot {
  id: ID;
  createdAt: ISODateString;
  range: "session" | "daily" | "weekly" | "all-time";
  summary: LearningAnalyticsSummary;
}

export interface LearningAnalyticsSummary {
  xpGained: number;
  currencyGained: number;
  completedScenes: number;
  completedQuests: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  mostPracticedGrammarIds: ID[];
  weakestGrammarIds: ID[];
  strongestGrammarIds: ID[];
  mostCommonErrorTags: Array<{ tag: string; count: number }>;
  masteryChanges: Array<{ targetId: ID; targetType: MasteryTargetType; before?: number; after: number }>;
}

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
  allowCycle?: boolean;
  intentionalCycle?: boolean;
  loopPurpose?: string;
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

export type ConversationRuntimeState = {
  flowId: string;
  currentNodeId: string;
  startedAt: string;
  visitedNodeIds: string[];
  selectedOptionId?: string;
  attempts: Record<string, number>;
  completed: boolean;
  currentNode?: any;
  options?: any[];
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
  sceneId: ID;
  visitCount: number;
  lastVisitedAt?: ISODateString;
  localFlags: Record<string, FlagValue>;
  resolvedIntentIds: string[];
  inspectedIds: string[];
  listenedIds: string[];
  readIds: string[];
  discoveredClueIds: string[];
  discoveredVocabularyIds: string[];
  discoveredGrammarIds: string[];
}

export interface RevisitVariant {
  id: ID;
  conditions: Condition[];
  descriptionOverride?: string;
  titleOverride?: string;
  choicesOverride?: SceneChoice[];
  effects?: Effect[];
}

export interface NpcMemoryReaction {
  npcId: ID;
  npcName: string;
  reactionType: "friendly" | "strict" | "amused" | "neutral" | string;
  text: string;
  referencedFactId?: ID;
}

export interface ActiveLivingSceneView {
  sceneId: ID;
  visitCount: number;
  isRevisit: boolean;
  activeVariantId?: ID;
  localFlags: Record<string, FlagValue>;
  inspectedIds: string[];
  listenedIds: string[];
  readIds: string[];
  discoveredClueIds: string[];
  discoveredVocabularyIds: string[];
  discoveredGrammarIds: string[];
  npcReactions: NpcMemoryReaction[];
  ambientActions: InteractionIntent[];
}
