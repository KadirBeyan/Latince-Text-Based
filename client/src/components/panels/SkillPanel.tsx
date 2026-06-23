import { useGameStore } from "../../stores/gameStore";
import { getSkillLabel } from "../../utils/displayLabels";
import { BookOpenText, Columns, Scroll, Sun } from "@phosphor-icons/react";

const icons = [BookOpenText, Scroll, Columns, Sun];

const pathLines: Record<string, string> = {
  ludus: "Magister sende öğrenme isteği görüyor.",
  castra: "Veteranus sende disiplin fark ediyor.",
  mercatura: "Mercator pazarlığa yatkın olduğunu sezdi.",
  scriptura: "Scriba harflere yaklaşımını not etti.",
  templum: "Ministra sende saygılı bir dikkat görüyor.",
  villa: "Ailen köy yaşamına bağlılığını fark ediyor."
};

export function SkillPanel() {
  const { gameState } = useGameStore();
  const skills = gameState?.skills ?? [];
  const lifePathHints = gameState?.player?.characterProfile?.lifePathHints;
  const visibleHints = lifePathHints ? Object.entries(lifePathHints).filter(([, value]) => Number(value) > 0).sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, 3) : [];

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
      {visibleHints.length ? (
        <div className="life-path-hints">
          <p className="eyebrow">Inclinationes</p>
          {visibleHints.map(([path]) => <span key={path}>{pathLines[path] ?? path}</span>)}
        </div>
      ) : null}
    </section>
  );
}
