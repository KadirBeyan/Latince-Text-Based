import type { ContentLoader } from "../game/content/ContentLoader";
import type { LatinEvaluationResult } from "../latin/LatinEvaluator"; import type { HintResult,NpcReplyResult,SceneNarrationResult } from "./LlmTypes";
import type { GeneratedQuest } from "../game/types/gameTypes";
import type { GrammarGateResult } from "../latin/LatinTypes";
import { checkTextAgainstLevel } from "../latin/LatinGrammarGatekeeper";
const text=(v:unknown,fallback:string,max:number)=>typeof v==="string"&&v.trim()?v.trim().slice(0,max):fallback; const arr=(v:unknown)=>Array.isArray(v)?v.filter((x):x is string=>typeof x==="string"):[]; const clamp=(v:unknown,min:number,max:number,f:number)=>typeof v==="number"&&Number.isFinite(v)?Math.min(max,Math.max(min,v)):f;
export type LatinGateContext={contentLoader:ContentLoader;playerLevel:number;allowedGrammarIds:string[];knownVocabularyIds?:string[];maxSentenceLength?:number;source?:"npc-reply"|"narration"|"generated-quest"|"hint"};
export type LatinGateViolationEvent={type:"LLM_LATIN_GATE_VIOLATION";payload:{source:NonNullable<LatinGateContext["source"]>;violations:GrammarGateResult["violations"]}};
export function sanitizeEvaluationResult(result:unknown):LatinEvaluationResult{const r=obj(result);return{isCorrect:typeof r.isCorrect==="boolean"?r.isCorrect:false,score:clamp(r.score,0,100,0),mode:"llm",feedbackTr:text(r.feedbackTr,"Cevabın değerlendirilemedi.",500),correctedLatin:typeof r.correctedLatin==="string"?r.correctedLatin:undefined,errorTags:arr(r.errorTags),grammarNotes:arr(r.grammarNotes),vocabularyNotes:arr(r.vocabularyNotes),confidence:clamp(r.confidence,0,1,.5)};}
export function sanitizeNarrationResult(result:unknown,gate?:LatinGateContext):SceneNarrationResult{const r=obj(result);const npcLineLatin=gateLatinText(text(r.npcLineLatin,"",180),gate,"Salve.");return{narrationTr:text(r.narrationTr,"Anlatım üretilemedi.",1200),npcLineLatin:npcLineLatin||undefined,npcLineTr:text(r.npcLineTr,"",300)||undefined,objectiveReminderTr:text(r.objectiveReminderTr,"Hedefini takip et.",400),worldMoodTr:typeof r.worldMoodTr==="string"&&r.worldMoodTr.trim()?r.worldMoodTr.trim().slice(0,100):undefined};}
export function sanitizeHintResult(result:unknown,gate?:LatinGateContext):HintResult{const r=obj(result);return{hintTr:text(r.hintTr,"İpucu üretilemedi.",400),miniExampleLatin:gateLatinText(typeof r.miniExampleLatin==="string"?r.miniExampleLatin.slice(0,180):"",gate,"Salve.")||undefined,miniExampleTr:typeof r.miniExampleTr==="string"?r.miniExampleTr.slice(0,300):undefined};}
export function sanitizeNpcReplyResult(result:unknown,gate?:LatinGateContext):NpcReplyResult{const r=obj(result);return{npcLineLatin:gateLatinText(text(r.npcLineLatin,"...",180),gate,"Salve, discipule."),npcLineTr:text(r.npcLineTr,"...",300),tone:text(r.tone,"neutral",40),memoryReferenceUsed:typeof r.memoryReferenceUsed==="boolean"?r.memoryReferenceUsed:false};}
function obj(value:unknown):Record<string,unknown>{return typeof value==="object"&&value!==null?value as Record<string,unknown>:{};}
function gateLatinText(value:string,gate:LatinGateContext|undefined,fallback:string):string{if(!gate||!value.trim())return value;try{const result=checkTextAgainstLevel({text:value,contentLoader:gate.contentLoader,playerLevel:gate.playerLevel,allowedGrammarIds:gate.allowedGrammarIds,knownVocabularyIds:gate.knownVocabularyIds,maxSentenceLength:gate.maxSentenceLength});return result.ok?value:(result.safeSuggestion||fallback);}catch{return fallback;}}

export function sanitizeGeneratedQuestDraft(result: unknown, gate?: LatinGateContext): GeneratedQuest | null {
  const r = obj(result);
  const title = text(r.title, "Dinamik Görev", 100);
  const description = text(r.description, "Latince pratik görevi.", 500);

  const rawScenes = Array.isArray(r.scenes) ? r.scenes.slice(0, 6) : [];
  if (rawScenes.length < 2) return null;
  
  const questId = `gen_quest_llm_${Math.random().toString(36).substring(2, 7)}`;
  const idMap = new Map<string, string>();
  
  rawScenes.forEach((sVal: any, idx: number) => {
    const s = obj(sVal);
    const tempId = typeof s.id === "string" ? s.id : `gen_scene_${idx + 1}`;
    const role = typeof s.role === "string" ? s.role : "practice";
    idMap.set(tempId, `gen_scene_${questId}_${role}_${idx + 1}`);
  });

  const scenes = rawScenes.map((sVal: any, idx: number) => {
    const s = obj(sVal);
    const role = text(s.role, "practice", 40) as any;
    const sId = idMap.get(typeof s.id === "string" ? s.id : `gen_scene_${idx + 1}`) || `gen_scene_${questId}_${role}_${idx + 1}`;

    const locationId = text(s.locationId, "forum", 100);
    const npcIds = arr(s.npcIds);
    const sceneDesc = text(s.description, "Gelişme.", 1000);
    const objective = text(s.objective, "Hedefi tamamla.", 400);
    const requestedInputMode = text(s.inputMode, "choice", 20);
    const inputMode: "choice" | "text" = requestedInputMode === "text" ? "text" : "choice";

    const choices: any[] = [];
    if (Array.isArray(s.choices)) {
      s.choices.forEach((cVal: any, cIdx: number) => {
        const c = obj(cVal);
        const rawNext = typeof c.nextSceneId === "string" ? c.nextSceneId : "";
        const nextSceneId = idMap.get(rawNext) || undefined;
        choices.push({
          id: `choice_${sId}_${cIdx}`,
          label: text(c.label, "Devam Et", 100),
          description: text(c.description, "", 200),
          conditions: [],
          effects: [],
          nextSceneId
        });
      });
    }

    let textChallenge: any = null;
    if (s.textChallenge) {
      const tc = obj(s.textChallenge);
      const rawSuccessNext = typeof tc.successNextSceneId === "string" ? tc.successNextSceneId : "";
      const rawFailureNext = typeof tc.failureNextSceneId === "string" ? tc.failureNextSceneId : "";
      const successNextSceneId = idMap.get(rawSuccessNext) || undefined;
      const failureNextSceneId = idMap.get(rawFailureNext) || sId;

      textChallenge = {
        id: `tc_${sId}`,
        prompt: text(tc.prompt, objective, 400),
        expectedAnswers: arr(tc.expectedAnswers).map(a => gateLatinText(a.toLowerCase().trim(), gate, "salve")),
        successEffects: [],
        failureEffects: [],
        successNextSceneId,
        failureNextSceneId
      };
    }

    return {
      id: sId,
      title: text(s.title, role.toUpperCase(), 100),
      locationId,
      npcIds,
      description: sceneDesc,
      objective,
      inputMode,
      choices,
      textChallenge,
      conditions: [],
      effects: [],
      rewards: [],
      onEnterEvents: [
        {
          type: "scene.entered",
          payload: { sceneId: sId }
        }
      ]
    };
  });

  if (scenes.length > 0) {
    const lastScene = scenes[scenes.length - 1];
    if (lastScene.inputMode === "choice") {
      if (lastScene.choices.length === 0) {
        lastScene.choices.push({
          id: `choice_${lastScene.id}_complete`,
          label: "Tamamla",
          description: "",
          conditions: [],
          effects: [{ type: "COMPLETE_QUEST", questId }],
          nextSceneId: undefined
        });
      } else {
        lastScene.choices.forEach((c: any) => {
          if (!c.effects.some((e: any) => e.type === "COMPLETE_QUEST")) {
            c.effects.push({ type: "COMPLETE_QUEST", questId });
          }
        });
      }
    } else if (lastScene.textChallenge) {
      if (!lastScene.textChallenge.successEffects.some((e: any) => e.type === "COMPLETE_QUEST")) {
        lastScene.textChallenge.successEffects.push({ type: "COMPLETE_QUEST", questId });
      }
    }
  }

  return {
    id: questId,
    title,
    description,
    locationId: "forum",
    npcIds: [],
    scenes,
    status: "draft",
    createdAt: new Date().toISOString(),
    validation: { ok: true, errors: [], warnings: [] },
    difficulty: "practice",
    learningFocus: { grammarIds: [], vocabularyIds: [], skillIds: [] },
    reason: "Yapay zeka tarafından üretilen alıştırma görevi."
  };
}
