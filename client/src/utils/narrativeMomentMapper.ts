import type { GameEvent, GameState } from "../types/gameTypes";
import type { NarrativeMoment, NarrativeMomentPriority, NarrativeMomentType } from "../types/narrativeTypes";

type Payload = Record<string, unknown>;

const correctVerdicts = new Set(["exact_correct", "equivalent_correct", "acceptable_variant"]);

function payloadOf(event: GameEvent): Payload {
  return event.payload ?? {};
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function amount(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function getEntityTitle(gameState: GameState | null | undefined, kind: "quest" | "chapter", id?: string): string | undefined {
  if (!gameState || !id) return undefined;
  if (kind === "chapter") {
    return gameState.currentCampaign?.chapters.find((chapter) => chapter.id === id)?.title
      ?? (gameState.currentChapter?.id === id ? gameState.currentChapter.title : undefined);
  }
  const quests = gameState.currentCampaign?.chapters.flatMap((chapter) => chapter.quests) ?? gameState.currentChapter?.quests ?? [];
  return quests.find((quest) => quest.id === id)?.title ?? (gameState.currentQuest?.id === id ? gameState.currentQuest.title : undefined);
}

function rewardSummary(payload: Payload): NarrativeMoment["rewardSummary"] | undefined {
  const source = typeof payload.reward === "object" && payload.reward !== null ? payload.reward as Payload : payload;
  const xp = amount(source.xp) ?? (payload.type === "ADD_XP" ? amount(source.amount) : undefined);
  const currency = amount(source.currency) ?? (payload.type === "ADD_CURRENCY" ? amount(source.amount) : undefined);
  const itemId = text(source.itemId);
  const quantity = amount(source.quantity);
  const items = Array.isArray(source.items)
    ? source.items.map((item) => typeof item === "string" ? item : text((item as Payload).itemId)).filter(Boolean) as string[]
    : itemId ? [`${quantity && quantity > 1 ? `${quantity}x ` : ""}${itemId}`] : undefined;
  const mastery = Array.isArray(source.masteryTargets)
    ? source.masteryTargets.map((item) => text((item as Payload).targetId)).filter(Boolean) as string[]
    : undefined;
  if (!xp && !currency && !items?.length && !mastery?.length) return undefined;
  return { xp, currency, items, mastery };
}

function base(event: GameEvent, partial: Omit<NarrativeMoment, "id" | "createdAt">): NarrativeMoment {
  const payload = payloadOf(event);
  return {
    id: `moment:${event.id}`,
    createdAt: event.timestamp ?? new Date().toISOString(),
    relatedSceneId: text(payload.sceneId),
    relatedQuestId: text(payload.questId),
    relatedChapterId: text(payload.chapterId),
    relatedNpcId: text(payload.npcId),
    relatedLocationId: text(payload.locationId),
    ...partial,
  };
}

function dialogueMoment(event: GameEvent): NarrativeMoment {
  const payload = payloadOf(event);
  const verdict = text(payload.verdict) ?? "wrong";
  const accepted = payload.acceptedAsCorrect === true || correctVerdicts.has(verdict);
  const type: NarrativeMomentType = accepted ? "dialogue-response-correct" : verdict === "near_miss" ? "dialogue-response-near-miss" : "dialogue-response-wrong";
  return base(event, {
    type,
    titleTr: accepted ? "Recte!" : type === "dialogue-response-near-miss" ? "Paene recte." : "Non ita.",
    subtitleTr: text(payload.targetMeaningTr),
    latinLine: text(payload.matchedCanonicalAnswer),
    bodyTr: text(payload.feedbackTr) ?? (accepted ? "NPC cevabını kabul etti." : "Cevabın sahne bağlamında tekrar değerlendirilmeli."),
    icon: accepted ? "check" : type === "dialogue-response-near-miss" ? "warning" : "x",
    tone: accepted ? "success" : type === "dialogue-response-near-miss" ? "warning" : "danger",
    priority: accepted ? "normal" : "high",
  });
}

export function mapGameEventToNarrativeMoment(event: GameEvent, gameState?: GameState | null): NarrativeMoment | null {
  const payload = payloadOf(event);
  switch (event.type) {
    case "DIALOGUE_RESPONSE_EVALUATED":
      return dialogueMoment(event);
    case "QUEST_STARTED": {
      const questId = text(payload.questId);
      return base(event, { type: "quest-start", titleTr: "Yeni görev başladı", subtitleTr: getEntityTitle(gameState, "quest", questId) ?? questId, bodyTr: text(payload.objective) ?? "Yeni hedef güncellendi.", latinLine: "Audi. Responde. Perge.", tone: "roman", priority: "normal", icon: "scroll" });
    }
    case "QUEST_COMPLETED": {
      const questId = text(payload.questId);
      return base(event, { type: "quest-complete", titleTr: "Görev Tamamlandı", subtitleTr: getEntityTitle(gameState, "quest", questId) ?? questId, bodyTr: "Opus perfectum. Emeğin ödüllendirildi.", latinLine: "Opus perfectum.", tone: "gold", priority: "critical", icon: "trophy", rewardSummary: rewardSummary(payload) });
    }
    case "CHAPTER_STARTED": {
      const chapterId = text(payload.chapterId);
      return base(event, { type: "chapter-start", titleTr: "Yeni bölüm", subtitleTr: getEntityTitle(gameState, "chapter", chapterId) ?? chapterId, bodyTr: text(payload.description) ?? gameState?.currentChapter?.description, latinLine: "Incipit capitulum.", tone: "roman", priority: "critical", icon: "laurel" });
    }
    case "CHAPTER_COMPLETED": {
      const chapterId = text(payload.chapterId);
      return base(event, { type: "chapter-complete", titleTr: "Bölüm tamamlandı", subtitleTr: getEntityTitle(gameState, "chapter", chapterId) ?? chapterId, bodyTr: "Bu bölümdeki yolculuğun tamamlandı.", latinLine: "Bene fecisti.", tone: "gold", priority: "critical", icon: "laurel", rewardSummary: rewardSummary(payload) });
    }
    case "LEVEL_UP":
      return base(event, { type: "level-up", titleTr: "Seviye Atladın", subtitleTr: `Seviye ${amount(payload.oldLevel) ?? "?"} -> ${amount(payload.newLevel) ?? "?"}`, bodyTr: "Bilgin ve itibarın Via Prima'da yükseliyor.", latinLine: "Nova aetas.", tone: "gold", priority: "critical", icon: "sparkle" });
    case "UPDATE_NPC_RELATIONSHIP":
      return base(event, { type: "relationship-change", titleTr: "İlişki değişti", subtitleTr: text(payload.npcId), bodyTr: text(payload.reason) ?? "NPC seni farklı değerlendirmeye başladı.", latinLine: "Meminit.", tone: "roman", priority: "high", icon: "handshake" });
    case "ADD_NPC_MEMORY":
      return base(event, { type: "npc-memory-added", titleTr: "NPC bunu hatırlayacak", subtitleTr: text(payload.npcId), bodyTr: text(payload.text) ?? "Yeni bir anı kaydedildi.", tone: "muted", priority: "normal", icon: "memory" });
    case "LOCATION_DISCOVERED":
    case "DISCOVER_LOCATION":
      return base(event, { type: "location-discovered", titleTr: "Yeni lokasyon keşfedildi", subtitleTr: text(payload.locationId), bodyTr: "Haritada yeni bir yer belirdi.", latinLine: "Locus repertus.", tone: "roman", priority: "high", icon: "map" });
    case "ADD_WORLD_EVENT": {
      const worldEvent = typeof payload.event === "object" && payload.event !== null ? payload.event as Payload : payload;
      return base(event, { type: "world-event", titleTr: text(worldEvent.title) ?? "Dünya olayı", bodyTr: text(worldEvent.text), tone: "muted", priority: "normal", icon: "world" });
    }
    case "ADD_XP":
    case "XP_ADDED":
    case "ADD_CURRENCY":
    case "CURRENCY_ADDED":
    case "ITEM_ADDED":
    case "SKILL_UNLOCKED":
    case "SKILL_INCREMENTED":
    case "APPLY_REWARD_BUNDLE":
    case "REWARD_BUNDLE_APPLIED":
      return base(event, { type: "reward", titleTr: "Ödül Kazanıldı", bodyTr: "Yeni kazanımlar hesabına işlendi.", tone: "gold", priority: "normal", icon: "gift", rewardSummary: rewardSummary({ ...payload, type: event.type }) });
    case "DYNAMIC_QUEST_GENERATED":
      return base(event, { type: "dynamic-quest-generated", titleTr: "Yeni dinamik görev", subtitleTr: text(payload.questId), bodyTr: "Öğrenme rotana uygun yeni bir görev önerildi.", tone: "roman", priority: "normal", icon: "sparkle" });
    default:
      return null;
  }
}

export function mapEventsToNarrativeMoments(events: GameEvent[], gameState?: GameState | null, seenMomentIds: string[] = []): NarrativeMoment[] {
  const seen = new Set(seenMomentIds);
  return events
    .map((event) => mapGameEventToNarrativeMoment(event, gameState))
    .filter((moment): moment is NarrativeMoment => moment !== null)
    .filter((moment) => !seen.has(moment.id));
}

export function narrativePriorityRank(priority: NarrativeMomentPriority): number {
  return priority === "critical" ? 4 : priority === "high" ? 3 : priority === "normal" ? 2 : 1;
}
