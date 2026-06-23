import { randomUUID } from "node:crypto";
import type { Effect, GameEvent, PlayerSave } from "../types/gameTypes";
import type { ReadableObject } from "./WorldPresenceTypes";
import { WorldPresenceContentLoader } from "./WorldPresenceContentLoader";
import { LatinDiscoverySystem } from "./LatinDiscoverySystem";
import { LocationMemorySystem } from "./LocationMemorySystem";
export class ReadableObjectSystem {
  constructor(private readonly loader = new WorldPresenceContentLoader(), private readonly discoveries = new LatinDiscoverySystem(loader), private readonly memory = new LocationMemorySystem()) {}
  getReadableObjects({ locationId }: { save: PlayerSave; locationId: string }): ReadableObject[] { return this.loader.load().readableObjects.filter(o => o.locationId === locationId); }
  attemptReadObject({ save, objectId, playerLatinAttempt }: { save: PlayerSave; objectId: string; playerLatinAttempt?: string }): { save: PlayerSave; outcome: "success" | "partial" | "failure"; resultTr: string; discoveredLatinIds: string[]; effects: Effect[]; events: GameEvent[] } {
    const object = this.loader.load().readableObjects.find(o => o.id === objectId); if (!object) throw new Error(`Unknown readable object ${objectId}.`);
    const skill = object.requiredSkill ? save.characterProfile?.skills[object.requiredSkill.skillId] ?? 0 : 1; const guess = (playerLatinAttempt ?? "").toLocaleLowerCase("tr-TR"); const hasFocus = object.wordFocus.some(w => guess.includes(w.toLocaleLowerCase("tr-TR"))) || (!!object.glossTr && guess.includes(object.glossTr.toLocaleLowerCase("tr-TR")));
    const outcome: "success" | "partial" | "failure" = hasFocus || skill >= (object.requiredSkill?.minValue ?? 1) + 1 ? "success" : skill >= (object.requiredSkill?.minValue ?? 1) ? "partial" : "failure";
    const resultTr = outcome === "success" ? object.successResultTr : outcome === "partial" ? object.partialResultTr : object.failureResultTr; let next = this.memory.recordLocationInteraction({ save, locationId: object.locationId, interactionType: "read", objectId, summaryTr: `${object.titleTr} üzerindeki Latinceyi okumaya çalışmıştın.` }); const ids: string[] = []; const events: GameEvent[] = [{ id: randomUUID(), type: "WORLD_TEXT_READ", timestamp: new Date().toISOString(), payload: { objectId, outcome } }];
    if (outcome !== "failure") for (const word of object.wordFocus) { const discovery = this.loader.load().latinDiscoveries.find(d => d.wordOrPhraseLatin.toLocaleLowerCase() === word.toLocaleLowerCase() || d.id === word); if (discovery) { const r = this.discoveries.discoverLatin({ save: next, discoveryId: discovery.id, source: "readable" }); next = r.save; if (r.newlyDiscovered) ids.push(discovery.id); events.push(...r.events); } }
    return { save: next, outcome, resultTr, discoveredLatinIds: ids, effects: outcome === "success" ? object.effectsOnRead ?? [] : [], events };
  }
}
