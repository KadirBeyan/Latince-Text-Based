import type { ConversationOption, FreeformWorldResponse } from "../../../types/gameTypes";

export function FreeformClarificationPanel({ response, options, onSelect }: { response: FreeformWorldResponse; options: ConversationOption[]; onSelect: (id: string) => void }) {
  const ids = response.suggestedNextOptionIds ?? [];
  const suggested = options.filter((option) => ids.includes(option.id));
  if (!suggested.length || response.tone !== "warning") return null;
  return <div style={{ padding: ".8rem 1rem", border: "1px dashed rgba(230,180,80,.4)", borderRadius: 8 }}><p style={{ margin: "0 0 .55rem" }}>Bunu mu demek istedin?</p><div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem" }}>{suggested.map((option) => <button type="button" key={option.id} onClick={() => onSelect(option.id)}>{option.labelTr}</button>)}</div></div>;
}
