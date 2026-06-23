import type { ID, PlayerSave } from "../types/gameTypes";

export class SkillSystem {
  unlockSkill(save: PlayerSave, skillId: ID): PlayerSave {
    const existing = save.skills.find((skill) => skill.skillId === skillId);
    if (existing) {
      return { ...save, skills: save.skills.map((skill) => (skill.skillId === skillId ? { ...skill, unlocked: true, level: Math.max(skill.level, 1) } : skill)) };
    }
    return { ...save, skills: [...save.skills, { skillId, level: 1, unlocked: true }] };
  }

  incrementSkill(save: PlayerSave, skillId: ID, amount = 1): PlayerSave {
    const unlocked = this.unlockSkill(save, skillId);
    return { ...unlocked, skills: unlocked.skills.map((skill) => (skill.skillId === skillId ? { ...skill, level: skill.level + amount } : skill)) };
  }

  hasSkill(save: PlayerSave, skillId: ID, minLevel = 1): boolean {
    const skill = save.skills.find((entry) => entry.skillId === skillId);
    return Boolean(skill?.unlocked && skill.level >= minLevel);
  }
}
