#!/usr/bin/env tsx
import fs from "node:fs";
import path from "node:path";
import { openDatabase, initDatabase } from "../server/src/db/database";
import { LexicalRepository } from "../server/src/lexicon/LexicalRepository";
import { buildLexicalIndex } from "../server/src/lexicon/LexicalIndexBuilder";

const db = openDatabase();
initDatabase(db);
const repo = new LexicalRepository(db);
const entries = repo.findByRankRange(1, 999999);
const index = buildLexicalIndex(entries);
const output = path.resolve(process.cwd(), "data", "imported", "lexical-index.json");
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(index, null, 2));
console.log(JSON.stringify({ output, entryCount: index.entryCount, formCount: index.formCount }, null, 2));
db.close();
