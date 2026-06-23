import React from "react";
import { VpButton } from "../../ui";
import { SelectField, TextField } from "./editorUtils";
import type { FailureBranch, InteractionIntent } from "../../../types/gameTypes";
import { InteractionIntentEditor } from "./InteractionIntentEditor";

interface FailureBranchEditorProps {
  branches: FailureBranch[];
  onChange: (branches: FailureBranch[]) => void;
  sceneIds: string[];
  npcIds: string[];
  locationIds: string[];
}

export function FailureBranchEditor({
  branches = [],
  onChange,
  sceneIds,
  npcIds,
  locationIds
}: FailureBranchEditorProps) {
  const update = (index: number, patch: Partial<FailureBranch>) => {
    onChange(branches.map((b, i) => (i === index ? { ...b, ...patch } : b)));
  };

  const remove = (index: number) => {
    onChange(branches.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([
      ...branches,
      {
        verdict: "wrong",
        npcReactionLatin: "",
        npcReactionTr: "",
        narrationTr: "",
        retryAllowed: true
      }
    ]);
  };

  return (
    <div className="authoring-nested-editor">
      <div className="authoring-toolbar">
        <VpButton type="button" variant="ghost" onClick={add}>
          Hata Dalı (Failure Branch) Ekle
        </VpButton>
      </div>

      {branches.map((branch, index) => (
        <div className="authoring-repeat-row" key={index}>
          <div className="authoring-row-head">
            <strong>Verdict: {branch.verdict}</strong>
            <button type="button" onClick={() => remove(index)}>
              Sil
            </button>
          </div>
          <div className="authoring-form-grid">
            <SelectField
              label="Hata Nedeni (Verdict)"
              value={branch.verdict}
              options={["near_miss", "context_wrong", "grammar_wrong", "meaning_wrong", "wrong"]}
              onChange={(verdict) => update(index, { verdict: verdict as any })}
            />
            <TextField
              label="NPC Latin Tepki"
              value={branch.npcReactionLatin || ""}
              onChange={(npcReactionLatin) => update(index, { npcReactionLatin })}
            />
            <TextField
              label="NPC Türkçe Reaksiyon"
              value={branch.npcReactionTr || ""}
              onChange={(npcReactionTr) => update(index, { npcReactionTr })}
            />
            <TextField
              label="Anlatım Türkçe"
              value={branch.narrationTr || ""}
              onChange={(narrationTr) => update(index, { narrationTr })}
            />
            <SelectField
              label="Gideceği Sahne"
              value={branch.nextSceneId || ""}
              options={sceneIds}
              onChange={(nextSceneId) => update(index, { nextSceneId })}
            />
            <label className="checkbox-field" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={branch.retryAllowed !== false}
                onChange={(e) => update(index, { retryAllowed: e.target.checked })}
              />
              <span>Tekrar Dene Yetkisi (Retry Allowed)?</span>
            </label>
          </div>

          <div style={{ marginTop: "1rem", paddingLeft: "1rem", borderLeft: "2px dashed var(--border)" }}>
            <span className="text-xs font-semibold text-gray-400">Dalın İçindeki Özel Seçenekler (Options):</span>
            <InteractionIntentEditor
              intents={branch.options || []}
              onChange={(options) => update(index, { options })}
              sceneIds={sceneIds}
              npcIds={npcIds}
              locationIds={locationIds}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
