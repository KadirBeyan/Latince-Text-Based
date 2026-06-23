import type { PlayerSave } from "../types/gameTypes";

export interface ReviewSuggestion {
  dueTags: string[];
  suggestions: string[];
  relatedGrammarIds: string[];
  relatedVocabularyIds: string[];
}

export class ReviewSystem {
  getDueReviewTags(save: PlayerSave): string[] {
    return (save.errorMemory ?? []).filter((entry) => entry.count >= 2).sort((a, b) => b.count - a.count).map((entry) => entry.tag);
  }

  shouldTriggerReview(save: PlayerSave): boolean {
    return this.getDueReviewTags(save).length > 0;
  }

  createReviewSuggestion(save: PlayerSave): ReviewSuggestion {
    const dueTags = this.getDueReviewTags(save);
    const due = (save.errorMemory ?? []).filter((entry) => dueTags.includes(entry.tag));
    return {
      dueTags,
      suggestions: dueTags.map((tag) => `${tag} konusunda tekrar yapman iyi olur.`),
      relatedGrammarIds: [...new Set(due.flatMap((entry) => entry.relatedGrammarIds))],
      relatedVocabularyIds: [...new Set(due.flatMap((entry) => entry.relatedVocabularyIds))]
    };
  }
}
