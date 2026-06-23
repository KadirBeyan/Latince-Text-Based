import type { NextFunction, Request, Response, Router } from "express";
import { Router as createRouter } from "express";
import type { ContentLoader } from "../game/content/ContentLoader";
import type { GameEngine } from "../game/core/GameEngine";
import { startPlacementTest, submitPlacementAnswer, completePlacementTest } from "../assessment/PlacementTestSystem";
import { buildDiagnosticProfile, getWeaknessReport } from "../assessment/DiagnosticSystem";
import { refreshLearningPath } from "../assessment/LearningPathSystem";
import { startChallenge, submitChallengeAnswer, completeChallenge, type ChallengeType } from "../assessment/ChallengeModeSystem";
import { buildAnalyticsSummary, createAnalyticsSnapshot, getErrorHeatmap, getMasteryHeatmap, getProgressTrend } from "../assessment/AnalyticsSystem";
import { evaluateAchievements, getAchievements } from "../assessment/AchievementSystem";

type RouteHandler = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;
type Range = "session" | "daily" | "weekly" | "all-time";

export function createAssessmentRoutes(gameEngine: GameEngine, contentLoader: ContentLoader): Router {
  const router = createRouter();
  const asyncHandler = (handler: RouteHandler): RouteHandler => (req, res, next) => { Promise.resolve(handler(req, res, next)).catch((error: unknown) => { const message = error instanceof Error ? error.message : String(error); if (message.includes("was not found")) { res.status(404).json({ error: message }); return; } res.status(400).json({ error: message }); }); };
  const update = (saveId: string, action: string, mutate: Parameters<GameEngine["debugUpdate"]>[2]) => gameEngine.debugUpdate(saveId, action, mutate);

  router.post("/api/assessment/placement/start", asyncHandler((req, res) => {
    const { saveId, questionCount } = req.body as { saveId?: string; questionCount?: number }; if (!saveId) return bad(res, "saveId is required.");
    const save = update(saveId, "assessment.placement.start", (current) => startPlacementTest({ save: current, questionCount }).save);
    res.json({ attempt: save.assessmentAttempts.find((attempt) => attempt.type === "placement" && attempt.status === "in-progress"), profile: save.assessmentProfile });
  }));
  router.post("/api/assessment/placement/answer", asyncHandler(async (req, res) => {
    const body = req.body as { saveId?: string; attemptId?: string; questionId?: string; answerText?: string; selectedChoice?: string }; if (!body.saveId || !body.attemptId || !body.questionId) return bad(res, "saveId, attemptId and questionId are required.");
    const current = gameEngine.getRawSave(body.saveId);
    const payload = await submitPlacementAnswer({ save: current, attemptId: body.attemptId, questionId: body.questionId, answerText: body.answerText, selectedChoice: body.selectedChoice, contentLoader });
    const save = update(body.saveId, "assessment.placement.answer", () => payload.save);
    res.json({ answer: payload.answer, attempt: payload.attempt, profile: save.assessmentProfile });
  }));

  router.post("/api/assessment/placement/complete", asyncHandler((req, res) => {
    const { saveId, attemptId } = req.body as { saveId?: string; attemptId?: string }; if (!saveId || !attemptId) return bad(res, "saveId and attemptId are required.");
    let result: ReturnType<typeof completePlacementTest>["result"] | undefined;
    let save = update(saveId, "assessment.placement.complete", (current) => { const completed = completePlacementTest({ save: current, attemptId }); result = completed.result; return evaluateAchievements(completed.save); });
    res.json({ result, profile: save.assessmentProfile, achievements: save.achievements });
  }));

  router.get("/api/assessment/profile/:saveId", asyncHandler((req, res) => { const save = evaluateAchievements(gameEngine.getRawSave(String(req.params.saveId))); res.json({ profile: save.assessmentProfile ?? buildDiagnosticProfile(save) }); }));
  router.get("/api/assessment/diagnostic/:saveId", asyncHandler((req, res) => { const save = gameEngine.getRawSave(String(req.params.saveId)); res.json({ profile: buildDiagnosticProfile(save), weaknessReport: getWeaknessReport(save) }); }));
  router.post("/api/assessment/learning-path/refresh", asyncHandler((req, res) => { const { saveId } = req.body as { saveId?: string }; if (!saveId) return bad(res, "saveId is required."); const save = update(saveId, "assessment.learningPath.refresh", (current) => refreshLearningPath({ save: current, contentLoader })); res.json({ learningPath: save.learningPath }); }));
  router.get("/api/assessment/learning-path/:saveId", asyncHandler((req, res) => { res.json({ learningPath: gameEngine.getRawSave(String(req.params.saveId)).learningPath }); }));

  router.post("/api/assessment/challenge/start", asyncHandler((req, res) => { const body = req.body as { saveId?: string; type?: ChallengeType; grammarIds?: string[]; vocabularyIds?: string[]; questionCount?: number }; if (!body.saveId || !body.type) return bad(res, "saveId and type are required."); const save = update(body.saveId, "assessment.challenge.start", (current) => startChallenge({ save: current, type: body.type!, grammarIds: body.grammarIds, vocabularyIds: body.vocabularyIds, questionCount: body.questionCount }).save); res.json({ attempt: save.assessmentAttempts.at(-1) }); }));
  router.post("/api/assessment/challenge/answer", asyncHandler(async (req, res) => { const body = req.body as { saveId?: string; attemptId?: string; questionId?: string; answerText?: string; selectedChoice?: string }; if (!body.saveId || !body.attemptId || !body.questionId) return bad(res, "saveId, attemptId and questionId are required."); const current = gameEngine.getRawSave(body.saveId); const payload = await submitChallengeAnswer({ save: current, attemptId: body.attemptId, questionId: body.questionId, answerText: body.answerText, selectedChoice: body.selectedChoice, contentLoader }); const save = update(body.saveId, "assessment.challenge.answer", () => payload.save); res.json({ answer: payload.answer, attempt: payload.attempt, profile: save.assessmentProfile }); }));
  router.post("/api/assessment/challenge/complete", asyncHandler((req, res) => { const { saveId, attemptId } = req.body as { saveId?: string; attemptId?: string }; if (!saveId || !attemptId) return bad(res, "saveId and attemptId are required."); let result: ReturnType<typeof completeChallenge>["result"] | undefined; const save = update(saveId, "assessment.challenge.complete", (current) => { const completed = completeChallenge({ save: current, attemptId, contentLoader }); result = completed.result; return evaluateAchievements(completed.save); }); res.json({ result, achievements: save.achievements }); }));

  router.get("/api/assessment/analytics/:saveId", asyncHandler((req, res) => { const range = parseRange(String(req.query.range ?? "all-time")); const save = gameEngine.getRawSave(String(req.params.saveId)); res.json({ summary: buildAnalyticsSummary({ save, range }), progressTrend: getProgressTrend({ save }), errorHeatmap: getErrorHeatmap(save), masteryHeatmap: getMasteryHeatmap(save) }); }));
  router.post("/api/assessment/analytics/snapshot", asyncHandler((req, res) => { const { saveId, range } = req.body as { saveId?: string; range?: Range }; if (!saveId) return bad(res, "saveId is required."); const save = update(saveId, "assessment.analytics.snapshot", (current) => createAnalyticsSnapshot({ save: current, range: parseRange(range ?? "all-time") })); res.json({ snapshots: save.analyticsSnapshots }); }));
  router.get("/api/assessment/achievements/:saveId", asyncHandler((req, res) => { const save = update(String(req.params.saveId), "assessment.achievements.evaluate", (current) => evaluateAchievements(current)); res.json({ achievements: getAchievements(save) }); }));
  return router;
}
function bad(res: Response, error: string): void { res.status(400).json({ error }); }
function parseRange(value: string): Range { return value === "session" || value === "daily" || value === "weekly" || value === "all-time" ? value : "all-time"; }
