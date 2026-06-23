import type { PlayerSave, LocationState } from "../types/gameTypes";
import { EventBus } from "../core/EventBus";

export class LocationStateSystem {
  getLocationState(save: PlayerSave, locationId: string): LocationState {
    const existing = save.locationStates.find(l => l.locationId === locationId);
    if (existing) return existing;
    return {
      locationId,
      discovered: false,
      visitCount: 0,
      flags: {}
    };
  }

  ensureLocationState(save: PlayerSave, locationId: string): PlayerSave {
    const existing = save.locationStates.find(l => l.locationId === locationId);
    if (existing) return save;
    const newState: LocationState = {
      locationId,
      discovered: false,
      visitCount: 0,
      flags: {}
    };
    return {
      ...save,
      locationStates: [...save.locationStates, newState]
    };
  }

  discoverLocation(params: {
    save: PlayerSave;
    locationId: string;
    eventBus?: EventBus;
  }): PlayerSave {
    const { save, locationId, eventBus } = params;
    let nextSave = this.ensureLocationState(save, locationId);
    const state = nextSave.locationStates.find(l => l.locationId === locationId)!;
    
    if (state.discovered) return nextSave;

    const updatedState = { ...state, discovered: true };
    nextSave = {
      ...nextSave,
      locationStates: nextSave.locationStates.map(l => l.locationId === locationId ? updatedState : l)
    };

    if (eventBus) {
      nextSave = eventBus.emit(nextSave, "LOCATION_DISCOVERED", { locationId });
    }

    return nextSave;
  }

  recordVisit(params: {
    save: PlayerSave;
    locationId: string;
    eventBus?: EventBus;
  }): PlayerSave {
    const { save, locationId, eventBus } = params;
    let nextSave = this.ensureLocationState(save, locationId);
    const state = nextSave.locationStates.find(l => l.locationId === locationId)!;
    
    const wasDiscovered = state.discovered;
    const newVisitCount = state.visitCount + 1;
    const updatedState: LocationState = {
      ...state,
      discovered: true,
      visitCount: newVisitCount,
      lastVisitedAt: new Date().toISOString()
    };

    nextSave = {
      ...nextSave,
      locationStates: nextSave.locationStates.map(l => l.locationId === locationId ? updatedState : l)
    };

    if (eventBus) {
      if (!wasDiscovered) {
        nextSave = eventBus.emit(nextSave, "LOCATION_DISCOVERED", { locationId });
      }
      nextSave = eventBus.emit(nextSave, "LOCATION_VISITED", { locationId, visitCount: newVisitCount });
    }

    return nextSave;
  }

  setLocationFlag(params: {
    save: PlayerSave;
    locationId: string;
    key: string;
    value: boolean | string | number;
  }): PlayerSave {
    const { save, locationId, key, value } = params;
    let nextSave = this.ensureLocationState(save, locationId);
    const state = nextSave.locationStates.find(l => l.locationId === locationId)!;

    const updatedState: LocationState = {
      ...state,
      flags: {
        ...state.flags,
        [key]: value
      }
    };

    return {
      ...nextSave,
      locationStates: nextSave.locationStates.map(l => l.locationId === locationId ? updatedState : l)
    };
  }

  setLocationMood(params: {
    save: PlayerSave;
    locationId: string;
    mood: LocationState["mood"];
    eventBus?: EventBus;
  }): PlayerSave {
    const { save, locationId, mood, eventBus } = params;
    let nextSave = this.ensureLocationState(save, locationId);
    const state = nextSave.locationStates.find(l => l.locationId === locationId)!;

    if (state.mood === mood) return nextSave;

    const oldMood = state.mood;
    const updatedState: LocationState = {
      ...state,
      mood
    };

    nextSave = {
      ...nextSave,
      locationStates: nextSave.locationStates.map(l => l.locationId === locationId ? updatedState : l)
    };

    if (eventBus) {
      nextSave = eventBus.emit(nextSave, "LOCATION_MOOD_CHANGED", { locationId, before: oldMood, after: mood });
    }

    return nextSave;
  }
}
