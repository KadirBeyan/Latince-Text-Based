import { test } from "node:test";
import assert from "node:assert";
import express from "express";
import { createLlmRoutes } from "./llmRoutes";

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("/api/llm/models provider filter returns only requested provider", async () => {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    if (String(input) === "http://localhost:11434/api/tags") {
      return new Response(JSON.stringify({
        models: [{ name: "mistral:7b", model: "mistral:7b", size: 99, modified_at: "2026-06-02T00:00:00Z" }],
      }), { status: 200 });
    }
    return originalFetch(input, init);
  }) as typeof fetch;

  const app = express();
  app.use(express.json());
  app.use(createLlmRoutes({ ollamaBaseUrl: "http://localhost:11434", ollamaModelsPath: undefined, lmStudioModelsPaths: [] }));
  const server = app.listen(0);
  try {
    const address = server.address();
    assert.ok(address && typeof address !== "string");
    const response = await fetch(`http://127.0.0.1:${address.port}/api/llm/models?provider=ollama`);
    assert.strictEqual(response.status, 200);
    const result = await response.json() as { models: Array<{ provider: string; name: string; source: string }>; errors: unknown[] };
    assert.deepStrictEqual(result.models.map((model) => model.provider), ["ollama", "ollama"]);
    assert.deepStrictEqual(result.models.map((model) => model.name), ["gemma4:31b-cloud", "mistral:7b"]);
    assert.strictEqual(result.models[0].source, "preset");
    assert.deepStrictEqual(result.errors, []);
  } finally {
    server.close();
  }
});
