import { randomUUID } from "node:crypto";
import type { GameEvent, PlayerSave } from "../types/gameTypes";

export class EventBus {
  emit(save: PlayerSave, type: string, payload: Record<string, unknown>): PlayerSave {
    const event: GameEvent = { id: randomUUID(), type, timestamp: new Date().toISOString(), payload };
    return { ...save, eventLog: [...save.eventLog, event] };
  }

  getRecentEvents(save: PlayerSave, limit = 10): GameEvent[] {
    return save.eventLog.slice(-limit).reverse();
  }
}
