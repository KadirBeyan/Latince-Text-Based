import test from "node:test";
import assert from "node:assert/strict";
import { FreeformActionInterpreter } from "./FreeformActionInterpreter";
import type { ConversationOption } from "../types/ConversationTypes";

const options: ConversationOption[] = [
  { id: "help", labelTr: "Yardım etmeyi kabul et", aliasesTr: ["yardım edeceğimi söylüyorum"], verb: "help", requiresLatin: true, targetMeaningTr: "Sana yardım edeceğim." },
  { id: "inspect", labelTr: "Sepeti incele", aliasesTr: ["sepetin içine bakıyorum"], verb: "inspect", requiresLatin: false },
  { id: "ask", labelTr: "Nereye götüreceğini sor", aliasesTr: ["nereye gideceğimi soruyorum"], verb: "ask", requiresLatin: true, targetMeaningTr: "Nereye gitmeliyim?" }
];

const interpreter = new FreeformActionInterpreter();
const context = { availableOptions: options, nearbyNpcIds: ["mater"], currentNode: { id: "start", options } as any };

test("Turkish freeform action maps to a Latin-requiring help option", async () => {
  const result = await interpreter.interpretFreeformAction({ inputText: "Mater'e yardım edeceğimi söylüyorum", context });
  assert.equal(result.ok, true);
  assert.equal(result.actionKind, "help");
  assert.equal(result.matchedOptionId, "help");
  assert.equal(result.requiresLatin, true);
});

test("inspect and ask actions are classified", async () => {
  const inspect = await interpreter.interpretFreeformAction({ inputText: "Sepetin içine bakıyorum", context });
  const ask = await interpreter.interpretFreeformAction({ inputText: "Nereye gideceğimi soruyorum", context });
  assert.equal(inspect.actionKind, "inspect_object");
  assert.equal(inspect.canResolveImmediately, true);
  assert.equal(ask.actionKind, "ask_npc");
});

test("direct Latin utterance is detected and strongly matched", async () => {
  const result = await interpreter.interpretFreeformAction({ inputText: "Certe, mater. Panem porto.", context: { ...context, availableOptions: [{ ...options[0], aliasesTr: ["certe mater panem porto"] }] } });
  assert.equal(result.actionKind, "direct_latin_utterance");
  assert.equal(result.detectedLatinText, "Certe, mater. Panem porto.");
});

test("ambiguous action receives a natural rejection with suggestions", async () => {
  const result = await interpreter.interpretFreeformAction({ inputText: "Bir şey yapıyorum", context });
  assert.equal(result.ok, false);
  assert.equal(result.rejection?.reasonCode, "no_matching_action");
  assert.deepEqual(result.rejection?.suggestedOptionIds, ["help", "inspect", "ask"]);
});
