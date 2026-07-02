import { createContext, createElement, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { authoringApi } from "../api/authoringApi";
import type { AuthoringBackup, AuthoringContentKind, AuthoringDocument, AuthoringMetrics, AuthoringReferences, AuthoringTreeNode, AuthoringValidationResult, LlmDraftRequest, LlmDraftResult, PreviewSessionResult, ScenePreviewResult } from "../types/authoringTypes";
import type { GameAction } from "../types/gameTypes";

type AuthoringContextValue = {
  tree: AuthoringTreeNode[];
  selectedDocument: AuthoringDocument | null;
  selectedKind: AuthoringContentKind | null;
  selectedPath: string | null;
  draftData: any;
  validation: AuthoringValidationResult | null;
  allValidation: AuthoringValidationResult | null;
  metrics: AuthoringMetrics | null;
  references: AuthoringReferences | null;
  unsavedChanges: boolean;
  loading: boolean;
  saving: boolean;
  error: string | null;
  statusMessage: string | null;
  backups: AuthoringBackup[];
  llmDraftResult: LlmDraftResult | null;
  preview: ScenePreviewResult | null;
  previewSession: PreviewSessionResult | null;
  loadTree: () => Promise<void>;
  loadReferences: () => Promise<void>;
  selectDocument: (kind: AuthoringContentKind, pathOrId: string) => Promise<void>;
  updateDraftData: (patch: any) => void;
  replaceDraftData: (data: any) => void;
  discardDraftChanges: () => void;
  validateDraft: () => Promise<void>;
  validateAll: () => Promise<void>;
  saveDraft: () => Promise<void>;
  duplicateDocument: (newId: string) => Promise<void>;
  deleteDocument: () => Promise<void>;
  generateLlmDraft: (request: LlmDraftRequest) => Promise<void>;
  applyLlmDraftToEditor: () => void;
  loadBackups: () => Promise<void>;
  restoreBackup: (backupPath: string, targetPath: string) => Promise<void>;
  previewDraft: () => Promise<void>;
  startPreviewSession: () => Promise<void>;
  sendPreviewAction: (action: GameAction) => Promise<void>;
  resetPreviewSession: () => Promise<void>;
  discardPreviewSession: () => Promise<void>;
  clearError: () => void;
  clearStatus: () => void;
};

const AuthoringContext = createContext<AuthoringContextValue | null>(null);

export function AuthoringProvider({ children }: { children: ReactNode }) {
  const [tree, setTree] = useState<AuthoringTreeNode[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<AuthoringDocument | null>(null);
  const [draftData, setDraftData] = useState<any>(null);
  const [validation, setValidation] = useState<AuthoringValidationResult | null>(null);
  const [allValidation, setAllValidation] = useState<AuthoringValidationResult | null>(null);
  const [metrics, setMetrics] = useState<AuthoringMetrics | null>(null);
  const [references, setReferences] = useState<AuthoringReferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [backups, setBackups] = useState<AuthoringBackup[]>([]);
  const [llmDraftResult, setLlmDraftResult] = useState<LlmDraftResult | null>(null);
  const [preview, setPreview] = useState<ScenePreviewResult | null>(null);
  const [previewSession, setPreviewSession] = useState<PreviewSessionResult | null>(null);

  const unsavedChanges = useMemo(() => selectedDocument ? stableStringify(selectedDocument.data) !== stableStringify(draftData) : false, [draftData, selectedDocument]);
  const selectedKind = selectedDocument?.kind ?? null;
  const selectedPath = selectedDocument?.path ?? null;

  const loadTree = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      setTree(await authoringApi.tree());
      authoringApi.metrics().then(setMetrics).catch(() => undefined);
    } catch (err) { setError(message(err)); } finally { setLoading(false); }
  }, []);

  const loadReferences = useCallback(async () => {
    try { setReferences(await authoringApi.references()); } catch (err) { setError(message(err)); }
  }, []);

  const confirmDiscardIfDirty = useCallback(() => {
    if (!selectedDocument || stableStringify(selectedDocument.data) === stableStringify(draftData)) return true;
    setStatusMessage("Kaydedilmemis degisiklikler var. Once Save veya Discard changes kullan.");
    return false;
  }, [draftData, selectedDocument]);

  const selectDocument = useCallback(async (kind: AuthoringContentKind, pathOrId: string) => {
    if (!confirmDiscardIfDirty()) return;
    setLoading(true); setError(null);
    try {
      const doc = await authoringApi.document(kind, pathOrId);
      setSelectedDocument(doc); setDraftData(structuredClone(doc.data)); setValidation(doc.validation ?? null); setPreview(null); setPreviewSession(null); setStatusMessage(null);
    } catch (err) { setError(message(err)); } finally { setLoading(false); }
  }, [confirmDiscardIfDirty]);

  const updateDraftData = useCallback((patch: any) => setDraftData((current: any) => ({ ...(current ?? {}), ...patch })), []);
  const replaceDraftData = useCallback((data: any) => setDraftData(data), []);
  const discardDraftChanges = useCallback(() => {
    if (!selectedDocument) return;
    setDraftData(structuredClone(selectedDocument.data));
    setValidation(selectedDocument.validation ?? null);
    setStatusMessage("Taslak degisiklikleri geri alindi.");
  }, [selectedDocument]);

  const validateDraft = useCallback(async () => {
    if (!selectedDocument) return;
    setLoading(true); setError(null);
    try { const result = await authoringApi.validate({ kind: selectedDocument.kind, path: selectedDocument.path, data: draftData }); setValidation(result); setStatusMessage(result.ok ? "Validation temiz." : "Validation issue bulundu; kaydetmeden once duzelt."); } catch (err) { setError(message(err)); } finally { setLoading(false); }
  }, [draftData, selectedDocument]);

  const validateAll = useCallback(async () => {
    setLoading(true); setError(null);
    try { const [v, m] = await Promise.all([authoringApi.validateAll(), authoringApi.metrics()]); setAllValidation(v); setMetrics(m); await loadTree(); } catch (err) { setError(message(err)); } finally { setLoading(false); }
  }, [loadTree]);

  const saveDraft = useCallback(async () => {
    if (!selectedDocument) return;
    setSaving(true); setError(null);
    try {
      const result = await authoringApi.saveDocument({ kind: selectedDocument.kind, path: selectedDocument.path, data: draftData, validateBeforeSave: true, createBackup: true });
      setValidation(result.validation);
      if (!result.ok) {
        setStatusMessage("Kaydedilmedi: validation hatalari var.");
        return;
      }
      if (result.document) { setSelectedDocument(result.document); setDraftData(structuredClone(result.document.data)); }
      setStatusMessage(`Kaydedildi${result.savedTo ? ` (${result.savedTo})` : ""}.`);
      await loadTree();
      await loadBackupsImpl(setBackups);
    } catch (err) { setError(message(err)); } finally { setSaving(false); }
  }, [draftData, loadTree, selectedDocument]);

  const duplicateDocument = useCallback(async (newId: string) => {
    if (!selectedDocument) return;
    setSaving(true); setError(null);
    if (!confirmDiscardIfDirty()) { setSaving(false); return; }
    try { const doc = await authoringApi.duplicateDocument({ kind: selectedDocument.kind, sourcePath: selectedDocument.path, newId }); setSelectedDocument(doc); setDraftData(structuredClone(doc.data)); setStatusMessage("Belge kopyalandi."); await loadTree(); } catch (err) { setError(message(err)); } finally { setSaving(false); }
  }, [confirmDiscardIfDirty, loadTree, selectedDocument]);

  const deleteDocument = useCallback(async () => {
    if (!selectedDocument) return;
    setSaving(true); setError(null);
    if (!confirmDiscardIfDirty()) { setSaving(false); return; }
    try { await authoringApi.deleteDocument({ kind: selectedDocument.kind, path: selectedDocument.path, createBackup: true }); setSelectedDocument(null); setDraftData(null); setStatusMessage("Belge silindi; backup olusturuldu."); await loadTree(); } catch (err) { setError(message(err)); } finally { setSaving(false); }
  }, [confirmDiscardIfDirty, loadTree, selectedDocument]);

  const generateLlmDraft = useCallback(async (request: LlmDraftRequest) => {
    setLoading(true); setError(null);
    try { setLlmDraftResult(await authoringApi.generateLlmDraft(request)); } catch (err) { setError(message(err)); } finally { setLoading(false); }
  }, []);

  const applyLlmDraftToEditor = useCallback(() => {
    if (llmDraftResult?.sanitizedDraft) setDraftData(structuredClone(llmDraftResult.sanitizedDraft));
  }, [llmDraftResult]);

  const loadBackups = useCallback(async () => loadBackupsImpl(setBackups).catch((err) => setError(message(err))), []);
  const restoreBackup = useCallback(async (backupPath: string, targetPath: string) => { setSaving(true); try { await authoringApi.restoreBackup(backupPath, targetPath); await loadTree(); } catch (err) { setError(message(err)); } finally { setSaving(false); } }, [loadTree]);
  const previewDraft = useCallback(async () => { if (selectedDocument?.kind === "scene") setPreview(await authoringApi.previewScene(draftData)); }, [draftData, selectedDocument]);
  const startPreviewSession = useCallback(async () => {
    if (selectedDocument?.kind === "scene") setPreviewSession(await authoringApi.previewSessionFromDraftScene({ sceneDraft: draftData }));
    if (selectedDocument?.kind === "quest") setPreviewSession(await authoringApi.previewSessionFromQuest({ questId: String(draftData?.id ?? selectedDocument.id) }));
  }, [draftData, selectedDocument]);
  const sendPreviewAction = useCallback(async (action: GameAction) => { if (previewSession) setPreviewSession(await authoringApi.previewAction(previewSession.previewId, action)); }, [previewSession]);
  const resetPreviewSession = useCallback(async () => { if (previewSession) setPreviewSession(await authoringApi.previewReset(previewSession.previewId)); }, [previewSession]);
  const discardPreviewSession = useCallback(async () => { if (previewSession) { await authoringApi.previewDiscard(previewSession.previewId); setPreviewSession(null); } }, [previewSession]);

  const value: AuthoringContextValue = { tree, selectedDocument, selectedKind, selectedPath, draftData, validation, allValidation, metrics, references, unsavedChanges, loading, saving, error, statusMessage, backups, llmDraftResult, preview, previewSession, loadTree, loadReferences, selectDocument, updateDraftData, replaceDraftData, discardDraftChanges, validateDraft, validateAll, saveDraft, duplicateDocument, deleteDocument, generateLlmDraft, applyLlmDraftToEditor, loadBackups, restoreBackup, previewDraft, startPreviewSession, sendPreviewAction, resetPreviewSession, discardPreviewSession, clearError: () => setError(null), clearStatus: () => setStatusMessage(null) };
  return createElement(AuthoringContext.Provider, { value }, children);
}

export function useAuthoringStore(): AuthoringContextValue {
  const value = useContext(AuthoringContext);
  if (!value) throw new Error("useAuthoringStore must be used inside AuthoringProvider.");
  return value;
}

async function loadBackupsImpl(setBackups: (backups: AuthoringBackup[]) => void): Promise<void> {
  setBackups(await authoringApi.backups());
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : "Authoring islemi basarisiz oldu.";
}

function stableStringify(value: unknown): string {
  return JSON.stringify(value, Object.keys(flattenKeys(value)).sort());
}

function flattenKeys(value: unknown, acc: Record<string, true> = {}): Record<string, true> {
  if (value && typeof value === "object") for (const [key, child] of Object.entries(value)) { acc[key] = true; flattenKeys(child, acc); }
  return acc;
}
