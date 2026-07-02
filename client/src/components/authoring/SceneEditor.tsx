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
import type { AuthoringReferences } from "../../types/authoringTypes";

export function SceneEditor({ data, references, onChange }: { data: any; references?: AuthoringReferences | null; onChange: (patch: any) => void }) {
  const sceneIds = references?.scenes.map((item) => item.id) ?? [data?.id, ...(data?.choices ?? []).map((choice: any) => choice.nextSceneId), data?.textChallenge?.successNextSceneId, data?.textChallenge?.failureNextSceneId, data?.dialogueChallenge?.successNextSceneId, data?.dialogueChallenge?.failureNextSceneId].filter(Boolean);
  const npcIds = references?.npcs.map((item) => item.id) ?? data?.npcIds ?? [];
  const locationIds = references?.locations.map((item) => item.id) ?? [data?.locationId].filter(Boolean);
  const sceneOptions = references?.scenes.map((item) => ({ value: item.id, label: item.label })) ?? sceneIds;
  const npcOptions = references?.npcs.map((item) => ({ value: item.id, label: item.label })) ?? npcIds;
  const locationOptions = references?.locations.map((item) => ({ value: item.id, label: item.label })) ?? locationIds;
  return (
    <div className="authoring-editor-stack">
      <VpCard variant="compact"><VpSectionHeader eyebrow="Scene" title={data?.titleTr ?? data?.title ?? "Sahne"} /><div className="authoring-form-grid"><FieldAnchor fieldPath="id"><Field label="id" value={data?.id} onChange={(id) => onChange({ id })} /></FieldAnchor><FieldAnchor fieldPath="titleTr"><Field label="titleTr" value={data?.titleTr ?? data?.title} onChange={(title) => onChange({ title, titleTr: title })} /></FieldAnchor><Field label="titleLatin" value={data?.titleLatin} onChange={(titleLatin) => onChange({ titleLatin })} /><FieldAnchor fieldPath="locationId"><Field label="locationId" value={data?.locationId} onChange={(locationId) => onChange({ locationId })} /></FieldAnchor><FieldAnchor fieldPath="npcIds"><Field label="npcIds" value={(data?.npcIds ?? []).join(", ")} onChange={(value) => onChange({ npcIds: split(value) })} /></FieldAnchor><FieldAnchor fieldPath="inputMode"><label><span>inputMode</span><select value={data?.inputMode ?? "choice"} onChange={(event) => onChange({ inputMode: event.target.value })}><option value="choice">choice</option><option value="text">text</option><option value="hybrid">hybrid</option><option value="dialogue-response">dialogue-response</option><option value="hybrid-dialogue">hybrid-dialogue</option></select></label></FieldAnchor></div><FieldAnchor fieldPath="descriptionTr"><label className="authoring-wide"><span>descriptionTr</span><VpTextarea value={data?.descriptionTr ?? data?.description ?? ""} onChange={(event) => onChange({ description: event.target.value, descriptionTr: event.target.value })} /></label></FieldAnchor><label className="authoring-wide"><span>objective</span><VpTextarea value={data?.objective ?? ""} onChange={(event) => onChange({ objective: event.target.value })} /></label></VpCard>
      <CinematicPreview kind="scene" data={data} />
      <VpCard variant="compact"><VpSectionHeader eyebrow="Learning Focus" title="Grammar / Vocabulary" /><FieldAnchor fieldPath="learningFocus.grammarIds"><LearningFocusEditor value={data?.learningFocus} scene={data} references={references} onChange={(learningFocus) => onChange({ learningFocus })} /></FieldAnchor></VpCard>
      
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
          sceneOptions={sceneOptions}
          npcOptions={npcOptions}
          locationOptions={locationOptions}
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
        <LivingSceneEditor
          revisitVariants={data?.revisitVariants ?? []}
          ambientTemplates={data?.ambientTemplates ?? []}
          onRevisitChange={(revisitVariants) => onChange({ revisitVariants })}
          onAmbientChange={(ambientTemplates) => onChange({ ambientTemplates })}
        />
      </VpCard>

      <JsonBlock data={data} onChange={onChange} />
    </div>
  );
}

export function Field({ label, value, onChange }: { label: string; value: unknown; onChange: (value: string) => void }) { return <label><span>{label}</span><VpInput value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} /></label>; }
export function JsonBlock({ data, onChange }: { data: any; onChange: (value: any) => void }) { return <VpCard variant="compact"><JsonAdvancedEditor value={data} onChange={onChange} title="Gelismis JSON" /></VpCard>; }
export { split };
export function splitLines(value: string): string[] { return value.split("\n").map((item) => item.trim()).filter(Boolean); }

function LivingSceneEditor({ revisitVariants, ambientTemplates, onRevisitChange, onAmbientChange }: { revisitVariants: any[]; ambientTemplates: any[]; onRevisitChange: (value: any[]) => void; onAmbientChange: (value: any[]) => void }) {
  const updateRevisit = (index: number, patch: any) => onRevisitChange(revisitVariants.map((item, i) => i === index ? { ...item, ...patch } : item));
  const updateAmbient = (index: number, patch: any) => onAmbientChange(ambientTemplates.map((item, i) => i === index ? { ...item, ...patch } : item));
  return <div className="authoring-nested-editor"><div className="authoring-row-head"><strong>Tekrar Ziyaret Varyantları ({revisitVariants.length})</strong><button type="button" onClick={() => onRevisitChange([...revisitVariants, { id: `revisit_${revisitVariants.length + 1}`, titleOverride: "", descriptionOverride: "" }])}>Varyant ekle</button></div>{revisitVariants.map((variant, index) => <div className="authoring-repeat-row" key={variant.id ?? index}><div className="authoring-row-head"><strong>{variant.id || `Variant ${index + 1}`}</strong><button type="button" onClick={() => onRevisitChange(revisitVariants.filter((_, i) => i !== index))}>Sil</button></div><div className="authoring-form-grid"><Field label="id" value={variant.id} onChange={(id) => updateRevisit(index, { id })} /><Field label="titleOverride" value={variant.titleOverride} onChange={(titleOverride) => updateRevisit(index, { titleOverride })} /><label className="authoring-wide"><span>descriptionOverride</span><VpTextarea value={variant.descriptionOverride ?? ""} onChange={(event) => updateRevisit(index, { descriptionOverride: event.target.value })} /></label></div></div>)}<div className="authoring-row-head"><strong>Çevre Etkileşim Şablonları ({ambientTemplates.length})</strong><button type="button" onClick={() => onAmbientChange([...ambientTemplates, { templateId: `ambient_${ambientTemplates.length + 1}`, labelTrOverride: "", descriptionTrOverride: "" }])}>Şablon ekle</button></div>{ambientTemplates.map((template, index) => <div className="authoring-repeat-row" key={template.templateId ?? index}><div className="authoring-row-head"><strong>{template.templateId || `Template ${index + 1}`}</strong><button type="button" onClick={() => onAmbientChange(ambientTemplates.filter((_, i) => i !== index))}>Sil</button></div><div className="authoring-form-grid"><Field label="templateId" value={template.templateId} onChange={(templateId) => updateAmbient(index, { templateId })} /><Field label="labelTrOverride" value={template.labelTrOverride} onChange={(labelTrOverride) => updateAmbient(index, { labelTrOverride })} /><label className="authoring-wide"><span>descriptionTrOverride</span><VpTextarea value={template.descriptionTrOverride ?? ""} onChange={(event) => updateAmbient(index, { descriptionTrOverride: event.target.value })} /></label></div></div>)}</div>;
}
