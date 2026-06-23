import type { PlayerSave, QuestTemplate, GeneratedQuest, Scene, SceneChoice, TextChallenge, ID, Effect, QuestTemplateRenderContext } from "../types/gameTypes";
import type { ContentLoader } from "./ContentLoader";
import type { QuestTemplateEngine } from "./QuestTemplateEngine";

export class GeneratedSceneBuilder {
  static buildQuestFromTemplate(
    template: QuestTemplate,
    save: PlayerSave,
    contentLoader: ContentLoader,
    templateEngine: QuestTemplateEngine
  ): GeneratedQuest {
    const questId: ID = `gen_quest_${template.id}_${Math.random().toString(36).substring(2, 7)}`;
    
    // Resolve labels
    const content = contentLoader.getContent();
    const npc = template.suggestedNpcId ? content.npcs.find(n => n.id === template.suggestedNpcId) : undefined;
    const location = template.suggestedLocationId;

    const grammarLabels = template.learningFocus.grammarIds.map(gid => {
      const topic = content.grammar.find(g => g.id === gid);
      return topic ? (topic.titleTr || topic.title) : gid;
    });

    const vocabularyLabels = template.learningFocus.vocabularyIds.map(vid => {
      const item = content.vocabulary.find(v => v.id === vid);
      return item ? item.latin : vid;
    });

    // Identify weak tags matching the template's focus
    const weakGrammar = new Set<string>();
    const weakVocab = new Set<string>();
    for (const ms of save.masteryStates || []) {
      if (ms.mastery < 0.6) {
        if (ms.targetType === "grammar") weakGrammar.add(ms.targetId);
        if (ms.targetType === "vocabulary") weakVocab.add(ms.targetId);
      }
    }
    const weakTags: string[] = [];
    for (const gid of template.learningFocus.grammarIds) {
      if (weakGrammar.has(gid)) weakTags.push(gid);
    }
    for (const vid of template.learningFocus.vocabularyIds) {
      if (weakVocab.has(vid)) weakTags.push(vid);
    }

    const renderCtx: QuestTemplateRenderContext = {
      playerName: save.playerName || "Discipulus",
      npcName: npc?.name || template.suggestedNpcId,
      locationName: location,
      grammarLabels,
      vocabularyLabels,
      weakTags
    };

    const title = templateEngine.renderText(template.titleTemplate, renderCtx);
    const description = templateEngine.renderText(template.descriptionTemplate, renderCtx);

    const scenes: Scene[] = [];
    const planCount = template.scenePlan.length;

    for (let i = 0; i < planCount; i++) {
      const plan = template.scenePlan[i];
      const sceneId: ID = `gen_scene_${questId}_${plan.role}`;
      const nextSceneId: ID | undefined = i < planCount - 1 
        ? `gen_scene_${questId}_${template.scenePlan[i + 1].role}`
        : undefined;

      const objective = templateEngine.renderText(plan.objectiveTemplate, renderCtx);
      const isLast = i === planCount - 1;

      const scene: Scene = {
        id: sceneId,
        title: plan.role.toUpperCase(),
        locationId: template.suggestedLocationId,
        npcIds: template.suggestedNpcId ? [template.suggestedNpcId] : [],
        description: objective,
        objective,
        inputMode: plan.inputMode === "hybrid" ? "choice" : plan.inputMode,
        choices: [],
        conditions: [],
        effects: [],
        rewards: [],
        onEnterEvents: [
          {
            type: "scene.entered",
            payload: { sceneId }
          }
        ],
        learningFocus: {
          grammarIds: template.learningFocus.grammarIds,
          vocabularyIds: template.learningFocus.vocabularyIds,
          skillIds: template.learningFocus.skillIds,
          difficulty: template.difficulty
        }
      };

      if (plan.inputMode === "choice" || plan.inputMode === "hybrid") {
        if (plan.choiceTemplates && plan.choiceTemplates.length > 0) {
          scene.choices = plan.choiceTemplates.map((cTmpl, cIdx) => {
            const effects: Effect[] = [];
            if (isLast) {
              effects.push({ type: "COMPLETE_QUEST", questId });
            }
            return {
              id: `choice_${sceneId}_${cIdx}`,
              label: cTmpl.label,
              description: cTmpl.description || "",
              conditions: [],
              effects,
              nextSceneId
            };
          });
        } else {
          // Fallback default choice if none specified
          const effects: Effect[] = [];
          if (isLast) {
            effects.push({ type: "COMPLETE_QUEST", questId });
          }
          scene.choices = [
            {
              id: `choice_${sceneId}_default`,
              label: isLast ? "Görevi Tamamla" : "Devam Et",
              description: "",
              conditions: [],
              effects,
              nextSceneId
            }
          ];
        }
      } else {
        // Text challenge inputMode
        const expected = plan.expectedAnswerTemplates
          ? plan.expectedAnswerTemplates.map(ans => templateEngine.renderText(ans, renderCtx))
          : ["salve"];

        const successEffects: Effect[] = [];
        if (isLast) {
          successEffects.push({ type: "COMPLETE_QUEST", questId });
        }

        scene.textChallenge = {
          id: `tc_${sceneId}`,
          prompt: objective,
          expectedAnswers: expected,
          successEffects,
          failureEffects: [],
          successNextSceneId: nextSceneId,
          failureNextSceneId: sceneId // retry same scene
        };
      }

      scenes.push(scene);
    }

    return {
      id: questId,
      sourceTemplateId: template.id,
      title,
      description,
      locationId: template.suggestedLocationId,
      npcIds: template.suggestedNpcId ? [template.suggestedNpcId] : [],
      scenes,
      status: "draft",
      difficulty: template.difficulty,
      learningFocus: {
        grammarIds: template.learningFocus.grammarIds,
        vocabularyIds: template.learningFocus.vocabularyIds,
        skillIds: template.learningFocus.skillIds
      },
      reason: templateEngine.renderText(template.reasonTemplate, renderCtx),
      createdAt: new Date().toISOString(),
      validation: { ok: true, errors: [], warnings: [] },
      metadata: {
        generatedBy: "template",
        playerLevel: save.level,
        relatedMasteryTargets: template.learningFocus.grammarIds
      }
    };
  }
}
