import type { Scene } from "../game/types/gameTypes";
import { createLlmClient } from "../llm/LlmProviderFactory";
import { safeJsonParse } from "../llm/JsonRepair";
import { checkTextAgainstLevel } from "../latin/LatinGrammarGatekeeper";
import type { LlmDraftRequest, LlmDraftResult } from "./AuthoringTypes";
import { AuthoringValidationService } from "./AuthoringValidationService";
import { ContentIdService } from "./ContentIdService";
import { ContentLoader } from "../game/content/ContentLoader";

export class AuthoringDraftService {
  private readonly idService = new ContentIdService();

  constructor(private readonly validationService = new AuthoringValidationService(), private readonly contentLoader = new ContentLoader()) {}

  async generateDraft(request: LlmDraftRequest): Promise<LlmDraftResult> {
    const warnings: string[] = [];
    let generatedBy: LlmDraftResult["generatedBy"] = "llm";
    let fallbackReason: string | undefined;
    let raw: unknown;
    if (!request.llmConfig) {
      generatedBy = "fallback";
      fallbackReason = "Model secili olmadigi icin guvenli fallback taslak uretildi.";
      raw = this.generateFallbackDraft(request);
    } else {
      try {
        raw = await this.generateWithLlm(request);
      } catch (error) {
        generatedBy = "fallback";
        fallbackReason = `LLM yanit vermedi; guvenli fallback kullanildi: ${error instanceof Error ? error.message : String(error)}`;
        raw = this.generateFallbackDraft(request);
      }
    }
    if (fallbackReason) warnings.push(fallbackReason);
    const sanitizedDraft = this.sanitizeDraft(request, raw);
    const validation = this.validateDraft(request, sanitizedDraft);
    const latinGate = this.latinGateForDraft(sanitizedDraft, request);
    if (latinGate && !latinGate.ok) warnings.push("Latin gate uyarisi: taslak beklenen seviyeyi asabilir.");
    return { ok: validation.ok && (!latinGate || latinGate.ok), kind: request.kind, generatedBy, fallbackReason, draft: raw, sanitizedDraft, validation, latinGate, warnings };
  }

  sanitizeDraft(request: LlmDraftRequest, raw: unknown): unknown {
    const parsed = typeof raw === "string" ? safeJsonParse<unknown>(raw) ?? {} : raw;
    const obj = typeof parsed === "object" && parsed !== null ? parsed as Record<string, unknown> : {};
    if (request.kind === "scene" || request.kind === "review-quest") return this.sanitizeScene(obj, request);
    if (request.kind === "quest") return { id: this.string(obj.id, this.idService.suggestQuestId(request.chapterId ?? "chapter", this.string(obj.title, request.promptTr))), title: this.string(obj.title, "Yeni Quest"), description: this.string(obj.description, request.promptTr), startSceneId: this.string(obj.startSceneId, "draft_scene_001"), scenes: Array.isArray(obj.scenes) ? obj.scenes.map((scene) => this.sanitizeScene(scene as Record<string, unknown>, request)) : [this.sanitizeScene({}, request)], rewards: [], statusConditions: [] };
    if (request.kind === "npc") return { id: this.string(obj.id, this.idService.suggestNpcId(this.string(obj.name, "Persona"))), name: this.string(obj.name, "Yeni NPC"), role: this.string(obj.role, "teacher"), descriptionTr: this.string(obj.descriptionTr, request.promptTr), defaultLocationId: request.locationId ?? "ludus", preferredGrammarIds: request.grammarIds ?? [], preferredVocabularyIds: request.vocabularyIds ?? [] };
    if (request.kind === "location") return { id: this.string(obj.id, this.idService.suggestLocationId(this.string(obj.title, "Locus"))), title: this.string(obj.title, "Yeni Lokasyon"), titleLatin: this.string(obj.titleLatin, "Locus"), descriptionTr: this.string(obj.descriptionTr, request.promptTr), mood: this.string(obj.mood, "calm"), connectedLocationIds: [], defaultNpcIds: request.npcIds ?? [], vocabularyIds: request.vocabularyIds ?? [], grammarIds: request.grammarIds ?? [], unlockConditions: [] };
    if (request.kind === "assessment-question") return { id: this.string(obj.id, `assess_${Date.now()}`), type: this.string(obj.type, "latin-input"), promptTr: this.string(obj.promptTr, request.promptTr), latinText: this.string(obj.latinText, ""), choices: Array.isArray(obj.choices) ? obj.choices : [], expectedAnswers: this.stringArray(obj.expectedAnswers, ["salve"]), grammarIds: request.grammarIds ?? [], vocabularyIds: request.vocabularyIds ?? [], skillIds: [], difficulty: request.difficulty ?? "practice", level: "A1" };
    return { id: this.string(obj.id, `grammar_${Date.now()}`), titleTr: this.string(obj.titleTr, "Yeni konu"), explanationTr: this.string(obj.explanationTr, request.promptTr), examples: this.stringArray(obj.examples, ["Salve."]), level: 1, prerequisiteGrammarIds: request.grammarIds ?? [], relatedVocabularyIds: request.vocabularyIds ?? [] };
  }

  validateDraft(request: LlmDraftRequest, draft: unknown) {
    if (request.kind === "scene" || request.kind === "review-quest") return this.validationService.validateScene(draft as Scene);
    if (request.kind === "quest") return this.validationService.validateQuest(draft as any);
    if (request.kind === "npc") return this.validationService.validateNpc(draft);
    if (request.kind === "location") return this.validationService.validateLocation(draft);
    if (request.kind === "assessment-question") return this.validationService.validateAssessmentQuestion(draft);
    return this.validationService.validateLatinData(draft);
  }

  buildDraftPrompt(request: LlmDraftRequest): string {
    return [
      "Sadece JSON don. Via Prima authoring draft uret.",
      `Tur: ${request.kind}`,
      `Chapter: ${request.chapterId ?? "-"}`,
      `Location: ${request.locationId ?? "-"}`,
      `NPCs: ${(request.npcIds ?? []).join(", ")}`,
      `Grammar: ${(request.grammarIds ?? []).join(", ")}`,
      `Vocabulary: ${(request.vocabularyIds ?? []).join(", ")}`,
      `Difficulty: ${request.difficulty ?? "practice"}`,
      "A1/A2 disina cikma, olmayan id uydurma, reward abartma, oyun state'i degistirme.",
      `Kullanici istegi: ${request.promptTr}`,
      ...(request.constraints ?? []).map((item) => `Kisit: ${item}`),
    ].join("\n");
  }

  private async generateWithLlm(request: LlmDraftRequest): Promise<unknown> {
    const client = createLlmClient(request.llmConfig!);
    const response = await client.chat({ messages: [{ role: "system", content: "Via Prima content authoring assistant. Return JSON only." }, { role: "user", content: this.buildDraftPrompt(request) }], responseFormat: "json", temperature: request.llmConfig?.temperature ?? 0.4 });
    return response.text;
  }

  private generateFallbackDraft(request: LlmDraftRequest): unknown {
    return this.sanitizeScene({}, request);
  }

  private sanitizeScene(obj: Record<string, unknown>, request: LlmDraftRequest): Scene {
    const id = this.string(obj.id, this.idService.suggestSceneId(request.chapterId ?? "draft", this.string(obj.title, request.promptTr)));
    return {
      id,
      title: this.string(obj.title, "Taslak Sahne"),
      locationId: this.string(obj.locationId, request.locationId ?? "ludus"),
      npcIds: this.stringArray(obj.npcIds, request.npcIds ?? []),
      description: this.string(obj.description, request.promptTr),
      objective: this.string(obj.objective, "A1 duzeyinde hedef cumleyi kur."),
      inputMode: this.string(obj.inputMode, "text") === "choice" ? "choice" : "text",
      choices: [],
      textChallenge: {
        id: `tc_${id}`,
        prompt: this.string((obj.textChallenge as any)?.prompt, "Latince kisa cevap ver."),
        expectedAnswers: this.stringArray((obj.textChallenge as any)?.expectedAnswers, ["salve"]),
        acceptedVariants: this.stringArray((obj.textChallenge as any)?.acceptedVariants, []),
        strictness: "normal",
        evaluationMode: "deterministic",
        successEffects: [],
        failureEffects: [],
      },
      conditions: [],
      effects: [],
      rewards: [],
      onEnterEvents: [{ type: "scene.entered", payload: { sceneId: id } }],
      learningFocus: { grammarIds: request.grammarIds ?? [], vocabularyIds: request.vocabularyIds ?? [], skillIds: [], difficulty: request.difficulty ?? "practice" },
      pedagogy: { explanationBefore: "Kisa ve guvenli A1 pratigi.", hintLevels: ["Cumleyi cok kisa tut."] },
      reviewTags: request.grammarIds ?? [],
    };
  }

  private latinGateForDraft(draft: unknown, request: LlmDraftRequest) {
    const scene = draft as Scene;
    const expected = scene.textChallenge?.expectedAnswers?.[0];
    if (!expected) return undefined;
    return checkTextAgainstLevel({ text: expected, contentLoader: this.contentLoader, playerLevel: request.difficulty === "challenge" ? 2 : 1, allowedGrammarIds: request.grammarIds ?? [], knownVocabularyIds: request.vocabularyIds });
  }

  private string(value: unknown, fallback: string): string {
    return typeof value === "string" && value.trim() ? value.trim().slice(0, 1000) : fallback;
  }

  private stringArray(value: unknown, fallback: string[]): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0).map((item) => item.trim().slice(0, 200)) : fallback;
  }
}
