#!/usr/bin/env tsx
import { openDatabase, initDatabase } from "../server/src/db/database";
import { ContentLoader } from "../server/src/game/content/ContentLoader";
import { LexicalRepository } from "../server/src/lexicon/LexicalRepository";
import { LatinLexicalEngine } from "../server/src/lexicon/LatinLexicalEngine";

async function main() {
  const args = process.argv.slice(2);
  const db = openDatabase();
  initDatabase(db);
  const repo = new LexicalRepository(db);
  if (args.includes("--stats")) {
    console.log(JSON.stringify(repo.getStats(), null, 2));
    db.close();
    return;
  }
  const query = args[0];
  if (!query) throw new Error("Usage: npx tsx scripts/inspect-lexicon.ts <word>|--stats");
  const loader = new ContentLoader();
  loader.load();
  const result = await new LatinLexicalEngine(repo, loader).lookup(query);
  console.log(JSON.stringify(result, null, 2));
  db.close();
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exit(1); });
