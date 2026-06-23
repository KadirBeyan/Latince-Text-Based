import type { LlmClient } from "./LlmClient";
import type { LlmProviderConfig } from "./LlmTypes";
import { OpenAiCompatibleClient } from "./OpenAiCompatibleClient";

export function createLlmClient(config: LlmProviderConfig): LlmClient {
  // All providers are mapped to the OpenAI-compatible client interface for now
  return new OpenAiCompatibleClient(config);
}
export class LlmProviderFactory {
  static createLlmClient(config: LlmProviderConfig): LlmClient {
    return createLlmClient(config);
  }
}
