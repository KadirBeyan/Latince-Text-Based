import type { LlmProviderConfig } from "../../llm/LlmTypes";
import { createLlmClient } from "../../llm/LlmProviderFactory";
import { safeJsonParse } from "../../llm/JsonRepair";
import type { DynamicWorldNarration, JournalEntryDraft, VillageRumor, WorldContextPack } from "./WorldPresenceTypes";
import { WorldPresenceGuard } from "./WorldPresenceGuard";
import { WorldPresenceTemplateFallback } from "./WorldPresenceTemplateFallback";
export class DynamicWorldNarrator {
  constructor(private readonly guard = new WorldPresenceGuard(), private readonly fallback = new WorldPresenceTemplateFallback()) {}
  narrateLocationEnter(p:{context:WorldContextPack;llmConfig?:LlmProviderConfig}){return this.narrate(p.context,p.llmConfig);}
  narrateNpcMoodIntro(p:{context:WorldContextPack;npcId:string;llmConfig?:LlmProviderConfig}){return this.narrate(p.context,p.llmConfig);}
  narrateObjectInspection(p:{context:WorldContextPack;objectId:string;deterministicResultTr:string;llmConfig?:LlmProviderConfig}){return this.narrate(p.context,p.llmConfig,p.deterministicResultTr);}
  narrateRumor(p:{context:WorldContextPack;rumor:VillageRumor;llmConfig?:LlmProviderConfig}){return this.narrate(p.context,p.llmConfig,p.rumor.bodyTr);}
  async narrateJournalEntry({context,rawFactsTr,llmConfig}:{context:WorldContextPack;rawFactsTr:string[];llmConfig?:LlmProviderConfig}):Promise<JournalEntryDraft>{const n=await this.narrate(context,llmConfig,rawFactsTr.join(" "));return {titleTr:`Gün ${context.village.dayNumber}`,bodyTr:n.narrationTr};}
  private async narrate(context:WorldContextPack,llmConfig?:LlmProviderConfig,fact?:string):Promise<DynamicWorldNarration>{if(!llmConfig)return this.fallback.narrate(context,fact);try{const response=await createLlmClient(llmConfig).chat({messages:[{role:"system",content:"Kontrollü bir köy anlatıcısısın. Yalnız JSON dön. Sadece verilen context gerçeklerini kullan. Yeni NPC, eşya, lokasyon, görev, ödül, ilişki veya kalıcı sonuç uydurma. Türkçe, kısa ve atmosferik yaz. NPC Latince satırları en fazla 8 basit kelime olsun. Şema: {\"narrationTr\":\"\",\"npcLines\":[],\"ambientLinesTr\":[],\"suggestedPlayerThoughtTr\":\"\",\"latinNudge\":null}"},{role:"user",content:JSON.stringify({context,fact})}],temperature:.3,responseFormat:"json"});const parsed=safeJsonParse<any>(response.text);const output:DynamicWorldNarration={narrationTr:String(parsed?.narrationTr??""),npcLines:Array.isArray(parsed?.npcLines)?parsed.npcLines:undefined,ambientLinesTr:Array.isArray(parsed?.ambientLinesTr)?parsed.ambientLinesTr:undefined,suggestedPlayerThoughtTr:parsed?.suggestedPlayerThoughtTr,latinNudge:parsed?.latinNudge,generatedBy:"llm"};return this.guard.validate(output,context).ok?output:this.fallback.narrate(context,fact);}catch{return this.fallback.narrate(context,fact);}}
}
