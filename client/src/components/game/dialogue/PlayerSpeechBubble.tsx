import React from "react";

export function PlayerSpeechBubble({ text }: { text: string }) {
  return (
    <div className="player-speech-bubble-container">
      <div className="player-speech-bubble">
        <div className="player-speech-header">Sen (Latin)</div>
        <p className="player-speech-text">“{text}”</p>
      </div>
      <div className="player-speech-avatar">S</div>
    </div>
  );
}
