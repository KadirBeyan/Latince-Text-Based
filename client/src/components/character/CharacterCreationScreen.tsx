import { CharacterCreationProvider, useCharacterCreationStore } from "../../stores/characterCreationStore";
import { CharacterNameStep } from "./CharacterNameStep";
import { CharacterOriginStep } from "./CharacterOriginStep";
import { CharacterSheetPreview } from "./CharacterSheetPreview";
import { CharacterSummaryStep } from "./CharacterSummaryStep";
import { SkillAllocationStep } from "./SkillAllocationStep";
import { TraitSelectionStep } from "./TraitSelectionStep";

const stepLabels = ["Kimlik", "Köken", "Beceriler", "Eğilim", "Özet"];

function CreationFlow({ onCancel }: { onCancel: () => void }) {
  const { step, stepIndex, canContinue, goNext, goBack } = useCharacterCreationStore();
  const Step = step === "name" ? CharacterNameStep : step === "origin" ? CharacterOriginStep : step === "skills" ? SkillAllocationStep : step === "traits" ? TraitSelectionStep : CharacterSummaryStep;
  return (
    <main className="character-creation-screen">
      <section className="creation-shell panel-card start-parchment">
        <div className="creation-header">
          <button type="button" onClick={onCancel}>Başlangıca dön</button>
          <div className="creation-steps" aria-label="Karakter yaratım adımları">
            {stepLabels.map((label, index) => <span key={label} className={index === stepIndex ? "active" : index < stepIndex ? "done" : ""}>{label}</span>)}
          </div>
        </div>
        <div className="creation-layout">
          <Step />
          <CharacterSheetPreview />
        </div>
        <div className="creation-actions">
          <button type="button" onClick={goBack} disabled={stepIndex === 0}>Geri</button>
          {step !== "summary" ? <button type="button" onClick={goNext} disabled={!canContinue}>Devam</button> : null}
        </div>
      </section>
    </main>
  );
}

export function CharacterCreationScreen({ onCancel }: { onCancel: () => void }) {
  return <CharacterCreationProvider><CreationFlow onCancel={onCancel} /></CharacterCreationProvider>;
}
