import React from "react";
import { VpButton } from "../../ui";
import { SelectField, TextField, LinesField } from "./editorUtils";
import { ConditionEditor } from "./ConditionEditor";
import { EffectEditor } from "./EffectEditor";
import { ConsequencePresentationEditor } from "./ConsequencePresentationEditor";
import { FailureBranchEditor } from "./FailureBranchEditor";
import type { InteractionIntent } from "../../../types/gameTypes";

interface InteractionIntentEditorProps {
  intents: InteractionIntent[];
  onChange: (intents: InteractionIntent[]) => void;
  sceneIds: string[];
  npcIds: string[];
  locationIds: string[];
}

const VERBS = [
  "speak", "ask", "inspect", "listen", "wait", "approach", "leave", "persuade",
  "bargain", "remember", "read", "offer", "take", "give", "follow", "challenge",
  "apologize", "thank", "custom"
];

const TONES = [
  "neutral", "polite", "bold", "curious", "cautious", "friendly", "formal", "rude", "secretive"
];

const FAILURE_BEHAVIORS = ["retry", "branch", "soft-fail", "continue"];

export function InteractionIntentEditor({
  intents = [],
  onChange,
  sceneIds,
  npcIds,
  locationIds
}: InteractionIntentEditorProps) {
  const update = (index: number, patch: Partial<InteractionIntent>) => {
    onChange(intents.map((intent, i) => (i === index ? { ...intent, ...patch } : intent)));
  };

  const remove = (index: number) => {
    onChange(intents.filter((_, i) => i !== index));
  };

  const add = () => {
    onChange([
      ...intents,
      {
        id: `intent_${intents.length + 1}`,
        labelTr: "Yeni Niyet",
        verb: "speak",
        requiresLatin: false,
        failureBehavior: "retry"
      }
    ]);
  };

  return (
    <div className="authoring-nested-editor">
      <div className="authoring-toolbar">
        <VpButton type="button" variant="ghost" onClick={add}>
          Niyet (Intent) Ekle
        </VpButton>
      </div>

      {intents.map((intent, index) => (
        <div className="authoring-repeat-row" key={intent.id ?? index}>
          <div className="authoring-row-head">
            <strong>{intent.labelTr} (ID: {intent.id})</strong>
            <button type="button" onClick={() => remove(index)}>
              Sil
            </button>
          </div>
          
          <div className="authoring-form-grid">
            <TextField
              label="ID"
              value={intent.id}
              onChange={(id) => update(index, { id })}
            />
            <TextField
              label="Başlık (Türkçe)"
              value={intent.labelTr}
              onChange={(labelTr) => update(index, { labelTr })}
            />
            <TextField
              label="Açıklama (Türkçe)"
              value={intent.descriptionTr || ""}
              onChange={(descriptionTr) => update(index, { descriptionTr })}
            />
            <SelectField
              label="Eylem Tipi (Verb)"
              value={intent.verb}
              options={VERBS}
              onChange={(verb) => update(index, { verb: verb as any })}
            />
            <SelectField
              label="Ton (Tone)"
              value={intent.tone || ""}
              options={TONES}
              onChange={(tone) => update(index, { tone: tone as any })}
            />
            <label className="checkbox-field" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={!!intent.requiresLatin}
                onChange={(e) => update(index, { requiresLatin: e.target.checked })}
              />
              <span>Latince Şartı var mı (Requires Latin)?</span>
            </label>
          </div>

          {/* Latin parameters - only show if requiresLatin is true */}
          {intent.requiresLatin && (
            <div className="authoring-form-grid" style={{ marginTop: "0.5rem", borderLeft: "2px solid var(--border-strong)", paddingLeft: "1rem" }}>
              <TextField
                label="Oyuncu Niyeti (Türkçe)"
                value={intent.playerIntentTr || ""}
                onChange={(playerIntentTr) => update(index, { playerIntentTr })}
              />
              <TextField
                label="Hedef Anlamı (Türkçe)"
                value={intent.targetMeaningTr || ""}
                onChange={(targetMeaningTr) => update(index, { targetMeaningTr })}
              />
              <SelectField
                label="Konuşan NPC"
                value={intent.speakerNpcId || ""}
                options={npcIds}
                onChange={(speakerNpcId) => update(index, { speakerNpcId })}
              />
              <SelectField
                label="Hedef NPC"
                value={intent.targetNpcId || ""}
                options={npcIds}
                onChange={(targetNpcId) => update(index, { targetNpcId })}
              />
              <LinesField
                label="Kabul Edilen Doğru Cevaplar (Canonical Answers - Satır Satır)"
                value={intent.canonicalAnswers || []}
                onChange={(canonicalAnswers) => update(index, { canonicalAnswers })}
              />
              <LinesField
                label="Kabul Edilen Varyantlar (Accepted Variants - Satır Satır)"
                value={intent.acceptedVariants || []}
                onChange={(acceptedVariants) => update(index, { acceptedVariants })}
              />
            </div>
          )}

          {/* Scene navigation & behavior */}
          <div className="authoring-form-grid">
            <SelectField
              label="Başarı Hedef Sahne"
              value={intent.successNextSceneId || ""}
              options={sceneIds}
              onChange={(successNextSceneId) => update(index, { successNextSceneId })}
            />
            <SelectField
              label="Hata Hedef Sahne"
              value={intent.failureNextSceneId || ""}
              options={sceneIds}
              onChange={(failureNextSceneId) => update(index, { failureNextSceneId })}
            />
            <SelectField
              label="Varsayılan Sonraki Sahne"
              value={intent.nextSceneId || ""}
              options={sceneIds}
              onChange={(nextSceneId) => update(index, { nextSceneId })}
            />
            <TextField
              label="Sonuç Önizleme (Türkçe)"
              value={intent.previewConsequenceTr || ""}
              onChange={(previewConsequenceTr) => update(index, { previewConsequenceTr })}
            />
            <SelectField
              label="Hata Durumu Davranışı"
              value={intent.failureBehavior || "retry"}
              options={FAILURE_BEHAVIORS}
              onChange={(failureBehavior) => update(index, { failureBehavior: failureBehavior as any })}
            />
            <label className="checkbox-field" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={!!intent.hiddenConsequence}
                onChange={(e) => update(index, { hiddenConsequence: e.target.checked })}
              />
              <span>Sonuçları Gizle (Hidden Consequence)?</span>
            </label>
          </div>

          {/* Conditions & Effects */}
          <div style={{ marginTop: "1rem" }}>
            <span className="text-xs font-bold text-gray-400">Görünürlük Koşulları:</span>
            <ConditionEditor
              conditions={intent.conditions || []}
              onChange={(conditions) => update(index, { conditions })}
              sceneIds={sceneIds}
              npcIds={npcIds}
              locationIds={locationIds}
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <span className="text-xs font-bold text-gray-400">Eylem Etkileri:</span>
            <EffectEditor
              effects={intent.effects || []}
              onChange={(effects) => update(index, { effects })}
              sceneIds={sceneIds}
              npcIds={npcIds}
              locationIds={locationIds}
            />
          </div>

          {/* Resolution Configuration */}
          <div style={{ marginTop: "1rem", border: "1px solid rgba(255,255,255,0.05)", padding: "0.75rem", borderRadius: "8px" }}>
            <span className="text-xs font-bold text-teal-400">Eylem Çözümleme (Resolution):</span>
            <div className="authoring-form-grid" style={{ marginTop: "0.5rem" }}>
              <TextField
                label="Sonuç Anlatımı (Türkçe)"
                value={intent.resolution?.resultNarrationTr || ""}
                onChange={(val) => update(index, { resolution: { ...intent.resolution, resultNarrationTr: val } })}
              />
              <TextField
                label="Açığa Çıkan Latince Metin"
                value={intent.resolution?.revealedLatin || ""}
                onChange={(val) => update(index, { resolution: { ...intent.resolution, revealedLatin: val } })}
              />
              <TextField
                label="Açığa Çıkan Türkçe Açıklama"
                value={intent.resolution?.revealedTextTr || ""}
                onChange={(val) => update(index, { resolution: { ...intent.resolution, revealedTextTr: val } })}
              />
              <TextField
                label="NPC Latince Cevap"
                value={intent.resolution?.npcReactionLatin || ""}
                onChange={(val) => update(index, { resolution: { ...intent.resolution, npcReactionLatin: val } })}
              />
              <TextField
                label="NPC Türkçe Reaksiyon"
                value={intent.resolution?.npcReactionTr || ""}
                onChange={(val) => update(index, { resolution: { ...intent.resolution, npcReactionTr: val } })}
              />
            </div>
            <div style={{ marginTop: "0.75rem" }}>
              <span className="text-xs font-semibold text-gray-400">Özel Sonuç Kayıtları (Consequence Presentations):</span>
              <ConsequencePresentationEditor
                consequences={intent.resolution?.consequences || []}
                onChange={(consequences) => update(index, { resolution: { ...intent.resolution, consequences } })}
              />
            </div>
          </div>

          {/* Failure Branches */}
          {intent.requiresLatin && (
            <div style={{ marginTop: "1rem", border: "1px solid rgba(244,63,94,0.15)", padding: "0.75rem", borderRadius: "8px" }}>
              <span className="text-xs font-bold text-rose-400">Hata Dalları (Failure Branches):</span>
              <FailureBranchEditor
                branches={intent.failureBranches || []}
                onChange={(failureBranches) => update(index, { failureBranches })}
                sceneIds={sceneIds}
                npcIds={npcIds}
                locationIds={locationIds}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
