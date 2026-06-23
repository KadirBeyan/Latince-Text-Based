import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { getDatabasePath } from "../config/AppPaths";
import { ensureLexicalSchema } from "../lexicon/LexicalRepository";

export type AppDatabase = Database.Database;

export function openDatabase(dbPath = getDatabasePath()): AppDatabase {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  return new Database(dbPath);
}

export function initDatabase(db: AppDatabase): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS saves (
      id TEXT PRIMARY KEY,
      playerName TEXT NOT NULL,
      saveJson TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);
  ensureLexicalSchema(db);
}
