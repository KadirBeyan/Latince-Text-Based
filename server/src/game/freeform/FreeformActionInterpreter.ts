import type { LlmProviderConfig } from "../../llm/LlmTypes";
import type { ConversationFlow, ConversationNode, ConversationOption } from "../types/ConversationTypes";
import type { CharacterProfile, FreeformActionKind, InteractionIntent, Scene } from "../types/gameTypes";
import { createLlmClient } from "../../llm/LlmProviderFactory";
import { safeJsonParse } from "../../llm/JsonRepair";

export type FreeformInterpretationResult = {
  ok: boolean;
  interpretationSource: "llm" | "heuristic" | "fallback";
  actionKind: FreeformActionKind;
  matchedOptionId?: string;
  matchedIntentId?: string;
  confidence: number;
  targetNpcId?: string;
  targetObjectId?: string;
  targetLocationId?: string;
  meaningTr: string;
  requiresLatin: boolean;
  targetMeaningTr?: string;
  detectedLatinText?: string;
  detectedTurkishIntent?: string;
  canResolveImmediately: boolean;
  suggestedLatinPromptTr?: string;
  suggestedOptionIds?: string[];
  rejection?: {
    reasonCode: "out_of_scope" | "not_possible_here" | "npc_not_present" | "object_not_present" | "too_ambiguous" | "unsafe_or_invalid" | "no_matching_action";
    messageTr: string;
    suggestedOptionIds?: string[];
  };
  debug?: unknown;
};

type AvailableAction = ConversationOption | InteractionIntent;

const ACTION_KINDS: FreeformActionKind[] = [
  "speak_to_npc", "ask_npc", "answer_npc", "inspect_object", "read_text", "listen", "remember",
  "journal", "move_or_leave", "help", "refuse", "bargain", "persuade", "thank", "apologize",
  "direct_latin_utterance", "unknown"
];

const LATIN_MARKERS = new Set(["salve", "vale", "certe", "ita", "non", "mater", "pater", "magister", "gratias", "quaeso", "volo", "possum", "sum", "est", "eo", "porto", "fero", "panem", "forum"]);

function normalize(value: string): string {
  return value.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9çğıöşü\s]/g, " ").replace(/\s+/g, " ").trim();
}

function optionAliases(option: AvailableAction): string[] {
  const raw = option as ConversationOption & { aliasesTr?: string[]; freeformMatchHints?: string[] };
  return [raw.labelTr, raw.descriptionTr, raw.playerIntentTr, ...(raw.aliasesTr ?? []), ...(raw.freeformMatchHints ?? []), ...(raw.canonicalAnswers ?? []), ...(raw.acceptedVariants ?? [])].filter((item): item is string => Boolean(item));
}

function kindFromVerb(verb?: string): FreeformActionKind {
  const map: Record<string, FreeformActionKind> = {
    speak: "speak_to_npc", ask: "ask_npc", answer: "answer_npc", inspect: "inspect_object", read: "read_text",
    listen: "listen", remember: "remember", journal: "journal", leave: "move_or_leave", help: "help", refuse: "refuse",
    bargain: "bargain", persuade: "persuade", thank: "thank", apologize: "apologize"
  };
  return map[verb ?? ""] ?? "unknown";
}

export class FreeformActionInterpreter {
  async interpretFreeformAction(params: {
    inputText: string;
    context: {
      scene?: Scene;
      conversationFlow?: ConversationFlow;
      currentNode?: ConversationNode;
      availableOptions: AvailableAction[];
      nearbyNpcIds: string[];
      locationId?: string;
      playerProfile?: CharacterProfile;
    };
    llmConfig?: LlmProviderConfig;
  }): Promise<FreeformInterpretationResult> {
    const inputText = params.inputText.trim();
    const heuristic = this.tryHeuristicMatch(inputText, params.context);
    if (heuristic?.ok || !params.llmConfig) return this.enforceScope(heuristic ?? this.buildFallbackRejection(inputText, params.context.availableOptions), params.context);

    try {
      const client = createLlmClient(params.llmConfig);
      const options = params.context.availableOptions.map((option) => ({
        id: option.id,
        labelTr: option.labelTr,
        aliasesTr: optionAliases(option),
        verb: (option as ConversationOption).verb,
        requiresLatin: Boolean((option as ConversationOption).requiresLatin),
        targetMeaningTr: (option as ConversationOption).targetMeaningTr
      }));
      const response = await client.chat({
        messages: [
          { role: "system", content: `Bir kontrollü text-RPG eylem yorumlayıcısısın. Yalnız JSON dön. Sadece verilen availableOptions ve nearbyNpcIds içinde karar ver. XP, ödül, eşya, görev, ilişki, sahne geçişi veya save state kararı verme. NPC mevcut değilse npc_not_present; eylem sahne dışındaysa out_of_scope; güven 0.72 altındaysa too_ambiguous rejection dön. actionKind şu listeden olmalı: ${ACTION_KINDS.join(", ")}. Şema: {"actionKind":"...","matchedOptionId":null,"matchedIntentId":null,"confidence":0,"targetNpcId":null,"meaningTr":"...","requiresLatin":false,"targetMeaningTr":null,"detectedLatinText":null,"suggestedLatinPromptTr":null,"rejection":null}` },
          { role: "user", content: JSON.stringify({ inputText, availableOptions: options, nearbyNpcIds: params.context.nearbyNpcIds, locationId: params.context.locationId }) }
        ],
        temperature: 0.1,
        responseFormat: "json"
      });
      const parsed = safeJsonParse<Record<string, any>>(response.text);
      if (!parsed) return heuristic ?? this.buildFallbackRejection(inputText, params.context.availableOptions);
      return this.enforceScope(this.validateLlmResult(parsed, inputText, params.context), params.context);
    } catch {
      return heuristic ?? this.buildFallbackRejection(inputText, params.context.availableOptions);
    }
  }

  private enforceScope(result: FreeformInterpretationResult, context: { conversationFlow?: ConversationFlow; currentNode?: ConversationNode; availableOptions: AvailableAction[] }): FreeformInterpretationResult {
    if (!result.ok) return result;
    const allowed = context.currentNode?.allowedActionKinds ?? context.conversationFlow?.allowedActionKinds;
    if (!allowed?.length || allowed.includes(result.actionKind) || result.actionKind === "direct_latin_utterance") return result;
    const suggestedOptionIds = context.availableOptions.slice(0, 3).map((option) => option.id);
    return {
      ...result,
      ok: false,
      canResolveImmediately: false,
      rejection: {
        reasonCode: "not_possible_here",
        messageTr: context.currentNode?.fallbackRejectionTr ?? context.conversationFlow?.disallowedActionMessages?.[result.actionKind] ?? context.conversationFlow?.fallbackRejectionTr ?? "Bu anda o eylemi gerçekleştirecek bir yol görünmüyor.",
        suggestedOptionIds
      }
    };
  }

  private tryHeuristicMatch(inputText: string, context: { availableOptions: AvailableAction[]; nearbyNpcIds: string[]; currentNode?: ConversationNode }): FreeformInterpretationResult | null {
    const clean = normalize(inputText);
    if (!clean) return null;
    const tokens = clean.split(" ");
    const latinCount = tokens.filter((token) => LATIN_MARKERS.has(token)).length;
    const looksLatin = latinCount >= 2 || /\b(salve|gratias|quaeso|certe|ita)\b/i.test(inputText);

    let best: { option: AvailableAction; score: number } | undefined;
    for (const option of context.availableOptions) {
      for (const alias of optionAliases(option)) {
        const normalizedAlias = normalize(alias);
        const aliasTokens = normalizedAlias.split(" ").filter((token) => token.length > 2);
        const overlap = aliasTokens.filter((token) => clean.includes(token)).length;
        const score = clean === normalizedAlias ? 1 : clean.includes(normalizedAlias) || normalizedAlias.includes(clean) ? 0.92 : aliasTokens.length ? overlap / aliasTokens.length : 0;
        if (!best || score > best.score) best = { option, score };
      }
    }

    const keywordKind = this.detectActionKind(clean, looksLatin);
    if (best && best.score >= 0.5) {
      const option = best.option as ConversationOption;
      const requiresLatin = looksLatin ? false : Boolean(option.requiresLatin ?? ["speak_to_npc", "ask_npc", "answer_npc", "help", "refuse", "thank", "apologize"].includes(keywordKind));
      return {
        ok: true,
        interpretationSource: "heuristic",
        actionKind: looksLatin ? "direct_latin_utterance" : (keywordKind === "unknown" ? kindFromVerb(option.verb) : keywordKind),
        matchedOptionId: context.currentNode ? best.option.id : undefined,
        matchedIntentId: context.currentNode ? undefined : best.option.id,
        confidence: Math.max(0.72, best.score),
        meaningTr: option.playerIntentTr || option.labelTr,
        requiresLatin,
        targetMeaningTr: option.targetMeaningTr || option.playerIntentTr || option.labelTr,
        detectedLatinText: looksLatin ? inputText : undefined,
        detectedTurkishIntent: looksLatin ? undefined : inputText,
        canResolveImmediately: !requiresLatin,
        suggestedLatinPromptTr: requiresLatin ? "Bunu Latince ifade etmeye çalış." : undefined
      };
    }

    if (looksLatin) {
      return {
        ok: false,
        interpretationSource: "heuristic",
        actionKind: "direct_latin_utterance",
        confidence: 0.55,
        meaningTr: "Doğrudan Latince bir söz söyledin.",
        requiresLatin: false,
        detectedLatinText: inputText,
        canResolveImmediately: false,
        suggestedOptionIds: context.availableOptions.slice(0, 3).map((option) => option.id),
        rejection: { reasonCode: "too_ambiguous", messageTr: "Sözünü duydular, ama niyetin tam anlaşılmadı. Bunu hangi eylem olarak söylediğini seçebilirsin.", suggestedOptionIds: context.availableOptions.slice(0, 3).map((option) => option.id) }
      };
    }

    if (keywordKind !== "unknown") {
      return {
        ok: false,
        interpretationSource: "heuristic",
        actionKind: keywordKind,
        confidence: 0.45,
        meaningTr: inputText,
        requiresLatin: false,
        canResolveImmediately: false,
        rejection: { reasonCode: "no_matching_action", messageTr: "Niyetin anlaşılıyor, fakat bu anda onu güvenle gerçekleştirecek bir yol görünmüyor.", suggestedOptionIds: context.availableOptions.slice(0, 3).map((option) => option.id) }
      };
    }
    return null;
  }

  private detectActionKind(clean: string, looksLatin: boolean): FreeformActionKind {
    if (looksLatin) return "direct_latin_utterance";
    const patterns: Array<[FreeformActionKind, RegExp]> = [
      ["ask_npc", /\b(sor|soruyorum|öğrenmek|ogrenmek)\b/], ["inspect_object", /\b(incele|bakıyorum|bakiyorum|kontrol|araştır)\b/],
      ["read_text", /\b(oku|okuyorum|yazıyı|yaziyi)\b/], ["listen", /\b(dinle|kulak ver)\b/], ["remember", /\b(hatırla|hatirla)\b/],
      ["journal", /\b(defter|günlük|gunluk|not al)\b/],
      ["move_or_leave", /\b(git|çık|cik|ayrıl|ayril|yola)\b/], ["help", /\b(yardım|yardim|taşı|tasi|destek)\b/],
      ["refuse", /\b(reddet|istemiyorum|hayır|hayir)\b/], ["bargain", /\b(pazarlık|pazarlik|fiyat)\b/], ["persuade", /\b(ikna)\b/],
      ["thank", /\b(teşekkür|tesekkur|sağ ol|sag ol)\b/], ["apologize", /\b(özür|ozur)\b/], ["answer_npc", /\b(cevap|yanıt|yanit)\b/],
      ["speak_to_npc", /\b(söyle|soyle|konuş|konus|selamla|diyorum)\b/]
    ];
    return patterns.find(([, pattern]) => pattern.test(clean))?.[0] ?? "unknown";
  }

  private validateLlmResult(parsed: Record<string, any>, inputText: string, context: { availableOptions: AvailableAction[]; nearbyNpcIds: string[] }): FreeformInterpretationResult {
    const confidence = typeof parsed.confidence === "number" ? Math.max(0, Math.min(1, parsed.confidence)) : 0;
    const actionKind = ACTION_KINDS.includes(parsed.actionKind) ? parsed.actionKind : "unknown";
    const availableIds = new Set(context.availableOptions.map((option) => option.id));
    const matchedId = parsed.matchedOptionId || parsed.matchedIntentId;
    const targetNpcId = typeof parsed.targetNpcId === "string" ? parsed.targetNpcId : undefined;
    if (targetNpcId && !context.nearbyNpcIds.includes(targetNpcId)) return this.rejection(inputText, actionKind, confidence, "npc_not_present", "Aradığın kişi burada görünmüyor.", context.availableOptions);
    if (matchedId && !availableIds.has(matchedId)) return this.rejection(inputText, actionKind, confidence, "no_matching_action", "Bu anda o eyleme giden güvenli bir yol görünmüyor.", context.availableOptions);
    if (confidence < 0.72 || !matchedId) return this.rejection(inputText, actionKind, confidence, parsed.rejection?.reasonCode || "too_ambiguous", parsed.rejection?.messageTr || "Ne yapmak istediğin tam anlaşılmadı.", context.availableOptions);
    return {
      ok: true,
      interpretationSource: "llm",
      actionKind,
      matchedOptionId: parsed.matchedOptionId || undefined,
      matchedIntentId: parsed.matchedIntentId || undefined,
      confidence,
      targetNpcId,
      meaningTr: parsed.meaningTr || inputText,
      requiresLatin: Boolean(parsed.requiresLatin),
      targetMeaningTr: parsed.targetMeaningTr || undefined,
      detectedLatinText: parsed.detectedLatinText || undefined,
      detectedTurkishIntent: parsed.detectedLatinText ? undefined : inputText,
      canResolveImmediately: !parsed.requiresLatin,
      suggestedLatinPromptTr: parsed.suggestedLatinPromptTr || (parsed.requiresLatin ? "Bunu Latince ifade etmeye çalış." : undefined)
    };
  }

  private rejection(inputText: string, actionKind: FreeformActionKind, confidence: number, reasonCode: FreeformInterpretationResult["rejection"] extends infer R ? R extends { reasonCode: infer C } ? C : never : never, messageTr: string, options: AvailableAction[]): FreeformInterpretationResult {
    const suggestedOptionIds = options.slice(0, 3).map((option) => option.id);
    return { ok: false, interpretationSource: "llm", actionKind, confidence, meaningTr: inputText, requiresLatin: false, canResolveImmediately: false, suggestedOptionIds, rejection: { reasonCode, messageTr, suggestedOptionIds } };
  }

  private buildFallbackRejection(inputText: string, options: AvailableAction[]): FreeformInterpretationResult {
    const suggestedOptionIds = options.slice(0, 3).map((option) => option.id);
    return { ok: false, interpretationSource: "fallback", actionKind: "unknown", confidence: 0, meaningTr: inputText, requiresLatin: false, canResolveImmediately: false, suggestedOptionIds, rejection: { reasonCode: "no_matching_action", messageTr: options.length ? "Bu anda bunu nasıl yapacağını kestiremiyorsun. Önündeki eylemlerden birini deneyebilir veya niyetini başka türlü yazabilirsin." : "Burada şu an gerçekleştirebileceğin belirgin bir eylem yok.", suggestedOptionIds } };
  }
}
