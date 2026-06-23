import type { CharacterProfile, PlayerSkill } from "../types/gameTypes";
import type { CharacterCreationInput } from "./CharacterTypes";
import { EMPTY_LIFE_PATH_HINTS, EMPTY_RPG_SKILLS, ORIGIN_CONFIG, RPG_SKILL_IDS } from "./CharacterTypes";

export class StartingProfileService {
  buildProfile(input: CharacterCreationInput, createdAt = new Date().toISOString()): CharacterProfile {
    const origin = ORIGIN_CONFIG[input.origin];
    const skills = { ...EMPTY_RPG_SKILLS };
    for (const skillId of RPG_SKILL_IDS) {
      skills[skillId] = Math.min(3, (input.skillAllocations[skillId] ?? 0) + (origin.skillBonuses[skillId] ?? 0));
    }
    const lifePathHints = { ...EMPTY_LIFE_PATH_HINTS, ...origin.pathHints };
    return {
      name: input.name.trim(),
      displayName: input.name.trim(),
      origin: input.origin,
      traits: [...input.traits],
      skills,
      backgroundSummaryTr: origin.summaryTr,
      createdAt,
      lifePathHints,
      knownPeople: origin.knownPeople,
      homeLocationId: "home_hut",
      currentLifePhase: "village_youth"
    };
  }

  toPlayerSkills(profile: CharacterProfile): PlayerSkill[] {
    return RPG_SKILL_IDS
      .filter((skillId) => profile.skills[skillId] > 0)
      .map((skillId) => ({ skillId, level: profile.skills[skillId], unlocked: true }));
  }
}
