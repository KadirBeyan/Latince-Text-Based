import type { LatinEvaluationResult } from "../latin/LatinEvaluator";
import { safeJsonParse } from "./JsonRepair";
import type { LlmClient } from "./LlmClient";
import type {
  LlmProviderConfig,
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
import {
  buildLatinEvaluationPrompt,
  buildSceneNarrationPrompt,
  buildHintPrompt,
  buildNpcReplyPrompt,
  buildSceneDraftPrompt,
} from "./PromptBuilder";
import { sanitizeEvaluationResult, sanitizeHintResult, sanitizeNarrationResult, sanitizeNpcReplyResult } from "./LlmOutputGuard";

export class OpenAiCompatibleClient implements LlmClient {
  private readonly normalizedBaseUrl: string;

  constructor(public readonly config: LlmProviderConfig) {
    this.normalizedBaseUrl = this.normalizeUrl(config.baseUrl);
  }

  private normalizeUrl(url: string): string {
    if (typeof url !== "string" || !url.trim()) {
      throw new Error("LLM provider baseUrl must be a non-empty string.");
    }
    const clean = url.trim().replace(/\/+$/, "");
    if (/\/v1$/i.test(clean)) {
      return clean;
    }
    return `${clean}/v1`;
  }

  async chat(request: LlmChatRequest): Promise<LlmChatResponse> {
    const endpoint = `${this.normalizedBaseUrl}/chat/completions`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.config.apiKey) {
      headers["Authorization"] = `Bearer ${this.config.apiKey}`;
    }

    const requestBody = {
      model: this.config.model,
      messages: request.messages,
      temperature: request.temperature ?? this.config.temperature ?? 0.2,
      response_format: request.responseFormat === "json" ? { type: "json_object" } : undefined,
    };

    const timeoutMs = this.config.timeoutMs ?? 15000; // default 15s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(`LLM provider returned status ${response.status}: ${errorText || response.statusText}`);
      }

      const data = (await response.json()) as {
        choices?: Array<{
          message?: {
            content?: string;
          };
        }>;
      };

      const content = data.choices?.[0]?.message?.content;
      if (content === undefined || content === null) {
        throw new Error("Invalid response format from LLM provider: missing message content.");
      }

      return {
        text: content,
        raw: data,
      };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error(`LLM provider request timed out after ${timeoutMs}ms.`);
      }
      throw new Error(`LLM client chat request failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async evaluateLatinAnswer(context: LatinAnswerEvaluationContext): Promise<LatinEvaluationResult> {
    const response = await this.chat({
      messages: buildLatinEvaluationPrompt(context),
      temperature: this.config.temperature ?? 0.2,
      responseFormat: "json",
    });

    const parsed = safeJsonParse<Partial<LatinEvaluationResult>>(response.text);
    if (!parsed) {
      throw new Error(`Failed to parse LLM evaluation JSON: ${response.text}`);
    }

    return sanitizeEvaluationResult(parsed);
  }

  async generateSceneNarration(context: SceneNarrationContext): Promise<SceneNarrationResult> {
    const response = await this.chat({
      messages: buildSceneNarrationPrompt(context),
      temperature: this.config.temperature ?? 0.5,
      responseFormat: "json",
    });

    const parsed = safeJsonParse<Partial<SceneNarrationResult>>(response.text);
    if (!parsed) {
      throw new Error(`Failed to parse LLM scene narration JSON: ${response.text}`);
    }

    return sanitizeNarrationResult({ ...parsed, narrationTr: parsed.narrationTr || context.sceneDescription, objectiveReminderTr: parsed.objectiveReminderTr || context.sceneObjective });
  }

  async generateHint(context: HintContext): Promise<HintResult> {
    const response = await this.chat({
      messages: buildHintPrompt(context),
      temperature: this.config.temperature ?? 0.4,
      responseFormat: "json",
    });

    const parsed = safeJsonParse<Partial<HintResult>>(response.text);
    if (!parsed) {
      throw new Error(`Failed to parse LLM hint JSON: ${response.text}`);
    }

    return sanitizeHintResult(parsed);
  }

  async generateNpcReply(context: NpcReplyContext): Promise<NpcReplyResult> {
    const response = await this.chat({
      messages: buildNpcReplyPrompt(context),
      temperature: this.config.temperature ?? 0.5,
      responseFormat: "json",
    });

    const parsed = safeJsonParse<Partial<NpcReplyResult>>(response.text);
    if (!parsed) {
      throw new Error(`Failed to parse LLM NPC reply JSON: ${response.text}`);
    }

    return sanitizeNpcReplyResult(parsed);
  }

  async generateSceneDraft(context: SceneDraftContext): Promise<SceneDraftResult> {
    const response = await this.chat({ messages: buildSceneDraftPrompt(context), temperature: this.config.temperature ?? 0.4, responseFormat: "json" });
    const parsed = safeJsonParse<Partial<SceneDraftResult>>(response.text);
    if (!parsed || !Array.isArray(parsed.drafts)) return { drafts: [], parseError: "LLM scene draft JSON could not be parsed." };
    return { drafts: parsed.drafts };
  }

}
