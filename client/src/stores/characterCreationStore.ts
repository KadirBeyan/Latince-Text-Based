import { createContext, createElement, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { EMPTY_SKILL_ALLOCATIONS, ORIGINS, type CharacterCreationPayload, type CharacterOrigin, type CharacterTrait, type RpgSkillId } from "../types/characterTypes";

type StepId = "name" | "origin" | "skills" | "traits" | "summary";

type CharacterCreationContextValue = {
  step: StepId;
  stepIndex: number;
  name: string;
  origin: CharacterOrigin;
  traits: CharacterTrait[];
  skillAllocations: Record<RpgSkillId, number>;
  pointsSpent: number;
  pointsRemaining: number;
  setName: (name: string) => void;
  setOrigin: (origin: CharacterOrigin) => void;
  toggleTrait: (trait: CharacterTrait) => void;
  adjustSkill: (skill: RpgSkillId, delta: 1 | -1) => void;
  goNext: () => void;
  goBack: () => void;
  canContinue: boolean;
  buildPayload: () => CharacterCreationPayload;
};

const STEPS: StepId[] = ["name", "origin", "skills", "traits", "summary"];
const CharacterCreationContext = createContext<CharacterCreationContextValue | null>(null);

export function CharacterCreationProvider({ children }: { children: ReactNode }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [name, setName] = useState("");
  const [origin, setOriginState] = useState<CharacterOrigin>("rural_family");
  const [traits, setTraits] = useState<CharacterTrait[]>([]);
  const [skillAllocations, setSkillAllocations] = useState<Record<RpgSkillId, number>>({ ...EMPTY_SKILL_ALLOCATIONS });

  const pointsSpent = Object.values(skillAllocations).reduce((sum, value) => sum + value, 0);
  const pointsRemaining = 6 - pointsSpent;

  const setOrigin = useCallback((nextOrigin: CharacterOrigin) => {
    if (ORIGINS.some((candidate) => candidate.id === nextOrigin)) setOriginState(nextOrigin);
  }, []);

  const toggleTrait = useCallback((trait: CharacterTrait) => {
    setTraits((current) => current.includes(trait) ? current.filter((item) => item !== trait) : current.length < 2 ? [...current, trait] : current);
  }, []);

  const adjustSkill = useCallback((skill: RpgSkillId, delta: 1 | -1) => {
    setSkillAllocations((current) => {
      const nextValue = Math.max(0, Math.min(3, current[skill] + delta));
      const next = { ...current, [skill]: nextValue };
      const nextSpent = Object.values(next).reduce((sum, value) => sum + value, 0);
      return nextSpent <= 6 ? next : current;
    });
  }, []);

  const canContinue = [
    name.trim().length > 0,
    Boolean(origin),
    pointsSpent === 6,
    traits.length === 2,
    true
  ][stepIndex];

  const goNext = useCallback(() => setStepIndex((current) => Math.min(STEPS.length - 1, current + 1)), []);
  const goBack = useCallback(() => setStepIndex((current) => Math.max(0, current - 1)), []);
  const buildPayload = useCallback(() => ({ name: name.trim(), origin, traits, skillAllocations, campaignId: "via-prima" }), [name, origin, traits, skillAllocations]);

  const value = useMemo(() => ({
    step: STEPS[stepIndex], stepIndex, name, origin, traits, skillAllocations, pointsSpent, pointsRemaining,
    setName, setOrigin, toggleTrait, adjustSkill, goNext, goBack, canContinue, buildPayload
  }), [adjustSkill, buildPayload, canContinue, goBack, goNext, name, origin, pointsRemaining, pointsSpent, setOrigin, skillAllocations, stepIndex, toggleTrait, traits]);

  return createElement(CharacterCreationContext.Provider, { value }, children);
}

export function useCharacterCreationStore() {
  const ctx = useContext(CharacterCreationContext);
  if (!ctx) throw new Error("useCharacterCreationStore must be used within CharacterCreationProvider");
  return ctx;
}
