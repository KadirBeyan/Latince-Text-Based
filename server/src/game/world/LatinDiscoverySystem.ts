import { randomUUID } from "node:crypto";
import type { GameEvent, PlayerSave } from "../types/gameTypes";
import type { LatinDiscovery } from "./WorldPresenceTypes";
import { WorldPresenceContentLoader } from "./WorldPresenceContentLoader";
import { getWorldPresence, normalizeWorldPresence } from "./WorldPresenceState";
export class LatinDiscoverySystem {
  constructor(private readonly loader = new WorldPresenceContentLoader()) {}
  discoverLatin({ save, discoveryId, source }: { save: PlayerSave; discoveryId: string; source: "object" | "npc" | "conversation" | "readable" | "rumor" }): { save: PlayerSave; newlyDiscovered: boolean; discovery: LatinDiscovery; events: GameEvent[] } {
    const discovery = this.loader.load().latinDiscoveries.find(d => d.id === discoveryId); if (!discovery) throw new Error(`Unknown Latin discovery ${discoveryId}.`);
    const world = getWorldPresence(save); const newlyDiscovered = !world.discoveredLatinIds.includes(discoveryId); const next = newlyDiscovered ? { ...save, worldPresence: normalizeWorldPresence({ ...world, discoveredLatinIds: [...world.discoveredLatinIds, discoveryId] }) } : save;
    return { save: next, newlyDiscovered, discovery, events: newlyDiscovered ? [{ id: randomUUID(), type: "LATIN_DISCOVERED", timestamp: new Date().toISOString(), payload: { discoveryId, source, wordLatin: discovery.wordOrPhraseLatin } }] : [] };
  }
  getRecentDiscoveries(save: PlayerSave): LatinDiscovery[] { const ids = getWorldPresence(save).discoveredLatinIds.slice(-8); return ids.map(id => this.loader.load().latinDiscoveries.find(d => d.id === id)).filter((d): d is LatinDiscovery => Boolean(d)); }
  getKnownWorldWords(save: PlayerSave): string[] { return this.getRecentDiscoveries(save).map(d => d.wordOrPhraseLatin).slice(-10); }
}
