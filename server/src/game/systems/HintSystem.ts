import type { PlayerSave, Scene } from "../types/gameTypes";
import type { LlmClient } from "../../llm/LlmClient";
import type { HintResult } from "../../llm/LlmTypes";
import { EventBus } from "../core/EventBus";
import { DialogueSystem } from "./DialogueSystem";
import { ContentLoader } from "../content/ContentLoader";
import { checkTextAgainstLevel } from "../../latin/LatinGrammarGatekeeper";
import type { GrammarGateResult } from "../../latin/LatinTypes";

export class HintSystem {
  constructor(
    private readonly eventBus: EventBus,
    private readonly contentLoader: ContentLoader,
    private readonly dialogueSystem = new DialogueSystem()
  ) {}

  async generateHint(
    save: PlayerSave,
    scene: Scene,
    llmClient?: LlmClient,
    options: { addDialogue?: boolean } = { addDialogue: true }
  ): Promise<{ save: PlayerSave; hint: HintResult }> {
    const challenge = scene.textChallenge;
    let hintResult: HintResult;
    let latinGateViolations: GrammarGateResult["violations"] = [];

    if (!challenge) {
      hintResult = {
        hintTr: "Bu sahnede çözülecek bir Latince sorusu bulunmuyor. Bir seçenek belirleyerek ilerleyebilirsin.",
      };
    } else if (llmClient) {
      try {
        hintResult = await llmClient.generateHint({
          prompt: challenge.prompt,
          expectedAnswers: challenge.expectedAnswers,
          playerLevel: save.level,
          unlockedSkills: save.skills.filter((s) => s.unlocked).map((s) => s.skillId),
        });
        const gated = this.gateHintLatin(save, scene, hintResult);
        hintResult = gated.hint;
        latinGateViolations = gated.violations;
      } catch (error) {
        console.error("LLM hint generation failed, using fallback:", error);
        hintResult = this.createFallbackHint(challenge.expectedAnswers);
      }
    } else {
      hintResult = this.createFallbackHint(challenge.expectedAnswers);
    }

    // Hint is registered as a small event
    let nextSave = this.eventBus.emit(save, "HINT_REQUESTED", {
      sceneId: scene.id,
      hint: hintResult,
    });
    if (latinGateViolations.length) {
      nextSave = this.eventBus.emit(nextSave, "LLM_LATIN_GATE_VIOLATION", { source: "hint", violations: latinGateViolations });
    }

    if (options.addDialogue === false) {
      return { save: nextSave, hint: hintResult };
    }

    // In-game REQUEST_HINT keeps a visible dialogue trace for the player.
    const speakerId = scene.npcIds.includes("marcus") ? "marcus" : "system";
    
    let hintMessage = hintResult.hintTr;
    if (hintResult.miniExampleLatin) {
      hintMessage += ` (Örnek: "${hintResult.miniExampleLatin}" - ${hintResult.miniExampleTr || ""})`;
    }
    
    nextSave = this.dialogueSystem.addDialogue(nextSave, speakerId, hintMessage, "tr");

    return { save: nextSave, hint: hintResult };
  }

  private createFallbackHint(expectedAnswers: string[]): HintResult {
    if (!expectedAnswers || expectedAnswers.length === 0) {
      return { hintTr: "Cevapla ilgili bir ipucu bulunamadı." };
    }

    const firstAnswer = expectedAnswers[0];
    const firstWord = firstAnswer.split(/\s+/)[0] || "";
    const cleanWord = firstWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");

    return {
      hintTr: `Cevap muhtemelen şu kelimeyle başlıyor olabilir: "${cleanWord}"`,
      miniExampleLatin: cleanWord,
      miniExampleTr: "başlangıç kelimesi",
    };
  }

  private gateHintLatin(save: PlayerSave, scene: Scene, hint: HintResult): { hint: HintResult; violations: GrammarGateResult["violations"] } {
    if (!hint.miniExampleLatin?.trim()) return { hint, violations: [] };
    try {
      const gate = checkTextAgainstLevel({ text: hint.miniExampleLatin, contentLoader: this.contentLoader, playerLevel: save.level, allowedGrammarIds: scene.learningFocus?.grammarIds ?? [], knownVocabularyIds: scene.learningFocus?.vocabularyIds, maxSentenceLength: save.level <= 1 ? 6 : 10 });
      if (gate.ok) return { hint, violations: [] };
      return { hint: { ...hint, miniExampleLatin: gate.safeSuggestion || "Salve.", miniExampleTr: hint.miniExampleTr || "Güvenli kısa örnek" }, violations: gate.violations };
    } catch {
      return { hint: { ...hint, miniExampleLatin: "Salve.", miniExampleTr: hint.miniExampleTr || "Güvenli kısa örnek" }, violations: [{ type: "unknown-form", messageTr: "Latin ipucu güvenli fallback ile değiştirildi." }] };
    }
  }
}
