import { randomUUID } from "node:crypto";
import type { PlayerSave, NpcMemory, NpcMemoryFact } from "../types/gameTypes";
import { EventBus } from "../core/EventBus";

export class NpcMemorySystem {
  getNpcMemory(save: PlayerSave, npcId: string): NpcMemory {
    const existing = save.npcMemories.find(m => m.npcId === npcId);
    if (existing) return existing;
    return {
      npcId,
      facts: [],
      relationship: { trust: 40, respect: 40, familiarity: 10 }
    };
  }

  ensureNpcMemory(save: PlayerSave, npcId: string): PlayerSave {
    const existing = save.npcMemories.find(m => m.npcId === npcId);
    if (existing) return save;
    const newMemory: NpcMemory = {
      npcId,
      facts: [],
      relationship: { trust: 40, respect: 40, familiarity: 10 }
    };
    return {
      ...save,
      npcMemories: [...save.npcMemories, newMemory]
    };
  }

  addNpcMemoryFact(params: {
    save: PlayerSave;
    npcId: string;
    text: string;
    importance?: number;
    relatedQuestId?: string;
    relatedSceneId?: string;
    tags?: string[];
    eventBus?: EventBus;
  }): PlayerSave {
    const { save, npcId, text, importance = 50, relatedQuestId, relatedSceneId, tags, eventBus } = params;
    let nextSave = this.ensureNpcMemory(save, npcId);
    const memory = nextSave.npcMemories.find(m => m.npcId === npcId)!;

    // Check duplicate text
    if (memory.facts.some(f => f.text === text)) {
      return nextSave;
    }

    const clampedImportance = Math.min(100, Math.max(1, importance));
    const newFact: NpcMemoryFact = {
      id: randomUUID(),
      text,
      importance: clampedImportance,
      createdAt: new Date().toISOString(),
      relatedQuestId,
      relatedSceneId,
      tags
    };

    // Add and prune
    let newFacts = [...memory.facts, newFact];
    newFacts = this.pruneFacts(newFacts, 30);

    const updatedMemory: NpcMemory = {
      ...memory,
      facts: newFacts,
      lastInteractionAt: new Date().toISOString()
    };

    nextSave = {
      ...nextSave,
      npcMemories: nextSave.npcMemories.map(m => m.npcId === npcId ? updatedMemory : m)
    };

    if (eventBus) {
      nextSave = eventBus.emit(nextSave, "NPC_MEMORY_ADDED", { npcId, fact: newFact });
    }

    return nextSave;
  }

  getImportantFacts(params: {
    save: PlayerSave;
    npcId: string;
    limit?: number;
  }): NpcMemoryFact[] {
    const { save, npcId, limit = 5 } = params;
    const memory = this.getNpcMemory(save, npcId);
    return [...memory.facts]
      .sort((a, b) => b.importance - a.importance)
      .slice(0, limit);
  }

  pruneNpcMemory(params: {
    save: PlayerSave;
    npcId: string;
    maxFacts?: number;
  }): PlayerSave {
    const { save, npcId, maxFacts = 30 } = params;
    const memory = save.npcMemories.find(m => m.npcId === npcId);
    if (!memory) return save;

    const pruned = this.pruneFacts(memory.facts, maxFacts);
    const updatedMemory = { ...memory, facts: pruned };

    return {
      ...save,
      npcMemories: save.npcMemories.map(m => m.npcId === npcId ? updatedMemory : m)
    };
  }

  recordNpcInteraction(params: {
    save: PlayerSave;
    npcId: string;
    sceneId?: string;
    questId?: string;
    summary: string;
    tags?: string[];
    importance?: number;
    eventBus?: EventBus;
  }): PlayerSave {
    const { save, npcId, sceneId, questId, summary, tags, importance = 40, eventBus } = params;
    let nextSave = this.addNpcMemoryFact({
      save,
      npcId,
      text: summary,
      importance,
      relatedQuestId: questId,
      relatedSceneId: sceneId,
      tags,
      eventBus
    });

    if (eventBus) {
      nextSave = eventBus.emit(nextSave, "NPC_INTERACTION_RECORDED", { npcId, summary, sceneId, questId });
    }

    return nextSave;
  }

  private pruneFacts(facts: NpcMemoryFact[], maxFacts: number): NpcMemoryFact[] {
    if (facts.length <= maxFacts) return facts;
    return [...facts]
      .sort((a, b) => {
        if (b.importance !== a.importance) return b.importance - a.importance;
        return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      })
      .slice(0, maxFacts);
  }
}
