import type { AppDatabase } from "../db/database";
import { ContentLoader } from "../game/content/ContentLoader";
import { SaveSerializer } from "../game/save/SaveSerializer";

type SaveRow = { id: string; playerName: string; saveJson: string; createdAt: string; updatedAt: string };

export type SaveIntegrityReport = {
  saveId: string;
  ok: boolean;
  issues: Array<{ severity: "warning" | "error"; message: string }>;
};

export class SaveIntegrityService {
  private readonly serializer = new SaveSerializer();

  constructor(private readonly db: AppDatabase, private readonly contentLoader: ContentLoader) {}

  checkAllSaves(): SaveIntegrityReport[] {
    const rows = this.db.prepare("SELECT * FROM saves ORDER BY updatedAt DESC").all() as SaveRow[];
    return rows.map((row) => this.checkRow(row));
  }

  checkSaveIntegrity(saveId: string): SaveIntegrityReport {
    const row = this.db.prepare("SELECT * FROM saves WHERE id = ?").get(saveId) as SaveRow | undefined;
    if (!row) throw new Error(`Save ${saveId} was not found.`);
    return this.checkRow(row);
  }

  repairSave(saveId: string): { report: SaveIntegrityReport; repaired: boolean } {
    const row = this.db.prepare("SELECT * FROM saves WHERE id = ?").get(saveId) as SaveRow | undefined;
    if (!row) throw new Error(`Save ${saveId} was not found.`);
    const parsed = this.serializer.deserialize(row.saveJson);
    if (!parsed.ok) return { report: this.checkRow(row), repaired: false };
    const save = parsed.save;
    const eventLog = save.eventLog.length > 200 ? save.eventLog.slice(-200) : save.eventLog;
    const dialogueLog = save.dialogueLog.length > 200 ? save.dialogueLog.slice(-200) : save.dialogueLog;
    let repaired = eventLog.length !== save.eventLog.length || dialogueLog.length !== save.dialogueLog.length;
    let livingSceneStates = save.livingSceneStates;
    if (!livingSceneStates) {
      livingSceneStates = {};
      repaired = true;
    }
    if (repaired) {
      const saveJson = this.serializer.serialize({ ...save, eventLog, dialogueLog, livingSceneStates });
      this.db.prepare("UPDATE saves SET saveJson = ?, updatedAt = ? WHERE id = ?").run(saveJson, new Date().toISOString(), saveId);
    }
    return { report: this.checkSaveIntegrity(saveId), repaired };
  }

  createLastKnownGood(saveId: string): { id: string } {
    const report = this.checkSaveIntegrity(saveId);
    if (!report.ok) throw new Error("Cannot mark a broken save as last known good.");
    return { id: saveId };
  }

  private checkRow(row: SaveRow): SaveIntegrityReport {
    const issues: SaveIntegrityReport["issues"] = [];
    const result = this.serializer.deserialize(row.saveJson);
    if (!result.ok) {
      return { saveId: row.id, ok: false, issues: [{ severity: "error", message: result.error }] };
    }
    const save = result.save;
    if (!this.contentLoader.findChapterForScene(save.currentCampaignId, save.currentSceneId)) issues.push({ severity: "error", message: `Invalid currentSceneId: ${save.currentSceneId}` });
    if (!this.contentLoader.getQuest(save.currentCampaignId, save.currentQuestId)) issues.push({ severity: "error", message: `Invalid currentQuestId: ${save.currentQuestId}` });
    if (!Array.isArray(save.inventory)) issues.push({ severity: "error", message: "Inventory is not an array." });
    if (!Array.isArray(save.masteryStates)) issues.push({ severity: "error", message: "masteryStates is not an array." });
    if (!Array.isArray(save.assessmentAttempts)) issues.push({ severity: "error", message: "assessmentAttempts is not an array." });
    if (!save.livingSceneStates || typeof save.livingSceneStates !== "object") issues.push({ severity: "error", message: "livingSceneStates is missing or not an object." });
    if (save.eventLog.length > 200) issues.push({ severity: "warning", message: "eventLog is larger than 200 entries." });
    if (save.dialogueLog.length > 200) issues.push({ severity: "warning", message: "dialogueLog is larger than 200 entries." });
    for (const quest of save.generatedQuests) {
      if (quest.status === "active" && !quest.scenes.some((scene) => scene.id === save.currentSceneId) && save.currentQuestId === quest.id) {
        issues.push({ severity: "error", message: `Generated quest ${quest.id} does not contain current scene.` });
      }
    }
    return { saveId: row.id, ok: !issues.some((issue) => issue.severity === "error"), issues };
  }
}
