import { Heart, Crown, Handshake, Brain, CalendarBlank } from "@phosphor-icons/react";
import { useGameStore } from "../../stores/gameStore";

const NPC_NAMES: Record<string, string> = {
  magister: "Magister Aelius",
  marcus: "Marcus",
  mercator: "Tüccar Mercator",
  davus: "Davus",
  lucia: "Lucia",
  quintus: "Quintus"
};

export function NpcMemoryPanel() {
  const { gameState } = useGameStore();

  if (!gameState) return null;

  const currentSceneNpcs = gameState.currentScene.npcIds || [];
  const memories = gameState.npcMemories || [];

  // Filter memories to only show NPCs present in the current scene
  const sceneMemories = memories.filter(m => currentSceneNpcs.includes(m.npcId));

  const relationshipTone = (val: number) => val < 30 ? "low" : val < 60 ? "mid" : "high";

  return (
    <section className="panel-card npc-memory-panel">
      <div className="panel-heading">
        <p className="eyebrow">Personae</p>
        <h3>Karakter İlişkileri & Hafıza</h3>
      </div>

      {sceneMemories.length === 0 ? (
        <div className="empty-state">
          <p>Şu anki sahnede etkileşimde bulunulan bir karakter yok veya henüz bir hafıza kaydı bulunmuyor.</p>
        </div>
      ) : (
        <div className="npc-list">
          {sceneMemories.map(npcMem => {
            const name = NPC_NAMES[npcMem.npcId] || npcMem.npcId.charAt(0).toUpperCase() + npcMem.npcId.slice(1);
            return (
              <div key={npcMem.npcId} className="npc-card cinematic-npc-card">
                <h4>
                  <span className="npc-card-dot" aria-hidden="true" />
                  {name}
                </h4>

                <div className="relationship-stats cinematic-relationship-stats">
                  <div>
                    <div className="relationship-row-label">
                      <span><Handshake size={14} weight="duotone" /> Güven</span>
                      <span>{npcMem.relationship.trust}/100</span>
                    </div>
                    <div className={`relationship-bar ${relationshipTone(npcMem.relationship.trust)}`}><span style={{ width: `${npcMem.relationship.trust}%` }} /></div>
                  </div>
                  <div>
                    <div className="relationship-row-label">
                      <span><Crown size={14} weight="duotone" /> Saygı</span>
                      <span>{npcMem.relationship.respect}/100</span>
                    </div>
                    <div className={`relationship-bar ${relationshipTone(npcMem.relationship.respect)}`}><span style={{ width: `${npcMem.relationship.respect}%` }} /></div>
                  </div>
                  <div>
                    <div className="relationship-row-label">
                      <span><Heart size={14} weight="duotone" /> Aşinalık</span>
                      <span>{npcMem.relationship.familiarity}/100</span>
                    </div>
                    <div className={`relationship-bar ${relationshipTone(npcMem.relationship.familiarity)}`}><span style={{ width: `${npcMem.relationship.familiarity}%` }} /></div>
                  </div>
                </div>

                <div className="facts-section cinematic-facts-section">
                  <h5>
                    <Brain size={14} weight="duotone" /> NPC hafızası
                  </h5>
                  {npcMem.facts.length === 0 ? (
                    <p className="empty-state">Bu karakter henüz özel bir olayı hatırlamıyor.</p>
                  ) : (
                    <ul className="npc-memory-timeline">
                      {npcMem.facts.map(fact => (
                        <li key={fact.id}>
                          <span>{fact.text}</span>{" "}
                          <small className={fact.importance >= 70 ? "important" : ""}>önem {fact.importance}</small>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {npcMem.lastInteractionAt && (
                  <div className="last-interaction-line">
                    <CalendarBlank size={12} />
                    <span>Son Etkileşim: {new Date(npcMem.lastInteractionAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
