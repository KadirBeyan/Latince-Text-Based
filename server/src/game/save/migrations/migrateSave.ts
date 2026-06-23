import type { PlayerSave } from "../../types/gameTypes";
import { EMPTY_LIFE_PATH_HINTS, EMPTY_RPG_SKILLS } from "../../character/CharacterTypes";
import { v1ToV2 } from "./v1ToV2";
import { v2ToV3 } from "./v2ToV3";
import { v3ToV4 } from "./v3ToV4";
import { v4ToV5 } from "./v4ToV5";
import { v5ToV6 } from "./v5ToV6";
import { v6ToV7 } from "./v6ToV7";

function withCharacterProfile(save: Record<string, unknown>): Record<string, unknown> {
  if (save.characterProfile && typeof save.characterProfile === "object") {
    const profile = save.characterProfile as any;
    if (!profile.skillProgress || typeof profile.skillProgress !== "object") {
      profile.skillProgress = { ...EMPTY_RPG_SKILLS };
    }
    return save;
  }
  const now = typeof save.createdAt === "string" ? save.createdAt : new Date().toISOString();
  save.characterProfile = {
    name: String(save.playerName || "Viator"),
    displayName: String(save.playerName || "Viator"),
    origin: "unknown_origin",
    traits: ["curious", "practical"],
    skills: { ...EMPTY_RPG_SKILLS },
    skillProgress: { ...EMPTY_RPG_SKILLS },
    backgroundSummaryTr: "Eski bir kayıttan gelen yolcu; kökeni bu bölümde belirsiz bırakıldı.",
    createdAt: now,
    lifePathHints: { ...EMPTY_LIFE_PATH_HINTS },
    knownPeople: [],
    homeLocationId: "home_hut",
    currentLifePhase: "village_youth"
  };
  return save;
}

export function migrateSave(value: unknown): PlayerSave {
  if (typeof value !== "object" || value === null) {
    throw new Error("Save must be an object.");
  }
  const save = value as Record<string, unknown>;
  if (typeof save.id !== "string" || typeof save.playerName !== "string" || typeof save.currentSceneId !== "string") {
    throw new Error("Save is missing required identity fields.");
  }
  
  let version = typeof save.schemaVersion === "number" ? save.schemaVersion : 1;
  let currentSave = save;
  
  if (version <= 1) {
    currentSave = v1ToV2(currentSave) as any;
    version = 2;
  }
  if (version === 2) {
    currentSave = v2ToV3(currentSave) as any;
    version = 3;
  }
  if (version === 3) {
    currentSave = v3ToV4(currentSave) as any;
    version = 4;
  }
  if (version === 4) {
    currentSave = v4ToV5(currentSave) as any;
    version = 5;
  }
  if (version === 5) {
    currentSave = v5ToV6(currentSave) as any;
    version = 6;
  }
  if (version === 6) {
    currentSave = v6ToV7(currentSave) as any;
    version = 7;
  }
  if (version === 7) {
    const save = currentSave as Record<string, unknown>;
    if (!save.chapterProgress || typeof save.chapterProgress !== "object") save.chapterProgress = {};
    if (!save.livingSceneStates || typeof save.livingSceneStates !== "object") save.livingSceneStates = {};
    if (!save.worldPresence || typeof save.worldPresence !== "object") save.worldPresence = { visitedLocations: {}, discoveredLatinIds: [], seenRumorIds: [], journalEntries: [], npcMoodOverrides: {}, worldFlags: {} };
    return withCharacterProfile(save) as unknown as PlayerSave;
  }
  
  throw new Error(`Unsupported save schemaVersion ${version}.`);
}
