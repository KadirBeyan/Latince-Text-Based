import React from "react";
import { VpButton } from "../../ui";
import { SelectField, TextField } from "./editorUtils";
import { InteractionIntentEditor } from "./InteractionIntentEditor";
import { ConditionEditor } from "./ConditionEditor";
import { EffectEditor } from "./EffectEditor";
import type { DialogueSequence, DialogueSequenceTurn } from "../../../types/gameTypes";

interface DialogueSequenceEditorProps {
  sequence?: DialogueSequence;
  onChange: (sequence: DialogueSequence | undefined) => void;
  sceneIds: string[];
  npcIds: string[];
  locationIds: string[];
}

export function DialogueSequenceEditor({
  sequence,
  onChange,
  sceneIds,
  npcIds,
  locationIds
}: DialogueSequenceEditorProps) {
  const handleToggleActive = () => {
    if (sequence) {
      onChange(undefined);
    } else {
      onChange({
        id: "dialogue_seq_1",
        turns: []
      });
    }
  };

  const update = (patch: Partial<DialogueSequence>) => {
    if (!sequence) return;
    onChange({
      ...sequence,
      ...patch
    });
  };

  const updateTurn = (index: number, turnPatch: Partial<DialogueSequenceTurn>) => {
    if (!sequence) return;
    const turns = sequence.turns.map((turn, i) => (i === index ? { ...turn, ...turnPatch } : turn));
    onChange({
      ...sequence,
      turns
    });
  };

  const removeTurn = (index: number) => {
    if (!sequence) return;
    onChange({
      ...sequence,
      turns: sequence.turns.filter((_, i) => i !== index)
    });
  };

  const addTurn = () => {
    if (!sequence) return;
    onChange({
      ...sequence,
      turns: [
        ...sequence.turns,
        {
          id: `turn_${sequence.turns.length + 1}`,
          speakerNpcId: npcIds[0] || "npc",
          npcLineLatin: "",
          npcLineTr: "",
          intents: []
        }
      ]
    });
  };

  return (
    <div style={{ padding: "0.5rem 0", display: "grid", gap: "0.8rem" }}>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          type="checkbox"
          checked={!!sequence}
          onChange={handleToggleActive}
        />
        <span className="font-semibold text-sm">Lineer Diyalog Dizisini Aktifleştir (Dialogue Sequence)</span>
      </label>

      {sequence && (
        <div style={{ paddingLeft: "1rem", borderLeft: "2px solid var(--accent)", display: "grid", gap: "0.8rem" }}>
          <div className="authoring-form-grid">
            <TextField
              label="Dizi ID"
              value={sequence.id}
              onChange={(id) => update({ id })}
            />
            <SelectField
              label="Tamamlandığında Gideceği Sahne"
              value={sequence.completionNextSceneId || ""}
              options={sceneIds}
              onChange={(completionNextSceneId) => update({ completionNextSceneId })}
            />
          </div>

          <div style={{ marginTop: "0.5rem" }}>
            <span className="text-xs font-bold text-gray-400">Dizi Tamamlanma Etkileri (Completion Effects):</span>
            <EffectEditor
              effects={sequence.completionEffects || []}
              onChange={(completionEffects) => update({ completionEffects })}
              sceneIds={sceneIds}
              npcIds={npcIds}
              locationIds={locationIds}
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <div className="authoring-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="text-xs font-bold text-gray-400">Diyalog Adımları (Turns):</span>
              <VpButton type="button" variant="ghost" onClick={addTurn}>
                Diyalog Adımı Ekle
              </VpButton>
            </div>

            {sequence.turns.map((turn, index) => (
              <div
                key={turn.id ?? index}
                style={{
                  marginTop: "0.75rem",
                  padding: "0.75rem",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.01)"
                }}
              >
                <div className="authoring-row-head" style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <strong>Adım {index + 1}: {turn.id}</strong>
                  <button type="button" onClick={() => removeTurn(index)}>
                    Sil
                  </button>
                </div>

                <div className="authoring-form-grid">
                  <TextField
                    label="Adım ID"
                    value={turn.id}
                    onChange={(id) => updateTurn(index, { id })}
                  />
                  <SelectField
                    label="Konuşan NPC"
                    value={turn.speakerNpcId}
                    options={npcIds}
                    onChange={(speakerNpcId) => updateTurn(index, { speakerNpcId })}
                  />
                  <TextField
                    label="NPC Latin Replik"
                    value={turn.npcLineLatin || ""}
                    onChange={(npcLineLatin) => updateTurn(index, { npcLineLatin })}
                  />
                  <TextField
                    label="NPC Türkçe Açıklama"
                    value={turn.npcLineTr || ""}
                    onChange={(npcLineTr) => updateTurn(index, { npcLineTr })}
                  />
                  <TextField
                    label="Gerekli Niyet ID (Required Intent ID)"
                    value={turn.requiredIntentId || ""}
                    onChange={(requiredIntentId) => updateTurn(index, { requiredIntentId })}
                  />
                </div>

                {/* Completion Condition */}
                <div style={{ marginTop: "0.75rem" }}>
                  <span className="text-xs font-semibold text-gray-400">Adım Tamamlama Koşulu (Completion Condition):</span>
                  <ConditionEditor
                    conditions={turn.completionCondition || []}
                    onChange={(completionCondition) => updateTurn(index, { completionCondition })}
                    sceneIds={sceneIds}
                    npcIds={npcIds}
                    locationIds={locationIds}
                  />
                </div>

                {/* Turn Intents */}
                <div style={{ marginTop: "0.75rem" }}>
                  <span className="text-xs font-semibold text-gray-400">Adım Niyet Seçenekleri (Turn Intents):</span>
                  <InteractionIntentEditor
                    intents={turn.intents || []}
                    onChange={(intents) => updateTurn(index, { intents })}
                    sceneIds={sceneIds}
                    npcIds={npcIds}
                    locationIds={locationIds}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
