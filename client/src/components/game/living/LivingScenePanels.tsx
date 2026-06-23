import React from "react";
import { useGameStore } from "../../../stores/gameStore";

export function RevisitNotice() {
  const { gameState } = useGameStore();
  const livingScene = gameState?.livingScene;

  if (!livingScene || !livingScene.isRevisit) {
    return null;
  }

  return (
    <div className="parchment-card alert-banner" style={{ borderLeft: "4px solid var(--gold)" }}>
      <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--gold)" }}>
        <strong>Agnitiō · Tanıdıklık Hissi</strong>
      </p>
      <p style={{ margin: "4px 0 0 0", fontSize: "0.85rem", opacity: 0.8 }}>
        Bu mekana daha önce de ayak basmıştın. Çevredeki insanlar ve nesneler sana tanıdık geliyor.
      </p>
    </div>
  );
}

export function AmbientActionPanel() {
  const { gameState, submitIntent, actionLoading } = useGameStore();
  const livingScene = gameState?.livingScene;

  if (!livingScene || !livingScene.ambientActions || livingScene.ambientActions.length === 0) {
    return null;
  }

  const isResolved = (action: any) => {
    // Check if any of the effects of this action are already in the scene state
    for (const effect of action.effects || []) {
      if (effect.type === "MARK_SCENE_INSPECTED" && livingScene.inspectedIds.includes(effect.inspectId)) return true;
      if (effect.type === "MARK_SCENE_LISTENED" && livingScene.listenedIds.includes(effect.listenId)) return true;
      if (effect.type === "MARK_SCENE_READ" && livingScene.readIds.includes(effect.readId)) return true;
      if (effect.type === "SET_SCENE_LOCAL_FLAG" && livingScene.localFlags[effect.key] === effect.value) return true;
    }
    return false;
  };

  return (
    <section className="choice-panel panel-card" style={{ marginTop: "1rem" }}>
      <div className="panel-heading compact-heading">
        <p className="eyebrow">Actiōnēs Ambientēs</p>
        <h3>Çevrede ne yapmak istersin?</h3>
      </div>
      <div className="choice-list" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.5rem" }}>
        {livingScene.ambientActions.map((action, index) => {
          const resolved = isResolved(action);
          return (
            <button
              className={`choice-button cinematic-choice-card ${resolved ? "choice-button--resolved" : ""}`}
              style={{
                animationDelay: `${index * 70}ms`,
                opacity: resolved ? 0.6 : 1,
                border: resolved ? "1px dashed rgba(255,255,255,0.2)" : "1px solid var(--gold-alpha)"
              }}
              type="button"
              key={action.id}
              disabled={actionLoading || resolved}
              onClick={() => void submitIntent(action.id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <span style={{ fontWeight: 600 }}>{action.labelTr}</span>
                {resolved && <span style={{ fontSize: "0.75rem", color: "var(--gold)" }}>✓ İncelendi</span>}
              </div>
              {action.descriptionTr && <small style={{ display: "block", marginTop: "2px" }}>{action.descriptionTr}</small>}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function NpcMemoryReactionCard() {
  const { gameState } = useGameStore();
  const livingScene = gameState?.livingScene;

  if (!livingScene || !livingScene.npcReactions || livingScene.npcReactions.length === 0) {
    return null;
  }

  return (
    <div className="npc-reactions-panel" style={{ marginTop: "1rem" }}>
      {livingScene.npcReactions.map((reaction, idx) => (
        <div
          className="npc-dialogue-card"
          key={idx}
          style={{
            borderLeft: "3px solid var(--gold)",
            padding: "0.75rem",
            marginBottom: "0.5rem"
          }}
        >
          <div className="npc-speech" style={{ paddingLeft: "0.5rem" }}>
            <p className="eyebrow" style={{ margin: 0, fontSize: "0.8rem", color: "var(--gold)" }}>
              {reaction.npcName} · Hafıza Reaksiyonu
            </p>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", fontStyle: "italic", opacity: 0.9 }}>
              {reaction.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SceneMemoryBadges() {
  const { gameState } = useGameStore();
  const livingScene = gameState?.livingScene;

  if (!livingScene) {
    return null;
  }

  const clueCount = livingScene.discoveredClueIds.length;
  const vocabCount = livingScene.discoveredVocabularyIds.length;
  const grammarCount = livingScene.discoveredGrammarIds.length;

  if (clueCount === 0 && vocabCount === 0 && grammarCount === 0) {
    return null;
  }

  return (
    <div className="scene-meta-row" style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      {clueCount > 0 && (
        <span className="scene-badge" style={{ backgroundColor: "rgba(184, 134, 11, 0.2)", border: "1px solid var(--gold)" }}>
          🔍 {clueCount} İpucu Keşfedildi
        </span>
      )}
      {vocabCount > 0 && (
        <span className="scene-badge" style={{ backgroundColor: "rgba(34, 139, 34, 0.2)", border: "1px solid green" }}>
          📖 {vocabCount} Kelime Keşfedildi
        </span>
      )}
      {grammarCount > 0 && (
        <span className="scene-badge" style={{ backgroundColor: "rgba(70, 130, 180, 0.2)", border: "1px solid steelblue" }}>
          📐 {grammarCount} Gramer Keşfedildi
        </span>
      )}
    </div>
  );
}

export function LivingSceneStatus() {
  const { gameState } = useGameStore();
  const livingScene = gameState?.livingScene;

  if (!livingScene) {
    return null;
  }

  return (
    <div style={{ padding: "0.5rem 1rem", fontSize: "0.75rem", opacity: 0.6, display: "flex", justifyContent: "space-between" }}>
      <span>Ziyaret Sayısı: {livingScene.visitCount}</span>
      {livingScene.activeVariantId && <span>Aktif Varyant: {livingScene.activeVariantId}</span>}
    </div>
  );
}
