import { VpButton, VpBadge } from "../../ui";
import { authoringApi } from "../../../api/authoringApi";
import { ReferenceListField } from "./editorUtils";
import type { AuthoringReferences } from "../../../types/authoringTypes";

export function LearningFocusEditor({ value, scene, references, onChange }: { value: any; scene?: any; references?: AuthoringReferences | null; onChange: (value: any) => void }) {
  const focus = value ?? { grammarIds: [], vocabularyIds: [], skillIds: [], difficulty: "practice" };
  const suggest = async () => {
    const result = await authoringApi.suggestLearningFocus({ text: scene?.descriptionTr ?? scene?.description ?? "", expectedAnswers: scene?.textChallenge?.expectedAnswers ?? [] });
    onChange({ ...focus, grammarIds: unique([...(focus.grammarIds ?? []), ...result.grammarIds]), vocabularyIds: unique([...(focus.vocabularyIds ?? []), ...result.vocabularyIds]), skillIds: unique([...(focus.skillIds ?? []), ...result.skillIds]) });
  };
  const grammarOptions = references?.grammar.map((item) => ({ value: item.id, label: item.label })) ?? (focus.grammarIds ?? []);
  const vocabularyOptions = references?.vocabulary.map((item) => ({ value: item.id, label: item.label })) ?? (focus.vocabularyIds ?? []);
  const skillOptions = references?.skills.map((item) => ({ value: item.id, label: item.label })) ?? (focus.skillIds ?? []);
  return <div className="authoring-form-grid"><ReferenceListField label="grammarIds" value={focus.grammarIds ?? []} options={grammarOptions} onChange={(grammarIds) => onChange({ ...focus, grammarIds })} /><ReferenceListField label="vocabularyIds" value={focus.vocabularyIds ?? []} options={vocabularyOptions} onChange={(vocabularyIds) => onChange({ ...focus, vocabularyIds })} /><ReferenceListField label="skillIds" value={focus.skillIds ?? []} options={skillOptions} onChange={(skillIds) => onChange({ ...focus, skillIds })} /><label><span>difficulty</span><select value={focus.difficulty ?? "practice"} onChange={(event) => onChange({ ...focus, difficulty: event.target.value })}><option value="intro">intro</option><option value="practice">practice</option><option value="review">review</option><option value="challenge">challenge</option></select></label><div className="authoring-chip-row"><VpBadge variant="gold">Grammar level</VpBadge><VpBadge>Vocabulary frequency</VpBadge><VpBadge variant={(focus.grammarIds?.length || focus.vocabularyIds?.length) ? "success" : "gold"}>Sahnede temsil</VpBadge></div><VpButton type="button" variant="ghost" onClick={() => void suggest()}>Onerilenleri ekle</VpButton></div>;
}

function unique(values: string[]) { return [...new Set(values.filter(Boolean))]; }
