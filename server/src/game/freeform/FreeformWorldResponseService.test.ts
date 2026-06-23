import test from "node:test";
import assert from "node:assert/strict";
import { FreeformWorldResponseService } from "./FreeformWorldResponseService";

test("template fallback produces a natural, mutation-free response", () => {
  const interpretation: any = { ok: true, interpretationSource: "heuristic", actionKind: "inspect_object", confidence: .9, meaningTr: "Sepeti inceliyorsun", requiresLatin: false, canResolveImmediately: true };
  const frozen = JSON.stringify(interpretation);
  const response = new FreeformWorldResponseService().buildFreeformWorldResponse({ interpretation, context: { npcIds: ["mater"] } });
  assert.match(response.narrationTr ?? "", /ayrıntılar/);
  assert.equal(response.tone, "neutral");
  assert.equal(JSON.stringify(interpretation), frozen);
});

test("rejection response stays in RPG language", () => {
  const response = new FreeformWorldResponseService().buildFreeformWorldResponse({ interpretation: { ok: false, interpretationSource: "fallback", actionKind: "unknown", confidence: 0, meaningTr: "tapınağa bak", requiresLatin: false, canResolveImmediately: false, rejection: { reasonCode: "out_of_scope", messageTr: "Buradan tapınağı göremiyorsun.", suggestedOptionIds: ["ask"] } }, context: { npcIds: [] } });
  assert.equal(response.narrationTr, "Buradan tapınağı göremiyorsun.");
  assert.deepEqual(response.suggestedNextOptionIds, ["ask"]);
});
