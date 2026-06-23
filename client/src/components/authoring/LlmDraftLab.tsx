import { useState } from "react";
import { Sparkle } from "@phosphor-icons/react";
import { VpBadge, VpButton, VpCard, VpInput, VpSectionHeader, VpTextarea } from "../ui";
import { useAuthoringStore } from "../../stores/authoringStore";
import type { LlmDraftKind } from "../../types/authoringTypes";

const templates = ["Vicus conversation node uret", "Pazar kelime pratiği uret", "NPC dialogue draft uret", "Köy okuma sahnesi uret", "Assessment question uret", "Vicus review quest uret"];

export function LlmDraftLab() {
  const { generateLlmDraft, llmDraftResult, applyLlmDraftToEditor, loading } = useAuthoringStore();
  const [kind, setKind] = useState<LlmDraftKind>("scene");
  const [promptTr, setPromptTr] = useState(templates[0]);
  const [chapterId, setChapterId] = useState("village_first_days");
  const [locationId, setLocationId] = useState("ludus");
  const [grammarIds, setGrammarIds] = useState("greetings-basic");
  const [vocabularyIds, setVocabularyIds] = useState("vocab-salve");
  return <div className="authoring-editor-stack"><VpCard variant="compact"><VpSectionHeader eyebrow="LLM Draft Lab" title="Generate draft" description="Model config yoksa basit guvenli fallback draft uretilecek." /><div className="authoring-form-grid"><label><span>kind</span><select value={kind} onChange={(event) => setKind(event.target.value as LlmDraftKind)}><option value="scene">scene</option><option value="quest">quest</option><option value="npc">npc</option><option value="location">location</option><option value="grammar-explanation">grammar-explanation</option><option value="assessment-question">assessment-question</option><option value="review-quest">review-quest</option></select></label><label><span>chapter</span><VpInput value={chapterId} onChange={(event) => setChapterId(event.target.value)} /></label><label><span>location</span><VpInput value={locationId} onChange={(event) => setLocationId(event.target.value)} /></label><label><span>grammar</span><VpInput value={grammarIds} onChange={(event) => setGrammarIds(event.target.value)} /></label><label><span>vocabulary</span><VpInput value={vocabularyIds} onChange={(event) => setVocabularyIds(event.target.value)} /></label></div><label className="authoring-wide"><span>promptTr</span><VpTextarea value={promptTr} onChange={(event) => setPromptTr(event.target.value)} /></label><div className="authoring-template-row">{templates.map((template) => <button key={template} type="button" onClick={() => setPromptTr(template)}>{template}</button>)}</div><VpButton icon={<Sparkle size={17} />} disabled={loading} onClick={() => void generateLlmDraft({ kind, chapterId, locationId, grammarIds: split(grammarIds), vocabularyIds: split(vocabularyIds), difficulty: "practice", promptTr })}>Draft</VpButton></VpCard>{llmDraftResult ? <VpCard variant="compact"><VpSectionHeader eyebrow="Draft" title={llmDraftResult.ok ? "Ready" : "Needs QA"} /><div className="authoring-chip-row"><VpBadge variant={llmDraftResult.generatedBy === "llm" ? "success" : "gold"}>{llmDraftResult.generatedBy === "llm" ? "Gercek LLM" : "Guvenli fallback"}</VpBadge>{llmDraftResult.fallbackReason ? <VpBadge variant="gold">{llmDraftResult.fallbackReason}</VpBadge> : null}</div><pre className="authoring-json-preview">{JSON.stringify(llmDraftResult.sanitizedDraft ?? llmDraftResult.draft, null, 2)}</pre><VpButton variant="secondary" onClick={applyLlmDraftToEditor}>Editore aktar</VpButton></VpCard> : null}</div>;
}

function split(value: string): string[] { return value.split(",").map((item) => item.trim()).filter(Boolean); }
