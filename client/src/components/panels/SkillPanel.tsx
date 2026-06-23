import { useGameStore } from "../../stores/gameStore";
import { getSkillLabel } from "../../utils/displayLabels";
import { BookOpenText, Columns, Scroll, Sun } from "@phosphor-icons/react";

const icons = [BookOpenText, Scroll, Columns, Sun];

export function SkillPanel() {
  const { gameState } = useGameStore();
  const skills = gameState?.skills ?? [];

  return (
    <section className="panel-card skill-panel">
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Artes</p>
        <h3>Beceriler</h3>
      </div>
      {skills.length === 0 ? <p className="empty-state">Henüz beceri açılmadı.</p> : null}
      <div className="skill-grid">
        {skills.map((skill, index) => {
          const Icon = icons[index % icons.length];
          const masteryObj = gameState?.masteryStates?.find(
            (m) => m.targetId === skill.skillId && m.targetType === "skill"
          );

          return (
            <div className="skill-tile flex flex-col items-start gap-1" key={skill.skillId}>
              <div className="flex items-center gap-2">
                <Icon size={26} weight="duotone" aria-hidden="true" />
                <span className="font-medium">{getSkillLabel(skill.skillId)}</span>
              </div>
              
              <div className="w-full mt-1">
                <div className="flex justify-between items-center text-[10px] text-stone-400">
                  <strong>Lv {skill.level}{skill.unlocked === false ? " · kilitli" : ""}</strong>
                  {masteryObj && <span className="text-gold font-bold">%{masteryObj.mastery} Ustalık</span>}
                </div>
                {masteryObj && (
                  <div className="w-full bg-stone-950 h-1 rounded overflow-hidden mt-1">
                    <div 
                      className="bg-gold h-full rounded transition-all duration-300"
                      style={{ width: `${masteryObj.mastery}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
