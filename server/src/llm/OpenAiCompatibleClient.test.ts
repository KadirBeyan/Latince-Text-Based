import { test } from "node:test";
import assert from "node:assert";
import { OpenAiCompatibleClient } from "./OpenAiCompatibleClient";

const originalFetch = globalThis.fetch;

test.afterEach(() => {
  globalThis.fetch = originalFetch;
});

test("OpenAiCompatibleClient normalizes baseUrl without duplicate v1 or broken slashes", async () => {
  const cases = [
    ["http://localhost:11434", "http://localhost:11434/v1/chat/completions"],
    ["http://localhost:11434/v1", "http://localhost:11434/v1/chat/completions"],
    ["http://localhost:1234/v1/", "http://localhost:1234/v1/chat/completions"],
    ["https://api.openai.com/v1", "https://api.openai.com/v1/chat/completions"],
  ];

  for (const [baseUrl, expectedEndpoint] of cases) {
    let capturedUrl = "";
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      capturedUrl = String(input);
      return new Response(JSON.stringify({ choices: [{ message: { content: "OK" } }] }), { status: 200 });
    }) as typeof fetch;

    const client = new OpenAiCompatibleClient({ provider: "custom", baseUrl, model: "mock-model" });
    await client.chat({ messages: [{ role: "user", content: "ping" }] });
    assert.strictEqual(capturedUrl, expectedEndpoint);
  }
});

test("OpenAiCompatibleClient normalizes LLM evaluation JSON schema", async () => {
  globalThis.fetch = (async () => {
    return new Response(JSON.stringify({
      choices: [{
        message: {
          content: JSON.stringify({
            isCorrect: "yes",
            score: 125,
            confidence: -0.5,
            errorTags: "not-an-array",
          }),
        },
      }],
    }), { status: 200 });
  }) as typeof fetch;

  const client = new OpenAiCompatibleClient({ provider: "custom", baseUrl: "http://localhost:11434", model: "mock-model" });
  const evaluation = await client.evaluateLatinAnswer({
    playerAnswer: "Ave",
    expectedAnswers: ["Salve."],
    prompt: "Selam ver.",
    sceneId: "scene",
    questId: "quest",
    playerLevel: 1,
    unlockedSkills: [],
  });

  assert.strictEqual(evaluation.isCorrect, false);
  assert.strictEqual(evaluation.score, 100);
  assert.strictEqual(evaluation.confidence, 0);
  assert.strictEqual(evaluation.feedbackTr, "Cevabın değerlendirilemedi.");
  assert.deepStrictEqual(evaluation.errorTags, []);
  assert.deepStrictEqual(evaluation.grammarNotes, []);
  assert.deepStrictEqual(evaluation.vocabularyNotes, []);
});

test("LLM scene draft returns a safe fallback for broken JSON", async () => {
  globalThis.fetch = (async () => new Response(JSON.stringify({ choices: [{ message: { content: "broken json" } }] }), { status: 200 })) as typeof fetch;
  const client = new OpenAiCompatibleClient({ provider: "custom", baseUrl: "http://localhost:11434", model: "mock" });
  const result = await client.generateSceneDraft({ grammarIds: ["greetings"], vocabularyIds: [], locationId: "ludus", npcIds: [], difficulty: "intro", count: 1 });
  assert.deepStrictEqual(result.drafts, []);
  assert.ok(result.parseError);
});
