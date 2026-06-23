# Cinematic Narrative Layer

Stage 17 adds a presentation-only cinematic layer for Via Prima. It turns backend-owned `eventLog` / `recentEvents` and dialogue evaluations into user-facing narrative moments without changing XP, quest state, rewards, scene transitions, saves, or other game rules.

## NarrativeMoment

`client/src/types/narrativeTypes.ts` defines `NarrativeMoment`. A moment is a UI-friendly event summary with a type, Turkish title/body, optional Latin line, tone, priority, related entity ids, and reward summary.

Moment ids are derived from event ids as `moment:{event.id}`. This lets the cinematic queue dedupe events across renders and avoid replaying old save-load events.

## Event Mapping

`client/src/utils/narrativeMomentMapper.ts` maps backend events to moments:

- `DIALOGUE_RESPONSE_EVALUATED` with `exact_correct`, `equivalent_correct`, or `acceptable_variant` becomes `dialogue-response-correct`.
- `DIALOGUE_RESPONSE_EVALUATED` with `near_miss` becomes `dialogue-response-near-miss`.
- `DIALOGUE_RESPONSE_EVALUATED` with wrong/context/grammar/meaning verdicts becomes `dialogue-response-wrong`.
- `QUEST_STARTED` and `QUEST_COMPLETED` become quest start/complete moments.
- `CHAPTER_STARTED` and `CHAPTER_COMPLETED` become chapter intro/outro moments.
- `LEVEL_UP`, relationship updates, NPC memory, location discovery, world events, dynamic quests, XP/currency/items/skill rewards all become dedicated UI moments.

The mapper only reads `GameEvent` and optional `GameState`; it never mutates game state.

## Queue System

`client/src/stores/cinematicStore.ts` owns the queue, active overlay, history, reduced motion flag, muted flag, and seen moment ids. High and critical moments can become overlays; low and normal moments flow into the timeline/toast surface. The overlay queue is capped at five and timeline history is capped at fifty.

Seen moment ids persist in `localStorage` under `via-prima:seen-cinematic-moment-ids`, so old events do not replay after save load.

## Overlay Types

Components live in `client/src/components/cinematic`:

- `CinematicProvider` listens to game events and preferences.
- `CinematicOverlay` renders the accessible modal shell.
- `ChapterIntroOverlay`, `ChapterCompleteOverlay`, `QuestCompleteOverlay`, `LevelUpOverlay`, `RelationshipMomentOverlay`, and `LocationDiscoveredOverlay` specialize major beats.
- `RewardReveal`, `NarrativeToast`, `MomentTimeline`, `SceneTransition`, `SceneTitlePlate`, `RomanDivider`, `LaurelFrame`, and `ParchmentReveal` provide smaller presentation pieces.

`CinematicOverlay` uses `role="dialog"`, `aria-modal`, Escape dismissal, a focused continue button, and reduced motion support.

## Scene Transitions

`SceneTransition` wraps `GameScreen` content. When the current scene id changes, it shows `SceneTitlePlate` and reveals the scene body with short CSS animations. Reduced motion disables the animations.

`SceneTitlePlate` shows location id as a Latin-style heading, scene title, current objective, chapter badge, mood badge, and grammar/vocabulary focus badges. It does not expose debug metadata.

## Dialogue Polish

Stage 17 keeps dialogue-first mechanics intact and changes presentation:

- `DialogueResponseComposer` now asks the player to answer the NPC rather than solve a generic Latin prompt.
- `DialogueIntentCard` uses intent-oriented copy.
- `SemanticFeedbackCard` has verdict-specific headings, notes, better-answer collapsible content, optional NPC reaction display, and dev-only confidence.

## Quest And Chapter Moments

Quest and chapter completion moments use overlay priority. `RewardReveal` separates XP, currency, items, and mastery targets. Reduced motion renders them as a simple list without delayed animation.

## NPC, Location, And World Moments

Relationship changes, NPC memories, location discoveries, and world events are mapped into narrative moments. The Personae panel presents relationship values and memories as readable cards/timeline items instead of raw memory JSON.

## Preferences

Systema includes cinematic settings:

- Cinematic overlays
- Scene transitions
- Reward animations
- Narrative toasts
- Reduced motion: system / on / off

These are stored through the existing settings store and desktop settings payload.

## Authoring Preview

Authoring Studio includes non-saving cinematic previews in scene, dialogue, quest, and chapter editors. These previews show how title plates, semantic feedback, quest complete, reward reveal, and chapter intro/outro surfaces will feel without changing the draft or save state.

## Accessibility And Motion

The cinematic CSS lives in `client/src/styles/cinematic.css`. Animations stay short and use `prefers-reduced-motion`. Overlays are keyboard dismissible, avoid color-only meaning, and include readable title/body content for assistive technology.
