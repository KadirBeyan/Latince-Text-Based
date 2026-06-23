import type { LlmClient } from "../llm/LlmClient";
import { safeJsonParse } from "../llm/JsonRepair";
import type {
  DialogueResponseChallenge,
  DialogueEvaluationResult,
  LatinResponseVerdict,
} from "../game/types/DialogueChallengeTypes";

export async function judgeWithLlm(params: {
  answer: string;
  challenge: DialogueResponseChallenge;
  sceneContext: {
    sceneId: string;
    titleTr?: string;
    locationId?: string;
    npcIds?: string[];
    previousDialogue?: unknown[];
  };
  playerContext: {
    level?: number;
    assessmentLevel?: string;
    knownGrammarIds?: string[];
    knownVocabularyIds?: string[];
  };
  llmClient: LlmClient;
}): Promise<Partial<DialogueEvaluationResult>> {
  const { answer, challenge, sceneContext, playerContext, llmClient } = params;

  const systemPrompt = `Sen bir Antik Romalı Magister ve Latince gramer/semantik değerlendirme uzmanısın.
Kullanıcının yazdığı Latince cevabı aşağıdaki bilgilere göre değerlendir ve sadece belirtilen JSON formatında çıktı ver. Başka hiçbir açıklama veya metin ekleme!

JSON Şeması:
{
  "verdict": "exact_correct | equivalent_correct | acceptable_variant | near_miss | context_wrong | grammar_wrong | meaning_wrong | wrong",
  "acceptedAsCorrect": true,
  "confidence": 1.0,
  "meaningMatches": true,
  "grammarOk": true,
  "contextOk": true,
  "levelAppropriate": true,
  "detectedMeaningTr": "Oyuncunun cevabının Türkçe meali",
  "feedbackTr": "Kısa Türkçe pedagojik geribildirim",
  "grammarNoteTr": "İsteğe bağlı Türkçe gramer notu",
  "contextNoteTr": "İsteğe bağlı Türkçe bağlam notu",
  "errors": [
    {
      "code": "Hata kodu (örn: WRONG_PERSON, ACCUSATIVE_REQUIRED)",
      "messageTr": "Hatanın Türkçe açıklaması",
      "severity": "info | warning | error"
    }
  ]
}

Değerlendirme Kuralları:
1. "verdict" Değerleri:
   - exact_correct: canonicalAnswers ile aynı anlamda ve kelimede ise.
   - equivalent_correct: canonicalAnswers ile tam olarak aynı anlama gelen eşdeğer bir cümle ise.
   - acceptable_variant: acceptedVariants içinden biriyle eşleşiyorsa veya gramer olarak doğru, anlam olarak kabul edilebilir ise.
   - near_miss: Küçük bir yazım veya gramer hatası varsa (örn. fiil çekimi veya isim durumu eki yanlış ama kelimeler doğru).
   - context_wrong: Latince gramer doğru olabilir ama diyalog bağlamında yanlış ise. Örneğin NPC "Quis es?" (Kimsin?) dediğinde, oyuncunun kendini tanıtmak yerine "Tu es Marcus" (Sen Marcus'sun) demesi.
   - grammar_wrong: Cümlenin anlamı yakın olsa da bariz gramer hataları varsa.
   - meaning_wrong: Gramer doğru olabilir ama hedeflenen anlamdan tamamen uzak bir şey söylenmişse.
   - wrong: Tamamen yanlış veya alakasız cevaplar.

2. "acceptedAsCorrect" Alanı:
   - "exact_correct", "equivalent_correct" veya "acceptable_variant" durumlarında TRUE olmalıdır.
   - Diğer durumlarda FALSE olmalıdır.

3. "confidence" Alanı:
   - Değerlendirmenin doğruluğundan ne kadar emin olduğunu belirten 0.0 ile 1.0 arasında bir oran.

4. Asla XP, puan, seviye atlama, ödül veya sahne geçişi kararı vermeye çalışma. Sadece dilsel değerlendirme yap.`;

  const userContent = {
    playerAnswer: answer,
    npcPromptLatin: challenge.npcPromptLatin || "",
    npcPromptTr: challenge.npcPromptTr || "",
    playerIntentTr: challenge.playerIntentTr,
    targetMeaningTr: challenge.targetMeaningTr,
    canonicalAnswers: challenge.canonicalAnswers,
    acceptedVariants: challenge.acceptedVariants || [],
    rejectedMeanings: challenge.rejectedMeanings || [],
    expectedLevel: challenge.expectedLevel || "A0",
    sceneContext: {
      sceneId: sceneContext.sceneId,
      locationId: sceneContext.locationId || "",
      npcIds: sceneContext.npcIds || [],
    },
    playerContext: {
      level: playerContext.level || 1,
      assessmentLevel: playerContext.assessmentLevel || "A0",
    },
  };

  const response = await llmClient.chat({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: JSON.stringify(userContent) },
    ],
    temperature: 0.1,
    responseFormat: "json",
  });

  const parsed = safeJsonParse<any>(response.text);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("LLM did not return a valid JSON object.");
  }

  // Clamping confidence
  let confidence = typeof parsed.confidence === "number" ? parsed.confidence : 0.5;
  confidence = Math.min(1.0, Math.max(0.0, confidence));

  // Validate and clamp verdict
  const validVerdicts: LatinResponseVerdict[] = [
    "exact_correct",
    "equivalent_correct",
    "acceptable_variant",
    "near_miss",
    "context_wrong",
    "grammar_wrong",
    "meaning_wrong",
    "wrong",
  ];
  let verdict: LatinResponseVerdict = parsed.verdict;
  if (!validVerdicts.includes(verdict)) {
    verdict = "wrong";
  }

  // Enforce verdict rules for acceptedAsCorrect
  let acceptedAsCorrect = false;
  if (verdict === "exact_correct" || verdict === "equivalent_correct" || verdict === "acceptable_variant") {
    acceptedAsCorrect = true;
  }

  // Downgrade if confidence is below minimum confidence threshold
  const minConfidence = challenge.evaluation?.minimumConfidence ?? 0.5;
  if (acceptedAsCorrect && confidence < minConfidence) {
    acceptedAsCorrect = false;
    verdict = "near_miss";
  }

  const errors = Array.isArray(parsed.errors)
    ? parsed.errors.map((e: any) => ({
        code: typeof e.code === "string" ? e.code : "LLM_ERROR",
        messageTr: typeof e.messageTr === "string" ? e.messageTr : "Hata tespit edildi.",
        severity: ["info", "warning", "error"].includes(e.severity) ? e.severity : "error",
        span: typeof e.span === "string" ? e.span : undefined,
      }))
    : [];

  return {
    verdict,
    acceptedAsCorrect,
    confidence,
    meaningMatches: typeof parsed.meaningMatches === "boolean" ? parsed.meaningMatches : acceptedAsCorrect,
    grammarOk: typeof parsed.grammarOk === "boolean" ? parsed.grammarOk : acceptedAsCorrect,
    contextOk: typeof parsed.contextOk === "boolean" ? parsed.contextOk : acceptedAsCorrect,
    levelAppropriate: typeof parsed.levelAppropriate === "boolean" ? parsed.levelAppropriate : true,
    detectedMeaningTr: parsed.detectedMeaningTr,
    feedbackTr: parsed.feedbackTr,
    grammarNoteTr: parsed.grammarNoteTr,
    contextNoteTr: parsed.contextNoteTr,
    errors,
    debug: {
      source: "llm",
      rawLlm: parsed,
    },
  };
}
