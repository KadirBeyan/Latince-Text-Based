import { useEffect } from "react";
import { useState } from "react";
import { CharacterCreationScreen } from "../character/CharacterCreationScreen";
import { LlmSettingsPanel } from "../panels/LlmSettingsPanel";
import { NewGameForm } from "./NewGameForm";
import { SaveList } from "./SaveList";

export function StartScreen() {
  const [creatingCharacter, setCreatingCharacter] = useState(false);
  useEffect(() => { window.scrollTo(0, 0); }, []);
  if (creatingCharacter) return <CharacterCreationScreen onCancel={() => setCreatingCharacter(false)} />;
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
          <div className="panel-heading">
            <p className="eyebrow">Initium</p>
            <h2>Yeni Karakter</h2>
            <p>Küçük bir Roma köyünde sıradan biri olarak başla; kökenin, becerilerin ve ilişkilerin ilerideki yolları hazırlasın.</p>
          </div>
          <button type="button" className="enter-world-button" onClick={() => setCreatingCharacter(true)}>Karakter Oluştur</button>
          {import.meta.env.DEV ? (
            <details className="quick-start-details">
              <summary>Geliştirici hızlı başlangıç</summary>
              <NewGameForm />
            </details>
          ) : null}
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
