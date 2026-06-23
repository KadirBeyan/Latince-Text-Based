import type { PlayerSave, NpcRelationship, NpcMemory } from "../types/gameTypes";
import { NpcMemorySystem } from "./NpcMemorySystem";
import { EventBus } from "../core/EventBus";

export class NpcRelationshipSystem {
  constructor(private readonly npcMemorySystem = new NpcMemorySystem()) {}

  getRelationship(save: PlayerSave, npcId: string): NpcRelationship {
    const memory = this.npcMemorySystem.getNpcMemory(save, npcId);
    return memory.relationship;
  }

  updateRelationship(params: {
    save: PlayerSave;
    npcId: string;
    delta: Partial<NpcRelationship>;
    reason?: string;
    eventBus?: EventBus;
  }): PlayerSave {
    const { save, npcId, delta, reason, eventBus } = params;
    let nextSave = this.npcMemorySystem.ensureNpcMemory(save, npcId);
    
    const memory = nextSave.npcMemories.find(m => m.npcId === npcId)!;
    const oldRel = memory.relationship;

    const newRel: NpcRelationship = {
      trust: Math.min(100, Math.max(0, oldRel.trust + (delta.trust ?? 0))),
      respect: Math.min(100, Math.max(0, oldRel.respect + (delta.respect ?? 0))),
      familiarity: Math.min(100, Math.max(0, oldRel.familiarity + (delta.familiarity ?? 0)))
    };

    const updatedMemory: NpcMemory = {
      ...memory,
      relationship: newRel,
      lastInteractionAt: new Date().toISOString()
    };

    nextSave = {
      ...nextSave,
      npcMemories: nextSave.npcMemories.map(m => m.npcId === npcId ? updatedMemory : m)
    };

    if (eventBus) {
      nextSave = eventBus.emit(nextSave, "NPC_RELATIONSHIP_UPDATED", {
        npcId,
        delta,
        before: oldRel,
        after: newRel,
        reason
      });
    }

    return nextSave;
  }

  applyRelationshipEffect(params: {
    save: PlayerSave;
    npcId: string;
    field: "trust" | "respect" | "familiarity";
    amount: number;
    reason?: string;
    eventBus?: EventBus;
  }): PlayerSave {
    const { save, npcId, field, amount, reason, eventBus } = params;
    return this.updateRelationship({
      save,
      npcId,
      delta: { [field]: amount },
      reason,
      eventBus
    });
  }

  hasRelationshipMin(params: {
    save: PlayerSave;
    npcId: string;
    field: "trust" | "respect" | "familiarity";
    value: number;
  }): boolean {
    const { save, npcId, field, value } = params;
    const rel = this.getRelationship(save, npcId);
    return rel[field] >= value;
  }
}
