import { normalizeLatin, latinEquals, latinSimilarity } from "./LatinNormalizer";
import type {
  DialogueResponseChallenge,
  DialogueEvaluationResult,
  LatinResponseVerdict,
  DialogueReaction,
} from "../game/types/DialogueChallengeTypes";
import type { LlmProviderConfig } from "../llm/LlmTypes";
import { judgeWithLlm } from "./LatinSemanticJudge";
import { tokenizeLatin } from "./LatinTokenizer";

type Person = "1" | "2" | "3";

function sentencePerson(text: string): { pronoun?: Person; verb?: Person } {
  const tokens = tokenizeLatin(text).map((token) => token.normalized);
  const pronoun = tokens.includes("ego") ? "1" : tokens.includes("tu") ? "2" : undefined;
  const sumPersons: Record<string, Person> = { sum: "1", sumus: "1", es: "2", estis: "2", est: "3", sunt: "3" };
  const verb = tokens.map((token) => sumPersons[token]).find(Boolean);
  return { pronoun, verb };
}

function sameTokenMultiset(left: string, right: string): boolean {
  const sorted = (value: string) => tokenizeLatin(value).map((token) => token.normalized).sort().join("|");
  return sorted(left) === sorted(right);
}

function sameWithOptionalSubjectPronoun(left: string, right: string): boolean {
  const sorted = (value: string) => tokenizeLatin(value)
    .map((token) => token.normalized)
    .filter((token) => token !== "ego" && token !== "tu")
    .sort()
    .join("|");
  return sorted(left) === sorted(right);
}

export async function evaluateDialogueResponse(params: {
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
  llmConfig?: LlmProviderConfig;
}): Promise<DialogueEvaluationResult> {
  const { answer, challenge, sceneContext, playerContext, llmConfig } = params;

  // 1. Empty answer guard
  const trimmed = answer.trim();
  if (!trimmed) {
    return {
      verdict: "wrong",
      acceptedAsCorrect: false,
      confidence: 1.0,
      meaningMatches: false,
      grammarOk: false,
      contextOk: false,
      levelAppropriate: true,
      normalizedAnswer: "",
      targetMeaningTr: challenge.targetMeaningTr,
      feedbackTr: "Lütfen bir cevap yazın.",
      errors: [
        {
          code: "EMPTY_ANSWER",
          messageTr: "Cevap boş olamaz.",
          severity: "error",
        },
      ],
      npcReaction: challenge.reactions?.wrong,
      debug: { source: "fallback" },
    };
  }

  const normalized = normalizeLatin(trimmed);

  // Helper to select the correct reaction based on verdict
  const getReactionForVerdict = (v: LatinResponseVerdict): DialogueReaction | undefined => {
    const rx = challenge.reactions;
    if (!rx) return undefined;
    switch (v) {
      case "exact_correct":
        return rx.correct;
      case "equivalent_correct":
        return rx.equivalentCorrect || rx.correct;
      case "acceptable_variant":
        return rx.acceptableVariant || rx.equivalentCorrect || rx.correct;
      case "near_miss":
        return rx.nearMiss;
      case "context_wrong":
        return rx.contextWrong || rx.wrong;
      case "grammar_wrong":
      case "meaning_wrong":
      case "wrong":
      default:
        return rx.wrong;
    }
  };

  // 2. Exact match canonicalAnswers
  for (const canonical of challenge.canonicalAnswers) {
    if (latinEquals(normalized, canonical)) {
      const verdict = "exact_correct";
      return {
        verdict,
        acceptedAsCorrect: true,
        confidence: 1.0,
        meaningMatches: true,
        grammarOk: true,
        contextOk: true,
        levelAppropriate: true,
        normalizedAnswer: normalized,
        matchedCanonicalAnswer: canonical,
        targetMeaningTr: challenge.targetMeaningTr,
        feedbackTr: challenge.reactions?.correct?.feedbackTr || "Mükemmel! Tam olarak doğru cevap.",
        errors: [],
        npcReaction: getReactionForVerdict(verdict),
        debug: { source: "exact" },
      };
    }
  }

  // 3. Exact/normalized match acceptedVariants
  if (challenge.acceptedVariants && challenge.acceptedVariants.length > 0) {
    for (const variant of challenge.acceptedVariants) {
      if (latinEquals(normalized, variant)) {
        const verdict = "equivalent_correct";
        return {
          verdict,
          acceptedAsCorrect: true,
          confidence: 1.0,
          meaningMatches: true,
          grammarOk: true,
          contextOk: true,
          levelAppropriate: true,
          normalizedAnswer: normalized,
          matchedVariant: variant,
          targetMeaningTr: challenge.targetMeaningTr,
          feedbackTr: challenge.reactions?.equivalentCorrect?.feedbackTr || "Doğru! Alternatif bir doğru cevap.",
          errors: [],
          npcReaction: getReactionForVerdict(verdict),
          debug: { source: "variant" },
        };
      }
    }
  }

  // 4. Explicitly rejected meanings are authoritative authoring hints.
  if (challenge.rejectedMeanings && challenge.rejectedMeanings.length > 0) {
    for (const rej of challenge.rejectedMeanings) {
      if (rej.exampleLatin && latinEquals(normalized, rej.exampleLatin)) {
        const verdict = "context_wrong";
        return {
          verdict,
          acceptedAsCorrect: false,
          confidence: 1.0,
          meaningMatches: false,
          grammarOk: true,
          contextOk: false,
          levelAppropriate: true,
          normalizedAnswer: normalized,
          detectedMeaningTr: rej.meaningTr,
          targetMeaningTr: challenge.targetMeaningTr,
          feedbackTr: rej.reasonTr,
          errors: [{ code: "REJECTED_MEANING", messageTr: rej.reasonTr, severity: "error" }],
          npcReaction: getReactionForVerdict(verdict),
          debug: { source: "fallback" },
        };
      }
    }
  }

  // 5. Safe word-order equivalence. This never introduces or removes words.
  if (challenge.evaluation?.allowWordOrderVariation) {
    for (const canonical of challenge.canonicalAnswers) {
      if (sameTokenMultiset(trimmed, canonical)) {
        const verdict = "acceptable_variant";
        return {
          verdict,
          acceptedAsCorrect: true,
          confidence: 0.96,
          meaningMatches: true,
          grammarOk: true,
          contextOk: true,
          levelAppropriate: true,
          normalizedAnswer: normalized,
          matchedCanonicalAnswer: canonical,
          targetMeaningTr: challenge.targetMeaningTr,
          feedbackTr: challenge.reactions?.acceptableVariant?.feedbackTr || "Doğru. Latince kelime sırası bu bağlamda değişebilir.",
          errors: [],
          npcReaction: getReactionForVerdict(verdict),
          debug: { source: "morphology" },
        };
      }
    }
  }

  if (challenge.evaluation?.allowEquivalentMeaning) {
    for (const canonical of challenge.canonicalAnswers) {
      const answerPerson = sentencePerson(trimmed);
      const canonicalPerson = sentencePerson(canonical);
      if (answerPerson.verb && canonicalPerson.verb && answerPerson.verb === canonicalPerson.verb && sameWithOptionalSubjectPronoun(trimmed, canonical)) {
        const verdict = "equivalent_correct";
        return {
          verdict,
          acceptedAsCorrect: true,
          confidence: 0.94,
          meaningMatches: true,
          grammarOk: true,
          contextOk: true,
          levelAppropriate: true,
          normalizedAnswer: normalized,
          matchedCanonicalAnswer: canonical,
          targetMeaningTr: challenge.targetMeaningTr,
          feedbackTr: challenge.reactions?.equivalentCorrect?.feedbackTr || "Doğru. Latince çekimli fiil özneyi zaten gösterebilir.",
          errors: [],
          npcReaction: getReactionForVerdict(verdict),
          debug: { source: "morphology" },
        };
      }
    }
  }

  // 6. Similarity is calculated early, but only used after semantic/person checks.
  let bestCanonical = challenge.canonicalAnswers[0] || "";
  let bestScore = -1;
  for (const canonical of challenge.canonicalAnswers) {
    const score = latinSimilarity(normalized, canonical);
    if (score > bestScore) {
      bestScore = score;
      bestCanonical = canonical;
    }
  }

  // 7. Deterministic morphology/person heuristic.
  const answerPerson = sentencePerson(trimmed);
  const canonicalPersons = challenge.canonicalAnswers.map(sentencePerson);
  const expectedPronoun = canonicalPersons.map((item) => item.pronoun).find(Boolean);
  const expectedVerb = canonicalPersons.map((item) => item.verb).find(Boolean);

  if (answerPerson.pronoun && answerPerson.verb && answerPerson.pronoun !== answerPerson.verb) {
    const verdict = "grammar_wrong";
    return {
      verdict,
      acceptedAsCorrect: false,
      confidence: 0.98,
      meaningMatches: true,
      grammarOk: false,
      contextOk: true,
      levelAppropriate: true,
      normalizedAnswer: normalized,
      matchedCanonicalAnswer: bestCanonical,
      targetMeaningTr: challenge.targetMeaningTr,
      feedbackTr: "Özne ile fiilin şahsı uyuşmuyor. Örneğin ‘ego’ ile ‘sum’, ‘tu’ ile ‘es’ kullanılmalıdır.",
      grammarNoteTr: `Özne ${answerPerson.pronoun}. şahıs, fiil ise ${answerPerson.verb}. şahıs biçiminde.`,
      errors: [{ code: "PERSON_AGREEMENT", messageTr: "Özne ve fiil şahıs bakımından uyuşmuyor.", severity: "error" }],
      npcReaction: getReactionForVerdict(verdict),
      debug: { source: "morphology" },
    };
  }

  if ((expectedPronoun && answerPerson.pronoun && expectedPronoun !== answerPerson.pronoun) ||
      (expectedVerb && answerPerson.verb && expectedVerb !== answerPerson.verb)) {
    const verdict = challenge.evaluation?.requireContextMatch === false ? "meaning_wrong" : "context_wrong";
    return {
      verdict,
      acceptedAsCorrect: false,
      confidence: 0.94,
      meaningMatches: false,
      grammarOk: true,
      contextOk: false,
      levelAppropriate: true,
      normalizedAnswer: normalized,
      matchedCanonicalAnswer: bestCanonical,
      targetMeaningTr: challenge.targetMeaningTr,
      feedbackTr: expectedPronoun === "1"
        ? "Cümle kurulmuş, fakat burada kendinden söz etmen gerekiyor. Birinci tekil şahıs kullanmalısın."
        : "Cümle kurulmuş, fakat hedeflenen kişi/şahıs diyalog bağlamıyla uyuşmuyor.",
      contextNoteTr: "Cevabın şahsı, konuşma niyetindeki şahısla eşleşmiyor.",
      errors: [{ code: "CONTEXT_PERSON_MISMATCH", messageTr: "Cevabın şahsı hedeflenen diyalog bağlamıyla uyuşmuyor.", severity: "error" }],
      npcReaction: getReactionForVerdict(verdict),
      debug: { source: "morphology" },
    };
  }

  // 8. LLM semantic judge (if enabled and client available)
  if (challenge.evaluation?.useLlmSemanticJudge && llmConfig) {
    try {
      const { LlmProviderFactory } = await import("../llm/LlmProviderFactory");
      const llmClient = LlmProviderFactory.createLlmClient(llmConfig);
      const judgeResult = await judgeWithLlm({
        answer: trimmed,
        challenge,
        sceneContext,
        playerContext,
        llmClient,
      });

      const verdict = judgeResult.verdict || "wrong";
      const confidence = typeof judgeResult.confidence === "number" ? judgeResult.confidence : 0.5;
      const acceptedAsCorrect = !!judgeResult.acceptedAsCorrect;

      return {
        verdict,
        acceptedAsCorrect,
        confidence,
        meaningMatches: !!judgeResult.meaningMatches,
        grammarOk: !!judgeResult.grammarOk,
        contextOk: !!judgeResult.contextOk,
        levelAppropriate: !!judgeResult.levelAppropriate,
        normalizedAnswer: normalized,
        detectedMeaningTr: judgeResult.detectedMeaningTr,
        targetMeaningTr: challenge.targetMeaningTr,
        feedbackTr: judgeResult.feedbackTr || "Değerlendirme tamamlandı.",
        errors: judgeResult.errors || [],
        grammarNoteTr: judgeResult.grammarNoteTr,
        vocabularyNoteTr: judgeResult.vocabularyNoteTr,
        contextNoteTr: judgeResult.contextNoteTr,
        npcReaction: judgeResult.npcReaction || getReactionForVerdict(verdict),
        debug: {
          source: "llm",
          rawLlm: judgeResult.debug?.rawLlm,
        },
      };
    } catch (err) {
      console.error("LLM dialogue response evaluation failed, falling back:", err);
    }
  }

  // 9. Similarity near miss and deterministic fallback.
  if (bestScore >= 0.75) {
    const verdict = "near_miss";
    return {
      verdict,
      acceptedAsCorrect: false,
      confidence: bestScore,
      meaningMatches: true, // meaning is probably close
      grammarOk: false, // probably has a small grammar/spelling error
      contextOk: true,
      levelAppropriate: true,
      normalizedAnswer: normalized,
      matchedCanonicalAnswer: bestCanonical,
      targetMeaningTr: challenge.targetMeaningTr,
      feedbackTr:
        challenge.reactions?.nearMiss?.feedbackTr ||
        `Cevabınız çok yakın! Şunu mu demek istediniz: "${bestCanonical}"?`,
      errors: [
        {
          code: "NEAR_MISS",
          messageTr: `Cevap hedef cümleye benziyor, ancak ufak farklılıklar var.`,
          severity: "warning",
        },
      ],
      npcReaction: getReactionForVerdict(verdict),
      debug: { source: "fallback" },
    };
  }

  // Default fallback (wrong)
  const verdict = "wrong";
  return {
    verdict,
    acceptedAsCorrect: false,
    confidence: 0.5,
    meaningMatches: false,
    grammarOk: false,
    contextOk: false,
    levelAppropriate: true,
    normalizedAnswer: normalized,
    targetMeaningTr: challenge.targetMeaningTr,
    feedbackTr:
      challenge.reactions?.wrong?.feedbackTr ||
      "Cevabınız hedeflenen anlamı taşımıyor veya gramer hatası içeriyor. Lütfen tekrar deneyin.",
    errors: [
      {
        code: "INCORRECT_ANSWER",
        messageTr: "Cevap hedeflenen anlamla eşleşmiyor.",
        severity: "error",
      },
    ],
    npcReaction: getReactionForVerdict(verdict),
    debug: { source: "fallback" },
  };
}
