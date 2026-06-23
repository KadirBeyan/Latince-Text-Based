import type { GameEvent } from "../types/gameTypes";
import type { RightPanelTab } from "../stores/gameStore";

const skillLabels: Record<string, string> = {
  latin_basics: "Fundamenta Latina",
  latin_greetings: "Salutationes",
  latin_sum_esse: "Sum / Esse",
  grammar: "Grammatica",
  vocabula: "Vocabula",
  rhetorica: "Rhetorica",
  historia: "Historia",
};

const locationLabels: Record<string, string> = {
  ludus_front: "Ludus",
  ludus_room: "Ludus",
  forum: "Forum",
  domus: "Domus",
  castra: "Castra",
  bibliotheca: "Bibliotheca",
};

const speakerLabels: Record<string, string> = {
  magister: "Magister",
  marcus: "Marcus",
  system: "Systema",
  player: "Tu",
};

const tabLabels: Record<RightPanelTab, string> = {
  feedback: "Correctio",
  journal: "Diarium",
  hint: "Auxilia",
  inventory: "Inventarium",
  skills: "Artes",
  mastery: "Magisterium",
  lingua: "Lingua",
  rota: "Rota",
  tabula: "Tabula",
  gloria: "Gloria",
  events: "Eventa",
  settings: "Systema",
  mundus: "Mundus",
  personae: "Personae",
};

export function getSkillLabel(skillId: string): string {
  return skillLabels[skillId] || skillId.replaceAll("_", " ");
}

export function getLocationLabel(locationId?: string): string {
  if (!locationId) {
    return "Locus";
  }
  return locationLabels[locationId] || locationId.replaceAll("_", " ");
}

export function getSpeakerLabel(speakerId: string): string {
  return speakerLabels[speakerId] || speakerId;
}

export function getPanelTabLabel(tab: RightPanelTab): string {
  return tabLabels[tab];
}

export function getEventLabel(event: GameEvent): string {
  if (event.type === "PLACEMENT_STARTED") return "Yerleştirme testi başladı.";
  if (event.type === "PLACEMENT_COMPLETED") return "Yerleştirme testi tamamlandı.";
  if (event.type === "CHALLENGE_COMPLETED") return "Challenge tamamlandı.";
  if (event.type === "LEARNING_PATH_UPDATED") return "Öğrenme rotası güncellendi.";
  if (event.type === "ACHIEVEMENT_UNLOCKED") return "Başarım açıldı.";
  if (event.type === "LLM_ERROR") {
    return "LLM responsum defuit; fallback pergitur.";
  }
  if (event.type === "TEXT_EVALUATED") {
    return "Responsum aestimatum.";
  }
  if (event.type === "NARRATION_GENERATED") {
    return "Narratio renovata.";
  }
  if (event.type === "HINT_REQUESTED") {
    return "Auxilium petitum.";
  }
  if (event.type === "action.choice_selected") {
    return "Via electa.";
  }
  if (event.type === "scene.entered") {
    return "Scaena ingressa.";
  }
  if (event.type === "game.created") {
    return "Ludus coepit.";
  }
  if (event.type.includes("COMPLETE_QUEST")) {
    return "Opus perfectum.";
  }
  if (event.type.includes("ADD_XP")) {
    const effect = event.payload?.effect;
    if (typeof effect === "object" && effect !== null && "amount" in effect && typeof effect.amount === "number") {
      return `+${effect.amount} puncta.`;
    }
  }
  return event.type.replaceAll("_", " ").replaceAll(".", " ");
}
