import { randomUUID } from "node:crypto";
import type { Effect, GameEvent, PlayerSave } from "../types/gameTypes";
import type { AmbientObject, LatinDiscovery } from "./WorldPresenceTypes";
import { WorldPresenceContentLoader } from "./WorldPresenceContentLoader";
import { LatinDiscoverySystem } from "./LatinDiscoverySystem";
import { LocationMemorySystem } from "./LocationMemorySystem";
const norm = (s: string) => s.toLocaleLowerCase("tr-TR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9çğıöşü ]/g, " ");
export class AmbientObjectSystem {
  constructor(private readonly loader = new WorldPresenceContentLoader(), private readonly discoveries = new LatinDiscoverySystem(loader), private readonly memory = new LocationMemorySystem()) {}
  getVisibleObjects({ locationId }: { save: PlayerSave; locationId: string }): AmbientObject[] { return this.loader.load().ambientObjects.filter(o => o.locationId === locationId); }
  inspectObject({ save, locationId, objectId }: { save: PlayerSave; locationId: string; objectId: string; inputText?: string }): { save: PlayerSave; resultTr: string; latinDiscoveries: LatinDiscovery[]; effects: Effect[]; events: GameEvent[] } {
    const object = this.getVisibleObjects({ save, locationId }).find(o => o.id === objectId); if (!object || !object.inspectable) throw new Error(`Object ${objectId} is not inspectable here.`);
    const resultTr = object.inspectResultTemplatesTr[0] ?? object.descriptionTr; let next = this.memory.recordLocationInteraction({ save, locationId, interactionType: "inspect", objectId, summaryTr: `${object.titleTr} nesnesini incelemiştin.` }); const found: LatinDiscovery[] = []; const events: GameEvent[] = [{ id: randomUUID(), type: "WORLD_OBJECT_INSPECTED", timestamp: new Date().toISOString(), payload: { objectId, locationId } }];
    for (const id of object.latinDiscoveryIds ?? []) { const result = this.discoveries.discoverLatin({ save: next, discoveryId: id, source: "object" }); next = result.save; if (result.newlyDiscovered) found.push(result.discovery); events.push(...result.events); }
    return { save: next, resultTr, latinDiscoveries: found, effects: [], events };
  }
  matchFreeformObject({ inputText, visibleObjects }: { inputText: string; visibleObjects: AmbientObject[] }): { objectId?: string; confidence: number; reasonTr?: string } { const clean = norm(inputText); let best: { id: string; score: number } | undefined; for (const object of visibleObjects) for (const alias of [object.titleTr, ...(object.aliasesTr ?? []), object.id.replaceAll("_", " ")]) { const a = norm(alias).trim(); const score = a && clean.includes(a) ? Math.min(1, .72 + a.length / 50) : 0; if (!best || score > best.score) best = { id: object.id, score }; } return best?.score ? { objectId: best.id, confidence: best.score } : { confidence: 0, reasonTr: "Yakındaki nesnelerden biri güvenle eşleşmedi." }; }
}
