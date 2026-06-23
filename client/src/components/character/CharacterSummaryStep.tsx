import { useGameStore } from "../../stores/gameStore";
import { ORIGINS, RPG_SKILLS, TRAITS } from "../../types/characterTypes";
import { useCharacterCreationStore } from "../../stores/characterCreationStore";

export function CharacterSummaryStep() {
  const { actionLoading, createCharacterGame } = useGameStore();
  const { name, origin, traits, skillAllocations, buildPayload } = useCharacterCreationStore();
  const originDef = ORIGINS.find((item) => item.id === origin);
  return (
    <div className="creation-step">
      <p className="eyebrow">V · Initium</p>
      <h2>Vicus sabahına böyle adım atıyorsun</h2>
      <div className="summary-block">
        <h3>{name}</h3>
        <p>{originDef?.title} · {originDef?.story}</p>
        <div className="preview-chip-row">{traits.map((trait) => <span key={trait}>{TRAITS.find((item) => item.id === trait)?.title ?? trait}</span>)}</div>
        <div className="summary-skills">
          {RPG_SKILLS.map((skill) => {
            const total = Math.min(3, skillAllocations[skill.id] + (originDef?.skillBonuses[skill.id] ?? 0));
            return total > 0 ? <span key={skill.id}>{skill.title} {total}</span> : null;
          })}
        </div>
      </div>
      <button type="button" className="enter-world-button" disabled={actionLoading} onClick={() => void createCharacterGame(buildPayload())}>{actionLoading ? "Köy hazırlanıyor..." : "Dünyaya Gir"}</button>
    </div>
  );
}
