import React from "react";
import { VpButton } from "../../ui";
import { SelectField, TextField } from "./editorUtils";
import type { ConsequencePresentation } from "../../../types/gameTypes";

interface ConsequencePresentationEditorProps {
  consequences: ConsequencePresentation[];
  onChange: (consequences: ConsequencePresentation[]) => void;
}

export function ConsequencePresentationEditor({
  consequences = [],
  onChange
}: ConsequencePresentationEditorProps) {
  const update = (index: number, patch: Partial<ConsequencePresentation>) => {
    onChange(consequences.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };

  const remove = (index: number) => {
    onChange(consequences.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([
      ...consequences,
      {
        id: `cons_${consequences.length + 1}`,
        kind: "latin",
        titleTr: "Yeni Sonuç",
        tone: "success"
      }
    ]);
  };

  return (
    <div className="authoring-nested-editor">
      <div className="authoring-toolbar">
        <VpButton type="button" variant="ghost" onClick={add}>
          Sonuç Ekle
        </VpButton>
      </div>

      {consequences.map((cons, index) => (
        <div className="authoring-repeat-row" key={cons.id ?? index}>
          <div className="authoring-row-head">
            <strong>{cons.titleTr || "Başlıksız Sonuç"} ({cons.kind})</strong>
            <button type="button" onClick={() => remove(index)}>
              Sil
            </button>
          </div>
          <div className="authoring-form-grid">
            <TextField
              label="ID"
              value={cons.id}
              onChange={(id) => update(index, { id })}
            />
            <SelectField
              label="Tür (Kind)"
              value={cons.kind}
              options={["relationship", "memory", "location", "world", "quest", "reward", "knowledge", "unlock", "latin"]}
              onChange={(kind) => update(index, { kind: kind as any })}
            />
            <TextField
              label="Başlık (Türkçe)"
              value={cons.titleTr}
              onChange={(titleTr) => update(index, { titleTr })}
            />
            <TextField
              label="Açıklama (Türkçe)"
              value={cons.bodyTr || ""}
              onChange={(bodyTr) => update(index, { bodyTr })}
            />
            <TextField
              label="Değer (Value)"
              value={cons.valueTr || ""}
              onChange={(valueTr) => update(index, { valueTr })}
            />
            <SelectField
              label="Ton (Tone)"
              value={cons.tone}
              options={["success", "warning", "danger", "gold", "muted"]}
              onChange={(tone) => update(index, { tone: tone as any })}
            />
            <label className="checkbox-field" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={!!cons.hidden}
                onChange={(e) => update(index, { hidden: e.target.checked })}
              />
              <span>Gizli?</span>
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}
