import { VpInput, VpTextarea } from "../../ui";

export const EFFECT_TYPES = ["ADD_XP", "ADD_CURRENCY", "REMOVE_CURRENCY", "ADD_ITEM", "REMOVE_ITEM", "UNLOCK_SKILL", "INCREMENT_SKILL", "START_QUEST", "COMPLETE_QUEST", "COMPLETE_CHAPTER", "UNLOCK_CHAPTER", "ADD_JOURNAL_ENTRY", "ADD_DIALOGUE_ENTRY", "SET_FLAG", "SET_NARRATIVE_FLAG", "ADD_NPC_MEMORY", "UPDATE_NPC_RELATIONSHIP", "DISCOVER_LOCATION", "SET_LOCATION_FLAG", "SET_LOCATION_MOOD", "ADD_WORLD_EVENT", "APPLY_REWARD_BUNDLE", "GO_TO_SCENE", "MARK_SCENE_COMPLETED"];
export const CONDITION_TYPES = ["HAS_ITEM", "HAS_SKILL", "FLAG_EQUALS", "NARRATIVE_FLAG_EQUALS", "QUEST_STATUS", "MIN_LEVEL", "SCENE_VISITED", "SCENE_COMPLETED", "NPC_RELATION_MIN", "NPC_MEMORY_HAS_TAG", "LOCATION_DISCOVERED", "LOCATION_FLAG_EQUALS", "CHAPTER_COMPLETED", "ASSESSMENT_LEVEL_MIN", "MASTERY_MIN"];

export function TextField({ label, value, onChange }: { label: string; value: unknown; onChange: (value: string) => void }) {
  return <label><span>{label}</span><VpInput value={String(value ?? "")} onChange={(event) => onChange(event.target.value)} /></label>;
}

export function NumberField({ label, value, onChange, min = -9999, max = 9999 }: { label: string; value: unknown; onChange: (value: number) => void; min?: number; max?: number }) {
  return <label><span>{label}</span><VpInput type="number" value={String(value ?? 0)} onChange={(event) => onChange(clamp(Number(event.target.value), min, max))} /></label>;
}

export function SelectField({ label, value, options, onChange }: { label: string; value: unknown; options: string[]; onChange: (value: string) => void }) {
  return <label><span>{label}</span><select value={String(value ?? "")} onChange={(event) => onChange(event.target.value)}><option value="">-</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

export function LinesField({ label, value, onChange }: { label: string; value: string[]; onChange: (value: string[]) => void }) {
  return <label className="authoring-wide"><span>{label}</span><VpTextarea value={(value ?? []).join("\n")} onChange={(event) => onChange(splitLines(event.target.value))} /></label>;
}

export function split(value: string): string[] { return value.split(",").map((item) => item.trim()).filter(Boolean); }
export function splitLines(value: string): string[] { return value.split("\n").map((item) => item.trim()).filter(Boolean); }
export function clamp(value: number, min: number, max: number): number { return Math.max(min, Math.min(max, Number.isFinite(value) ? value : 0)); }
export function idsFrom(items: any[] | undefined): string[] { return (items ?? []).map((item) => String(item.id)).filter(Boolean); }
