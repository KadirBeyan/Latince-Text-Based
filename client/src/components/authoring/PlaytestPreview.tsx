import { Play, Trash, ArrowClockwise } from "@phosphor-icons/react";
import { useState } from "react";
import { VpBadge, VpButton, VpCard, VpEmptyState, VpInput, VpSectionHeader } from "../ui";
import { useAuthoringStore } from "../../stores/authoringStore";
import { PreviewStateDiff } from "./PreviewStateDiff";
import { InteractionIntentList } from "../game/interaction/InteractionIntentList";
import { SelectedIntentPanel } from "../game/interaction/SelectedIntentPanel";
import { LatinActionComposer } from "../game/interaction/LatinActionComposer";
import { ObservationResultCard } from "../game/interaction/ObservationResultCard";
import { NextActionsPanel } from "../game/interaction/NextActionsPanel";
import type { GameAction, InteractionIntent } from "../../types/gameTypes";

export function PlaytestPreview() {
  const { previewSession, selectedDocument, startPreviewSession, sendPreviewAction, resetPreviewSession, discardPreviewSession } = useAuthoringStore();
  const [answer, setAnswer] = useState("");
  const [acknowledgedEventId, setAcknowledgedEventId] = useState<string | null>(null);
  const scene = previewSession?.state?.currentScene;
  const activeInteraction = previewSession?.state?.activeInteraction;
  const latestResolved = (previewSession?.state?.recentEvents ?? []).filter((event: any) => event.type === "INTENT_RESOLVED").at(-1);
  const activeResolution = latestResolved && latestResolved.id !== acknowledgedEventId ? latestResolved.payload?.resolution : null;
  const intents = getPreviewIntents(scene, activeInteraction);
  const selectedIntent = activeInteraction?.selectedIntentId ? intents.find((intent) => intent.id === activeInteraction.selectedIntentId) ?? scene?.interactionModel?.intents?.find((intent: InteractionIntent) => intent.id === activeInteraction.selectedIntentId) : undefined;
  const send = (action: GameAction) => void sendPreviewAction(action);
  return <VpCard variant="compact" className="authoring-side-card authoring-playtest"><VpSectionHeader eyebrow="Preview" title="Playtest v2" description="Gercek GameEngine session uzerinden test." /><div className="authoring-chip-row"><VpBadge variant="success">Preview mode</VpBadge>{previewSession ? <VpBadge>{previewSession.source.kind}</VpBadge> : null}{scene ? <VpBadge variant="gold">{scene.inputMode}</VpBadge> : null}</div><div className="authoring-toolbar"><VpButton variant="ghost" icon={<Play size={17} />} disabled={!selectedDocument || !["scene", "quest"].includes(selectedDocument.kind)} onClick={() => void startPreviewSession()}>Baslat</VpButton><VpButton variant="ghost" icon={<ArrowClockwise size={17} />} disabled={!previewSession} onClick={() => { setAcknowledgedEventId(null); void resetPreviewSession(); }}>Reset</VpButton><VpButton variant="ghost" icon={<Trash size={17} />} disabled={!previewSession} onClick={() => void discardPreviewSession()}>Discard</VpButton></div>{scene ? <div className="authoring-preview"><div className="authoring-preview-scene"><strong>{scene.titleTr ?? scene.title}</strong><p>{scene.descriptionTr ?? scene.description}</p></div>{selectedIntent ? <div className="authoring-preview-flow"><SelectedIntentPanel intent={selectedIntent} onClear={() => setAcknowledgedEventId(latestResolved?.id ?? null)} /><LatinActionComposer intent={selectedIntent} onSubmitText={(text) => { setAnswer(""); send({ type: "TEXT_SUBMIT", text }); }} isLoading={false} /></div> : activeResolution ? <div className="authoring-preview-flow"><ObservationResultCard resolution={activeResolution} /><NextActionsPanel consequences={activeResolution.consequences} onContinue={() => setAcknowledgedEventId(latestResolved?.id ?? null)} /></div> : intents.length ? <InteractionIntentList intents={intents} actionLoading={false} onSelectIntent={(intentId) => send({ type: "INTENT_SELECT", saveId: previewSession.save.id, sceneId: scene.id, intentId })} /> : scene.choices?.length ? <div className="authoring-preview-actions">{scene.choices.map((choice: any) => <VpButton key={choice.id} type="button" variant="ghost" onClick={() => send({ type: "CHOICE_SELECT", choiceId: choice.id })}>{choice.label}</VpButton>)}</div> : null}{scene.textChallenge ? <form className="authoring-preview-answer" onSubmit={(event) => { event.preventDefault(); if (!answer.trim()) return; send({ type: "TEXT_SUBMIT", text: answer.trim() }); setAnswer(""); }}><code>{scene.textChallenge.promptTr ?? scene.textChallenge.prompt}</code><VpInput value={answer} onChange={(event) => setAnswer(event.target.value)} /><VpButton type="submit" variant="primary">Gonder</VpButton></form> : null}<PreviewStateDiff diff={previewSession?.stateDiff} /><details><summary>Event log</summary><ul className="authoring-event-log">{(previewSession?.recentEvents ?? []).map((event: any) => <li key={event.id ?? `${event.type}-${event.timestamp}`}><strong>{event.type}</strong><small>{event.timestamp}</small></li>)}</ul></details></div> : <VpEmptyState title="Preview yok">Scene veya quest secildiginde gercek motorla test baslatilabilir.</VpEmptyState>}</VpCard>;
}

function getPreviewIntents(scene: any, activeInteraction: any): InteractionIntent[] {
  if (activeInteraction?.tempOptions?.length) return activeInteraction.tempOptions;
  if (scene?.dialogueSequence?.turns?.length) return scene.dialogueSequence.turns[activeInteraction?.activeTurnIndex ?? 0]?.intents ?? [];
  return scene?.interactionModel?.intents ?? [];
}
