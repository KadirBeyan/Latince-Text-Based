import type { ContentLoader } from "./ContentLoader";
import type { Campaign, Quest, Scene } from "../types/gameTypes";
import type { LatinDifficultyResult } from "../../latin/LatinTypes";
import { analyzeSentence } from "../../latin/LatinSentenceAnalyzer";

export type QualityIssue = { severity: "error" | "warning" | "info"; code: string; message: string; path: string };
export type SceneQualityReport = { sceneId: string; score: number; issues: QualityIssue[]; suggestions: string[]; latinDifficulty?: LatinDifficultyResult };
export type QuestQualityReport = { questId: string; score: number; sceneReports: SceneQualityReport[]; issues: QualityIssue[] };
export type CampaignQualityReport = { campaignId: string; score: number; questReports: QuestQualityReport[]; issues: QualityIssue[] };

export class ContentQualityAnalyzer {
  constructor(private readonly contentLoader?: ContentLoader) {}

  analyzeScene(scene: Scene): SceneQualityReport {
    const issues: QualityIssue[] = [];
    const add = (severity: QualityIssue["severity"], code: string, message: string, path: string) => issues.push({ severity, code, message, path });
    if (!scene.objective?.trim()) add("warning", "MISSING_OBJECTIVE", "Scene objective is missing.", `${scene.id}.objective`);
    if (scene.description.length < 30) add("info", "SHORT_DESCRIPTION", "Description is very short.", `${scene.id}.description`);
    if (scene.description.length > 800) add("warning", "LONG_DESCRIPTION", "Description is too long.", `${scene.id}.description`);
    if (!scene.learningFocus) add("warning", "MISSING_LEARNING_FOCUS", "learningFocus is missing.", `${scene.id}.learningFocus`);
    if (!scene.pedagogy) add("info", "MISSING_PEDAGOGY", "pedagogy is missing.", `${scene.id}.pedagogy`);
    if (!scene.reviewTags?.length) add("info", "MISSING_REVIEW_TAGS", "reviewTags are missing.", `${scene.id}.reviewTags`);
    if (!scene.rewards.length) add("info", "NO_REWARDS", "Scene has no rewards.", `${scene.id}.rewards`);
    for (const choice of scene.choices) if (!choice.nextSceneId) add("warning", "CHOICE_MISSING_PATH", "Choice has no nextSceneId.", `${scene.id}.choices.${choice.id}`);
    if (scene.choices.length > 5) add("warning", "TOO_MANY_CHOICES", "Scene has more than five choices.", `${scene.id}.choices`);

    const t = scene.textChallenge;
    let latinDifficulty: LatinDifficultyResult | undefined;
    if (t) {
      if (!Array.isArray(t.expectedAnswers) || t.expectedAnswers.length === 0) add("error", "MISSING_EXPECTED_ANSWERS", "Text challenge has no expectedAnswers.", `${scene.id}.textChallenge.expectedAnswers`);
      const normalized = t.expectedAnswers.map(x => x.trim().toLowerCase());
      if (new Set(normalized).size !== normalized.length) add("warning", "DUPLICATE_EXPECTED_ANSWERS", "Expected answers contain duplicates.", `${scene.id}.textChallenge.expectedAnswers`);
      const variants = (t.acceptedVariants ?? []).map(x => x.trim().toLowerCase());
      if (new Set(variants).size !== variants.length) add("warning", "DUPLICATE_VARIANTS", "Accepted variants contain duplicates.", `${scene.id}.textChallenge.acceptedVariants`);
      if (!(t.successNextSceneId ?? scene.successNextSceneId) || !(t.failureNextSceneId ?? scene.failureNextSceneId)) add("warning", "MISSING_CHALLENGE_PATH", "Challenge needs success and failure paths.", `${scene.id}.textChallenge`);
      latinDifficulty = this.analyzeLatinFocus(scene, add);
    }
    return { sceneId: scene.id, score: this.score(issues), issues, suggestions: issues.map(i => i.message), ...(latinDifficulty ? { latinDifficulty } : {}) };
  }

  analyzeQuest(quest: Quest): QuestQualityReport { const sceneReports = quest.scenes.map(s => this.analyzeScene(s)); const issues: QualityIssue[] = []; return { questId: quest.id, score: avg(sceneReports.map(r => r.score)), sceneReports, issues }; }
  analyzeCampaign(campaign: Campaign): CampaignQualityReport { const questReports = campaign.chapters.flatMap(c => c.quests).map(q => this.analyzeQuest(q)); const issues: QualityIssue[] = []; return { campaignId: campaign.id, score: avg(questReports.map(r => r.score)), questReports, issues }; }

  private analyzeLatinFocus(scene: Scene, add: (severity: QualityIssue["severity"], code: string, message: string, path: string) => void): LatinDifficultyResult | undefined {
    if (!this.contentLoader || !scene.textChallenge?.expectedAnswers?.length) return undefined;
    try {
      const expectedText = scene.textChallenge.expectedAnswers.join(". ");
      const analysis = analyzeSentence({ text: expectedText, contentLoader: this.contentLoader, unlockedGrammarIds: scene.learningFocus?.grammarIds, knownVocabularyIds: scene.learningFocus?.vocabularyIds });
      const focusGrammar = new Set(scene.learningFocus?.grammarIds ?? []);
      const detectedGrammar = new Set(analysis.difficulty.detectedGrammarIds);
      const detectedVocabulary = new Set(analysis.difficulty.detectedVocabularyIds);
      for (const grammarId of focusGrammar) {
        if (grammarId.includes("sum") && !detectedGrammar.has("sum-esse-present")) add("warning", "learning-focus-not-represented", "sum/esse focus is not represented in expected answers.", `${scene.id}.learningFocus.grammarIds`);
        else if (grammarId.includes("accusative") && !detectedGrammar.has("accusative-basic")) add("warning", "learning-focus-not-represented", "Accusative focus is not represented in expected answers.", `${scene.id}.learningFocus.grammarIds`);
        else if (grammarId === "greetings" && !detectedGrammar.has("greetings")) add("warning", "learning-focus-not-represented", "Greeting focus is not represented in expected answers.", `${scene.id}.learningFocus.grammarIds`);
      }
      for (const vocabularyId of scene.learningFocus?.vocabularyIds ?? []) {
        if (!detectedVocabulary.has(vocabularyId)) add("warning", "vocabulary-focus-not-represented", `Vocabulary focus '${vocabularyId}' is not represented in expected answers.`, `${scene.id}.learningFocus.vocabularyIds`);
      }
      if ((scene.learningFocus?.difficulty === "intro" || scene.learningFocus?.difficulty === "practice") && (analysis.difficulty.level === "B1" || analysis.difficulty.level === "B2")) add("warning", "scene-latin-too-hard", `Scene Latin looks ${analysis.difficulty.level}, above the target difficulty.`, `${scene.id}.textChallenge.expectedAnswers`);
      if (scene.learningFocus?.difficulty === "challenge" && analysis.difficulty.level === "A1") add("info", "scene-latin-too-easy", "Challenge scene uses only A1-looking Latin.", `${scene.id}.textChallenge.expectedAnswers`);
      if (analysis.tokens.length > 10) add("warning", "expected-answer-too-complex", "Expected answer text is long for a beginner challenge.", `${scene.id}.textChallenge.expectedAnswers`);
      return analysis.difficulty;
    } catch {
      add("warning", "expected-answer-too-complex", "Latin quality analysis could not parse this expected answer.", `${scene.id}.textChallenge.expectedAnswers`);
      return undefined;
    }
  }

  private score(issues: QualityIssue[]): number { return Math.max(0, Math.min(100, 100 - issues.reduce((n, i) => n + (i.severity === "error" ? 25 : i.severity === "warning" ? 10 : 3), 0))); }
}

function avg(values: number[]): number { return values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 100; }
