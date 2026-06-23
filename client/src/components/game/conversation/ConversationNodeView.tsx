import { useState } from "react";
import type { ConversationNode } from "../../../types/gameTypes";
import { getSpeakerLabel } from "../../../utils/displayLabels";
import magisterPortrait from "../../../assets/magister-portrait.png";
import discipulusAvatar from "../../../assets/discipulus-avatar.png";

type ConversationNodeViewProps = {
  node: ConversationNode;
};

export function ConversationNodeView({ node }: ConversationNodeViewProps) {
  const [showTranslation, setShowTranslation] = useState(true);
  const speakerId = node.speakerNpcId || "system";
  const speakerLabel = getSpeakerLabel(speakerId);

  const renderAvatar = () => {
    if (speakerId === "magister" || speakerId === "magister_ruralis") {
      return <img className="npc-medallion" src={magisterPortrait} alt={speakerLabel} />;
    }
    if (speakerId === "player" || speakerId === "tu") {
      return <img className="npc-medallion" src={discipulusAvatar} alt={speakerLabel} />;
    }

    const firstLetter = speakerLabel.charAt(0).toUpperCase();
    const gradients: Record<string, string> = {
      M: "linear-gradient(135deg, #8a2387, #e94057, #f27121)", // Mater (Sunset)
      P: "linear-gradient(135deg, #11998e, #38ef7d)", // Pater (Nature)
      V: "linear-gradient(135deg, #4568dc, #b06ab3)", // Veteranus (Royal Blue)
      S: "linear-gradient(135deg, #f12711, #f5af19)", // Scriba (Fire)
    };
    const background = gradients[firstLetter] || "linear-gradient(135deg, #3a7bd5, #3a6073)";

    return (
      <div
        className="npc-medallion npc-monogram"
        style={{
          background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff",
          fontWeight: "bold",
          fontSize: "1.25rem",
          borderRadius: "50%",
          width: "48px",
          height: "48px",
          border: "2px solid var(--accent-gold, #c3a05c)",
          textShadow: "1px 1px 2px rgba(0,0,0,0.5)"
        }}
      >
        {firstLetter}
      </div>
    );
  };

  const isSystem = speakerId === "system" || speakerId === "systema";

  return (
    <div className="conversation-node-view">
      {node.narrationTr && (
        <div className="parchment-card conversation-narration" style={{ marginBottom: "1.2rem", padding: "1.2rem" }}>
          <p className="scene-description">{node.narrationTr}</p>
        </div>
      )}

      {node.npcLineLatin && (
        <div className="npc-dialogue-card" style={{ transition: "all 0.3s ease" }}>
          <div className="npc-medallion-wrap">
            {renderAvatar()}
            <span className="npc-nameplate">{speakerLabel}</span>
          </div>
          <div className="npc-speech">
            <p className="latin-quote" style={{ fontSize: "1.15rem", fontWeight: "600", color: "var(--accent-gold, #c3a05c)" }}>
              {node.npcLineLatin}
            </p>
            {node.npcLineTr && showTranslation && (
              <p className="translation-text" style={{ marginTop: "0.5rem", fontStyle: "italic", opacity: 0.9 }}>
                {node.npcLineTr}
              </p>
            )}
            {node.npcLineTr && (
              <button
                type="button"
                className="btn-text-toggle"
                onClick={() => setShowTranslation(!showTranslation)}
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted, #8e8e93)",
                  background: "none",
                  border: "none",
                  padding: "0",
                  cursor: "pointer",
                  marginTop: "0.4rem",
                  textDecoration: "underline"
                }}
              >
                {showTranslation ? "Tercümeyi Gizle" : "Tercümeyi Göster"}
              </button>
            )}
          </div>
        </div>
      )}

      {node.playerContextTr && (
        <div className="player-context-box" style={{ margin: "1rem 0", fontStyle: "italic", color: "var(--text-muted, #8e8e93)", fontSize: "0.9rem", textAlign: "center" }}>
          {node.playerContextTr}
        </div>
      )}
    </div>
  );
}
