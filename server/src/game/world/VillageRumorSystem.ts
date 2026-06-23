import { randomUUID } from "node:crypto";
import type { GameEvent, PlayerSave, VillageTimeOfDay } from "../types/gameTypes";
import type { VillageRumor } from "./WorldPresenceTypes";
import { WorldPresenceContentLoader } from "./WorldPresenceContentLoader";
import { getWorldPresence, normalizeWorldPresence } from "./WorldPresenceState";
export class VillageRumorSystem {
  constructor(private readonly loader = new WorldPresenceContentLoader()) {}
  getAvailableRumors({ save, locationId, timeOfDay }: { save: PlayerSave; locationId?: string; timeOfDay?: VillageTimeOfDay }): VillageRumor[] { const world = getWorldPresence(save); const day = save.villageLife?.dayState.dayNumber ?? 1; const time = timeOfDay ?? save.villageLife?.dayState.timeOfDay; return this.loader.load().rumors.filter(r => (!r.locationId || !locationId || r.locationId === locationId) && (!r.timeWindows?.length || !time || r.timeWindows.includes(time)) && (!r.expiresAfterDay || day <= r.expiresAfterDay) && (!r.once || !world.seenRumorIds.includes(r.id))).sort((a,b) => b.priority-a.priority).slice(0,5); }
  markRumorSeen({ save, rumorId }: { save: PlayerSave; rumorId: string }): PlayerSave { const world = getWorldPresence(save); return { ...save, worldPresence: normalizeWorldPresence({ ...world, seenRumorIds: [...world.seenRumorIds, rumorId] }) }; }
  surfaceRumor({ save, locationId }: { save: PlayerSave; locationId?: string }): { save: PlayerSave; rumor?: VillageRumor; narrationTr?: string; events: GameEvent[] } { const rumor = this.getAvailableRumors({ save, locationId })[0]; if (!rumor) return { save, events: [] }; return { save: this.markRumorSeen({ save, rumorId: rumor.id }), rumor, narrationTr: `Köyde biri şöyle söylüyor: ${rumor.bodyTr}`, events: [{ id: randomUUID(), type: "VILLAGE_RUMOR_HEARD", timestamp: new Date().toISOString(), payload: { rumorId: rumor.id } }] }; }
}
