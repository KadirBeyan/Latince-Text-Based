import { useGameStore, type RightPanelTab } from "../../stores/gameStore";
import { EventLog } from "../game/EventLog";
import { FeedbackPanel } from "../game/FeedbackPanel";
import { GrammarHintPanel } from "../panels/GrammarHintPanel";
import { JournalPanel } from "../panels/JournalPanel";
import { SystemPanel } from "../system/SystemPanel";
import { MasteryPanel } from "../panels/MasteryPanel";
import { LatinAnalysisPanel } from "../panels/LatinAnalysisPanel";
import { LatinExercisePanel } from "../panels/LatinExercisePanel";
import { MundusPanel } from "../panels/MundusPanel";
import { NpcMemoryPanel } from "../panels/NpcMemoryPanel";
import { getPanelTabLabel } from "../../utils/displayLabels";
import { PlacementTestScreen } from "../assessment/PlacementTestScreen";
import { ChallengeModePanel } from "../assessment/ChallengeModePanel";
import { LearningPathPanel } from "../assessment/LearningPathPanel";
import { AnalyticsDashboard } from "../assessment/AnalyticsDashboard";
import { AchievementPanel } from "../assessment/AchievementPanel";
import { LexiconSearchPanel } from "../lexicon/LexiconSearchPanel";
import { VocabularyPlanPanel } from "../lexicon/VocabularyPlanPanel";

const tabs: Array<{ id: RightPanelTab; label: string }> = [
  { id: "feedback", label: "Correctio" },
  { id: "lingua", label: "Lingua" },
  { id: "rota", label: "Rota" },
];

export function RightPanel() {
  const { selectedRightPanelTab, setRightPanelTab } = useGameStore();
  const panelHeading = selectedRightPanelTab === "feedback"
    ? ["Correctio", "Düzeltme"]
    : selectedRightPanelTab === "lingua" || selectedRightPanelTab === "hint"
      ? ["Lingua", "Dil Çalışması"]
      : selectedRightPanelTab === "settings"
        ? ["Systema", "Sistem"]
        : selectedRightPanelTab === "tabula"
          ? ["Tabula", "Raporlar"]
          : [getPanelTabLabel(selectedRightPanelTab), "Öğrenme Rotası"];

  return (
    <aside className="right-panel">
      <nav className="tab-bar" aria-label="Sağ panel sekmeleri">
        {tabs.map((tab) => (
          <button key={tab.id} type="button" className={selectedRightPanelTab === tab.id ? "active" : ""} onClick={() => setRightPanelTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="right-panel-body">
        <header className="right-panel-heading">
          <p className="eyebrow">{panelHeading[0]}</p>
          <h2>{panelHeading[1]}</h2>
        </header>
        {selectedRightPanelTab === "feedback" ? <FeedbackPanel compact /> : null}
        {selectedRightPanelTab === "personae" ? <NpcMemoryPanel /> : null}
        {selectedRightPanelTab === "mundus" ? <MundusPanel /> : null}
        {selectedRightPanelTab === "journal" ? <JournalPanel /> : null}
        {selectedRightPanelTab === "mastery" ? <MasteryPanel /> : null}
        {selectedRightPanelTab === "lingua" || selectedRightPanelTab === "hint" ? <div className="lingua-panel-stack"><GrammarHintPanel /><LexiconSearchPanel /><LatinAnalysisPanel /><LatinExercisePanel /><PlacementTestScreen /><ChallengeModePanel /></div> : null}
        {selectedRightPanelTab === "rota" ? <div className="lingua-panel-stack"><LearningPathPanel /><VocabularyPlanPanel /></div> : null}
        {selectedRightPanelTab === "tabula" ? <AnalyticsDashboard /> : null}
        {selectedRightPanelTab === "gloria" ? <AchievementPanel /> : null}
        {selectedRightPanelTab === "events" ? <EventLog /> : null}
        {selectedRightPanelTab === "settings" ? <SystemPanel /> : null}
      </div>
    </aside>
  );
}
