import type { AppDatabase } from "../../db/database";
import type { PlayerSave } from "../types/gameTypes";
import { SaveSerializer } from "./SaveSerializer";

interface SaveRow {
  id: string;
  playerName: string;
  saveJson: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaveSummary {
  id: string;
  playerName: string;
  createdAt: string;
  updatedAt: string;
}

export class SaveRepository {
  private readonly serializer = new SaveSerializer();

  constructor(private readonly db: AppDatabase) {}

  create(save: PlayerSave): PlayerSave {
    const saveJson = this.serializer.serialize(save);
    this.db
      .prepare("INSERT INTO saves (id, playerName, saveJson, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)")
      .run(save.id, save.playerName, saveJson, save.createdAt, save.updatedAt);
    return save;
  }

  getById(saveId: string): PlayerSave | null {
    const row = this.db.prepare("SELECT * FROM saves WHERE id = ?").get(saveId) as SaveRow | undefined;
    if (!row) {
      return null;
    }
    const result = this.serializer.deserialize(row.saveJson);
    if (!result.ok) {
      throw new Error(`Save ${saveId} is corrupted: ${result.error}`);
    }
    return result.save;
  }

  update(save: PlayerSave): PlayerSave {
    const updatedAt = new Date().toISOString();
    const updatedSave: PlayerSave = { ...save, updatedAt };
    const result = this.db
      .prepare("UPDATE saves SET playerName = ?, saveJson = ?, updatedAt = ? WHERE id = ?")
      .run(updatedSave.playerName, this.serializer.serialize(updatedSave), updatedSave.updatedAt, updatedSave.id);
    if (result.changes === 0) {
      throw new Error(`Cannot update missing save ${save.id}.`);
    }
    return updatedSave;
  }

  delete(saveId: string): void {
    this.db.prepare("DELETE FROM saves WHERE id = ?").run(saveId);
  }

  list(): SaveSummary[] {
    const rows = this.db.prepare("SELECT id, playerName, createdAt, updatedAt FROM saves ORDER BY updatedAt DESC").all() as SaveRow[];
    return rows.map((row) => ({ id: row.id, playerName: row.playerName, createdAt: row.createdAt, updatedAt: row.updatedAt }));
  }
}
