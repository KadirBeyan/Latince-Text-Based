import { ORIGINS, RPG_SKILLS } from "../../types/characterTypes";
import { useCharacterCreationStore } from "../../stores/characterCreationStore";
import { SkillCard } from "./SkillCard";

export function SkillAllocationStep() {
  const { origin, skillAllocations, pointsRemaining, adjustSkill } = useCharacterCreationStore();
  const originDef = ORIGINS.find((item) => item.id === origin);
  return (
    <div className="creation-step">
      <p className="eyebrow">III · Artes</p>
      <h2>Altı puanı dağıt</h2>
      <p>Köken bonusları ayrı eklenir. Bir beceriye en fazla 3 başlangıç puanı verebilirsin.</p>
      <div className="points-ribbon"><strong>{pointsRemaining}</strong><span>puan kaldı</span></div>
      <div className="creation-card-grid skill-grid-creation">
        {RPG_SKILLS.map((skill) => <SkillCard key={skill.id} {...skill} value={skillAllocations[skill.id]} bonus={originDef?.skillBonuses[skill.id] ?? 0} remaining={pointsRemaining} onAdjust={(delta) => adjustSkill(skill.id, delta)} />)}
      </div>
    </div>
  );
}
