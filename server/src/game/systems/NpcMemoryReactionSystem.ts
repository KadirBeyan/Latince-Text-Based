import type { PlayerSave, NpcMemoryReaction, NpcMemoryFact } from "../types/gameTypes";
import { NpcMemorySystem } from "./NpcMemorySystem";

export class NpcMemoryReactionSystem {
  private npcMemorySystem = new NpcMemorySystem();

  buildNpcMemoryReactions(params: {
    save: PlayerSave;
    npcIds: string[];
    sceneId: string;
  }): NpcMemoryReaction[] {
    const { save, npcIds, sceneId } = params;
    const reactions: NpcMemoryReaction[] = [];

    for (const npcId of npcIds) {
      const memory = this.npcMemorySystem.getNpcMemory(save, npcId);
      const relationship = memory.relationship;

      // Find facts related to this scene or general important facts
      const relatedFact = memory.facts.find(
        (f) => f.relatedSceneId === sceneId || (f.tags && f.tags.includes(sceneId))
      ) || memory.facts.find((f) => f.importance >= 70);

      const npcName = this.getNpcName(npcId);

      if (relatedFact) {
        // Generate a reaction referencing the fact
        const reactionType = relationship.trust > 60 ? "friendly" : relationship.respect > 60 ? "strict" : "neutral";
        const text = this.generateFactBasedText(npcName, relatedFact, reactionType);
        
        reactions.push({
          npcId,
          npcName,
          reactionType,
          text,
          referencedFactId: relatedFact.id,
        });
      } else if (relationship.familiarity > 30) {
        // Generate relationship-based reaction
        const reactionType = relationship.trust > 60 ? "friendly" : relationship.respect > 60 ? "strict" : "neutral";
        const text = this.generateRelationshipBasedText(npcName, relationship, reactionType);

        reactions.push({
          npcId,
          npcName,
          reactionType,
          text,
        });
      }
    }

    return reactions;
  }

  private getNpcName(npcId: string): string {
    const names: Record<string, string> = {
      caecilius: "Caecilius",
      metella: "Metella",
      quintus: "Quintus",
      lucia: "Lucia",
      grumio: "Grumio",
      clemens: "Clemens",
      pantagathus: "Pantagathus",
      syphax: "Syphax",
      cuba: "Cuba",
      decens: "Decens",
      felix: "Felix",
      marcus: "Marcus",
      servus: "Servus",
      mercator: "Mercator",
      dominus: "Dominus",
      lanista: "Lanista",
      custos: "Custos",
      scribe: "Scribe",
      scriba: "Scriba",
      barbatus: "Barbatus",
      gaius: "Gaius",
    };
    return names[npcId.toLowerCase()] || npcId;
  }

  private generateFactBasedText(npcName: string, fact: NpcMemoryFact, reactionType: string): string {
    if (reactionType === "friendly") {
      return `"${fact.text}" konusundaki yardımını unutmadım, sana minnettarım.`;
    } else if (reactionType === "strict") {
      return `Bana "${fact.text}" olayını hatırlatıyorsun. Dürüstlüğün ve disiplinin takdire şayan.`;
    } else if (reactionType === "amused") {
      return `Ah, "${fact.text}" cidden komik bir andı. Seni görmek güzel!`;
    } else {
      return `"${fact.text}" durumunu hatırlıyorum. Nasıl yardımcı olabilirim?`;
    }
  }

  private generateRelationshipBasedText(npcName: string, relationship: any, reactionType: string): string {
    if (relationship.trust > 70) {
      return `Seni tekrar görmek güzel, dostum. Her zaman buraya hoş geldin.`;
    } else if (relationship.respect > 70) {
      return `Hoş geldin. Çalışmalarını ve duruşunu takdir ediyorum.`;
    } else if (relationship.familiarity > 50) {
      return `Yine mi sen? Buralarda fazla görünmeye başladın.`;
    } else {
      return `Tekrar karşılaştık. Bir şeye mi ihtiyacın var?`;
    }
  }
}
