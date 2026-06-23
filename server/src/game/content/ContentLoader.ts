import fs from "node:fs";
import path from "node:path";
import type { Campaign, Chapter, ID, Quest, Scene, QuestTemplate } from "../types/gameTypes";
import type { GrammarTopic, ItemDefinition, LatinExample, LoadedContent, NpcDefinition, SkillDefinition, VocabularyItem } from "../types/contentTypes";
import { ContentOverrideService } from "../../content/ContentOverrideService";

export class ContentLoader {
  private content: LoadedContent = { campaigns: [], npcs: [], items: [], skills: [], grammar: [], vocabulary: [], examples: [], questTemplates: [] };
  private readonly overrides: ContentOverrideService;

  constructor(private readonly dataRoot = path.resolve(process.cwd(), "data"), overrideService?: ContentOverrideService) {
    this.overrides = overrideService ?? new ContentOverrideService({ projectRoot: path.resolve(this.dataRoot, "..") });
  }

  load(): LoadedContent {
    const campaignsDir = path.join(this.dataRoot, "campaigns");
    const campaignFiles = this.listMergedFiles("campaigns");
    const flatCampaigns = campaignFiles.map((file) => this.readJson<Campaign>(path.join(campaignsDir, file)));
    const modularCampaigns = this.readModularCampaigns(campaignsDir, new Set());
    const modularIds = new Set(modularCampaigns.map((campaign) => campaign.id));
    const campaigns = [...modularCampaigns, ...flatCampaigns.filter((campaign) => !modularIds.has(campaign.id))];

    const templatesDir = path.join(this.dataRoot, "quest-templates");
    const templateFiles = this.listMergedFiles("quest-templates");
    const questTemplates = templateFiles.flatMap((file) => this.readJson<QuestTemplate[]>(path.join(templatesDir, file)));

    this.content = {
      campaigns,
      npcs: this.mergeById(this.readJson<NpcDefinition[]>(path.join(this.dataRoot, "npcs.json")), this.readJsonDir<NpcDefinition>(path.join(this.dataRoot, "npcs"))),
      items: this.readJson<ItemDefinition[]>(path.join(this.dataRoot, "items.json")),
      skills: this.readJson<SkillDefinition[]>(path.join(this.dataRoot, "skills.json")),
      grammar: this.mergeById(this.readJson<GrammarTopic[]>(path.join(this.dataRoot, "latin", "grammar.json")), this.readJsonFiles<GrammarTopic>(path.join(this.dataRoot, "latin"), /^grammar-.+\.json$/)),
      vocabulary: this.mergeById(this.readJson<VocabularyItem[]>(path.join(this.dataRoot, "latin", "vocabulary.json")), this.readJsonFiles<VocabularyItem>(path.join(this.dataRoot, "latin"), /^vocabulary-.+\.json$/)),
      examples: this.readJson<LatinExample[]>(path.join(this.dataRoot, "latin", "examples.json")),
      questTemplates
    };
    return this.content;
  }

  getContent(): LoadedContent {
    return this.content;
  }

  getQuestTemplates(): QuestTemplate[] {
    return this.content.questTemplates;
  }

  getQuestTemplate(id: ID): QuestTemplate | undefined {
    return this.content.questTemplates.find((t) => t.id === id);
  }

  getQuestTemplatesByCategory(category: QuestTemplate["category"]): QuestTemplate[] {
    return this.content.questTemplates.filter((template) => template.category === category);
  }

  getCampaign(id: ID): Campaign | undefined {
    return this.content.campaigns.find((campaign) => campaign.id === id);
  }

  getDefaultCampaign(): Campaign | undefined {
    return this.content.campaigns[0];
  }

  getGrammarTopic(id: ID): GrammarTopic | undefined {
    return this.content.grammar.find((topic) => topic.id === id);
  }

  getVocabularyItem(id: ID): VocabularyItem | undefined {
    return this.content.vocabulary.find((item) => item.id === id);
  }

  getVocabularyByLevel(level: string | number): VocabularyItem[] {
    return this.content.vocabulary.filter((item) => String(item.level) === String(level));
  }

  getGrammarByLevel(level: string | number): GrammarTopic[] {
    return this.content.grammar.filter((topic) => String(topic.level) === String(level));
  }

  getChapter(campaignId: ID, chapterId: ID): Chapter | undefined {
    const normalizedChapterId = chapterId === "chapter_ludus" ? "prologus" : chapterId;
    return this.getCampaign(campaignId)?.chapters.find((chapter) => chapter.id === normalizedChapterId);
  }

  getQuest(campaignId: ID, questId: ID): Quest | undefined {
    return this.getCampaign(campaignId)?.chapters.flatMap((chapter) => chapter.quests).find((quest) => quest.id === questId);
  }

  getScene(campaignId: ID, sceneId: ID): Scene | undefined {
    return this.getCampaign(campaignId)?.chapters.flatMap((chapter) => chapter.quests).flatMap((quest) => quest.scenes).find((scene) => scene.id === sceneId);
  }

  findChapterForQuest(campaignId: ID, questId: ID): Chapter | undefined {
    return this.getCampaign(campaignId)?.chapters.find((chapter) => chapter.quests.some((quest) => quest.id === questId));
  }

  findQuestForScene(campaignId: ID, sceneId: ID): Quest | undefined {
    return this.getCampaign(campaignId)?.chapters.flatMap((chapter) => chapter.quests).find((quest) => quest.scenes.some((scene) => scene.id === sceneId));
  }

  findChapterForScene(campaignId: ID, sceneId: ID): Chapter | undefined {
    const quest = this.findQuestForScene(campaignId, sceneId);
    return quest ? this.findChapterForQuest(campaignId, quest.id) : undefined;
  }

  private readModularCampaigns(campaignsDir: string, existingIds: Set<ID>): Campaign[] {
    if (!fs.existsSync(campaignsDir)) return [];
    return fs.readdirSync(campaignsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(campaignsDir, entry.name))
      .filter((dir) => fs.existsSync(path.join(dir, "campaign.json")))
      .map((dir) => {
        const summary = this.readJson<Campaign & { chapters: Array<Partial<Chapter> & { id: ID }> }>(path.join(dir, "campaign.json"));
        const chapterDir = path.join(dir, "chapters");
        const chapters = fs.existsSync(chapterDir)
          ? fs.readdirSync(chapterDir).filter((file) => file.endsWith(".json")).map((file) => this.readJson<Chapter>(path.join(chapterDir, file))).sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
          : summary.chapters as Chapter[];
        return { ...summary, chapters } as Campaign;
      })
      .filter((campaign) => !existingIds.has(campaign.id));
  }

  private readJsonDir<T extends { id: ID }>(dirPath: string): T[] {
    return this.readJsonFiles<T>(dirPath, /.+\.json$/);
  }

  private readJsonFiles<T>(dirPath: string, pattern: RegExp): T[] {
    const relativeDir = path.relative(this.dataRoot, dirPath);
    return this.listMergedFiles(relativeDir)
      .filter((file) => pattern.test(file))
      .flatMap((file) => {
        const value = this.readJson<T | T[]>(path.join(dirPath, file));
        return Array.isArray(value) ? value : [value];
      });
  }

  private mergeById<T extends { id: ID }>(base: T[], extra: T[]): T[] {
    const result = new Map<ID, T>();
    for (const item of base) result.set(item.id, item);
    for (const item of extra) result.set(item.id, { ...result.get(item.id), ...item });
    return [...result.values()];
  }

  private readJson<T>(filePath: string): T {
    const relative = path.relative(this.dataRoot, filePath);
    const raw = fs.readFileSync(this.overrides.resolveContentPath(relative), "utf8");
    return JSON.parse(raw) as T;
  }

  private listMergedFiles(relativeDir: string): string[] {
    const sourceDir = path.join(this.dataRoot, relativeDir);
    const overrideDir = this.overrides.toOverridePath(relativeDir);
    const names = new Set<string>();
    if (fs.existsSync(sourceDir)) for (const file of fs.readdirSync(sourceDir)) if (file.endsWith(".json")) names.add(file);
    if (fs.existsSync(overrideDir)) for (const file of fs.readdirSync(overrideDir)) if (file.endsWith(".json")) names.add(file);
    return [...names].sort();
  }
}
