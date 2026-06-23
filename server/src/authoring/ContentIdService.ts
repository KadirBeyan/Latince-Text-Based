import type { AuthoringContentKind } from "./AuthoringTypes";
import type { AuthoringContentService } from "./AuthoringContentService";

export class ContentIdService {
  constructor(private readonly contentService?: AuthoringContentService) {}

  suggestSceneId(chapterId: string, titleTr: string): string {
    return `${chapterId}_${this.slugifyLatinAware(titleTr).slice(0, 38) || "scene"}`;
  }

  suggestQuestId(chapterId: string, titleTr: string): string {
    return `${chapterId}_quest_${this.slugifyLatinAware(titleTr).slice(0, 34) || "nova"}`;
  }

  suggestNpcId(name: string): string {
    return `npc_${this.slugifyLatinAware(name) || "persona"}`;
  }

  suggestLocationId(title: string): string {
    return this.slugifyLatinAware(title) || "locus";
  }

  slugifyLatinAware(text: string): string {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[ıİ]/g, "i")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .replace(/_{2,}/g, "_");
  }

  async ensureUniqueId(kind: AuthoringContentKind, baseId: string): Promise<string> {
    if (!this.contentService) return baseId;
    const docs = await this.contentService.listDocuments(kind);
    const ids = new Set(docs.map((doc) => doc.id));
    if (!ids.has(baseId)) return baseId;
    for (let index = 2; index < 999; index++) {
      const candidate = `${baseId}_${index}`;
      if (!ids.has(candidate)) return candidate;
    }
    throw new Error("Could not produce a unique id.");
  }
}
