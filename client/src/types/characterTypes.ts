import type { CharacterOrigin, CharacterTrait, LifePathId, RpgSkillId } from "./gameTypes";

export type { CharacterOrigin, CharacterTrait, LifePathId, RpgSkillId };

export type CharacterCreationPayload = {
  name: string;
  origin: CharacterOrigin;
  traits: CharacterTrait[];
  skillAllocations: Record<RpgSkillId, number>;
  campaignId?: string;
};

export const RPG_SKILLS: Array<{ id: RpgSkillId; title: string; description: string }> = [
  { id: "lingua", title: "Lingua", description: "Latince konuşma ve ifade becerisi." },
  { id: "memoria", title: "Memoria", description: "Kelimeleri, kalıpları ve önceki olayları hatırlama." },
  { id: "observatio", title: "Observatio", description: "Çevreyi, yazıları, nesneleri ve ipuçlarını fark etme." },
  { id: "urbanitas", title: "Urbanitas", description: "Kibar, sosyal ve uygun konuşma." },
  { id: "auctoritas", title: "Auctoritas", description: "İkna, güçlü ifade ve otorite kurma." },
  { id: "mercatura", title: "Mercatura", description: "Pazarlık, ticaret, fiyat ve alışveriş dili." },
  { id: "disciplina", title: "Disciplina", description: "Askerî düzen, emirleri anlama ve dayanıklılık." },
  { id: "labor", title: "Labor", description: "Köy işi, beden gücü ve gündelik pratik beceri." },
  { id: "scriptura", title: "Scriptura", description: "Okuma-yazma, yazıt ve belge çözme." },
  { id: "pietas", title: "Pietas", description: "Gelenek, ritüel, saygı ve aile sorumluluğu." }
];

export const ORIGINS: Array<{
  id: CharacterOrigin;
  title: string;
  story: string;
  skillBonuses: Partial<Record<RpgSkillId, number>>;
  pathText: string;
}> = [
  { id: "rural_family", title: "Köylü ailesi", story: "Tarlanın, ev işlerinin ve komşu sözünün içinde büyüdün.", skillBonuses: { labor: 1, observatio: 1 }, pathText: "Villa yoluna yakınsın." },
  { id: "trader_family", title: "Tüccar ailesi", story: "Pazar sesleri, küçük hesaplar ve nazik pazarlıklar sana tanıdık.", skillBonuses: { mercatura: 1, urbanitas: 1 }, pathText: "Mercatura kapısı aralık." },
  { id: "veteran_family", title: "Emekli asker ailesi", story: "Evde düzen, emir ve dayanıklılık anlatıları eksik olmadı.", skillBonuses: { disciplina: 1, auctoritas: 1 }, pathText: "Castra seni uzaktan çağırır." },
  { id: "temple_family", title: "Tapınak çevresi", story: "Ritüeller ve saygılı sözler karakterini şekillendirdi.", skillBonuses: { pietas: 1, memoria: 1 }, pathText: "Templum ilgini çeker." },
  { id: "scribe_family", title: "Yazıcı ailesi", story: "Tabula, stilus ve harflerin gücü evin gündelik diliydi.", skillBonuses: { scriptura: 1, memoria: 1 }, pathText: "Ludus ve scriptura sana yakındır." },
  { id: "unknown_origin", title: "Belirsiz köken", story: "Kimse seni tek bir yola bağlayamıyor; köy seni yaptıklarınla tanıyacak.", skillBonuses: {}, pathText: "Yolların hepsi açık." }
];

export const TRAITS: Array<{ id: CharacterTrait; title: string; description: string }> = [
  { id: "curious", title: "Meraklı", description: "Kapalı kapıların ardındaki sözü duymak istersin." },
  { id: "polite", title: "Nazik", description: "Doğru hitap ve ölçülü söz sende doğal durur." },
  { id: "bold", title: "Cesur", description: "Geri çekilmeden konuşmayı bilirsin." },
  { id: "diligent", title: "Çalışkan", description: "Tekrar, sabır ve emek seni taşır." },
  { id: "observant", title: "Dikkatli", description: "Küçük işaretleri başkalarından önce fark edersin." },
  { id: "practical", title: "Pratik", description: "Sözü işe, işi sonuca bağlamayı seversin." },
  { id: "pious", title: "Saygılı", description: "Aile, ritüel ve gelenek sende ağırlık taşır." },
  { id: "restless", title: "Huzursuz", description: "Köy yolunun ötesi aklını kurcalar." }
];

export const EMPTY_SKILL_ALLOCATIONS = RPG_SKILLS.reduce((acc, skill) => ({ ...acc, [skill.id]: 0 }), {} as Record<RpgSkillId, number>);
