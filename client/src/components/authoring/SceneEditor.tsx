import { VpCard, VpInput, VpSectionHeader, VpTextarea } from "../ui";
import { FieldAnchor } from "./FieldAnchor";
import { ChoiceListEditor } from "./fields/ChoiceListEditor";
import { ConditionEditor } from "./fields/ConditionEditor";
import { EffectEditor } from "./fields/EffectEditor";
import { JsonAdvancedEditor } from "./fields/JsonAdvancedEditor";
import { LearningFocusEditor } from "./fields/LearningFocusEditor";
import { TextChallengeEditor } from "./fields/TextChallengeEditor";
import { DialogueChallengeEditor } from "./fields/DialogueChallengeEditor";
import { split } from "./fields/editorUtils";
import { CinematicPreview } from "./CinematicPreview";
import { InteractionModelEditor } from "./fields/InteractionModelEditor";
import { DialogueSequenceEditor } from "./fields/DialogueSequenceEditor";

export function SceneEditor({ data, onChange }: { data: any; onChange: (patch: any) => void }) {
  const sceneIds = [data?.id, ...(data?.choices ?? []).map((choice: any) => choice.nextSceneId), data?.textChallenge?.successNextSceneId, data?.textChallenge?.failureNextSceneId, data?.dialogueChallenge?.successNextSceneId, data?.dialogueChallenge?.failureNextSceneId].filter(Boolean);
  const npcIds = data?.npcIds ?? [];
  const locationIds = [data?.locationId].filter(Boolean);
  return (
    <div className="authoring-editor-stack">
      <VpCard variant="compact"><VpSectionHeader eyebrow="Scene" title={data?.titleTr ?? data?.title ?? "Sahne"} /><div className="authoring-form-grid"><FieldAnchor fieldPath="id"><Field label="id" value={data?.id} onChange={(id) => onChange({ id })} /></FieldAnchor><FieldAnchor fieldPath="titleTr"><Field label="titleTr" value={data?.titleTr ?? data?.title} onChange={(title) => onChange({ title, titleTr: title })} /></FieldAnchor><Field label="titleLatin" value={data?.titleLatin} onChange={(titleLatin) => onChange({ titleLatin })} /><FieldAnchor fieldPath="locationId"><Field label="locationId" value={data?.locationId} onChange={(locationId) => onChange({ locationId })} /></FieldAnchor><FieldAnchor fieldPath="npcIds"><Field label="npcIds" value={(data?.npcIds ?? []).join(", ")} onChange={(value) => onChange({ npcIds: split(value) })} /></FieldAnchor><FieldAnchor fieldPath="inputMode"><label><span>inputMode</span><select value={data?.inputMode ?? "choice"} onChange={(event) => onChange({ inputMode: event.target.value })}><option value="choice">choice</option><option value="text">text</option><option value="hybrid">hybrid</option><option value="dialogue-response">dialogue-response</option><option value="hybrid-dialogue">hybrid-dialogue</option></select></label></FieldAnchor></div><FieldAnchor fieldPath="descriptionTr"><label className="authoring-wide"><span>descriptionTr</span><VpTextarea value={data?.descriptionTr ?? data?.description ?? ""} onChange={(event) => onChange({ description: event.target.value, descriptionTr: event.target.value })} /></label></FieldAnchor><label className="authoring-wide"><span>objective</span><VpTextarea value={data?.objective ?? ""} onChange={(event) => onChange({ objective: event.target.value })} /></label></VpCard>
      <CinematicPreview kind="scene" data={data} />
      <VpCard variant="compact"><VpSectionHeader eyebrow="Learning Focus" title="Grammar / Vocabulary" /><FieldAnchor fieldPath="learningFocus.grammarIds"><LearningFocusEditor value={data?.learningFocus} scene={data} onChange={(learningFocus) => onChange({ learningFocus })} /></FieldAnchor></VpCard>
      
      {data?.inputMode === "dialogue-response" ? (
        <VpCard variant="compact">
          <VpSectionHeader eyebrow="Dialogue Challenge" title="Diyalog Değerlendirme" />
          <FieldAnchor fieldPath="dialogueChallenge.canonicalAnswers">
            <DialogueChallengeEditor value={data?.dialogueChallenge} sceneIds={sceneIds} onChange={(dialogueChallenge) => onChange({ dialogueChallenge })} />
          </FieldAnchor>
          <CinematicPreview kind="dialogue" data={data} />
        </VpCard>
      ) : data?.inputMode === "hybrid-dialogue" ? (
        <VpCard variant="compact">
          <VpSectionHeader eyebrow="Hybrid Dialogue Config" title="Hibrit Diyalog Ayarları" />
          <p className="authoring-muted" style={{ padding: "0 16px 12px", color: "var(--color-muted)" }}>
            Hibrit diyalog niyetleri ve akışı için "Gelişmiş JSON" alanını kullanabilir veya sahneyi yapılandırabilirsiniz.
          </p>
        </VpCard>
      ) : (
        <VpCard variant="compact">
          <VpSectionHeader eyebrow="Text Challenge" title={data?.textChallenge?.promptTr ?? data?.textChallenge?.prompt ?? "Prompt"} />
          <FieldAnchor fieldPath="textChallenge.expectedAnswers">
            <TextChallengeEditor value={data?.textChallenge} sceneIds={sceneIds} onChange={(textChallenge) => onChange({ textChallenge })} />
          </FieldAnchor>
        </VpCard>
      )}

      <VpCard variant="compact"><VpSectionHeader eyebrow="Choices" title={`${data?.choices?.length ?? 0} secim`} /><FieldAnchor fieldPath="choices"><ChoiceListEditor choices={data?.choices ?? []} onChange={(choices) => onChange({ choices })} sceneIds={sceneIds} npcIds={npcIds} locationIds={locationIds} /></FieldAnchor></VpCard>
      <VpCard variant="compact"><VpSectionHeader eyebrow="Conditions" title="Visibility gates" /><FieldAnchor fieldPath="conditions"><ConditionEditor conditions={data?.conditions ?? []} onChange={(conditions) => onChange({ conditions })} sceneIds={sceneIds} npcIds={npcIds} locationIds={locationIds} /></FieldAnchor></VpCard>
      <VpCard variant="compact"><VpSectionHeader eyebrow="Effects" title="Scene effects and rewards" /><FieldAnchor fieldPath="effects"><EffectEditor effects={data?.effects ?? []} onChange={(effects) => onChange({ effects })} sceneIds={sceneIds} npcIds={npcIds} locationIds={locationIds} /></FieldAnchor><FieldAnchor fieldPath="rewards"><EffectEditor effects={data?.rewards ?? []} onChange={(rewards) => onChange({ rewards })} sceneIds={sceneIds} npcIds={npcIds} locationIds={locationIds} /></FieldAnchor></VpCard>

      <VpCard variant="compact">
        <VpSectionHeader eyebrow="Interaction Model" title="Etkileşim Döngüsü Model Ayarları" />
        <InteractionModelEditor
          model={data?.interactionModel}
          onChange={(interactionModel) => onChange({ interactionModel })}
          sceneIds={sceneIds}
          npcIds={npcIds}
          locationIds={locationIds}
        />
      </VpCard>

      <VpCard variant="compact">
        <VpSectionHeader eyebrow="Dialogue Sequence" title="Lineer Diyalog Akışı" />
        <DialogueSequenceEditor
          sequence={data?.dialogueSequence}
          onChange={(dialogueSequence) => onChange({ dialogueSequence })}
          sceneIds={sceneIds}
          npcIds={npcIds}
          locationIds={locationIds}
        />
      </VpCard>

      <VpCard variant="compact">
        <VpSectionHeader eyebrow="Living Scene Config" title="Revisit Variants & Ambient Actions" />
        <div style={{ padding: "16px", fontSize: "0.85rem" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "var(--gold)" }}>Tekrar Ziyaret Varyantları ({data?.revisitVariants?.length ?? 0})</h4>
          {(data?.revisitVariants || []).length === 0 ? (
            <p className="authoring-muted" style={{ margin: "0 0 16px 0", fontStyle: "italic" }}>Tanımlı varyant yok. Gelismis JSON alanından ekleyebilirsiniz.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {(data.revisitVariants).map((v: any, idx: number) => (
                <div key={idx} style={{ padding: "8px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px" }}>
                  <div><strong>ID:</strong> {v.id}</div>
                  {v.titleOverride && <div><strong>Title:</strong> {v.titleOverride}</div>}
                  {v.descriptionOverride && <div><strong>Description:</strong> {v.descriptionOverride}</div>}
                </div>
              ))}
            </div>
          )}

          <h4 style={{ margin: "0 0 8px 0", color: "var(--gold)" }}>Çevre Etkileşim Şablonları ({data?.ambientTemplates?.length ?? 0})</h4>
          {(data?.ambientTemplates || []).length === 0 ? (
            <p className="authoring-muted" style={{ margin: 0, fontStyle: "italic" }}>Tanımlı şablon yok. Gelismis JSON alanından ekleyebilirsiniz.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {(data.ambientTemplates).map((t: any, idx: number) => (
                <div key={idx} style={{ padding: "8px", backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px" }}>
                  <div><strong>Template:</strong> {t.templateId}</div>
                  {t.labelTrOverride && <div><strong>Label Override:</strong> {t.labelTrOverride}</div>}
                  {t.descriptionTrOverride && <div><strong>Description Override:</strong> {t.descriptionTrOverride}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </VpCard>

      <JsonBlock data={data} onChange={onChange} />
    </div>
  );
}

export function Field({ label, value, onChange }: { label: string; value: unknown; onChange: (value: string) => void }) { return <label><span>{label}</span><VpInput value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} /></label>; }
export function JsonBlock({ data, onChange }: { data: any; onChange: (value: any) => void }) { return <VpCard variant="compact"><JsonAdvancedEditor value={data} onChange={onChange} title="Gelismis JSON" /></VpCard>; }
export { split };
export function splitLines(value: string): string[] { return value.split("\n").map((item) => item.trim()).filter(Boolean); }
