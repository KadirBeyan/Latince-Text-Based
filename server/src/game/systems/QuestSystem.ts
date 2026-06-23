import type { ID, PlayerSave, QuestStatus } from "../types/gameTypes";

export class QuestSystem {
  startQuest(save: PlayerSave, questId: ID): PlayerSave {
    const existing = save.questStates[questId];
    if (existing?.status === "active" || existing?.status === "completed") {
      return save;
    }
    return {
      ...save,
      currentQuestId: questId,
      questStates: { ...save.questStates, [questId]: { questId, status: "active", startedAt: new Date().toISOString() } }
    };
  }

  completeQuest(save: PlayerSave, questId: ID): PlayerSave {
    return this.setQuestStatus(save, questId, "completed", "completedAt");
  }

  failQuest(save: PlayerSave, questId: ID): PlayerSave {
    return this.setQuestStatus(save, questId, "failed", "failedAt");
  }

  getQuestStatus(save: PlayerSave, questId: ID): QuestStatus {
    return save.questStates[questId]?.status ?? "not_started";
  }

  ensureCurrentQuest(save: PlayerSave): PlayerSave {
    return this.startQuest(save, save.currentQuestId);
  }

  private setQuestStatus(save: PlayerSave, questId: ID, status: QuestStatus, timestampKey: "completedAt" | "failedAt"): PlayerSave {
    const previous = save.questStates[questId] ?? { questId, status: "not_started" as QuestStatus };
    return {
      ...save,
      questStates: {
        ...save.questStates,
        [questId]: { ...previous, status, [timestampKey]: new Date().toISOString() }
      }
    };
  }
}
