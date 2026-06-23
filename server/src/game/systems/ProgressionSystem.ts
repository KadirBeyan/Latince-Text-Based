import type { PlayerSave, RewardBundle } from "../types/gameTypes";
import { InventorySystem } from "./InventorySystem"; import { SkillSystem } from "./SkillSystem"; import { MasterySystem } from "./MasterySystem";
export class ProgressionSystem {
  addXp(save: PlayerSave, amount: number): PlayerSave { const xp=Math.max(0,save.xp+amount); return {...save,xp,level:this.calculateLevel(xp)}; }
  calculateLevel(xp: number): number { return Math.floor(Math.max(0,xp)/100)+1; }
  getXpToNextLevel(save: PlayerSave): number { return 100-(save.xp%100); }
  getProgressPercent(save: PlayerSave): number { return save.xp%100; }
  checkLevelUp(save: PlayerSave): PlayerSave { return {...save,level:this.calculateLevel(save.xp)}; }
  updateDailyStreak(save: PlayerSave, now=new Date()): PlayerSave { const today=this.day(now); const last=save.streak.lastActiveDate; if(last===today)return save; let current=1; if(last){const diff=Math.round((Date.parse(today)-Date.parse(last))/86400000); if(diff===1)current=save.streak.current+1;} return {...save,streak:{current,best:Math.max(save.streak.best,current),lastActiveDate:today}}; }
  applyRewardBundle({save,reward}:{save:PlayerSave;reward:RewardBundle;context?:Record<string,unknown>}):PlayerSave { let next=reward.xp?this.addXp(save,reward.xp):save; if(reward.currency)next={...next,currency:Math.max(0,next.currency+reward.currency)}; const inventory=new InventorySystem(); for(const item of reward.items??[])next=inventory.addItem(next,item.itemId,item.quantity); const skills=new SkillSystem(); for(const skill of reward.skillIncrements??[])next=skills.incrementSkill(next,skill.skillId,skill.amount); const mastery=new MasterySystem(); for(const target of reward.masteryTargets??[])next=mastery.updateMastery({save:next,...target,isCorrect:true}); return next; }
  private day(date:Date):string{return date.toISOString().slice(0,10);}
}
