import { ORIGINS, RPG_SKILLS, TRAITS } from "../../types/characterTypes";
import { useCharacterCreationStore } from "../../stores/characterCreationStore";

export function CharacterSheetPreview() {
  const { name, origin, traits, skillAllocations } = useCharacterCreationStore();
  const originDef = ORIGINS.find((item) => item.id === origin);
  const traitLabels = traits.map((trait) => TRAITS.find((item) => item.id === trait)?.title ?? trait);
  return (
    <aside className="character-sheet-preview panel-card">
      <p className="eyebrow">Tabula Personae</p>
      <h3>{name.trim() || "İsimsiz"}</h3>
      <p>{originDef?.story}</p>
      <div className="preview-chip-row">{traitLabels.length ? traitLabels.map((label) => <span key={label}>{label}</span>) : <span>İki eğilim bekleniyor</span>}</div>
      <div className="preview-skill-list">
        {RPG_SKILLS.filter((skill) => skillAllocations[skill.id] > 0 || (originDef?.skillBonuses[skill.id] ?? 0) > 0).map((skill) => (
          <div key={skill.id}><span>{skill.title}</span><b>{Math.min(3, skillAllocations[skill.id] + (originDef?.skillBonuses[skill.id] ?? 0))}</b></div>
        ))}
      </div>
    </aside>
  );
}
