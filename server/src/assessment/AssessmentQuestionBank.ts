import fs from "node:fs";
import path from "node:path";
import type { AssessmentLevel, AssessmentQuestion } from "./AssessmentTypes";

let cache: AssessmentQuestion[] | undefined;
const order: AssessmentLevel[] = ["A0", "A1", "A2", "B1", "B2", "unknown"];

export function loadQuestionBank(dataRoot = path.resolve(process.cwd(), "data")): AssessmentQuestion[] {
  if (!cache) {
    const filePath = path.join(dataRoot, "assessment", "question-bank.json");
    cache = JSON.parse(fs.readFileSync(filePath, "utf8")) as AssessmentQuestion[];
  }
  return cache;
}
export function getQuestionsByLevel(level: Exclude<AssessmentLevel, "unknown">): AssessmentQuestion[] { return loadQuestionBank().filter((question) => question.level === level); }
export function getQuestionsByGrammar(grammarIds: string[]): AssessmentQuestion[] { const wanted = new Set(grammarIds); return loadQuestionBank().filter((question) => question.grammarIds.some((id) => wanted.has(id))); }
export function getQuestionsByVocabulary(vocabularyIds: string[]): AssessmentQuestion[] { const wanted = new Set(vocabularyIds); return loadQuestionBank().filter((question) => question.vocabularyIds.some((id) => wanted.has(id))); }
export function buildPlacementQuestionSet(questionCount = 12): AssessmentQuestion[] {
  const selected: AssessmentQuestion[] = []; const seen = new Set<string>();
  const preferred: Array<Exclude<AssessmentLevel, "unknown">> = ["A0", "A1", "A1", "A1", "A2", "A2", "B1"];
  for (const level of preferred) {
    for (const question of getQuestionsByLevel(level)) { if (!seen.has(question.id)) { selected.push(question); seen.add(question.id); break; } }
    if (selected.length >= questionCount) break;
  }
  for (const question of [...loadQuestionBank()].sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level))) {
    if (selected.length >= questionCount) break;
    if (!seen.has(question.id)) { selected.push(question); seen.add(question.id); }
  }
  return selected;
}
export function buildChallengeQuestionSet(params: { grammarIds?: string[]; vocabularyIds?: string[]; questionCount?: number } = {}): AssessmentQuestion[] {
  const count = Math.max(1, Math.min(20, params.questionCount ?? 5));
  const candidates = params.grammarIds?.length ? getQuestionsByGrammar(params.grammarIds) : params.vocabularyIds?.length ? getQuestionsByVocabulary(params.vocabularyIds) : loadQuestionBank();
  return [...new Map(candidates.map((question) => [question.id, question])).values()].slice(0, count);
}
export function clearQuestionBankCache(): void { cache = undefined; }

