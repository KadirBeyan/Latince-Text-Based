import {
  BookOpen,
  ChartBar,
  Feather,
  GameController,
  GearSix,
  LockSimple,
  Scroll,
  TextAa,
} from "@phosphor-icons/react";
import { useGameStore } from "../../stores/gameStore";
import { ProgressPanel } from "../panels/ProgressPanel";

export function LeftPanel() {
  const { gameState, setRightPanelTab } = useGameStore();
  const chapters = gameState?.currentCampaign?.chapters ?? [];

  return (
    <aside className="left-panel">
      <div className="sidebar-logo" aria-label="Via Prima navigation">
        <strong>VIA PRIMA</strong>
        <span>Lingua Latina Ludendo</span>
      </div>
      <ProgressPanel />
      <nav className="sidebar-nav" aria-label="Ana navigasyon">
        <button className="active" type="button"><GameController size={20} weight="duotone" />Oyun</button>
        <button type="button" onClick={() => setRightPanelTab("rota")}><BookOpen size={20} weight="duotone" />Dersler</button>
        <button type="button" onClick={() => setRightPanelTab("lingua")}><Scroll size={20} weight="duotone" />Gramer</button>
        <button type="button" onClick={() => setRightPanelTab("lingua")}><TextAa size={20} weight="duotone" />Lexicon</button>
        <button type="button" onClick={() => setRightPanelTab("tabula")}><ChartBar size={20} weight="duotone" />Raporlar</button>
        <button type="button" onClick={() => window.dispatchEvent(new Event("open-authoring-studio"))}><Feather size={20} weight="duotone" />Authoring</button>
        <button type="button" onClick={() => setRightPanelTab("settings")}><GearSix size={20} weight="duotone" />Sistem</button>
      </nav>
      <section className="sidebar-chapters" aria-label="Bölüm ilerlemesi">
        <p className="eyebrow">Caput Progressus</p>
        <div className="sidebar-chapter-list">
          {chapters.slice(0, 4).map((chapter) => {
            const progress = gameState?.chapterProgress?.[chapter.id];
            const unlocked = gameState?.unlockedChapters?.includes(chapter.id) ?? false;
            const active = chapter.id === gameState?.currentChapter?.id;
            return (
              <div className={active ? "sidebar-chapter-row active" : "sidebar-chapter-row"} key={chapter.id}>
                <span>
                  <strong>{chapter.title}</strong>
                  <small>{active ? `${progress?.progressPercent ?? 0}% tamamlandı` : unlocked ? "Açık" : "Kilitli"}</small>
                </span>
                {!unlocked ? <LockSimple size={15} weight="fill" /> : <b>{progress?.progressPercent ?? 0}%</b>}
              </div>
            );
          })}
        </div>
      </section>
      <div className="sidebar-seal">SPQR</div>
    </aside>
  );
}
