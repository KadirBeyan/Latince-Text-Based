import type { PlayerSave } from "../../types/gameTypes";
import { v1ToV2 } from "./v1ToV2";
import { v2ToV3 } from "./v2ToV3";
import { v3ToV4 } from "./v3ToV4";
import { v4ToV5 } from "./v4ToV5";

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
    const save = currentSave as Record<string, unknown>;
    if (!save.chapterProgress || typeof save.chapterProgress !== "object") save.chapterProgress = {};
    if (!save.livingSceneStates || typeof save.livingSceneStates !== "object") save.livingSceneStates = {};
    return save as unknown as PlayerSave;
  }
  
  throw new Error(`Unsupported save schemaVersion ${version}.`);
}
