import type { GeneratedQuest, Scene, ValidationIssue, ValidationResult, ID, Effect } from "../types/gameTypes";
import type { LoadedContent } from "../types/contentTypes";
import type { ContentLoader } from "./ContentLoader";
import { analyzeSentence } from "../../latin/LatinSentenceAnalyzer";
import { checkTextAgainstLevel } from "../../latin/LatinGrammarGatekeeper";

type LatinValidationOptions = { contentLoader?: ContentLoader; playerLevel?: number; allowedGrammarIds?: string[]; knownVocabularyIds?: string[]; maxSentenceLength?: number };

export class GeneratedContentValidator {
  private static pushIssue(
    issues: ValidationIssue[],
    severity: "error" | "warning",
    code: string,
    path: string,
    message: string,
    refId?: string
  ) {
    issues.push({ severity, code, path, message, refId });
  }

  static validateGeneratedQuest(quest: GeneratedQuest, content: LoadedContent, existingQuestIds: ID[] = [], latinOptions: LatinValidationOptions = {}): ValidationResult {
    const issues: ValidationIssue[] = [];

    // 1. Basic properties
    if (!quest.id) {
      this.pushIssue(issues, "error", "MISSING_QUEST_ID", "id", "Quest is missing an ID.");
    } else if (!quest.id.startsWith("gen_quest_")) {
      this.pushIssue(issues, "error", "INVALID_QUEST_ID", "id", `Quest ID '${quest.id}' must start with 'gen_quest_'.`);
    } else if (existingQuestIds.includes(quest.id)) {
      this.pushIssue(issues, "error", "DUPLICATE_QUEST_ID", "id", `Quest ID '${quest.id}' already exists.`);
    }

    if (!quest.title || !quest.title.trim()) {
      this.pushIssue(issues, "error", "MISSING_TITLE", "title", "Quest is missing a title.");
    }

    if (!quest.scenes || !Array.isArray(quest.scenes)) {
      this.pushIssue(issues, "error", "MISSING_SCENES", "scenes", "Quest is missing scenes list.");
      return { ok: false, errors: issues, warnings: [] };
    }

    const sceneCount = quest.scenes.length;
    if (sceneCount < 2) {
      this.pushIssue(issues, "error", "TOO_FEW_SCENES", "scenes", `Quest must have at least 2 scenes (has ${sceneCount}).`);
    }
    if (sceneCount > 6) {
      this.pushIssue(issues, "error", "TOO_MANY_SCENES", "scenes", `Quest must have at most 6 scenes (has ${sceneCount}).`);
    }

    // Reference checking sets
    const itemIds = new Set(content.items.map(i => i.id));
    const skillIds = new Set(content.skills.map(i => i.id));
    const npcIds = new Set(content.npcs.map(i => i.id));
    const grammarIds = new Set(content.grammar.map(i => i.id));
    const vocabularyIds = new Set(content.vocabulary.map(i => i.id));
    
    // Extracted locations
    const locationIds = new Set<ID>([
      "home_hut",
      "village_path",
      "field_edge",
      "village_market",
      "teacher_corner",
      "veteran_bench",
      "scribe_table",
      "shrine"
    ]);
    for (const campaign of content.campaigns) {
      for (const chapter of campaign.chapters) {
        for (const q of chapter.quests) {
          for (const s of q.scenes) {
            if (s.locationId) locationIds.add(s.locationId);
          }
        }
      }
    }

    const sceneIds = new Set(quest.scenes.map(s => s.id));
    const refs = { itemIds, skillIds, npcIds, grammarIds, vocabularyIds, locationIds, sceneIds };

    if (!quest.locationId || !locationIds.has(quest.locationId)) this.pushIssue(issues, "error", "UNKNOWN_LOCATION", "locationId", `Unknown locationId '${quest.locationId}'.`, quest.locationId);
    for (const npcId of quest.npcIds || []) if (!npcIds.has(npcId)) this.pushIssue(issues, "error", "UNKNOWN_NPC", "npcIds", `Unknown npcId '${npcId}'.`, npcId);
    for (const id of quest.learningFocus?.grammarIds || []) if (!grammarIds.has(id)) this.pushIssue(issues, "error", "UNKNOWN_GRAMMAR", "learningFocus.grammarIds", `Unknown grammarId '${id}'.`, id);
    for (const id of quest.learningFocus?.vocabularyIds || []) if (!vocabularyIds.has(id)) this.pushIssue(issues, "error", "UNKNOWN_VOCABULARY", "learningFocus.vocabularyIds", `Unknown vocabularyId '${id}'.`, id);
    for (const id of quest.learningFocus?.skillIds || []) if (!skillIds.has(id)) this.pushIssue(issues, "error", "UNKNOWN_SKILL", "learningFocus.skillIds", `Unknown skillId '${id}'.`, id);

    if (sceneIds.size !== quest.scenes.length) this.pushIssue(issues, "error", "DUPLICATE_SCENE_ID", "scenes", "Generated quest scene IDs must be unique.");
    
    // Validate each scene
    for (let i = 0; i < quest.scenes.length; i++) {
      const scene = quest.scenes[i];
      const basePath = `scenes[${i}]`;
      this.validateGeneratedScene(scene, quest.id, refs, sceneIds, basePath, issues, { ...latinOptions, allowedGrammarIds: latinOptions.allowedGrammarIds ?? quest.learningFocus?.grammarIds, knownVocabularyIds: latinOptions.knownVocabularyIds ?? quest.learningFocus?.vocabularyIds });
    }

    // Graph and reachability check
    const startSceneId = quest.scenes[0]?.id;
    if (startSceneId) {
      const edges = new Map(quest.scenes.map(s => [s.id, this.getSceneEdges(s)]));
      const reachable = new Set<ID>();
      const visiting = new Set<ID>();
      const visited = new Set<ID>();
      let cycle = false;

      const walk = (id: ID): void => {
        reachable.add(id);
        if (visiting.has(id)) {
          cycle = true;
          return;
        }
        if (visited.has(id)) return;
        visiting.add(id);
        for (const next of edges.get(id) || []) {
          if (edges.has(next)) walk(next);
        }
        visiting.delete(id);
        visited.add(id);
      };

      walk(startSceneId);

      for (const scene of quest.scenes) {
        if (!reachable.has(scene.id)) {
          this.pushIssue(issues, "error", "UNREACHABLE_SCENE", `scenes`, `Scene '${scene.id}' is unreachable from start scene '${startSceneId}'.`, scene.id);
        }
      }
      if (cycle) {
        this.pushIssue(issues, "warning", "SCENE_GRAPH_CYCLE", `scenes`, "Scene graph contains a cycle.");
      }
    }

    const errors = issues.filter(issue => issue.severity === "error");
    const warnings = issues.filter(issue => issue.severity === "warning");

    return {
      ok: errors.length === 0,
      errors,
      warnings
    };
  }

  private static getSceneEdges(scene: Scene): ID[] {
    const edges: ID[] = [];
    if (scene.successNextSceneId) edges.push(scene.successNextSceneId);
    if (scene.failureNextSceneId) edges.push(scene.failureNextSceneId);
    for (const choice of scene.choices || []) {
      if (choice.nextSceneId) edges.push(choice.nextSceneId);
    }
    if (scene.textChallenge) {
      if (scene.textChallenge.successNextSceneId) edges.push(scene.textChallenge.successNextSceneId);
      if (scene.textChallenge.failureNextSceneId) edges.push(scene.textChallenge.failureNextSceneId);
    }
    return edges;
  }

  private static validateGeneratedScene(
    scene: Scene,
    questId: ID,
    refs: { itemIds: Set<ID>; skillIds: Set<ID>; npcIds: Set<ID>; grammarIds: Set<ID>; vocabularyIds: Set<ID>; locationIds: Set<ID>; sceneIds: Set<ID> },
    ownSceneIds: Set<ID>,
    path: string,
    issues: ValidationIssue[],
    latinOptions: LatinValidationOptions = {}
  ) {
    if (!scene.id) {
      this.pushIssue(issues, "error", "MISSING_SCENE_ID", path, "Scene is missing an ID.");
      return;
    }
    if (!scene.id.startsWith("gen_scene_")) {
      this.pushIssue(issues, "error", "INVALID_SCENE_ID", `${path}.id`, `Scene ID '${scene.id}' must start with 'gen_scene_'.`);
    }

    if (!(["choice", "text", "hybrid"] as string[]).includes(scene.inputMode)) this.pushIssue(issues, "error", "INVALID_INPUT_MODE", `${path}.inputMode`, `Invalid inputMode '${scene.inputMode}'.`);
    if (scene.inputMode === "text" && !scene.textChallenge) this.pushIssue(issues, "error", "MISSING_TEXT_CHALLENGE", `${path}.textChallenge`, "Text input scenes require a textChallenge.");
    if (scene.inputMode === "choice" && (!scene.choices || scene.choices.length === 0)) this.pushIssue(issues, "error", "MISSING_CHOICES", `${path}.choices`, "Choice input scenes require at least one choice.");
    if (scene.inputMode === "hybrid" && (!scene.textChallenge || !scene.choices || scene.choices.length === 0)) this.pushIssue(issues, "error", "INVALID_HYBRID_SCENE", path, "Hybrid scenes require both choices and a textChallenge.");

    if (!scene.locationId || !refs.locationIds.has(scene.locationId)) {
      this.pushIssue(issues, "error", "UNKNOWN_LOCATION", `${path}.locationId`, `Unknown locationId '${scene.locationId}'.`, scene.locationId);
    }

    for (const npcId of scene.npcIds || []) {
      if (!refs.npcIds.has(npcId)) {
        this.pushIssue(issues, "error", "UNKNOWN_NPC", `${path}.npcIds`, `Unknown npcId '${npcId}'.`, npcId);
      }
    }

    const focus = scene.learningFocus;
    if (focus) {
      for (const id of focus.grammarIds || []) {
        if (!refs.grammarIds.has(id)) {
          this.pushIssue(issues, "error", "UNKNOWN_GRAMMAR", `${path}.learningFocus.grammarIds`, `Unknown grammarId '${id}'.`, id);
        }
      }
      for (const id of focus.vocabularyIds || []) {
        if (!refs.vocabularyIds.has(id)) {
          this.pushIssue(issues, "error", "UNKNOWN_VOCABULARY", `${path}.learningFocus.vocabularyIds`, `Unknown vocabularyId '${id}'.`, id);
        }
      }
      for (const id of focus.skillIds || []) {
        if (!refs.skillIds.has(id)) {
          this.pushIssue(issues, "error", "UNKNOWN_SKILL", `${path}.learningFocus.skillIds`, `Unknown skillId '${id}'.`, id);
        }
      }
    }

    // Validate next scene references
    const checkNextScene = (nextId: ID | undefined | null, field: string) => {
      if (nextId && !ownSceneIds.has(nextId)) {
        this.pushIssue(issues, "error", "INVALID_SCENE_REFERENCE", `${path}.${field}`, `Scene '${scene.id}' links to external or invalid scene '${nextId}'.`, nextId);
      }
    };

    checkNextScene(scene.successNextSceneId, "successNextSceneId");
    checkNextScene(scene.failureNextSceneId, "failureNextSceneId");

    // Validate effects
    const allEffects = [...(scene.effects || []), ...(scene.rewards || [])];
    this.validateEffects(allEffects, questId, refs, `${path}.effects`, issues);

    // Choices
    for (let c = 0; c < (scene.choices || []).length; c++) {
      const choice = scene.choices[c];
      const choicePath = `${path}.choices[${c}]`;
      checkNextScene(choice.nextSceneId, `choices[${c}].nextSceneId`);
      this.validateEffects(choice.effects || [], questId, refs, `${choicePath}.effects`, issues);
    }

    // Text Challenge
    if (scene.textChallenge) {
      const chal = scene.textChallenge;
      const chalPath = `${path}.textChallenge`;
      if (!chal.expectedAnswers || chal.expectedAnswers.length === 0) {
        this.pushIssue(issues, "error", "MISSING_EXPECTED_ANSWERS", chalPath, "Text challenge needs at least one expected answer.");
      }
      for (let a = 0; a < (chal.expectedAnswers || []).length; a++) {
        this.validateLatinExpectedAnswer(chal.expectedAnswers[a], `${chalPath}.expectedAnswers[${a}]`, latinOptions, scene.learningFocus?.difficulty, issues);
      }
      if ((chal.expectedAnswers || []).some((answer) => answer.length > 240)) this.pushIssue(issues, "error", "EXPECTED_ANSWER_TOO_LONG", `${chalPath}.expectedAnswers`, "Expected answers must be 240 characters or shorter.");
      checkNextScene(chal.successNextSceneId, "textChallenge.successNextSceneId");
      checkNextScene(chal.failureNextSceneId, "textChallenge.failureNextSceneId");
      this.validateEffects([...(chal.successEffects || []), ...(chal.failureEffects || [])], questId, refs, `${chalPath}.effects`, issues);
    }
  }

  private static validateLatinExpectedAnswer(answer: string, path: string, options: LatinValidationOptions, sceneDifficulty: string | undefined, issues: ValidationIssue[]) {
    if (!answer.trim()) {
      this.pushIssue(issues, "error", "latin-expected-answer-empty", path, "Latin expected answer is empty.");
      return;
    }
    if (!options.contentLoader) return;
    try {
      const playerLevel = options.playerLevel ?? 1;
      const allowedGrammarIds = options.allowedGrammarIds ?? [];
      const gate = checkTextAgainstLevel({ text: answer, contentLoader: options.contentLoader, playerLevel, allowedGrammarIds, knownVocabularyIds: options.knownVocabularyIds, maxSentenceLength: options.maxSentenceLength });
      for (const violation of gate.violations) {
        const code = violation.type === "length" ? "latin-too-long" : violation.type === "unknown-form" ? "latin-unknown-forms" : "latin-out-of-level";
        const severity = violation.type === "unknown-form" ? "warning" : "error";
        this.pushIssue(issues, severity, code, path, violation.messageTr, violation.id || violation.token);
      }
      const analysis = analyzeSentence({ text: answer, contentLoader: options.contentLoader, playerLevel, unlockedGrammarIds: allowedGrammarIds, knownVocabularyIds: options.knownVocabularyIds });
      if ((sceneDifficulty === "intro" || sceneDifficulty === "practice") && (analysis.difficulty.level === "B1" || analysis.difficulty.level === "B2")) {
        this.pushIssue(issues, sceneDifficulty === "intro" ? "error" : "warning", "latin-difficulty-mismatch", path, `Expected answer looks ${analysis.difficulty.level}, above ${sceneDifficulty} scope.`);
      }
      for (const word of analysis.words) for (const warning of word.warnings) this.pushIssue(issues, "warning", "latin-analysis-warning", path, warning.messageTr, word.token.raw);
    } catch {
      this.pushIssue(issues, "warning", "latin-analysis-warning", path, "Latin analysis failed; generated content will rely on fallback validation.");
    }
  }

  private static validateEffects(
    effects: Effect[],
    questId: ID,
    refs: { itemIds: Set<ID>; skillIds: Set<ID>; npcIds: Set<ID>; grammarIds: Set<ID>; vocabularyIds: Set<ID>; locationIds: Set<ID>; sceneIds: Set<ID> },
    path: string,
    issues: ValidationIssue[]
  ) {
    const allowedEffects = new Set<Effect["type"]>([
      "ADD_XP", "APPLY_REWARD_BUNDLE", "ADD_CURRENCY", "ADD_ITEM", "UNLOCK_SKILL", "INCREMENT_SKILL",
      "ADD_JOURNAL_ENTRY", "ADD_DIALOGUE_ENTRY", "ADD_NPC_MEMORY", "UPDATE_NPC_RELATIONSHIP", "SET_LOCATION_FLAG",
      "ADD_WORLD_EVENT", "MARK_SCENE_COMPLETED", "COMPLETE_QUEST", "GO_TO_SCENE"
    ]);
    for (const effect of effects) {
      if (!allowedEffects.has(effect.type)) {
        this.pushIssue(issues, "error", "FORBIDDEN_EFFECT", path, `Effect '${effect.type}' is not allowed in generated quests.`);
        continue;
      }
      // 1. Unknown references check
      if ((effect.type === "ADD_ITEM" || effect.type === "REMOVE_ITEM") && !refs.itemIds.has(effect.itemId)) {
        this.pushIssue(issues, "error", "UNKNOWN_ITEM", path, `Unknown itemId '${effect.itemId}'.`, effect.itemId);
      }
      if ((effect.type === "UNLOCK_SKILL" || effect.type === "INCREMENT_SKILL") && !refs.skillIds.has(effect.skillId)) {
        this.pushIssue(issues, "error", "UNKNOWN_SKILL", path, `Unknown skillId '${effect.skillId}'.`, effect.skillId);
      }
      if (effect.type === "ADD_NPC_MEMORY" && !refs.npcIds.has(effect.npcId)) {
        this.pushIssue(issues, "error", "UNKNOWN_NPC", path, `Unknown npcId '${effect.npcId}' in ADD_NPC_MEMORY.`, effect.npcId);
      }
      if (effect.type === "UPDATE_NPC_RELATIONSHIP" && !refs.npcIds.has(effect.npcId)) {
        this.pushIssue(issues, "error", "UNKNOWN_NPC", path, `Unknown npcId '${effect.npcId}' in UPDATE_NPC_RELATIONSHIP.`, effect.npcId);
      }
      if (effect.type === "DISCOVER_LOCATION" && !refs.locationIds.has(effect.locationId)) {
        this.pushIssue(issues, "error", "UNKNOWN_LOCATION", path, `Unknown locationId '${effect.locationId}' in DISCOVER_LOCATION.`, effect.locationId);
      }
      if (effect.type === "SET_LOCATION_FLAG" && !refs.locationIds.has(effect.locationId)) {
        this.pushIssue(issues, "error", "UNKNOWN_LOCATION", path, `Unknown locationId '${effect.locationId}' in SET_LOCATION_FLAG.`, effect.locationId);
      }
      if (effect.type === "SET_LOCATION_MOOD" && !refs.locationIds.has(effect.locationId)) {
        this.pushIssue(issues, "error", "UNKNOWN_LOCATION", path, `Unknown locationId '${effect.locationId}' in SET_LOCATION_MOOD.`, effect.locationId);
      }
      if (effect.type === "GO_TO_SCENE" && !refs.sceneIds.has(effect.sceneId)) this.pushIssue(issues, "error", "FORBIDDEN_EFFECT", path, `Generated quest cannot navigate to external scene '${effect.sceneId}'.`, effect.sceneId);

      // 2. Forbidden campaign modification checks
      if (effect.type === "START_QUEST" || effect.type === "COMPLETE_QUEST" || effect.type === "FAIL_QUEST") {
        if (effect.questId !== questId) {
          this.pushIssue(
            issues,
            "error",
            "FORBIDDEN_EFFECT",
            path,
            `Generated quest cannot modify status of external quest '${effect.questId}'. Only '${questId}' is allowed.`,
            effect.questId
          );
        }
      }

      // 3. Excessive raw rewards are invalid; the reward balancer must own these values.
      if (effect.type === "ADD_XP" && effect.amount > 100) {
        this.pushIssue(issues, "error", "EXCESSIVE_REWARD", path, `Raw XP reward of ${effect.amount} exceeds limit of 100.`);
      }
      if (effect.type === "ADD_CURRENCY" && effect.amount > 20) {
        this.pushIssue(issues, "error", "EXCESSIVE_REWARD", path, `Raw Denarii reward of ${effect.amount} exceeds limit of 20.`);
      }
      if (effect.type === "APPLY_REWARD_BUNDLE") {
        if (effect.reward.xp && effect.reward.xp > 120) {
          this.pushIssue(issues, "error", "EXCESSIVE_REWARD", path, `Reward bundle XP of ${effect.reward.xp} exceeds limit of 120.`);
        }
        if (effect.reward.currency && effect.reward.currency > 20) {
          this.pushIssue(issues, "error", "EXCESSIVE_REWARD", path, `Reward bundle Denarii of ${effect.reward.currency} exceeds limit of 20.`);
        }
      }
    }
  }
}
