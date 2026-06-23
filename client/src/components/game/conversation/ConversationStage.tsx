import { useGameStore } from "../../../stores/gameStore";
import { ConversationNodeView } from "./ConversationNodeView";
import { ConversationOptionList } from "./ConversationOptionList";
import { ConversationLatinComposer } from "./ConversationLatinComposer";
import { FreeformActionBox } from "./FreeformActionBox";

export function ConversationStage() {
  const {
    gameState,
    selectConversationOption,
    submitConversationText,
    exitConversation,
    submitFreeformAction,
    actionLoading
  } = useGameStore();

  const activeConv = gameState?.activeConversation;
  if (!activeConv || !activeConv.currentNode) return null;

  const currentNode = activeConv.currentNode;
  const options = activeConv.options || [];
  const selectedOption = activeConv.selectedOptionId
    ? options.find((o: any) => o.id === activeConv.selectedOptionId)
    : undefined;

  return (
    <section 
      className="conversation-stage-card scene-card panel-card" 
      style={{ 
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        animation: "fadeIn 0.4s ease-out"
      }}
    >
      <div 
        className="conversation-header" 
        style={{
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: "0.75rem",
          marginBottom: "0.8rem"
        }}
      >
        <div>
          <span className="eyebrow" style={{ color: "var(--accent-gold, #c3a05c)", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "1px" }}>Colloquium</span>
          <h3 style={{ margin: 0, color: "#ffffff", fontSize: "1.25rem" }}>Sohbet</h3>
        </div>
        <button
          className="btn-exit-conversation"
          type="button"
          onClick={exitConversation}
          disabled={actionLoading}
          style={{
            backgroundColor: "rgba(220, 50, 50, 0.1)",
            border: "1px solid rgba(220, 50, 50, 0.25)",
            color: "#ff8b8b",
            padding: "0.4rem 0.8rem",
            borderRadius: "4px",
            fontSize: "0.8rem",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseOver={e => {
            if (!actionLoading) {
              e.currentTarget.style.backgroundColor = "rgba(220, 50, 50, 0.25)";
              e.currentTarget.style.borderColor = "rgba(220, 50, 50, 0.4)";
            }
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = "rgba(220, 50, 50, 0.1)";
            e.currentTarget.style.borderColor = "rgba(220, 50, 50, 0.25)";
          }}
        >
          Konuşmadan Çık (Abeo)
        </button>
      </div>

      <ConversationNodeView node={currentNode} />

      {selectedOption ? (
        <ConversationLatinComposer
          option={selectedOption}
          onSubmit={submitConversationText}
          onCancel={exitConversation}
          actionLoading={actionLoading}
        />
      ) : (
        <>
          <ConversationOptionList
            options={options}
            disabled={actionLoading}
            onOptionSelect={selectConversationOption}
          />
          <FreeformActionBox
            onSubmit={submitFreeformAction}
            actionLoading={actionLoading}
          />
        </>
      )}
    </section>
  );
}
