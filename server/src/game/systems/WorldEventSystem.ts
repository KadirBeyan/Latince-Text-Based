import { randomUUID } from "node:crypto";
import type { PlayerSave, WorldEvent } from "../types/gameTypes";
import { EventBus } from "../core/EventBus";

export class WorldEventSystem {
  addWorldEvent(params: {
    save: PlayerSave;
    event: Omit<WorldEvent, "id" | "createdAt">;
    eventBus?: EventBus;
  }): PlayerSave {
    const { save, event, eventBus } = params;

    // Check duplicate
    if (save.worldEvents.some(e => e.title === event.title && e.text === event.text)) {
      return save;
    }

    const clampedImportance = Math.min(100, Math.max(1, event.importance));
    const newEvent: WorldEvent = {
      ...event,
      id: randomUUID(),
      importance: clampedImportance,
      createdAt: new Date().toISOString()
    };

    let nextSave: PlayerSave = {
      ...save,
      worldEvents: [...save.worldEvents, newEvent]
    };

    if (eventBus) {
      nextSave = eventBus.emit(nextSave, "WORLD_EVENT_ADDED", { event: newEvent });
      if (newEvent.type === "rumor") {
        nextSave = eventBus.emit(nextSave, "RUMOR_DISCOVERED", { rumor: newEvent });
      }
    }

    return nextSave;
  }

  getActiveWorldEvents(save: PlayerSave, now = new Date()): WorldEvent[] {
    const time = now.getTime();
    return save.worldEvents.filter(e => {
      if (!e.expiresAt) return true;
      return Date.parse(e.expiresAt) > time;
    });
  }

  markWorldEventSeen(params: {
    save: PlayerSave;
    eventId: string;
  }): PlayerSave {
    const { save, eventId } = params;
    return {
      ...save,
      worldEvents: save.worldEvents.map(e => e.id === eventId ? { ...e, seen: true } : e)
    };
  }

  expireOldWorldEvents(save: PlayerSave, now = new Date()): PlayerSave {
    const time = now.getTime();
    return {
      ...save,
      worldEvents: save.worldEvents.filter(e => {
        if (!e.expiresAt) return true;
        return Date.parse(e.expiresAt) > time;
      })
    };
  }

  generateDeterministicRumor(params: {
    save: PlayerSave;
    locationId?: string;
  }): WorldEvent | null {
    const { save, locationId } = params;

    let rumorData: Omit<WorldEvent, "id" | "createdAt"> | null = null;

    if (locationId === "forum") {
      rumorData = {
        type: "rumor",
        title: "Forumda Yeni Bir Tüccar",
        text: "Forumda yeni bir egzotik tüccar görülmüş.",
        importance: 30,
        relatedLocationId: "forum"
      };
    } else if (locationId === "ludus_room" || locationId === "ludus_front") {
      const sumMemory = save.errorMemory?.find(e => e.tag === "missing-sum");
      if (sumMemory && sumMemory.count >= 2) {
        rumorData = {
          type: "rumor",
          title: "Magister'in Sertleşen Tavrı",
          text: "Magister bugün sum/esse konusunda daha zor sorular soracak.",
          importance: 40,
          relatedLocationId: locationId
        };
      }
    } else if (locationId === "bibliotheca") {
      rumorData = {
        type: "rumor",
        title: "Kayıp Kodeks",
        text: "Bibliotheca'da antik ve kayıp bir parşömen metni bulundu.",
        importance: 50,
        relatedLocationId: "bibliotheca"
      };
    }

    const marcusMemory = save.npcMemories.find(m => m.npcId === "marcus");
    const trust = marcusMemory?.relationship.trust ?? 40;
    if (trust >= 60 && !rumorData) {
      rumorData = {
        type: "rumor",
        title: "Marcus'un Arayışı",
        text: "Marcus hararetli bir şekilde seni Forum civarında arıyor.",
        importance: 60,
        relatedNpcId: "marcus"
      };
    }

    if (!rumorData) return null;

    // Check duplicate
    if (save.worldEvents.some(e => e.title === rumorData!.title && e.text === rumorData!.text)) {
      return null;
    }

    const rumor: WorldEvent = {
      ...rumorData,
      id: randomUUID(),
      createdAt: new Date().toISOString()
    };

    return rumor;
  }
}
