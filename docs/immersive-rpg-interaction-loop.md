# Immersive RPG Interaction Loop (Stage 18)

Stage 18 introduces the **Immersive RPG Interaction Loop** to replace the form-filling "read prompt, type translation, check correct/incorrect" structure. Instead, the player selects a contextual action first. Latin translation is required only when the selected action explicitly demands it.

## Key Design Principles
1. **Action-First Input:** Players choose *how* they want to interact (e.g. Speak, Ask, Inspect, Listen, Wait, Persuade, Remember) before writing any Latin.
2. **Contextual Translation:** Writing Latin acts as the *execution* of a selected RPG action, not as answering a test question.
3. **No Form Terminology:** Prompts like "Latince yaz", "Doğru cevabı gir", "Soru" are replaced with immersive narration (e.g., "Bunu Latince söyle.", "Mercator seni anlamaya çalışıyor.").
4. **Rich Consequences:** Results of actions are presented as narrative feedback ("Magister bunu hatırlayacak", "Güven +2") rather than plain score values.

---

## Data Models

### 1. Interaction Intent (`InteractionIntent`)
Represents an action the player can choose. Defined as part of `SceneInteractionModel`.
```typescript
type InteractionIntent = {
  id: string;
  labelTr: string;
  descriptionTr?: string;
  verb: InteractionVerb;
  tone?: InteractionTone;
  requiresLatin: boolean;
  speakerNpcId?: string;
  targetNpcId?: string;
  targetMeaningTr?: string;
  playerIntentTr?: string;
  canonicalAnswers?: string[];
  acceptedVariants?: string[];
  rejectedMeanings?: { meaningTr: string; exampleLatin?: string; reasonTr: string }[];
  conditions?: Condition[];
  effects?: Effect[];
  successNextSceneId?: string;
  failureNextSceneId?: string;
  nextSceneId?: string;
  previewConsequenceTr?: string;
  hiddenConsequence?: boolean;
  failureBehavior?: "retry" | "branch" | "soft-fail" | "continue";
  responseReactions?: {
    correct?: DialogueReaction;
    equivalentCorrect?: DialogueReaction;
    acceptableVariant?: DialogueReaction;
    nearMiss?: DialogueReaction;
    wrong?: DialogueReaction;
    contextWrong?: DialogueReaction;
  };
  resolution?: InteractionResolution;
  failureBranches?: FailureBranch[];
};
```

### 2. Scene Interaction Model (`SceneInteractionModel`)
Used to declare that a scene operates in interaction-loop mode.
```typescript
type SceneInteractionModel = {
  mode: "interaction-loop";
  openingNarrationTr?: string;
  openingNarrationLatin?: string;
  activeNpcId?: string;
  npcLineLatin?: string;
  npcLineTr?: string;
  intents: InteractionIntent[];
  defaultIntentId?: string;
};
```

### 3. Dialogue Sequence (`DialogueSequence`)
Supports small, multi-turn dialogue trees (2-4 turns).
```typescript
type DialogueSequence = {
  id: string;
  activeTurnIndex?: number;
  turns: DialogueSequenceTurn[];
  completionEffects?: Effect[];
  completionNextSceneId?: string;
};
```

---

## Engine Action & State Updates

### `INTENT_SELECT` Action
When a player clicks an action intent:
1. Engine validates the intent and checks entry `conditions` using `RuleEngine`.
2. If `requiresLatin: false`:
   - Immediately apply intent `effects`.
   - Update `resolvedIntentIds`.
   - Transition to `nextSceneId` if defined.
   - Emit `INTENT_RESOLVED` event and write resolution narration/NPC lines to the dialogue log.
3. If `requiresLatin: true`:
   - Set `selectedIntentId` in `activeInteraction` state.
   - Client displays the Latin response composer.

### `TEXT_SUBMIT` Action with Selected Intent
When the player submits Latin text:
1. Semantic judge compares input against `canonicalAnswers` and `acceptedVariants`.
2. If correct:
   - Apply success effects.
   - Transition to success path or next turn.
3. If incorrect:
   - Match verdict against `FailureBranch` (near miss, context wrong, meaning wrong vb.).
   - Process retry loops or branch transitions accordingly.
