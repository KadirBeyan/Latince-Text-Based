import { useEffect, useState } from "react";
import { Copy, FloppyDisk, GitBranch, Play, ShieldCheck, Sparkle, Trash, X } from "@phosphor-icons/react";
import { VpButton, VpCard, VpEmptyState, VpSectionHeader, VpTabs } from "../ui";
import { AuthoringProvider, useAuthoringStore } from "../../stores/authoringStore";
import { ContentTree } from "./ContentTree";
import { FieldInspector } from "./FieldInspector";
import { ValidationIssueList } from "./ValidationIssueList";
import { PlaytestPreview } from "./PlaytestPreview";
import { UnsavedChangesBar } from "./UnsavedChangesBar";
import { JsonDiffViewer } from "./JsonDiffViewer";
import { AuthoringDashboard } from "./AuthoringDashboard";
import { ValidationDashboard } from "./ValidationDashboard";
import { LlmDraftLab } from "./LlmDraftLab";
import { CampaignEditor } from "./CampaignEditor";
import { ChapterEditor } from "./ChapterEditor";
import { QuestEditor } from "./QuestEditor";
import { SceneEditor } from "./SceneEditor";
import { NpcEditor } from "./NpcEditor";
import { LocationEditor } from "./LocationEditor";
import { LatinDataEditor } from "./LatinDataEditor";
import { SceneGraphEditor } from "./graph/SceneGraphEditor";
import { OverrideStatusBadge } from "./OverrideStatusBadge";
import { VillageActivityEditor } from "./village/VillageActivityEditor";
import { VillageLoopPreview } from "./village/VillageLoopPreview";

type StudioTab = "editor" | "dashboard" | "validation" | "graph" | "llm" | "preview" | "village";

export function AuthoringStudio({ onClose }: { onClose: () => void }) {
  return <AuthoringProvider><AuthoringStudioInner onClose={onClose} /></AuthoringProvider>;
}

function AuthoringStudioInner({ onClose }: { onClose: () => void }) {
  const store = useAuthoringStore();
  const [tab, setTab] = useState<StudioTab>("editor");
  useEffect(() => { window.scrollTo(0, 0); void store.loadTree(); void store.validateAll(); void store.loadBackups(); }, []);
  const editor = renderEditor(store.selectedDocument?.kind, store.draftData, store.replaceDraftData, store.updateDraftData);
  return <div className="authoring-studio"><header className="authoring-top"><div><p className="eyebrow">Authoring Studio</p><h1>Via Prima Content QA</h1></div><div className="authoring-actions"><VpButton variant="ghost" icon={<ShieldCheck size={17} />} onClick={() => void store.validateDraft()} disabled={!store.selectedDocument}>Validate</VpButton><VpButton variant="ghost" icon={<Play size={17} />} onClick={() => void store.previewDraft()} disabled={store.selectedDocument?.kind !== "scene"}>Preview</VpButton><VpButton variant="ghost" icon={<GitBranch size={17} />} onClick={() => setTab("graph")}>Visual Graph</VpButton><VpButton variant="ghost" icon={<Sparkle size={17} />} onClick={() => setTab("llm")}>LLM Draft</VpButton><VpButton variant="ghost" icon={<Copy size={17} />} disabled={!store.selectedDocument} onClick={() => { const id = window.prompt("New id"); if (id) void store.duplicateDocument(id); }}>Duplicate</VpButton><VpButton variant="danger" icon={<Trash size={17} />} disabled={!store.selectedDocument} onClick={() => window.confirm("Delete document?") && void store.deleteDocument()}>Delete</VpButton><VpButton icon={<FloppyDisk size={17} />} disabled={!store.selectedDocument || store.saving} onClick={() => void store.saveDraft()}>Save</VpButton><VpButton variant="ghost" icon={<X size={17} />} onClick={onClose}>Close</VpButton></div></header><VpTabs ariaLabel="Authoring sections" active={tab} onChange={setTab} tabs={[{ id: "editor", label: "Editor" }, { id: "dashboard", label: "Dashboard" }, { id: "validation", label: "Validation" }, { id: "graph", label: "Visual Graph" }, { id: "llm", label: "LLM Draft Lab" }, { id: "preview", label: "Preview" }, { id: "village", label: "Village Loop" }]} className="authoring-main-tabs" /><UnsavedChangesBar visible={store.unsavedChanges} saving={store.saving} onSave={() => void store.saveDraft()} onValidate={() => void store.validateDraft()} />{store.error ? <div className="error-band"><span>{store.error}</span><button type="button" onClick={store.clearError}>Kapat</button></div> : null}<div className="authoring-grid"><aside><ContentTree /></aside><main>{tab === "dashboard" ? <AuthoringDashboard /> : tab === "validation" ? <ValidationDashboard /> : tab === "graph" ? <SceneGraphEditor /> : tab === "llm" ? <LlmDraftLab /> : tab === "preview" ? <PlaytestPreview /> : tab === "village" ? <VillageLoopPreview /> : store.selectedDocument ? <><EditorHeader onOpenGraph={() => setTab("graph")} /><div>{editor}</div><JsonDiffViewer original={store.selectedDocument.data} draft={store.draftData} /></> : <VpCard><VpEmptyState title="Belge sec">Sol agactan bir content belgesi ac.</VpEmptyState></VpCard>}</main><aside><FieldInspector document={store.selectedDocument} data={store.draftData} /><ValidationIssueList validation={store.validation} /><PlaytestPreview /></aside></div></div>;
}

function EditorHeader({ onOpenGraph }: { onOpenGraph: () => void }) {
  const { selectedDocument } = useAuthoringStore();
  const graphable = selectedDocument?.kind === "scene" || selectedDocument?.kind === "quest" || selectedDocument?.kind === "chapter";
  return <VpCard variant="compact" className="authoring-editor-header"><VpSectionHeader eyebrow={selectedDocument?.kind} title={selectedDocument?.title ?? "Document"} description={selectedDocument?.path} /><OverrideStatusBadge document={selectedDocument} />{graphable ? <VpButton variant="ghost" icon={<GitBranch size={16} />} onClick={onOpenGraph}>{selectedDocument?.kind === "scene" ? "Graph'te Goster" : selectedDocument?.kind === "quest" ? "Quest Graph" : "Chapter Graph"}</VpButton> : null}</VpCard>;
}

function renderEditor(kind: string | undefined, data: any, replace: (data: any) => void, patch: (patch: any) => void) {
  const onPatch = (value: any) => replace(value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).some((key) => key in (data ?? {})) ? { ...(data ?? {}), ...value } : value);
  if (!kind) return null;
  if (kind === "campaign") return <CampaignEditor data={data} onChange={patch} />;
  if (kind === "chapter") return <ChapterEditor data={data} onChange={patch} />;
  if (kind === "quest") return <QuestEditor data={data} onChange={patch} />;
  if (kind === "scene") return <SceneEditor data={data} onChange={patch} />;
  if (kind === "npc") return <NpcEditor data={data} onChange={patch} />;
  if (kind === "location") return <LocationEditor data={data} onChange={patch} />;
  if (kind === "village-activity") return <VillageActivityEditor data={data} onChange={patch} />;
  if (kind === "grammar" || kind === "vocabulary" || kind === "assessment-question" || kind === "quest-template") return <LatinDataEditor data={data} kind={kind} onChange={onPatch} />;
  return null;
}
