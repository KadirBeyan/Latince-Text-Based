import fs from "node:fs";
import path from "node:path";
import type { PlayerSave, VillageLifeState, VillageActivity, VillageAmbientEvent, VillageDayState, VillageTimeOfDay, GameEvent, LifePathId } from "../types/gameTypes";
import { EMPTY_RPG_SKILLS } from "../character/CharacterTypes";
import type { RuleEngine } from "../core/RuleEngine";

export class VillageLifeSystem {
  private readonly dataRoot: string;

  constructor(dataRoot?: string) {
    this.dataRoot = dataRoot ?? path.resolve(process.cwd(), "data");
  }

  getVillageLife(save: PlayerSave): VillageLifeState {
    if (!save.villageLife) {
      return {
        dayState: {
          dayNumber: 1,
          timeOfDay: "mane",
          actionsUsedThisPeriod: 0,
          maxActionsPerPeriod: 3,
          completedDailyActivityIds: [],
          availableActivityIds: [],
          dayFlags: {}
        },
        routineHistory: []
      };
    }
    return save.villageLife;
  }

  advanceTime(params: {
    save: PlayerSave;
    reasonTr?: string;
  }): {
    save: PlayerSave;
    events: GameEvent[];
  } {
    const { save, reasonTr } = params;
    const villageLife = { ...this.getVillageLife(save) };
    const dayState = { ...villageLife.dayState };
    const fromTime = dayState.timeOfDay;
    let nextTime: VillageTimeOfDay = "mane";
    let dayIncremented = false;

    switch (fromTime) {
      case "mane":
        nextTime = "meridies";
        break;
      case "meridies":
        nextTime = "vesper";
        break;
      case "vesper":
        nextTime = "nox";
        break;
      case "nox":
        nextTime = "mane";
        dayIncremented = true;
        break;
    }

    if (dayIncremented) {
      // Roll over to a new day
      return {
        save: this.startNewVillageDay({ save, summaryTr: reasonTr }),
        events: [
          {
            id: Math.random().toString(),
            type: "VILLAGE_TIME_ADVANCED",
            timestamp: new Date().toISOString(),
            payload: { from: fromTime, to: nextTime, dayNumber: dayState.dayNumber + 1 }
          }
        ]
      };
    }

    dayState.timeOfDay = nextTime;
    dayState.actionsUsedThisPeriod = 0; // reset action count for new block
    villageLife.dayState = dayState;

    const nextSave: PlayerSave = {
      ...save,
      villageLife
    };

    return {
      save: nextSave,
      events: [
        {
          id: Math.random().toString(),
          type: "VILLAGE_TIME_ADVANCED",
          timestamp: new Date().toISOString(),
          payload: { from: fromTime, to: nextTime, dayNumber: dayState.dayNumber }
        }
      ]
    };
  }

  recordVillageActivity(params: {
    save: PlayerSave;
    activityId: string;
    npcIds?: string[];
    lifePathChanges?: Record<string, number>;
    summaryTr: string;
  }): PlayerSave {
    const { save, activityId, npcIds, lifePathChanges, summaryTr } = params;
    const villageLife = { ...this.getVillageLife(save) };
    const dayState = { ...villageLife.dayState };

    if (!dayState.completedDailyActivityIds.includes(activityId)) {
      dayState.completedDailyActivityIds = [...dayState.completedDailyActivityIds, activityId];
    }
    dayState.actionsUsedThisPeriod = Math.min(dayState.maxActionsPerPeriod, dayState.actionsUsedThisPeriod + 1);
    villageLife.dayState = dayState;

    // Update routine history for the day
    const dayNumber = dayState.dayNumber;
    let history = [...villageLife.routineHistory];
    let historyEntryIndex = history.findIndex(h => h.dayNumber === dayNumber);
    let historyEntry = historyEntryIndex !== -1 ? { ...history[historyEntryIndex] } : {
      dayNumber,
      activityIds: [] as string[],
      notableNpcIds: [] as string[],
      lifePathChanges: {} as Record<string, number>,
      summaryTr: ""
    };

    historyEntry.activityIds = [...historyEntry.activityIds, activityId];
    if (npcIds) {
      historyEntry.notableNpcIds = [...new Set([...historyEntry.notableNpcIds, ...npcIds])];
    }
    if (lifePathChanges) {
      const mergedChanges = { ...historyEntry.lifePathChanges };
      for (const [path, amount] of Object.entries(lifePathChanges)) {
        mergedChanges[path] = (mergedChanges[path] ?? 0) + amount;
      }
      historyEntry.lifePathChanges = mergedChanges;
    }
    historyEntry.summaryTr = (historyEntry.summaryTr ? historyEntry.summaryTr + " · " : "") + summaryTr;

    if (historyEntryIndex !== -1) {
      history[historyEntryIndex] = historyEntry;
    } else {
      history.push(historyEntry);
    }
    villageLife.routineHistory = history;

    // Apply life path hint changes to character profile
    let updatedProfile = save.characterProfile;
    if (updatedProfile && lifePathChanges) {
      const newHints = { ...(updatedProfile.lifePathHints || {}) };
      for (const [path, amount] of Object.entries(lifePathChanges)) {
        newHints[path as LifePathId] = Math.max(0, (newHints[path as LifePathId] ?? 0) + amount);
      }
      updatedProfile = {
        ...updatedProfile,
        lifePathHints: newHints
      };
    }

    return {
      ...save,
      characterProfile: updatedProfile,
      villageLife
    };
  }

  getAvailableVillageActivities(params: {
    save: PlayerSave;
    currentLocationId?: string;
  }): VillageActivity[] {
    const { save, currentLocationId } = params;
    const villageLife = this.getVillageLife(save);
    const dayState = villageLife.dayState;
    const timeOfDay = dayState.timeOfDay;

    const filePath = path.join(this.dataRoot, "village", "village-activities.json");
    if (!fs.existsSync(filePath)) {
      return [];
    }

    let activities: VillageActivity[] = [];
    try {
      activities = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
      return [];
    }

    const RuleEngineClass = require("../core/RuleEngine").RuleEngine;
    const ruleEngine = new RuleEngineClass();

    return activities.filter((activity) => {
      // 1. Time Window check
      if (!activity.timeWindows.includes(timeOfDay)) {
        return false;
      }

      // 2. Location check
      if (currentLocationId && activity.locationId !== currentLocationId) {
        return false;
      }

      // 3. Repeatability check
      if (!activity.repeatable) {
        const completedToday = dayState.completedDailyActivityIds.includes(activity.id);
        const completedHistory = villageLife.routineHistory.some((h) => h.activityIds.includes(activity.id));
        if (completedToday || completedHistory) {
          return false;
        }
      }

      // 4. Cooldown check
      if (activity.cooldownDays !== undefined && activity.cooldownDays > 0) {
        let lastCompletedDay = -100;
        for (const historyEntry of villageLife.routineHistory) {
          if (historyEntry.activityIds.includes(activity.id)) {
            lastCompletedDay = Math.max(lastCompletedDay, historyEntry.dayNumber);
          }
        }
        if (dayState.dayNumber - lastCompletedDay < activity.cooldownDays) {
          return false;
        }
      }

      // 5. Conditions check
      if (activity.requiredConditions && activity.requiredConditions.length > 0) {
        if (!ruleEngine.checkConditions(save, activity.requiredConditions)) {
          return false;
        }
      }

      return true;
    });
  }

  startNewVillageDay(params: {
    save: PlayerSave;
    summaryTr?: string;
  }): PlayerSave {
    const { save, summaryTr } = params;
    const villageLife = { ...this.getVillageLife(save) };
    const dayState = { ...villageLife.dayState };

    const oldDayNumber = dayState.dayNumber;

    // Build timeline summary if not already logged
    let history = [...villageLife.routineHistory];
    let historyEntryIndex = history.findIndex(h => h.dayNumber === oldDayNumber);
    if (historyEntryIndex === -1) {
      history.push({
        dayNumber: oldDayNumber,
        activityIds: [],
        notableNpcIds: [],
        lifePathChanges: {},
        summaryTr: summaryTr || "Dinlendin ve yeni günü başlattın."
      });
    } else {
      const entry = { ...history[historyEntryIndex] };
      entry.summaryTr = entry.summaryTr || summaryTr || "Dinlendin ve günü tamamladın.";
      history[historyEntryIndex] = entry;
    }

    dayState.dayNumber = oldDayNumber + 1;
    dayState.timeOfDay = "mane";
    dayState.actionsUsedThisPeriod = 0;
    dayState.completedDailyActivityIds = [];
    villageLife.dayState = dayState;
    villageLife.routineHistory = history;

    return {
      ...save,
      villageLife
    };
  }

  setVillageDayFlag(params: {
    save: PlayerSave;
    key: string;
    value: string | number | boolean;
  }): PlayerSave {
    const { save, key, value } = params;
    const villageLife = { ...this.getVillageLife(save) };
    const dayState = { ...villageLife.dayState };
    dayState.dayFlags = {
      ...dayState.dayFlags,
      [key]: value
    };
    villageLife.dayState = dayState;
    return {
      ...save,
      villageLife
    };
  }

  getNearbyNpcs(save: PlayerSave, locationId: string): string[] {
    const villageLife = this.getVillageLife(save);
    const timeOfDay = villageLife.dayState.timeOfDay;
    const filePath = path.join(this.dataRoot, "village", "npc-presence.json");
    if (!fs.existsSync(filePath)) {
      return [];
    }

    try {
      const presence: Record<string, Record<string, string>> = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const nearby: string[] = [];
      for (const [npcId, schedule] of Object.entries(presence)) {
        if (schedule[timeOfDay] === locationId) {
          nearby.push(npcId);
        }
      }
      return nearby;
    } catch {
      return [];
    }
  }

  getCuratedAmbientEvents(save: PlayerSave, locationId: string): VillageAmbientEvent[] {
    const villageLife = this.getVillageLife(save);
    const timeOfDay = villageLife.dayState.timeOfDay;
    const filePath = path.join(this.dataRoot, "village", "ambient-events.json");
    if (!fs.existsSync(filePath)) {
      return [];
    }

    try {
      const events: VillageAmbientEvent[] = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const RuleEngineClass = require("../core/RuleEngine").RuleEngine;
      const ruleEngine = new RuleEngineClass();

      return events.filter((e) => {
        if (e.locationId && e.locationId !== locationId) {
          return false;
        }
        if (e.timeWindows && !e.timeWindows.includes(timeOfDay)) {
          return false;
        }
        if (e.once && save.narrativeFlags?.[`ambient_event_seen_${e.id}`]) {
          return false;
        }
        if (e.conditions && !ruleEngine.checkConditions(save, e.conditions)) {
          return false;
        }
        return true;
      });
    } catch {
      return [];
    }
  }
}
