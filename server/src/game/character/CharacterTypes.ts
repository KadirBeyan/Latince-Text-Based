import type { CharacterOrigin, CharacterProfile, CharacterTrait, LifePathId, RpgSkillId } from "../types/gameTypes";

export type { CharacterOrigin, CharacterProfile, CharacterTrait, LifePathId, RpgSkillId };

export type CharacterCreationInput = {
  name: string;
  origin: CharacterOrigin;
  traits: CharacterTrait[];
  skillAllocations: Partial<Record<RpgSkillId, number>>;
};

export const RPG_SKILL_IDS: RpgSkillId[] = [
  "lingua",
  "memoria",
  "observatio",
  "urbanitas",
  "auctoritas",
  "mercatura",
  "disciplina",
  "labor",
  "scriptura",
  "pietas"
];

export const CHARACTER_ORIGINS: CharacterOrigin[] = [
  "rural_family",
  "trader_family",
  "veteran_family",
  "temple_family",
  "scribe_family",
  "unknown_origin"
];

export const CHARACTER_TRAITS: CharacterTrait[] = [
  "curious",
  "polite",
  "bold",
  "diligent",
  "observant",
  "practical",
  "pious",
  "restless"
];

export const LIFE_PATH_IDS: LifePathId[] = ["ludus", "castra", "mercatura", "scriptura", "templum", "villa"];

export const EMPTY_RPG_SKILLS: Record<RpgSkillId, number> = RPG_SKILL_IDS.reduce((acc, id) => ({ ...acc, [id]: 0 }), {} as Record<RpgSkillId, number>);
export const EMPTY_LIFE_PATH_HINTS: Record<LifePathId, number> = LIFE_PATH_IDS.reduce((acc, id) => ({ ...acc, [id]: 0 }), {} as Record<LifePathId, number>);

export const ORIGIN_CONFIG: Record<CharacterOrigin, {
  titleTr: string;
  summaryTr: string;
  skillBonuses: Partial<Record<RpgSkillId, number>>;
  pathHints: Partial<Record<LifePathId, number>>;
  knownPeople: string[];
}> = {
  rural_family: {
    titleTr: "Köylü ailesi",
    summaryTr: "Tarlanın, ev işlerinin ve komşu sözünün içinde büyüdün.",
    skillBonuses: { labor: 1, observatio: 1 },
    pathHints: { villa: 2 },
    knownPeople: ["mater", "pater", "amicus"]
  },
  trader_family: {
    titleTr: "Tüccar ailesi",
    summaryTr: "Pazar sesleri, küçük hesaplar ve nazik pazarlıklar sana tanıdık.",
    skillBonuses: { mercatura: 1, urbanitas: 1 },
    pathHints: { mercatura: 2 },
    knownPeople: ["mater", "pater", "mercator_vicus"]
  },
  veteran_family: {
    titleTr: "Emekli asker ailesi",
    summaryTr: "Evde düzen, emir ve dayanıklılık anlatıları eksik olmadı.",
    skillBonuses: { disciplina: 1, auctoritas: 1 },
    pathHints: { castra: 2 },
    knownPeople: ["pater", "veteranus", "amicus"]
  },
  temple_family: {
    titleTr: "Tapınak çevresi",
    summaryTr: "Ritüeller, aile sorumluluğu ve saygılı sözler karakterini şekillendirdi.",
    skillBonuses: { pietas: 1, memoria: 1 },
    pathHints: { templum: 2 },
    knownPeople: ["mater", "sacerdos_vicus", "amicus"]
  },
  scribe_family: {
    titleTr: "Yazıcı ailesi",
    summaryTr: "Tabula, stilus ve harflerin gücü evin gündelik diliydi.",
    skillBonuses: { scriptura: 1, memoria: 1 },
    pathHints: { ludus: 1, scriptura: 1 },
    knownPeople: ["pater", "scriba_vicus", "magister_ruralis"]
  },
  unknown_origin: {
    titleTr: "Belirsiz köken",
    summaryTr: "Kimse seni tek bir yola bağlayamıyor; köy seni yaptıklarınla tanıyacak.",
    skillBonuses: {},
    pathHints: {},
    knownPeople: ["mater", "pater", "amicus"]
  }
};
