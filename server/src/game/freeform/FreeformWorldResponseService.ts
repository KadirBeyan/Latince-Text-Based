import { randomUUID } from "node:crypto";
import type { CharacterProfile, DialogueEvaluationResult, FreeformWorldResponse, LivingSceneState } from "../types/gameTypes";
import type { FreeformInterpretationResult } from "./FreeformActionInterpreter";

export class FreeformWorldResponseService {
  buildFreeformWorldResponse(params: {
    interpretation: FreeformInterpretationResult;
    latinEvaluation?: DialogueEvaluationResult;
    context: {
      sceneId?: string;
      flowId?: string;
      nodeId?: string;
      locationId?: string;
      npcIds: string[];
      playerProfile?: CharacterProfile;
      livingSceneState?: LivingSceneState;
    };
  }): FreeformWorldResponse {
    const { interpretation, latinEvaluation } = params;
    if (interpretation.rejection) {
      return {
        narrationTr: interpretation.rejection.messageTr,
        feedbackTr: "Başka bir şey deneyebilir veya önündeki eylemlerden birini seçebilirsin.",
        consequencePresentations: [],
        suggestedNextOptionIds: interpretation.rejection.suggestedOptionIds,
        tone: "warning"
      };
    }
    if (latinEvaluation) {
      const success = latinEvaluation.acceptedAsCorrect;
      return {
        narrationTr: success ? "Sözlerin yerine ulaşıyor; dünya niyetine karşılık veriyor." : "Niyetin hissediliyor, fakat Latince sözlerin henüz tam yerine oturmuyor.",
        npcLineLatin: latinEvaluation.npcReaction?.npcLineLatin,
        npcLineTr: latinEvaluation.npcReaction?.npcLineTr,
        feedbackTr: latinEvaluation.feedbackTr,
        consequencePresentations: [{
          id: randomUUID(),
          kind: "latin",
          titleTr: success ? "Sözün anlaşıldı" : "Sözünü yeniden kurabilirsin",
          bodyTr: latinEvaluation.feedbackTr,
          tone: success ? "success" : "warning"
        }],
        tone: success ? "success" : "failure"
      };
    }
    const narrationByKind: Partial<Record<FreeformInterpretationResult["actionKind"], string>> = {
      inspect_object: "Yakından bakınca daha önce gözünden kaçan ayrıntılar belirginleşiyor.",
      listen: "Bir an susup çevrendeki seslere kulak veriyorsun.",
      remember: "Aklını yokluyor, bu ana dair bildiklerini bir araya getiriyorsun.",
      move_or_leave: "Niyetin bedenine yansıyor; bulunduğun yerde hareket başlıyor.",
      help: "Yardım etme isteğin davranışına açıkça yansıyor."
    };
    return {
      narrationTr: narrationByKind[interpretation.actionKind] || interpretation.meaningTr,
      feedbackTr: "Eylemin sahnenin sınırları içinde gerçekleşti.",
      consequencePresentations: [],
      suggestedNextOptionIds: interpretation.suggestedOptionIds,
      tone: "neutral"
    };
  }
}
