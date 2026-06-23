import { VpButton } from "../../ui";
import { JsonAdvancedEditor } from "./JsonAdvancedEditor";
import { CONDITION_TYPES, NumberField, SelectField, TextField } from "./editorUtils";

export function ConditionEditor({ conditions = [], onChange, sceneIds = [], npcIds = [], locationIds = [], skillIds = [], itemIds = [] }: { conditions?: any[]; onChange: (conditions: any[]) => void; sceneIds?: string[]; npcIds?: string[]; locationIds?: string[]; skillIds?: string[]; itemIds?: string[] }) {
  const update = (index: number, patch: any) => onChange(conditions.map((condition, i) => i === index ? { ...condition, ...patch } : condition));
  return <div className="authoring-nested-editor"><div className="authoring-toolbar"><VpButton type="button" variant="ghost" onClick={() => onChange([...conditions, { type: "MIN_LEVEL", level: 1 }])}>Condition ekle</VpButton></div>{conditions.map((condition, index) => <div className="authoring-repeat-row" key={`${condition?.type}-${index}`}><div className="authoring-row-head"><strong>{summarizeCondition(condition)}</strong><button type="button" onClick={() => onChange(conditions.filter((_, i) => i !== index))}>Sil</button></div><div className="authoring-form-grid"><SelectField label="type" value={condition?.type} options={CONDITION_TYPES} onChange={(type) => update(index, { type })} />{renderConditionFields(condition, (patch) => update(index, patch), { sceneIds, npcIds, locationIds, skillIds, itemIds })}</div><JsonAdvancedEditor value={condition} onChange={(value) => update(index, value)} /></div>)}</div>;
}

function renderConditionFields(condition: any, onChange: (patch: any) => void, ids: { sceneIds: string[]; npcIds: string[]; locationIds: string[]; skillIds: string[]; itemIds: string[] }) {
  switch (condition?.type) {
    case "HAS_ITEM": return <SelectField label="itemId" value={condition.itemId} options={ids.itemIds} onChange={(itemId) => onChange({ itemId })} />;
    case "HAS_SKILL": return <SelectField label="skillId" value={condition.skillId} options={ids.skillIds} onChange={(skillId) => onChange({ skillId })} />;
    case "MIN_LEVEL": return <NumberField label="level" value={condition.level} min={1} max={99} onChange={(level) => onChange({ level })} />;
    case "SCENE_VISITED": case "SCENE_COMPLETED": return <SelectField label="sceneId" value={condition.sceneId} options={ids.sceneIds} onChange={(sceneId) => onChange({ sceneId })} />;
    case "NPC_RELATION_MIN": return <><SelectField label="npcId" value={condition.npcId} options={ids.npcIds} onChange={(npcId) => onChange({ npcId })} /><SelectField label="metric" value={condition.metric ?? "trust"} options={["trust", "respect", "familiarity"]} onChange={(metric) => onChange({ metric })} /><NumberField label="min" value={condition.min ?? condition.value ?? 50} min={0} max={100} onChange={(min) => onChange({ min })} /></>;
    case "LOCATION_DISCOVERED": return <SelectField label="locationId" value={condition.locationId} options={ids.locationIds} onChange={(locationId) => onChange({ locationId })} />;
    case "FLAG_EQUALS": case "NARRATIVE_FLAG_EQUALS": case "LOCATION_FLAG_EQUALS": return <><TextField label="key" value={condition.key ?? condition.flag} onChange={(key) => onChange({ key })} /><TextField label="value" value={condition.value} onChange={(value) => onChange({ value })} /></>;
    default: return <TextField label="value" value={condition.value ?? condition.id ?? ""} onChange={(value) => onChange({ value })} />;
  }
}

export function summarizeCondition(condition: any): string {
  if (condition?.type === "NPC_RELATION_MIN") return `${condition.npcId ?? "NPC"} ile ${condition.metric ?? "trust"} ${condition.min ?? condition.value ?? 50} veya uzeri.`;
  if (condition?.type === "HAS_ITEM") return `${condition.itemId ?? "item"} envanterdeyse gorunur.`;
  if (condition?.type === "MIN_LEVEL") return `Seviye ${condition.level ?? 1} veya uzeriyse gorunur.`;
  return condition?.type ? `${condition.type} kosulu.` : "Yeni kosul.";
}
