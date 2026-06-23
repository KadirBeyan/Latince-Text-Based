import { randomUUID } from "node:crypto";
import type { JournalEntry, PlayerSave } from "../types/gameTypes";

export class JournalSystem {
  addEntry(save: PlayerSave, entry: Omit<JournalEntry, "id" | "timestamp">): PlayerSave {
    return { ...save, journalEntries: [...save.journalEntries, { id: randomUUID(), timestamp: new Date().toISOString(), ...entry }] };
  }

  listEntries(save: PlayerSave): JournalEntry[] {
    return save.journalEntries;
  }
}
