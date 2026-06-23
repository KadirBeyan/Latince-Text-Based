import test from "node:test";
import assert from "node:assert/strict";
import { openDatabase, initDatabase } from "../../db/database";
import { ContentLoader } from "../content/ContentLoader";
import { SaveRepository } from "../save/SaveRepository";
import { GameEngine } from "./GameEngine";

function createEngine() {
  const db = openDatabase(":memory:");
  initDatabase(db);
  const loader = new ContentLoader();
  loader.load();
  return new GameEngine(loader, new SaveRepository(db));
}

test("freeform Turkish speech creates pending Latin and correct submission resolves authored option", async () => {
  const engine = createEngine();
  let state = await engine.createNewGame("Titus");
  state = await engine.submitAction(state.saveId, { type: "START_CONVERSATION", saveId: state.saveId, flowId: "conv_mater_bread_help" });
  state = await engine.submitAction(state.saveId, { type: "FREEFORM_ACTION_SUBMIT", saveId: state.saveId, inputText: "Yardım etmeyi kabul ediyorum" });
  assert.equal(state.pendingFreeformLatin?.matchedOptionId, "opt_accept");
  assert.equal(state.pendingFreeformLatin?.targetMeaningTr, "Sana yardım etmeyi istiyorum");
  const pendingId = state.pendingFreeformLatin!.id;
  state = await engine.submitAction(state.saveId, { type: "FREEFORM_LATIN_SUBMIT", saveId: state.saveId, pendingFreeformLatinId: pendingId, answer: "Te adiuvare volo." });
  assert.equal(state.pendingFreeformLatin, undefined);
  assert.equal(state.activeConversation?.currentNodeId, "accept_help");
  assert.ok(state.recentEvents.some((event) => event.type === "FREEFORM_LATIN_EVALUATED"));
});

test("near miss keeps pending state and increases hint support", async () => {
  const engine = createEngine();
  let state = await engine.createNewGame("Titus");
  state = await engine.submitAction(state.saveId, { type: "START_CONVERSATION", saveId: state.saveId, flowId: "conv_mater_bread_help" });
  state = await engine.submitAction(state.saveId, { type: "FREEFORM_ACTION_SUBMIT", saveId: state.saveId, inputText: "Yardım etmeyi kabul ediyorum" });
  state = await engine.submitAction(state.saveId, { type: "FREEFORM_LATIN_SUBMIT", saveId: state.saveId, pendingFreeformLatinId: state.pendingFreeformLatin!.id, answer: "Salve." });
  assert.equal(state.pendingFreeformLatin?.attempts, 1);
  assert.equal(state.pendingFreeformLatin?.hintLevel, "vocabulary");
  assert.equal(state.activeConversation?.currentNodeId, "start");
});

test("matched non-Latin freeform option resolves through ConversationEngine", async () => {
  const engine = createEngine();
  let state = await engine.createNewGame("Titus");
  state = await engine.submitAction(state.saveId, { type: "START_CONVERSATION", saveId: state.saveId, flowId: "conv_mater_bread_help" });
  state = await engine.submitAction(state.saveId, { type: "FREEFORM_ACTION_SUBMIT", saveId: state.saveId, inputText: "Sepeti incele" });
  assert.equal(state.activeConversation?.currentNodeId, "inspect_basket");
  assert.equal(state.pendingFreeformLatin, undefined);
});
