import React from "react";
import { SelectField, TextField, type SelectOption } from "./editorUtils";
import { InteractionIntentEditor } from "./InteractionIntentEditor";
import type { SceneInteractionModel } from "../../../types/gameTypes";

interface InteractionModelEditorProps {
  model?: SceneInteractionModel;
  onChange: (model: SceneInteractionModel | undefined) => void;
  sceneIds: string[];
  npcIds: string[];
  locationIds: string[];
  sceneOptions?: SelectOption[];
  npcOptions?: SelectOption[];
  locationOptions?: SelectOption[];
}

export function InteractionModelEditor({
  model,
  onChange,
  sceneIds,
  npcIds,
  locationIds,
  sceneOptions,
  npcOptions,
  locationOptions
}: InteractionModelEditorProps) {
  const handleToggleActive = () => {
    if (model) {
      onChange(undefined);
    } else {
      onChange({
        mode: "interaction-loop",
        openingNarrationTr: "",
        openingNarrationLatin: "",
        intents: [],
        afterIntentResolution: {
          showConsequences: true,
          showNextActions: true,
          autoContinueOnSuccess: false
        }
      });
    }
  };

  const update = (patch: Partial<SceneInteractionModel>) => {
    if (!model) return;
    onChange({
      ...model,
      ...patch
    });
  };

  const updateAfterResolution = (patch: any) => {
    if (!model) return;
    onChange({
      ...model,
      afterIntentResolution: {
        ...(model.afterIntentResolution || { showConsequences: true, showNextActions: true }),
        ...patch
      }
    });
  };

  return (
    <div style={{ padding: "0.5rem 0", display: "grid", gap: "0.8rem" }}>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          type="checkbox"
          checked={!!model}
          onChange={handleToggleActive}
        />
        <span className="font-semibold text-sm">Etkileşim Döngüsü Modelini Aktifleştir (Interaction Model)</span>
      </label>

      {model && (
        <div style={{ paddingLeft: "1rem", borderLeft: "2px solid var(--accent)", display: "grid", gap: "0.8rem" }}>
          <div className="authoring-form-grid">
            <TextField
              label="Açılış Anlatımı (Türkçe)"
              value={model.openingNarrationTr || ""}
              onChange={(openingNarrationTr) => update({ openingNarrationTr })}
            />
            <TextField
              label="Açılış Anlatımı (Latince)"
              value={model.openingNarrationLatin || ""}
              onChange={(openingNarrationLatin) => update({ openingNarrationLatin })}
            />
            <SelectField
              label="Aktif NPC"
              value={model.activeNpcId || ""}
              options={npcOptions ?? npcIds}
              onChange={(activeNpcId) => update({ activeNpcId })}
            />
            <TextField
              label="NPC Latince Replik"
              value={model.npcLineLatin || ""}
              onChange={(npcLineLatin) => update({ npcLineLatin })}
            />
            <TextField
              label="NPC Türkçe Açıklama"
              value={model.npcLineTr || ""}
              onChange={(npcLineTr) => update({ npcLineTr })}
            />
            <TextField
              label="Varsayılan Niyet ID (Default Intent)"
              value={model.defaultIntentId || ""}
              onChange={(defaultIntentId) => update({ defaultIntentId })}
            />
          </div>

          <div className="authoring-form-grid" style={{ margin: "0.5rem 0" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={!!model.afterIntentResolution?.showConsequences}
                onChange={(e) => updateAfterResolution({ showConsequences: e.target.checked })}
              />
              <span>Sonuçları Göster (Show Consequences)</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={!!model.afterIntentResolution?.showNextActions}
                onChange={(e) => updateAfterResolution({ showNextActions: e.target.checked })}
              />
              <span>Sonraki Eylemleri Göster (Show Next Actions)</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={!!model.afterIntentResolution?.autoContinueOnSuccess}
                onChange={(e) => updateAfterResolution({ autoContinueOnSuccess: e.target.checked })}
              />
              <span>Başarıda Otomatik Devam Et (Auto Continue)</span>
            </label>
          </div>

          <div style={{ marginTop: "0.5rem" }}>
            <span className="text-xs font-bold text-gray-400">Döngü Niyetleri (Loop Intents):</span>
            <InteractionIntentEditor
              intents={model.intents || []}
              onChange={(intents) => update({ intents })}
              sceneIds={sceneIds}
              npcIds={npcIds}
              locationIds={locationIds}
              sceneOptions={sceneOptions}
              npcOptions={npcOptions}
              locationOptions={locationOptions}
            />
          </div>
        </div>
      )}
    </div>
  );
}
