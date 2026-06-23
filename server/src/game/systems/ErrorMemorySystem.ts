import type { PlayerErrorMemory, PlayerSave, Scene } from "../types/gameTypes";

export class ErrorMemorySystem {
  record(save: PlayerSave, errorTags: string[], scene: Scene): PlayerSave {
    if (errorTags.length === 0) return save;
    const memory = [...(save.errorMemory ?? [])];
    const now = new Date().toISOString();
    for (const tag of new Set(errorTags.filter(Boolean))) {
      const index = memory.findIndex((entry) => entry.tag === tag);
      const previous = index >= 0 ? memory[index] : undefined;
      const next: PlayerErrorMemory = {
        tag,
        count: (previous?.count ?? 0) + 1,
        lastSeenAt: now,
        relatedSceneIds: this.union(previous?.relatedSceneIds, [scene.id]),
        relatedGrammarIds: this.union(previous?.relatedGrammarIds, scene.learningFocus?.grammarIds),
        relatedVocabularyIds: this.union(previous?.relatedVocabularyIds, scene.learningFocus?.vocabularyIds)
      };
      if (index >= 0) memory[index] = next; else memory.push(next);
    }
    return { ...save, errorMemory: memory };
  }

  private union(left: string[] = [], right: string[] = []): string[] {
    return [...new Set([...left, ...right])];
  }
}
