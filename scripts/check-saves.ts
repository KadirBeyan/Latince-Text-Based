import { getRuntimeConfig } from "../server/src/config/RuntimeConfig";
import { initDatabase, openDatabase } from "../server/src/db/database";
import { ContentLoader } from "../server/src/game/content/ContentLoader";
import { SaveSerializer } from "../server/src/game/save/SaveSerializer";
import { SaveIntegrityService } from "../server/src/system/SaveIntegrityService";

type Row = { id: string; saveJson: string };
const runtime = getRuntimeConfig();
const db = openDatabase(runtime.paths.databasePath);
initDatabase(db);
const loader = new ContentLoader();
loader.load();
const rows = db.prepare("SELECT id, saveJson FROM saves ORDER BY updatedAt DESC").all() as Row[];
const serializer = new SaveSerializer();
const integrity = new SaveIntegrityService(db, loader).checkAllSaves();
const migrationWarnings: string[] = [];

for (const row of rows) {
  try {
    const raw = JSON.parse(row.saveJson) as { save?: { schemaVersion?: number }; schemaVersion?: number };
    const sourceVersion = raw.save?.schemaVersion ?? raw.schemaVersion ?? 1;
    const parsed = serializer.deserialize(row.saveJson);
    if (parsed.ok && parsed.save.schemaVersion !== sourceVersion) migrationWarnings.push(`${row.id}: v${sourceVersion} -> v${parsed.save.schemaVersion}`);
  } catch {
    // Corrupt JSON is reported by the integrity service below.
  }
}

const invalid = integrity.filter((report) => !report.ok);
const warnings = integrity.flatMap((report) => report.issues.filter((issue) => issue.severity === "warning").map((issue) => `${report.saveId}: ${issue.message}`));
console.log(`Save count: ${rows.length}`);
console.log(`Invalid save count: ${invalid.length}`);
console.log(`Migration warnings: ${migrationWarnings.length}`);
console.log(`Integrity warnings: ${warnings.length}`);
for (const warning of migrationWarnings) console.log(`[migration] ${warning}`);
for (const warning of warnings) console.log(`[integrity] ${warning}`);
for (const report of invalid) for (const issue of report.issues) console.log(`[invalid] ${report.saveId}: ${issue.message}`);
db.close();
if (invalid.length > 0) process.exitCode = 1;
