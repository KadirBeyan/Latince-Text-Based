import { randomUUID } from "node:crypto";
import type { GameEvent, PlayerSave } from "../types/gameTypes";
import { getWorldPresence, normalizeWorldPresence } from "./WorldPresenceState";

export class LocationMemorySystem {
  onLocationEnter({ save, locationId }: { save: PlayerSave; locationId: string }): { save: PlayerSave; memoryNotesTr: string[]; visitCount: number; events: GameEvent[] } {
    const now = new Date().toISOString(); const world = getWorldPresence(save); const previous = world.visitedLocations[locationId];
    const visit = previous ? { ...previous, visitCount: previous.visitCount + 1, lastVisitedAt: now } : { visitCount: 1, firstVisitedAt: now, lastVisitedAt: now, discoveredObjectIds: [], inspectedObjectIds: [], readObjectIds: [], memoryNotesTr: [] };
    const next = { ...save, worldPresence: normalizeWorldPresence({ ...world, visitedLocations: { ...world.visitedLocations, [locationId]: visit } }) };
    return { save: next, memoryNotesTr: visit.memoryNotesTr, visitCount: visit.visitCount, events: [{ id: randomUUID(), type: "WORLD_LOCATION_ENTERED", timestamp: now, payload: { locationId, visitCount: visit.visitCount } }] };
  }
  recordLocationInteraction(params: { save: PlayerSave; locationId: string; interactionType: "inspect" | "read" | "talk" | "activity" | "freeform"; objectId?: string; npcId?: string; activityId?: string; summaryTr: string }): PlayerSave {
    const world = getWorldPresence(params.save); const now = new Date().toISOString(); const old = world.visitedLocations[params.locationId] ?? { visitCount: 0, firstVisitedAt: now, lastVisitedAt: now, discoveredObjectIds: [], inspectedObjectIds: [], readObjectIds: [], memoryNotesTr: [] };
    const meaningful = params.summaryTr.trim().length >= 12; const notes = meaningful ? [...old.memoryNotesTr.filter(n => n !== params.summaryTr), params.summaryTr].slice(-10) : old.memoryNotesTr;
    const visit = { ...old, memoryNotesTr: notes, inspectedObjectIds: params.interactionType === "inspect" && params.objectId ? [...new Set([...old.inspectedObjectIds, params.objectId])] : old.inspectedObjectIds, readObjectIds: params.interactionType === "read" && params.objectId ? [...new Set([...old.readObjectIds, params.objectId])] : old.readObjectIds };
    return { ...params.save, worldPresence: normalizeWorldPresence({ ...world, visitedLocations: { ...world.visitedLocations, [params.locationId]: visit } }) };
  }
  getLocationMemoryView({ save, locationId }: { save: PlayerSave; locationId: string }) { const v = getWorldPresence(save).visitedLocations[locationId]; return { locationId, visitCount: v?.visitCount ?? 0, memoryNotesTr: v?.memoryNotesTr ?? [], inspectedObjectIds: v?.inspectedObjectIds ?? [], readObjectIds: v?.readObjectIds ?? [] }; }
}
