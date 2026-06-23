import type { Campaign, Chapter, Quest, Scene } from "../game/types/gameTypes";
import type { AuthoringContentKind, AuthoringDocument, AuthoringSaveRequest, AuthoringSaveResult, AuthoringTreeNode } from "./AuthoringTypes";
import { AuthoringFileService } from "./AuthoringFileService";
import { AuthoringValidationService } from "./AuthoringValidationService";
import { ContentOverrideService } from "../content/ContentOverrideService";

type PathParts = { filePath: string; fragment?: string };

export class AuthoringContentService {
  constructor(
    private readonly fileService = new AuthoringFileService(),
    private readonly validationService = new AuthoringValidationService(),
    private readonly overrideService = new ContentOverrideService(),
  ) {}

  async getAuthoringTree(): Promise<AuthoringTreeNode[]> {
    const docs = await this.listDocuments(undefined, false);
    const folders: Array<{ id: string; title: string; kinds: AuthoringContentKind[] }> = [
      { id: "campaigns", title: "Campaigns", kinds: ["campaign"] },
      { id: "chapters", title: "Chapters", kinds: ["chapter"] },
      { id: "quests", title: "Quests", kinds: ["quest"] },
      { id: "scenes", title: "Scenes", kinds: ["scene"] },
      { id: "npcs", title: "NPCs", kinds: ["npc"] },
      { id: "locations", title: "Locations", kinds: ["location"] },
      { id: "latin", title: "Latin Data", kinds: ["grammar", "vocabulary"] },
      { id: "assessment", title: "Assessment", kinds: ["assessment-question"] },
      { id: "templates", title: "Templates", kinds: ["quest-template"] },
      { id: "village", title: "Village Activities", kinds: ["village-activity"] },
    ];
    return folders.map((folder) => ({
      id: folder.id,
      kind: "folder",
      title: folder.title,
      children: docs.filter((doc) => folder.kinds.includes(doc.kind)).map((doc) => ({ id: doc.id, kind: doc.kind, title: doc.title, path: doc.path, issueCount: doc.validation?.errors.length, warningCount: doc.validation?.warnings.length })),
      issueCount: docs.filter((doc) => folder.kinds.includes(doc.kind)).reduce((sum, doc) => sum + (doc.validation?.errors.length ?? 0), 0),
      warningCount: docs.filter((doc) => folder.kinds.includes(doc.kind)).reduce((sum, doc) => sum + (doc.validation?.warnings.length ?? 0), 0),
    }));
  }

  async listDocuments(kind?: AuthoringContentKind, includeValidation = false): Promise<AuthoringDocument[]> {
    const docs: AuthoringDocument[] = [];
    const campaignFiles = await this.fileService.listContentFiles("data/campaigns");
    for (const file of campaignFiles) {
      const value = await this.fileService.readJsonFileSafe<Campaign | Chapter>(file);
      if (this.isCampaign(value)) {
        docs.push(await this.makeDocument("campaign", file, value, includeValidation));
        for (const chapter of value.chapters ?? []) this.pushChapterDocs(docs, file, chapter, includeValidation);
      } else if (this.isChapter(value)) {
        this.pushChapterDocs(docs, file, value, includeValidation);
      }
    }
    await this.pushFileDocs(docs, "npc", "data/npcs", includeValidation);
    await this.pushFileDocs(docs, "location", "data/locations", includeValidation);
    await this.pushArrayDocs(docs, "grammar", "data/latin", includeValidation);
    await this.pushArrayDocs(docs, "vocabulary", "data/latin", includeValidation);
    await this.pushArrayDocs(docs, "assessment-question", "data/assessment", includeValidation);
    await this.pushArrayDocs(docs, "quest-template", "data/quest-templates", includeValidation);
    await this.pushArrayDocs(docs, "village-activity", "data/village", includeValidation);
    return (kind ? docs.filter((doc) => doc.kind === kind) : docs).sort((a, b) => `${a.kind}:${a.title}`.localeCompare(`${b.kind}:${b.title}`));
  }

  async getDocument(params: { kind: AuthoringContentKind; pathOrId: string }): Promise<AuthoringDocument> {
    const docs = await this.listDocuments(params.kind, false);
    const doc = docs.find((candidate) => candidate.path === params.pathOrId || candidate.id === params.pathOrId);
    if (!doc) throw new Error(`Authoring document not found: ${params.kind}/${params.pathOrId}`);
    return { ...doc, validation: this.validationService.validateDocument(doc) };
  }

  async saveDocument(params: AuthoringSaveRequest): Promise<AuthoringSaveResult> {
    const validation = params.validateBeforeSave ? this.validationService.validateDocument({ id: this.idOf(params.data), kind: params.kind, title: this.titleOf(params.data), path: params.path, data: params.data }) : this.validationService.validateAllContent();
    if (!validation.ok && !params.allowErrorOverride) return { ok: false, validation };
    const { filePath, fragment } = this.splitPath(params.path);
    const writeTarget = params.writeTarget ?? "override";
    const backupPath = params.createBackup ? await this.fileService.createContentBackup(filePath) : undefined;
    if (fragment) await this.writeFragment(filePath, fragment, params.kind, params.data, writeTarget);
    else if (writeTarget === "override") await this.overrideService.writeOverride(filePath, params.data);
    else await this.fileService.writeJsonFileSafe(filePath, params.data);
    const document = await this.getDocument({ kind: params.kind, pathOrId: this.idOf(params.data) || params.path }).catch(() => this.getDocument({ kind: params.kind, pathOrId: params.path }));
    return { ok: true, document, validation: document.validation ?? validation, backupPath, savedTo: writeTarget, path: params.path, defaultPath: this.overrideService.toSourcePath(filePath), overridePath: this.overrideService.toOverridePath(filePath) };
  }

  async deleteDocument(params: { kind: AuthoringContentKind; path: string; createBackup: boolean }): Promise<{ ok: boolean; backupPath?: string }> {
    const { filePath, fragment } = this.splitPath(params.path);
    const backupPath = params.createBackup ? await this.fileService.createContentBackup(filePath) : undefined;
    if (!fragment) await this.fileService.deleteFileSafe(filePath);
    else await this.deleteFragment(filePath, fragment, params.kind);
    return { ok: true, backupPath };
  }

  async duplicateDocument(params: { kind: AuthoringContentKind; sourcePath: string; newId: string }): Promise<AuthoringDocument> {
    const source = await this.getDocument({ kind: params.kind, pathOrId: params.sourcePath });
    const clone = structuredClone(source.data) as Record<string, unknown>;
    clone.id = params.newId;
    clone.title = `${String(clone.title ?? source.title)} Copy`;
    const { filePath, fragment } = this.splitPath(source.path);
    if (!fragment) {
      const target = filePath.replace(/\.json$/, `-${params.newId}.json`);
      await this.fileService.writeJsonFileSafe(target, clone);
      return this.getDocument({ kind: params.kind, pathOrId: target });
    }
    await this.insertFragment(filePath, fragment, params.kind, clone);
    return this.getDocument({ kind: params.kind, pathOrId: params.newId });
  }

  private pushChapterDocs(docs: AuthoringDocument[], file: string, chapter: Chapter, includeValidation = false): void {
    docs.push(this.syncDocument("chapter", file, chapter, includeValidation));
    for (const quest of chapter.quests ?? []) {
      docs.push(this.syncDocument("quest", `${file}#${quest.id}`, quest, includeValidation));
      for (const scene of quest.scenes ?? []) docs.push(this.syncDocument("scene", `${file}#${quest.id}/${scene.id}`, scene, includeValidation));
    }
  }

  private async pushFileDocs(docs: AuthoringDocument[], kind: AuthoringContentKind, root: string, includeValidation: boolean): Promise<void> {
    for (const file of await this.fileService.listContentFiles(root)) docs.push(await this.makeDocument(kind, file, await this.fileService.readJsonFileSafe(file), includeValidation));
  }

  private async pushArrayDocs(docs: AuthoringDocument[], kind: AuthoringContentKind, root: string, includeValidation: boolean): Promise<void> {
    for (const file of await this.fileService.listContentFiles(root)) {
      const value = await this.fileService.readJsonFileSafe<unknown>(file);
      const items = Array.isArray(value) ? value : [value];
      for (const item of items) {
        if (!this.matchesKind(kind, file, item)) continue;
        docs.push(await this.makeDocument(kind, `${file}#${this.idOf(item)}`, item, includeValidation));
      }
    }
  }

  private async makeDocument(kind: AuthoringContentKind, docPath: string, data: unknown, includeValidation: boolean): Promise<AuthoringDocument> {
    const { filePath } = this.splitPath(docPath);
    const metadata = await this.fileService.getFileMetadata(filePath);
    const hasOverride = this.overrideService.hasOverride(filePath);
    return { ...this.syncDocument(kind, docPath, data, includeValidation), updatedAt: metadata.updatedAt, hasOverride, overridePath: this.overrideService.toOverridePath(filePath), sourcePath: this.overrideService.toSourcePath(filePath) };
  }

  private syncDocument(kind: AuthoringContentKind, docPath: string, data: unknown, includeValidation: boolean): AuthoringDocument {
    const document = { id: this.idOf(data), kind, title: this.titleOf(data), path: docPath, data };
    return includeValidation ? { ...document, validation: this.validationService.validateDocument(document) } : document;
  }

  private async writeFragment(filePath: string, fragment: string, kind: AuthoringContentKind, data: unknown, writeTarget: "override" | "source" = "override"): Promise<void> {
    const fileData = await this.fileService.readJsonFileSafe<any>(filePath);
    const writeFile = async (value: unknown) => {
      if (writeTarget === "override") await this.overrideService.writeOverride(filePath, value);
      else await this.fileService.writeJsonFileSafe(filePath, value);
    };
    if (kind === "scene") {
      const [questId, sceneId] = fragment.split("/");
      const chapter = fileData as Chapter;
      const quest = chapter.quests.find((item) => item.id === questId);
      if (!quest) throw new Error("Quest fragment not found.");
      quest.scenes = quest.scenes.map((scene) => scene.id === sceneId ? data as Scene : scene);
      await writeFile(chapter);
      return;
    }
    if (kind === "quest") {
      const chapter = fileData as Chapter;
      chapter.quests = chapter.quests.map((quest) => quest.id === fragment ? data as Quest : quest);
      await writeFile(chapter);
      return;
    }
    if (Array.isArray(fileData)) {
      await writeFile(fileData.map((item) => this.idOf(item) === fragment ? data : item));
      return;
    }
    throw new Error("Unsupported authoring fragment write.");
  }

  private async deleteFragment(filePath: string, fragment: string, kind: AuthoringContentKind): Promise<void> {
    const fileData = await this.fileService.readJsonFileSafe<any>(filePath);
    if (kind === "scene") {
      const [questId, sceneId] = fragment.split("/");
      const quest = (fileData as Chapter).quests.find((item) => item.id === questId);
      if (quest) quest.scenes = quest.scenes.filter((scene) => scene.id !== sceneId);
      await this.fileService.writeJsonFileSafe(filePath, fileData);
    } else if (kind === "quest") {
      (fileData as Chapter).quests = (fileData as Chapter).quests.filter((quest) => quest.id !== fragment);
      await this.fileService.writeJsonFileSafe(filePath, fileData);
    } else if (Array.isArray(fileData)) {
      await this.fileService.writeJsonFileSafe(filePath, fileData.filter((item) => this.idOf(item) !== fragment));
    }
  }

  private async insertFragment(filePath: string, fragment: string, kind: AuthoringContentKind, data: unknown): Promise<void> {
    const fileData = await this.fileService.readJsonFileSafe<any>(filePath);
    if (kind === "scene") {
      const [questId] = fragment.split("/");
      const quest = (fileData as Chapter).quests.find((item) => item.id === questId);
      if (!quest) throw new Error("Quest fragment not found.");
      quest.scenes.push(data as Scene);
    } else if (kind === "quest") {
      (fileData as Chapter).quests.push(data as Quest);
    } else if (Array.isArray(fileData)) {
      fileData.push(data);
    } else {
      throw new Error("Unsupported duplicate target.");
    }
    await this.fileService.writeJsonFileSafe(filePath, fileData);
  }

  private splitPath(docPath: string): PathParts {
    const [filePath, fragment] = docPath.split("#");
    return { filePath, fragment };
  }

  private matchesKind(kind: AuthoringContentKind, file: string, item: unknown): boolean {
    const id = this.idOf(item);
    if (!id) return false;
    if (kind === "grammar") return file.includes("grammar") && !file.includes("vocabulary");
    if (kind === "vocabulary") return file.includes("vocabulary");
    if (kind === "assessment-question") return file.includes("question");
    if (kind === "quest-template") return true;
    if (kind === "village-activity") return file.includes("village-activities");
    return true;
  }

  private isCampaign(value: unknown): value is Campaign {
    return Boolean(value && typeof value === "object" && "chapters" in value && "startChapterId" in value);
  }

  private isChapter(value: unknown): value is Chapter {
    return Boolean(value && typeof value === "object" && "quests" in value && "startQuestId" in value && !("startChapterId" in value));
  }

  private idOf(data: unknown): string {
    return String((data as { id?: unknown })?.id ?? "");
  }

  private titleOf(data: unknown): string {
    const value = data as { titleTr?: unknown; title?: unknown; name?: unknown; latin?: unknown; id?: unknown };
    return String(value.titleTr ?? value.title ?? value.name ?? value.latin ?? value.id ?? "Untitled");
  }
}
