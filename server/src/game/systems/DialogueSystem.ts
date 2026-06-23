import { randomUUID } from "node:crypto";
import type { DialogueEntry, ID, PlayerSave } from "../types/gameTypes";

export class DialogueSystem {
  addDialogue(save: PlayerSave, speakerId: ID, text: string, language: string): PlayerSave {
    const entry: DialogueEntry = { id: randomUUID(), timestamp: new Date().toISOString(), speakerId, text, language };
    return { ...save, dialogueLog: [...save.dialogueLog, entry] };
  }

  listDialogue(save: PlayerSave): DialogueEntry[] {
    return save.dialogueLog;
  }
}
