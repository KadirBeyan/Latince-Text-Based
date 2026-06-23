import type { PlayerSave } from "../types/gameTypes"; import { migrateSave } from "./migrations/migrateSave";
interface SaveEnvelope { version: number; save: unknown; }
export type DeserializeResult = { ok: true; save: PlayerSave } | { ok: false; error: string };
export class SaveSerializer {
  serialize(save: PlayerSave): string { return JSON.stringify({ version: 2, save }); }
  deserialize(raw: string): DeserializeResult { try { const parsed=JSON.parse(raw) as SaveEnvelope|unknown; const candidate=typeof parsed==="object"&&parsed!==null&&"save" in parsed?(parsed as SaveEnvelope).save:parsed; return {ok:true,save:migrateSave(candidate)}; } catch(error){return {ok:false,error:error instanceof Error?error.message:"Unknown save parse error."};} }
}
