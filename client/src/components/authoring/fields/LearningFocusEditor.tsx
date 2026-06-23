import { VpButton, VpBadge } from "../../ui";
import { authoringApi } from "../../../api/authoringApi";
import { TextField, split } from "./editorUtils";

export function LearningFocusEditor({ value, scene, onChange }: { value: any; scene?: any; onChange: (value: any) => void }) {
  const focus = value ?? { grammarIds: [], vocabularyIds: [], skillIds: [], difficulty: "practice" };
  const suggest = async () => {
    const result = await authoringApi.suggestLearningFocus({ text: scene?.descriptionTr ?? scene?.description ?? "", expectedAnswers: scene?.textChallenge?.expectedAnswers ?? [] });
    onChange({ ...focus, grammarIds: unique([...(focus.grammarIds ?? []), ...result.grammarIds]), vocabularyIds: unique([...(focus.vocabularyIds ?? []), ...result.vocabularyIds]), skillIds: unique([...(focus.skillIds ?? []), ...result.skillIds]) });
  };
  return <div className="authoring-form-grid"><TextField label="grammarIds" value={(focus.grammarIds ?? []).join(", ")} onChange={(v) => onChange({ ...focus, grammarIds: split(v) })} /><TextField label="vocabularyIds" value={(focus.vocabularyIds ?? []).join(", ")} onChange={(v) => onChange({ ...focus, vocabularyIds: split(v) })} /><TextField label="skillIds" value={(focus.skillIds ?? []).join(", ")} onChange={(v) => onChange({ ...focus, skillIds: split(v) })} /><label><span>difficulty</span><select value={focus.difficulty ?? "practice"} onChange={(event) => onChange({ ...focus, difficulty: event.target.value })}><option value="intro">intro</option><option value="practice">practice</option><option value="review">review</option><option value="challenge">challenge</option></select></label><div className="authoring-chip-row"><VpBadge variant="gold">Grammar level</VpBadge><VpBadge>Vocabulary frequency</VpBadge><VpBadge variant={(focus.grammarIds?.length || focus.vocabularyIds?.length) ? "success" : "gold"}>Sahnede temsil</VpBadge></div><VpButton type="button" variant="ghost" onClick={() => void suggest()}>Onerilenleri ekle</VpButton></div>;
}

function unique(values: string[]) { return [...new Set(values.filter(Boolean))]; }
