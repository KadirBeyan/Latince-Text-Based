import { randomUUID } from "node:crypto";
import type { DialogueEntry, GameAction, GameState, PlayerSave, SessionSummary } from "../types/gameTypes";
import { ConversationEngine } from "../conversation/ConversationEngine";
import { FreeformActionInterpreter } from "../freeform/FreeformActionInterpreter";
import { FreeformWorldResponseService } from "../freeform/FreeformWorldResponseService";
import { ContentLoader } from "../content/ContentLoader";
import { SaveRepository, type SaveSummary } from "../save/SaveRepository";
import { QuestSystem } from "../systems/QuestSystem";
import { SceneSystem } from "../systems/SceneSystem";
import { EffectRunner } from "./EffectRunner";
import { EventBus } from "./EventBus";
import { GameStateService } from "./GameStateService";
import { RuleEngine } from "./RuleEngine";
import type { LlmProviderConfig, HintResult, SceneNarrationResult } from "../../llm/LlmTypes";
import { LlmProviderFactory } from "../../llm/LlmProviderFactory";
import type { LlmClient } from "../../llm/LlmClient";
import { HintSystem } from "../systems/HintSystem";
import { NarrationSystem } from "../systems/NarrationSystem";
import { ReviewSystem, type ReviewSuggestion } from "../systems/ReviewSystem";
import { ProgressionSystem } from "../systems/ProgressionSystem";
import { SessionSummarySystem } from "../systems/SessionSummarySystem";
import { SideQuestSystem } from "../systems/SideQuestSystem";
import { GeneratedContentSystem } from "../systems/GeneratedContentSystem";
import { QuestTemplateEngine } from "../content/QuestTemplateEngine";
import { DynamicQuestSystem } from "../systems/DynamicQuestSystem";
import { CharacterCreationService } from "../character/CharacterCreationService";
import { StartingProfileService } from "../character/StartingProfileService";
import type { CharacterCreationInput } from "../character/CharacterTypes";
import type { CharacterProfile } from "../types/gameTypes";
import { WorldPresenceService } from "../world/WorldPresenceService";

export class GameEngine {
  private readonly eventBus: EventBus;
  private readonly ruleEngine: RuleEngine;
  private readonly effectRunner: EffectRunner;
  private readonly sceneSystem: SceneSystem;
  private readonly templateEngine: QuestTemplateEngine;
  private readonly dynamicQuestSystem: DynamicQuestSystem;
  private readonly questSystem: QuestSystem;
  private readonly gameStateService: GameStateService;
  private readonly hintSystem: HintSystem;
  private readonly narrationSystem: NarrationSystem;
  private readonly reviewSystem = new ReviewSystem();
  private readonly progressionSystem = new ProgressionSystem();
  private readonly sessionSummarySystem = new SessionSummarySystem();
  private readonly sideQuestSystem = new SideQuestSystem();
  private readonly characterCreationService = new CharacterCreationService();
  private readonly startingProfileService = new StartingProfileService();

  private readonly conversationEngine: ConversationEngine;
  private readonly freeformInterpreter: FreeformActionInterpreter;
  private readonly freeformWorldResponse = new FreeformWorldResponseService();
  private readonly worldPresence = new WorldPresenceService();

  constructor(
    private readonly contentLoader: ContentLoader,
    private readonly saveRepository: SaveRepository
  ) {
    this.eventBus = new EventBus();
    this.ruleEngine = new RuleEngine();
    this.effectRunner = new EffectRunner(this.contentLoader, this.eventBus);
    this.sceneSystem = new SceneSystem(this.contentLoader, this.ruleEngine, this.effectRunner, this.eventBus);
    this.questSystem = new QuestSystem();
    this.gameStateService = new GameStateService(this.contentLoader, this.ruleEngine, this.eventBus);
    this.hintSystem = new HintSystem(this.eventBus, this.contentLoader);
    this.narrationSystem = new NarrationSystem(this.contentLoader);
    this.templateEngine = new QuestTemplateEngine(this.contentLoader);
    this.dynamicQuestSystem = new DynamicQuestSystem(this.contentLoader, this.templateEngine);
    this.conversationEngine = new ConversationEngine(this.contentLoader, this.effectRunner, this.eventBus);
    this.freeformInterpreter = new FreeformActionInterpreter();
  }

  async createNewGame(playerName: string, campaignId?: string, llmConfig?: LlmProviderConfig): Promise<GameState> {
    let save = this.initializeSave(playerName, campaignId || "vicus_first_days");
    const scene = this.contentLoader.getScene(save.currentCampaignId, save.currentSceneId);
    if (scene?.locationId) save = await this.worldPresence.onLocationEnter({ save, locationId: scene.locationId, llmConfig });
    const saved = this.saveRepository.create(save);
    return this.gameStateService.buildState(saved);
  }

  async createCharacterSave(input: CharacterCreationInput, campaignId?: string): Promise<GameState> {
    const result = this.characterCreationService.createProfile(input);
    let save = this.initializeSave(result.playerName, campaignId || "vicus_first_days", undefined, {
      profile: result.profile,
      startChapterId: "village_first_days",
      startQuestId: "vicus_prologue_main",
      startSceneId: "vicus_001_home_morning"
    });
    const scene = this.contentLoader.getScene(save.currentCampaignId, save.currentSceneId);
    if (scene?.locationId) save = await this.worldPresence.onLocationEnter({ save, locationId: scene.locationId });
    const saved = this.saveRepository.create(save);
    return this.gameStateService.buildState(saved);
  }

  getGameState(saveId: string): GameState {
    const save=GeneratedContentSystem.expireOldGeneratedQuests(this.progressionSystem.updateDailyStreak(this.requireSave(saveId)));
    this.saveRepository.update(save);
    return this.gameStateService.buildState(save);
  }

  async submitAction(saveId: string, action: GameAction, llmConfig?: LlmProviderConfig): Promise<GameState> {
    let save = this.requireSave(saveId);
    let nextSave: PlayerSave;
    const llm = this.createOptionalLlmClient(save, llmConfig, action.type);
    save = llm.save;
    const llmClient = llm.client;

    switch (action.type) {
      case "CHOICE_SELECT":
        nextSave = this.sceneSystem.resolveChoice(save, action.choiceId);
        break;
      case "INTENT_SELECT":
        nextSave = await this.sceneSystem.resolveIntentSelect(save, action.intentId, action.sceneId);
        break;
      case "TEXT_SUBMIT":
        nextSave = await this.sceneSystem.resolveTextChallenge(save, action.text, llmClient);
        break;
      case "START_CONVERSATION": {
        const result = this.conversationEngine.startConversation({
          save,
          flowId: action.flowId,
          sceneId: action.sceneId
        });
        nextSave = result.save;
        break;
      }
      case "CONVERSATION_OPTION_SELECT": {
        const result = this.conversationEngine.selectConversationOption({
          save,
          flowId: action.flowId,
          nodeId: action.nodeId,
          optionId: action.optionId
        });
        nextSave = result.save;
        break;
      }
      case "CONVERSATION_TEXT_SUBMIT": {
        const result = await this.conversationEngine.submitConversationText({
          save,
          flowId: action.flowId,
          nodeId: action.nodeId,
          optionId: action.optionId,
          answer: action.answer,
          llmConfig
        });
        nextSave = result.save;
        break;
      }
      case "CONVERSATION_EXIT": {
        nextSave = { ...save, pendingFreeformLatin: undefined, latestFreeformResponse: undefined };
        if (nextSave.activeConversation) {
          if (nextSave.activeConversation.selectedOptionId) {
            nextSave.activeConversation = {
              ...nextSave.activeConversation,
              selectedOptionId: undefined
            };
          } else {
            nextSave.activeConversation = undefined;
          }
        }
        break;
      }
      case "FREEFORM_ACTION_SUBMIT": {
        const activeConv = save.activeConversation;
        let availableOptions: any[] = [];
        let conversationFlow: any = undefined;
        let currentNode: any = undefined;
        
        if (activeConv) {
          conversationFlow = this.contentLoader.getConversationFlow(activeConv.flowId);
          if (conversationFlow) {
            currentNode = conversationFlow.nodes.find((n: any) => n.id === activeConv.currentNodeId);
            if (currentNode) {
              availableOptions = currentNode.options;
            }
          }
        } else {
          const scene = this.contentLoader.getScene(save.currentCampaignId, save.currentSceneId);
          if (scene) {
            if (scene.interactionModel && scene.interactionModel.intents) {
              availableOptions = scene.interactionModel.intents;
            } else if (scene.hybridDialogue && scene.hybridDialogue.intents) {
              availableOptions = scene.hybridDialogue.intents;
            }
          }
        }

        const scene = this.contentLoader.getScene(save.currentCampaignId, save.currentSceneId);
        const nearbyNpcs = scene ? scene.npcIds : [];
        const locationId = scene ? scene.locationId : undefined;

        const authoredConversationOptionMatches = activeConv ? this.matchesAuthoredConversationOption(action.inputText, availableOptions) : false;

        if (!authoredConversationOptionMatches && locationId && /\b(defter|gunluk|günlük|not al|yazıyorum|yaziyorum)\b/i.test(action.inputText)) {
          const facts = save.eventLog.slice(-5).map((event) => String(event.payload.summaryTr ?? event.payload.messageTr ?? event.type));
          const journal = this.worldPresence.journal.createJournalEntry({ save, mode: "manual", relatedLocationIds: [locationId], learnedWordIds: save.worldPresence?.discoveredLatinIds.slice(-5), rawFactsTr: facts.length ? facts : ["köyde çevreme dikkatle baktım."] });
          nextSave = journal.save;
          nextSave.activeWorldPresence = { ...this.worldPresence.buildView(nextSave, locationId), latestWorldReaction: { narrationTr: journal.entry.bodyTr, generatedBy: "template" } };
          break;
        }
        if (!authoredConversationOptionMatches && locationId && /\b(dinle|dinliyorum|kulak ver|konuşmaları|konusmalari|söylenti|soylenti)\b/i.test(action.inputText)) {
          const heard = this.worldPresence.rumors.surfaceRumor({ save, locationId }); nextSave = heard.save;
          nextSave.activeWorldPresence = { ...this.worldPresence.buildView(nextSave, locationId), latestWorldReaction: { narrationTr: heard.narrationTr ?? "Bugün belirgin bir söylenti duymuyorsun.", generatedBy: "template" } };
          break;
        }
        if (!authoredConversationOptionMatches && locationId && /\b(oku|okuyorum|yazıda|yazida|ne yazıyor|ne yaziyor)\b/i.test(action.inputText)) {
          const candidates = this.worldPresence.readable.getReadableObjects({ save, locationId });
          const match = this.worldPresence.objects.matchFreeformObject({ inputText: action.inputText, visibleObjects: this.worldPresence.objects.getVisibleObjects({ save, locationId }).filter(o => o.readable) });
          const readable = candidates.find(o => o.id === match.objectId) ?? candidates.find(o => [o.titleTr, ...(o.aliasesTr ?? [])].some(a => action.inputText.toLocaleLowerCase("tr-TR").includes(a.toLocaleLowerCase("tr-TR")))) ?? (candidates.length === 1 ? candidates[0] : undefined);
          if (readable) { const result = this.worldPresence.readable.attemptReadObject({ save, objectId: readable.id, playerLatinAttempt: action.inputText }); nextSave = result.save; nextSave.activeWorldPresence = { ...this.worldPresence.buildView(nextSave, locationId), latestWorldReaction: { narrationTr: result.resultTr, generatedBy: "template" } }; break; }
        }
        if (!authoredConversationOptionMatches && locationId && /\b(incele|bakıyorum|bakiyorum|kontrol|içine bak|icine bak)\b/i.test(action.inputText)) {
          const visible = this.worldPresence.objects.getVisibleObjects({ save, locationId }); const match = this.worldPresence.objects.matchFreeformObject({ inputText: action.inputText, visibleObjects: visible });
          if (match.objectId) { const result = this.worldPresence.objects.inspectObject({ save, locationId, objectId: match.objectId, inputText: action.inputText }); nextSave = result.save; nextSave.activeWorldPresence = { ...this.worldPresence.buildView(nextSave, locationId), latestWorldReaction: { narrationTr: result.resultTr, latinNudge: result.latinDiscoveries[0] ? { wordLatin: result.latinDiscoveries[0].wordOrPhraseLatin, meaningTr: result.latinDiscoveries[0].meaningTr } : undefined, generatedBy: "template" } }; break; }
        }

        const result = await this.freeformInterpreter.interpretFreeformAction({
          inputText: action.inputText,
          context: {
            scene,
            conversationFlow,
            currentNode,
            availableOptions,
            nearbyNpcIds: nearbyNpcs,
            locationId,
            playerProfile: save.characterProfile
          },
          llmConfig
        });

        nextSave = { ...save, latestFreeformResponse: undefined };
        nextSave = this.eventBus.emit(nextSave, "FREEFORM_ACTION_INTERPRETED", {
          inputText: action.inputText,
          actionKind: result.actionKind,
          matchedOptionId: result.matchedOptionId,
          confidence: result.confidence,
          meaningTr: result.meaningTr,
          requiresLatin: result.requiresLatin
        });

        if (result.ok && result.matchedOptionId) {
          const optionId = result.matchedOptionId;
          if (!activeConv || !conversationFlow) throw new Error("Freeform conversation option requires an active conversation.");
          const flowId = activeConv.flowId;
          const nodeId = activeConv.currentNodeId;
          const node = conversationFlow.nodes.find((n: any) => n.id === nodeId);
          const option = node.options.find((o: any) => o.id === optionId);
          const directLatin = result.actionKind === "direct_latin_utterance" && result.detectedLatinText;

          if (option.requiresLatin && directLatin) {
            const resolved = await this.conversationEngine.submitConversationText({ save: nextSave, flowId, nodeId, optionId, answer: directLatin, llmConfig });
            nextSave = resolved.save;
            nextSave = this.recordFreeformHistory(nextSave, action.inputText, result.meaningTr, nodeId, directLatin, resolved.evaluation?.verdict);
            nextSave.latestFreeformResponse = this.freeformWorldResponse.buildFreeformWorldResponse({ interpretation: result, latinEvaluation: resolved.evaluation, context: { sceneId: save.currentSceneId, flowId, nodeId, locationId, npcIds: nearbyNpcs, playerProfile: save.characterProfile } });
            nextSave = this.eventBus.emit(nextSave, "FREEFORM_LATIN_EVALUATED", { answer: directLatin, verdict: resolved.evaluation?.verdict, acceptedAsCorrect: resolved.evaluation?.acceptedAsCorrect, feedbackTr: resolved.evaluation?.feedbackTr });
          } else if (option.requiresLatin || result.requiresLatin) {
            const pending = {
              id: randomUUID(), originalInput: action.inputText, actionKind: result.actionKind,
              targetNpcId: result.targetNpcId || node.speakerNpcId, matchedOptionId: optionId,
              targetMeaningTr: result.targetMeaningTr || option.targetMeaningTr || option.labelTr,
              suggestedLatinPromptTr: result.suggestedLatinPromptTr || "Bunu Latince ifade etmeye çalış.",
              createdAt: new Date().toISOString(), attempts: 0, hintLevel: "nudge"
            } as const;
            nextSave.pendingFreeformLatin = pending;
            nextSave = this.recordFreeformHistory(nextSave, action.inputText, result.meaningTr, nodeId);
            nextSave = this.eventBus.emit(nextSave, "FREEFORM_LATIN_REQUESTED", { targetMeaningTr: pending.targetMeaningTr, targetNpcId: pending.targetNpcId, matchedOptionId: optionId });
          } else {
            const optionResult = this.conversationEngine.selectConversationOption({
              save: nextSave,
              flowId,
              nodeId,
              optionId
            });
            nextSave = optionResult.save;
            nextSave = this.recordFreeformHistory(nextSave, action.inputText, result.meaningTr, nodeId);
            nextSave.latestFreeformResponse = this.freeformWorldResponse.buildFreeformWorldResponse({ interpretation: result, context: { sceneId: save.currentSceneId, flowId, nodeId, locationId, npcIds: nearbyNpcs, playerProfile: save.characterProfile } });
          }
        } else if (result.ok && result.matchedIntentId) {
          nextSave = await this.sceneSystem.resolveIntentSelect(nextSave, result.matchedIntentId, save.currentSceneId);
          nextSave.latestFreeformResponse = this.freeformWorldResponse.buildFreeformWorldResponse({ interpretation: result, context: { sceneId: save.currentSceneId, locationId, npcIds: nearbyNpcs, playerProfile: save.characterProfile } });
        } else {
          const rejectionMessage = result.rejection?.messageTr || "Bunu şu an burada yapamazsın.";
          const entry: DialogueEntry = {
            id: randomUUID(),
            speakerId: "narrator",
            text: rejectionMessage,
            language: "Turkish",
            timestamp: new Date().toISOString()
          };
          nextSave.dialogueLog = [...nextSave.dialogueLog, entry];
          nextSave.latestFreeformResponse = this.freeformWorldResponse.buildFreeformWorldResponse({ interpretation: result, context: { sceneId: save.currentSceneId, flowId: activeConv?.flowId, nodeId: activeConv?.currentNodeId, locationId, npcIds: nearbyNpcs, playerProfile: save.characterProfile } });
          nextSave = this.eventBus.emit(nextSave, "FREEFORM_ACTION_REJECTED", { inputText: action.inputText, reasonCode: result.rejection?.reasonCode, messageTr: rejectionMessage, suggestedOptionIds: result.rejection?.suggestedOptionIds ?? [] });
        }
        break;
      }
      case "FREEFORM_LATIN_SUBMIT": {
        const pending = save.pendingFreeformLatin;
        if (!pending || pending.id !== action.pendingFreeformLatinId) throw new Error("Bekleyen Latince ifade isteği bulunamadı.");
        const activeConv = save.activeConversation;
        if (!activeConv || !pending.matchedOptionId) throw new Error("Bekleyen Latince ifade bir konuşma seçeneğine bağlı değil.");
        const resolved = await this.conversationEngine.submitConversationText({
          save,
          flowId: activeConv.flowId,
          nodeId: activeConv.currentNodeId,
          optionId: pending.matchedOptionId,
          answer: action.answer,
          llmConfig
        });
        nextSave = resolved.save;
        const accepted = Boolean(resolved.evaluation?.acceptedAsCorrect);
        nextSave.pendingFreeformLatin = accepted ? undefined : {
          ...pending,
          attempts: pending.attempts + 1,
          hintLevel: pending.attempts >= 2 ? "example" : pending.attempts === 1 ? "structure" : "vocabulary"
        };
        nextSave = this.recordFreeformHistory(nextSave, pending.originalInput, pending.targetMeaningTr, activeConv.currentNodeId, action.answer, resolved.evaluation?.verdict);
        nextSave.latestFreeformResponse = this.freeformWorldResponse.buildFreeformWorldResponse({
          interpretation: { ok: true, interpretationSource: "heuristic", actionKind: pending.actionKind, matchedOptionId: pending.matchedOptionId, confidence: 1, targetNpcId: pending.targetNpcId, meaningTr: pending.targetMeaningTr, requiresLatin: true, targetMeaningTr: pending.targetMeaningTr, detectedLatinText: action.answer, canResolveImmediately: false },
          latinEvaluation: resolved.evaluation,
          context: { sceneId: save.currentSceneId, flowId: activeConv.flowId, nodeId: activeConv.currentNodeId, npcIds: pending.targetNpcId ? [pending.targetNpcId] : [], playerProfile: save.characterProfile }
        });
        nextSave = this.eventBus.emit(nextSave, "FREEFORM_LATIN_EVALUATED", { answer: action.answer, verdict: resolved.evaluation?.verdict, acceptedAsCorrect: accepted, feedbackTr: resolved.evaluation?.feedbackTr });
        break;
      }
      case "REQUEST_HINT": {
        const scene = this.resolveScene(save);
        if (!scene) {
          throw new Error(`Scene ${save.currentSceneId} was not found.`);
        }
        const hintResult = await this.hintSystem.generateHint(save, scene, llmClient);
        nextSave = hintResult.save;
        break;
      }
      case "USE_ITEM":
        if (!this.ruleEngine.canUseItem(save, action.itemId)) {
          throw new Error(`Item ${action.itemId} cannot be used because it is not in inventory.`);
        }
        nextSave = this.eventBus.emit(save, "action.item_used", { itemId: action.itemId, sceneId: save.currentSceneId });
        break;
      case "START_QUEST":
        if (action.questId.startsWith("gen_quest_")) {
          nextSave = GeneratedContentSystem.startQuest(save, action.questId, this.eventBus);
        } else {
          nextSave = this.questSystem.startQuest(save, action.questId);
        }
        nextSave = this.eventBus.emit(nextSave, "action.quest_started", { questId: action.questId });
        break;
      case "OPEN_JOURNAL":
        nextSave = this.eventBus.emit(save, "action.journal_opened", { entries: save.journalEntries.length });
        break;
    }

    const finalScene = this.contentLoader.getScene(nextSave.currentCampaignId, nextSave.currentSceneId);
    if (finalScene?.locationId) nextSave.activeWorldPresence = this.worldPresence.buildView(nextSave, finalScene.locationId);
    const updated = this.saveRepository.update(nextSave);
    return this.gameStateService.buildState(updated);
  }

  async generateNarration(saveId: string, llmConfig?: LlmProviderConfig): Promise<SceneNarrationResult> {
    const save = this.requireSave(saveId);
    const scene = this.resolveScene(save);
    if (!scene) {
      throw new Error(`Scene ${save.currentSceneId} was not found.`);
    }

    const npcs = this.contentLoader.getContent().npcs || [];
    const npcProfiles = npcs.filter((n) => scene.npcIds.includes(n.id));
    const llm = this.createOptionalLlmClient(save, llmConfig, "generateNarration");
    const llmClient = llm.client;

    const narration = await this.narrationSystem.generateNarration(llm.save, scene, npcProfiles, llmClient);

    let nextSave = this.eventBus.emit(llm.save, "NARRATION_GENERATED", {
      sceneId: scene.id,
      narration,
    });

    if (llmClient && narration.mode === "fallback") {
      nextSave = this.eventBus.emit(nextSave, "LLM_ERROR", {
        error: "LLM narration generation failed, using fallback.",
        action: "generateNarration",
      });
    }

    this.saveRepository.update(nextSave);
    return narration;
  }

  async generateHint(saveId: string, llmConfig?: LlmProviderConfig): Promise<HintResult> {
    const save = this.requireSave(saveId);
    const scene = this.resolveScene(save);
    if (!scene) {
      throw new Error(`Scene ${save.currentSceneId} was not found.`);
    }

    const llm = this.createOptionalLlmClient(save, llmConfig, "generateHint");
    const llmClient = llm.client;
    const result = await this.hintSystem.generateHint(llm.save, scene, llmClient, { addDialogue: false });

    let nextSave = result.save;
    if (llmClient && result.hint.hintTr.startsWith("Cevap muhtemelen")) {
      nextSave = this.eventBus.emit(nextSave, "LLM_ERROR", {
        error: "LLM hint generation failed, using fallback.",
        action: "generateHint",
      });
    }

    this.saveRepository.update(nextSave);
    return result.hint;
  }

  resetGame(saveId: string): GameState {
    const existing = this.requireSave(saveId);
    const resetSave = this.initializeSave(existing.playerName, existing.currentCampaignId, existing.id);
    const updated = this.saveRepository.update(resetSave);
    return this.gameStateService.buildState(updated);
  }

  listSaves(): SaveSummary[] {
    return this.saveRepository.list();
  }

  getReview(saveId: string): ReviewSuggestion {
    return this.reviewSystem.createReviewSuggestion(this.requireSave(saveId));
  }

  getSessionSummary(saveId: string): SessionSummary { return this.sessionSummarySystem.getSessionSummary(this.requireSave(saveId)); }
  getRawSave(saveId:string):PlayerSave{return this.requireSave(saveId);}
  debugUpdate(saveId:string, action:string, mutate:(save:PlayerSave)=>PlayerSave):PlayerSave { const save=this.requireSave(saveId); return this.saveRepository.update(this.eventBus.emit(mutate(save),"DEBUG_ACTION",{action})); }

  getSideQuestSuggestions(saveId: string): GameState {
    const save = this.requireSave(saveId);
    return this.gameStateService.buildState(save);
  }

  refreshSideQuestSuggestions(saveId: string): GameState {
    let save = this.requireSave(saveId);
    save = this.sideQuestSystem.refreshSideQuestSuggestions(save);
    const updated = this.saveRepository.update(save);
    return this.gameStateService.buildState(updated);
  }

  acceptSideQuestSuggestion(saveId: string, suggestionId: string): GameState {
    let save = this.requireSave(saveId);
    save = this.sideQuestSystem.acceptSideQuestSuggestion({ save, suggestionId, eventBus: this.eventBus });
    const updated = this.saveRepository.update(save);
    return this.gameStateService.buildState(updated);
  }

  dismissSideQuestSuggestion(saveId: string, suggestionId: string): GameState {
    let save = this.requireSave(saveId);
    save = this.sideQuestSystem.dismissSideQuestSuggestion({ save, suggestionId, eventBus: this.eventBus });
    const updated = this.saveRepository.update(save);
    return this.gameStateService.buildState(updated);
  }

  private initializeSave(playerName: string, requestedCampaignId?: string, saveId: string = randomUUID(), options?: { profile?: CharacterProfile; startChapterId?: string; startQuestId?: string; startSceneId?: string }): PlayerSave {
    const campaign = requestedCampaignId ? this.contentLoader.getCampaign(requestedCampaignId) : this.contentLoader.getDefaultCampaign();
    if (!campaign) {
      throw new Error(requestedCampaignId ? `Campaign ${requestedCampaignId} was not found.` : "No campaigns are loaded.");
    }
    const chapterId = options?.startChapterId ?? campaign.startChapterId;
    const chapter = campaign.chapters.find((candidate) => candidate.id === chapterId);
    if (!chapter) {
      throw new Error(`Campaign ${campaign.id} points to missing start chapter ${chapterId}.`);
    }
    const questId = options?.startQuestId ?? chapter.startQuestId;
    const quest = chapter.quests.find((candidate) => candidate.id === questId);
    if (!quest) {
      throw new Error(`Chapter ${chapter.id} points to missing start quest ${questId}.`);
    }
    const now = new Date().toISOString();
    const characterProfile = options?.profile ?? this.startingProfileService.buildProfile({ name: playerName, origin: "unknown_origin", traits: ["curious", "practical"], skillAllocations: { lingua: 1, memoria: 1, observatio: 1, urbanitas: 1, labor: 1, pietas: 1 } }, now);
    if (!characterProfile.skillProgress) {
      characterProfile.skillProgress = { lingua: 0, memoria: 0, observatio: 0, urbanitas: 0, auctoritas: 0, mercatura: 0, disciplina: 0, labor: 0, scriptura: 0, pietas: 0 };
    }
    const baseSave: PlayerSave = {
      schemaVersion: 7,
      id: saveId,
      playerName,
      createdAt: now,
      updatedAt: now,
      currentCampaignId: campaign.id,
      currentChapterId: chapter.id,
      currentQuestId: quest.id,
      currentSceneId: options?.startSceneId ?? quest.startSceneId,
      level: 1,
      xp: 0,
      currency: 0,
      streak: { current: 0, best: 0 },
      masteryStates: [],
      seenRewardEventIds: [],
      flags: {},
      inventory: [],
      skills: [],
      questStates: {},
      completedSceneIds: [],
      visitedSceneIds: [],
      journalEntries: [],
      dialogueLog: [],
      eventLog: [],
      errorMemory: [],
      npcMemories: [],
      locationStates: [],
      worldEvents: [],
      activeSideQuestSuggestions: [],
      narrativeFlags: {},
      generatedQuests: [],
      assessmentAttempts: [],
      achievements: [],
      analyticsSnapshots: [],
      characterProfile,
      chapterProgress: { [chapter.id]: { chapterId: chapter.id, unlocked: true, completed: false, completedSceneIds: [], completedQuestIds: [], progressPercent: 0 } },
      villageLife: {
        dayState: {
          dayNumber: 1,
          timeOfDay: "mane",
          actionsUsedThisPeriod: 0,
          maxActionsPerPeriod: 3,
          completedDailyActivityIds: [],
          availableActivityIds: [],
          dayFlags: {}
        },
        routineHistory: []
      },
      worldPresence: { visitedLocations: {}, discoveredLatinIds: [], seenRumorIds: [], journalEntries: [], npcMoodOverrides: {}, worldFlags: {} }
    };

    baseSave.skills = this.startingProfileService.toPlayerSkills(characterProfile);
    const activeQuest = this.questSystem.startQuest(baseSave, quest.id);
    const enteredScene = this.sceneSystem.enterScene(activeQuest, options?.startSceneId ?? quest.startSceneId);
    return this.eventBus.emit(enteredScene, "game.created", { playerName, campaignId: campaign.id });
  }

  private requireSave(saveId: string): PlayerSave {
    const save = this.saveRepository.getById(saveId);
    if (!save) {
      throw new Error(`Save ${saveId} was not found.`);
    }
    return save;
  }

  private recordFreeformHistory(save: PlayerSave, inputText: string, interpretationSummaryTr: string, nodeId: string, latinAnswer?: string, verdict?: string): PlayerSave {
    if (!save.activeConversation) return save;
    const history = [...(save.activeConversation.freeformHistory ?? []), {
      inputText,
      interpretationSummaryTr,
      latinAnswer,
      verdict,
      nodeId,
      at: new Date().toISOString()
    }].slice(-10);
    return { ...save, activeConversation: { ...save.activeConversation, freeformHistory: history } };
  }

  private matchesAuthoredConversationOption(inputText: string, availableOptions: any[]): boolean {
    const normalize = (value: string) => value
      .toLocaleLowerCase("tr-TR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9çğıöşü\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const clean = normalize(inputText);
    if (!clean) return false;
    return availableOptions.some((option) => {
      const aliases = [
        option.labelTr,
        option.descriptionTr,
        option.playerIntentTr,
        ...(option.aliasesTr ?? []),
        ...(option.freeformMatchHints ?? [])
      ].filter((item): item is string => Boolean(item));
      return aliases.some((alias) => {
        const normalizedAlias = normalize(alias);
        const aliasTokens = normalizedAlias.split(" ").filter((token) => token.length > 2);
        const overlap = aliasTokens.filter((token) => clean.includes(token)).length;
        const score = clean === normalizedAlias ? 1 : clean.includes(normalizedAlias) || normalizedAlias.includes(clean) ? 0.92 : aliasTokens.length ? overlap / aliasTokens.length : 0;
        return score >= 0.5;
      });
    });
  }

  private resolveScene(save: PlayerSave) {
    if (GeneratedContentSystem.isGeneratedSceneId(save.currentSceneId)) return GeneratedContentSystem.findGeneratedScene({ save, sceneId: save.currentSceneId })?.scene;
    return this.contentLoader.getScene(save.currentCampaignId, save.currentSceneId);
  }

  private createOptionalLlmClient(save: PlayerSave, llmConfig: LlmProviderConfig | undefined, action: string): { save: PlayerSave; client?: LlmClient } {
    if (!llmConfig) {
      return { save };
    }
    try {
      return { save, client: LlmProviderFactory.createLlmClient(llmConfig) };
    } catch (error) {
      return {
        save: this.eventBus.emit(save, "LLM_ERROR", {
          error: error instanceof Error ? error.message : String(error),
          action,
        }),
      };
    }
  }

  async generateQuestFromSuggestion(saveId: string, suggestionId: string, llmConfig?: LlmProviderConfig): Promise<GameState> {
    const save = this.requireSave(saveId);
    const llm = this.createOptionalLlmClient(save, llmConfig, "generateQuestFromSuggestion");
    const system = new DynamicQuestSystem(this.contentLoader, this.templateEngine, llm.client);
    const quest = await system.generateQuestFromSuggestion(llm.save, suggestionId);
    let nextSave = GeneratedContentSystem.addGeneratedQuest(llm.save, quest, this.eventBus);
    nextSave = this.sideQuestSystem.acceptSideQuestSuggestion({ save: nextSave, suggestionId, eventBus: this.eventBus });
    const updated = this.saveRepository.update(nextSave);
    return this.gameStateService.buildState(updated);
  }

  async generateReviewQuest(saveId: string, params: { grammarIds?: string[]; vocabularyIds?: string[]; errorTags?: string[] }, llmConfig?: LlmProviderConfig): Promise<GameState> {
    const save = this.requireSave(saveId);
    const llm = this.createOptionalLlmClient(save, llmConfig, "generateReviewQuest");
    const system = new DynamicQuestSystem(this.contentLoader, this.templateEngine, llm.client);
    const quest = await system.generateReviewQuest(llm.save, params);
    const nextSave = GeneratedContentSystem.addGeneratedQuest(llm.save, quest, this.eventBus);
    const updated = this.saveRepository.update(nextSave);
    return this.gameStateService.buildState(updated);
  }

  acceptGeneratedQuest(saveId: string, questId: string): GameState {
    let save = this.requireSave(saveId);
    save = GeneratedContentSystem.acceptQuest(save, questId, this.eventBus);
    const updated = this.saveRepository.update(save);
    return this.gameStateService.buildState(updated);
  }

  dismissGeneratedQuest(saveId: string, questId: string): GameState {
    let save = this.requireSave(saveId);
    save = GeneratedContentSystem.dismissQuest(save, questId, this.eventBus);
    const updated = this.saveRepository.update(save);
    return this.gameStateService.buildState(updated);
  }

  startGeneratedQuest(saveId: string, questId: string): GameState {
    let save = this.requireSave(saveId);
    save = GeneratedContentSystem.startQuest(save, questId, this.eventBus);
    const updated = this.saveRepository.update(save);
    return this.gameStateService.buildState(updated);
  }

  listGeneratedQuests(saveId: string) { return GeneratedContentSystem.listGeneratedQuests(this.requireSave(saveId)); }

  getGeneratedQuest(saveId: string, questId: string) {
    return GeneratedContentSystem.getGeneratedQuest({ save: this.requireSave(saveId), generatedQuestId: questId });
  }
}
