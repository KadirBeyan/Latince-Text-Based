import type {
  LlmChatRequest,
  LlmChatResponse,
  LatinAnswerEvaluationContext,
  SceneNarrationContext,
  SceneNarrationResult,
  HintContext,
  HintResult,
  NpcReplyContext,
  NpcReplyResult,
  SceneDraftContext,
  SceneDraftResult,
} from "./LlmTypes";
import type { LatinEvaluationResult } from "../latin/LatinEvaluator";

export interface LlmClient {
  chat(request: LlmChatRequest): Promise<LlmChatResponse>;
  evaluateLatinAnswer(context: LatinAnswerEvaluationContext): Promise<LatinEvaluationResult>;
  generateSceneNarration(context: SceneNarrationContext): Promise<SceneNarrationResult>;
  generateHint(context: HintContext): Promise<HintResult>;
  generateNpcReply(context: NpcReplyContext): Promise<NpcReplyResult>;
  generateSceneDraft(context: SceneDraftContext): Promise<SceneDraftResult>;
}
