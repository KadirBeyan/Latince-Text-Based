import type { CharacterCreationInput } from "./CharacterTypes";
import { CHARACTER_ORIGINS, CHARACTER_TRAITS, RPG_SKILL_IDS } from "./CharacterTypes";

export class CharacterCreationValidator {
  validate(input: CharacterCreationInput): void {
    const name = input.name?.trim() ?? "";
    if (!name) throw new Error("Karakter adı gerekli.");
    if (name.length > 32) throw new Error("Karakter adı 32 karakterden uzun olamaz.");
    if (!CHARACTER_ORIGINS.includes(input.origin)) throw new Error("Geçersiz köken seçimi.");
    if (!Array.isArray(input.traits) || input.traits.length !== 2) throw new Error("Tam olarak 2 kişilik eğilimi seçmelisin.");
    if (new Set(input.traits).size !== input.traits.length) throw new Error("Aynı eğilim iki kez seçilemez.");
    for (const trait of input.traits) if (!CHARACTER_TRAITS.includes(trait)) throw new Error(`Geçersiz eğilim: ${trait}`);

    let spent = 0;
    for (const [skillId, rawValue] of Object.entries(input.skillAllocations ?? {})) {
      if (!RPG_SKILL_IDS.includes(skillId as any)) throw new Error(`Geçersiz beceri: ${skillId}`);
      const value = Number(rawValue);
      if (!Number.isInteger(value) || value < 0 || value > 3) throw new Error("Beceri puanları 0 ile 3 arasında tam sayı olmalı.");
      spent += value;
    }
    if (spent !== 6) throw new Error("Başlangıçta tam 6 beceri puanı dağıtmalısın.");
  }
}
