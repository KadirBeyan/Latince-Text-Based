import type { FlagValue, PlayerSave } from "../types/gameTypes";

export class FlagSystem {
  setFlag(save: PlayerSave, key: string, value: FlagValue): PlayerSave {
    return { ...save, flags: { ...save.flags, [key]: value } };
  }

  getFlag(save: PlayerSave, key: string): FlagValue | undefined {
    return save.flags[key];
  }

  flagEquals(save: PlayerSave, key: string, value: FlagValue): boolean {
    return save.flags[key] === value;
  }
}
