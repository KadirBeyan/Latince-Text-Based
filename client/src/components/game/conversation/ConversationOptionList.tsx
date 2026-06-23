import type { ConversationOption } from "../../../types/gameTypes";
import { ConversationOptionCard } from "./ConversationOptionCard";

type ConversationOptionListProps = {
  options: ConversationOption[];
  disabled?: boolean;
  onOptionSelect: (optionId: string) => void;
};

export function ConversationOptionList({ options, disabled, onOptionSelect }: ConversationOptionListProps) {
  if (options.length === 0) return null;

  return (
    <div 
      className="conversation-option-list"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        width: "100%",
        marginTop: "1.2rem"
      }}
    >
      {options.map((option, index) => (
        <div 
          key={option.id} 
          className="conversation-option-card-wrapper"
          style={{
            animation: "fadeInUp 0.3s ease forwards",
            animationDelay: `${index * 50}ms`,
            transform: "translateY(10px)",
            opacity: 1 // fallback if animation is delayed or omitted
          }}
        >
          <ConversationOptionCard
            option={option}
            disabled={disabled}
            onClick={() => onOptionSelect(option.id)}
          />
        </div>
      ))}
    </div>
  );
}
