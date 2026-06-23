import type { LlmProviderConfig } from "../../llm/LlmTypes";
import type { ConversationFlow, ConversationNode, ConversationOption } from "../types/ConversationTypes";
import type { InteractionIntent, Scene, CharacterProfile } from "../types/gameTypes";
import { createLlmClient } from "../../llm/LlmProviderFactory";
import { safeJsonParse } from "../../llm/JsonRepair";

export type FreeformInterpretationResult = {
  ok: boolean;
  interpretationSource: "llm" | "heuristic" | "fallback";
  matchedOptionId?: string;
  matchedIntentId?: string;
  confidence: number;
  actionVerb?: string;
  targetNpcId?: string;
  meaningTr: string;
  requiresLatin?: boolean;
  suggestedResponseTr?: string;
  rejection?: {
    reasonCode:
      | "out_of_scope"
      | "not_possible_here"
      | "npc_not_present"
      | "too_ambiguous"
      | "unsafe_or_invalid"
      | "no_matching_action";
    messageTr: string;
    suggestedOptionIds?: string[];
  };
  debug?: unknown;
};

export class FreeformActionInterpreter {
  async interpretFreeformAction(params: {
    inputText: string;
    context: {
      scene?: Scene;
      conversationFlow?: ConversationFlow;
      currentNode?: ConversationNode;
      availableOptions: (ConversationOption | InteractionIntent)[];
      nearbyNpcIds: string[];
      locationId?: string;
      playerProfile?: CharacterProfile;
    };
    llmConfig?: LlmProviderConfig;
  }): Promise<FreeformInterpretationResult> {
    const { inputText, context, llmConfig } = params;

    // 1. Try Heuristic Fallback first (or if LLM not configured)
    const heuristicResult = this.tryHeuristicMatch(inputText, context.availableOptions);
    if (heuristicResult) {
      return heuristicResult;
    }

    if (!llmConfig) {
      // Return rejection fallback if no LLM config
      return this.buildFallbackRejection(inputText, context.availableOptions);
    }

    // 2. Call LLM for semantic match
    try {
      const llmClient = createLlmClient(llmConfig);
      
      const optionsSerialized = (context.availableOptions as any[]).map(o => {
        if ("labelTr" in o) {
          // ConversationOption
          return { id: o.id, label: o.labelTr, description: o.descriptionTr || "", verb: o.verb, requiresLatin: o.requiresLatin };
        } else {
          // InteractionIntent
          return { id: o.id, label: o.labelTr, description: o.descriptionTr || "", verb: o.verb, requiresLatin: o.requiresLatin };
        }
      });

      const systemPrompt = `Sen bir text-based RPG oyununda oyuncunun serbest yazdığı eylemi yorumlayan bir yapay zekasın (Freeform Action Interpreter).
Görevin, oyuncunun Türkçe yazdığı eylemi anlamlandırmak ve mevcut eylem seçenekleri (available options) ile eşleştirmektir.

KURALLAR:
1. Yalnızca JSON biçiminde yanıt ver. Markdown veya açıklama ekleme.
2. Eşleşme kararı verirken anlam benzerliğini dikkate al.
3. Eğer oyuncunun yazdığı eylem mevcut seçeneklerden birine anlamca çok yakınsa ve yapılabilirse, "matchedOptionId" veya "matchedIntentId" alanını doldur.
4. Eşleşme güven oranı (confidence) 0.72'den düşükse veya oyuncunun yazdığı eylem mantıksız/bağlam dışıysa kesinlikle "matchedOptionId" / "matchedIntentId" değerini boş bırak ve bir "rejection" (reddetme gerekçesi) üret.
5. Asla oyuncuya yeni yetenek/ödül kazandırma kararı verme. Oyun durumunu değiştirme yetkin yoktur.
6. Yanıtını şu JSON şemasına göre oluştur:
{
  "ok": boolean (eşleşme bulunduysa true, rejection üretildiyse false),
  "matchedOptionId": string | null (eşleşen available option ID'si),
  "matchedIntentId": string | null (varsa eşleşen intent ID'si),
  "confidence": number (güven oranı, 0.0 ile 1.0 arası),
  "meaningTr": string (oyuncunun yazdığı eylemin kısa Türkçe özeti),
  "actionVerb": string | null (eylemin ana fiili, örn: "ask", "inspect"),
  "targetNpcId": string | null (eylemin hedef aldığı NPC kimliği, yoksa null),
  "rejection": {
    "reasonCode": "out_of_scope" | "not_possible_here" | "npc_not_present" | "too_ambiguous" | "unsafe_or_invalid" | "no_matching_action",
    "messageTr": string (oyuncuya gösterilecek doğal, nazik Türkçe reddetme açıklaması. Örn: "Şu anda öğretmen ortalıkta görünmüyor, onunla konuşamazsın. Bunun yerine sepeti inceleyebilirsin.")
  } | null
}`;

      const userContext = {
        inputText,
        availableOptions: optionsSerialized,
        nearbyNpcIds: context.nearbyNpcIds,
        locationId: context.locationId,
        playerProfile: context.playerProfile ? { name: context.playerProfile.name, origin: context.playerProfile.origin } : undefined
      };

      const response = await llmClient.chat({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: JSON.stringify(userContext) }
        ],
        temperature: 0.1,
        responseFormat: "json"
      });

      const parsed = safeJsonParse<any>(response.text);
      if (parsed) {
        const confidence = typeof parsed.confidence === "number" ? Math.max(0, Math.min(1, parsed.confidence)) : 0;
        const ok = Boolean(parsed.ok) && confidence >= 0.72;

        if (ok && (parsed.matchedOptionId || parsed.matchedIntentId)) {
          const id = parsed.matchedOptionId || parsed.matchedIntentId;
          const isValidId = context.availableOptions.some(o => o.id === id);
          if (isValidId) {
            return {
              ok: true,
              interpretationSource: "llm",
              matchedOptionId: parsed.matchedOptionId || undefined,
              matchedIntentId: parsed.matchedIntentId || undefined,
              confidence,
              actionVerb: parsed.actionVerb || undefined,
              targetNpcId: parsed.targetNpcId || undefined,
              meaningTr: parsed.meaningTr || inputText
            };
          }
        }

        const reasonCode = parsed.rejection?.reasonCode || "no_matching_action";
        const messageTr = parsed.rejection?.messageTr || "Bunu şu an burada yapamazsın.";
        return {
          ok: false,
          interpretationSource: "llm",
          confidence,
          meaningTr: parsed.meaningTr || inputText,
          rejection: {
            reasonCode,
            messageTr
          }
        };
      }
    } catch (e) {
      // Fallback on LLM failure
    }

    return this.buildFallbackRejection(inputText, context.availableOptions);
  }

  private tryHeuristicMatch(
    inputText: string,
    options: (ConversationOption | InteractionIntent)[]
  ): FreeformInterpretationResult | null {
    const cleanInput = inputText.toLowerCase().trim();
    if (!cleanInput) return null;

    for (const option of options) {
      const opt = option as any;
      const label = opt.labelTr.toLowerCase();
      if (cleanInput.includes(label) || label.includes(cleanInput)) {
        return {
          ok: true,
          interpretationSource: "heuristic",
          matchedOptionId: "verb" in opt ? opt.id : undefined,
          matchedIntentId: !("verb" in opt) ? opt.id : undefined,
          confidence: 0.9,
          meaningTr: opt.labelTr
        };
      }
    }
    return null;
  }

  private buildFallbackRejection(
    inputText: string,
    options: (ConversationOption | InteractionIntent)[]
  ): FreeformInterpretationResult {
    const suggestedLabels = options.slice(0, 3).map(o => `"${o.labelTr}"`);
    const messageTr = suggestedLabels.length > 0
      ? `Bunu şu anda yapamazsın. Şunları deneyebilirsin: ${suggestedLabels.join(", ")}`
      : "Bunu şu an burada yapamazsın.";

    return {
      ok: false,
      interpretationSource: "fallback",
      confidence: 0.0,
      meaningTr: inputText,
      rejection: {
        reasonCode: "no_matching_action",
        messageTr
      }
    };
  }
}
