import { useEffect } from "react";
import { LlmSettingsPanel } from "../panels/LlmSettingsPanel";
import { NewGameForm } from "./NewGameForm";
import { SaveList } from "./SaveList";

export function StartScreen() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <main className="start-screen">
      <section className="start-hero">
        <p className="eyebrow">Discere Latine, vivere Romane</p>
        <h1>Via Prima</h1>
        <p>Dinamik Latince Text RPG</p>
        <p className="start-copy">Latince öğrenirken Roma dünyasında seçimler yap, cevaplar ver ve hikayeyi ilerlet.</p>
      </section>
      <section className="start-grid">
        <div className="panel-card start-card start-parchment">
          <NewGameForm />
        </div>
        <div className="panel-card start-card">
          <SaveList />
        </div>
        <div className="panel-card start-card settings-start">
          <details>
            <summary>LLM ayarları</summary>
            <LlmSettingsPanel compact />
          </details>
        </div>
      </section>
    </main>
  );
}
