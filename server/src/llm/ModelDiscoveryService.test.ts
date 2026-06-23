import { test } from "node:test";
import assert from "node:assert";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  discoverLmStudioModels,
  discoverOllamaModels,
  scanModelDirectory,
  type ModelDiscoveryConfig,
} from "./ModelDiscoveryService";

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("Ollama /api/tags response is normalized", async () => {
  globalThis.fetch = (async (input: RequestInfo | URL) => {
    assert.strictEqual(String(input), "http://localhost:11434/api/tags");
    return new Response(JSON.stringify({
      models: [{ name: "llama3.2:3b", model: "llama3.2:3b", size: 1234, modified_at: "2026-06-01T12:00:00Z" }],
    }), { status: 200 });
  }) as typeof fetch;

  const result = await discoverOllamaModels(baseConfig());
  assert.deepStrictEqual(result.errors, []);
  assert.deepStrictEqual(result.models, [
    {
      id: "ollama:gemma4:31b-cloud",
      name: "gemma4:31b-cloud",
      provider: "ollama",
      source: "preset",
    },
    {
      id: "ollama:llama3.2:3b",
      name: "llama3.2:3b",
      provider: "ollama",
      source: "api",
      sizeBytes: 1234,
      modifiedAt: "2026-06-01T12:00:00Z",
    },
  ]);
});

test("filesystem scan finds .gguf files recursively", async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "model-scan-"));
  await fs.mkdir(path.join(root, "publisher", "model"), { recursive: true });
  await fs.writeFile(path.join(root, "publisher", "model", "q4.gguf"), "mock");
  await fs.writeFile(path.join(root, "publisher", "model", "notes.txt"), "ignore");

  const models = await scanModelDirectory(root);
  assert.strictEqual(models.length, 1);
  assert.strictEqual(models[0].name, "publisher/model/q4");
  assert.strictEqual(models[0].sizeBytes, 4);
});

test("missing LM Studio path returns an error instead of crashing", async () => {
  const result = await discoverLmStudioModels({ ...baseConfig(), lmStudioModelsPaths: [path.join(os.tmpdir(), "does-not-exist-lmstudio")] });
  assert.deepStrictEqual(result.models, []);
  assert.strictEqual(result.errors.length, 1);
  assert.strictEqual(result.errors[0].provider, "lmstudio");
});

test("duplicate filesystem models are removed", async () => {
  const first = await fs.mkdtemp(path.join(os.tmpdir(), "lmstudio-a-"));
  const second = await fs.mkdtemp(path.join(os.tmpdir(), "lmstudio-b-"));
  for (const root of [first, second]) {
    await fs.mkdir(path.join(root, "vendor", "model"), { recursive: true });
    await fs.writeFile(path.join(root, "vendor", "model", "model.gguf"), "mock");
  }

  const result = await discoverLmStudioModels({ ...baseConfig(), lmStudioModelsPaths: [first, second] });
  assert.deepStrictEqual(result.errors, []);
  assert.strictEqual(result.models.length, 1);
  assert.strictEqual(result.models[0].name, "vendor/model/model");
  assert.strictEqual(result.models[0].provider, "lmstudio");
});

function baseConfig(): ModelDiscoveryConfig {
  return {
    ollamaBaseUrl: "http://localhost:11434/v1",
    ollamaModelsPath: undefined,
    lmStudioModelsPaths: [],
  };
}
