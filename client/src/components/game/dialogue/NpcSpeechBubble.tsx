import React from "react";
import { getSpeakerLabel } from "../../../utils/displayLabels";

export function NpcSpeechBubble({ npcId, latinText, trText }: { npcId?: string; latinText: string; trText?: string }) {
  return (
    <div className="npc-speech-bubble-container">
      <div className="npc-speech-avatar">
        {getSpeakerLabel(npcId || "Magister")[0].toUpperCase()}
      </div>
      <div className="npc-speech-bubble cinematic-dialogue-bubble">
        <div className="npc-speech-header">{getSpeakerLabel(npcId || "Magister")}</div>
        <p className="npc-speech-latin">“{latinText}”</p>
        {trText && <p className="npc-speech-tr">({trText})</p>}
      </div>
    </div>
  );
}
