import { randomUUID } from "node:crypto";
import type { GameEvent, PlayerSave } from "../game/types/gameTypes";

export function emitAssessmentEvent(save: PlayerSave, type: string, payload: Record<string, unknown> = {}): PlayerSave {
  const event: GameEvent = { id: randomUUID(), type, timestamp: new Date().toISOString(), payload };
  return { ...save, updatedAt: event.timestamp, eventLog: [...save.eventLog, event].slice(-250) };
}
export function replaceAttempt(save: PlayerSave, attempt: PlayerSave["assessmentAttempts"][number]): PlayerSave {
  return { ...save, assessmentAttempts: [...save.assessmentAttempts.filter((item) => item.id !== attempt.id), attempt] };
}
export function requireAttempt(save: PlayerSave, attemptId: string): PlayerSave["assessmentAttempts"][number] {
  const attempt = save.assessmentAttempts.find((item) => item.id === attemptId);
  if (!attempt) throw new Error("Invalid attemptId.");
  return attempt;
}

