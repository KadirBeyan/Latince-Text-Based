# Stage 22 — Freeform Latin Roleplay Core

Stage 22 makes writing the primary way to inhabit Vicus. The player can describe an action in Turkish, attempt a direct Latin utterance, or choose a prepared action. The backend interprets intent only inside the current scene and conversation node.

## Runtime flow

`FREEFORM_ACTION_SUBMIT` is classified as a bounded action kind and matched to an available option or scene intent. Non-verbal actions may resolve immediately. Speech actions create `pendingFreeformLatin`, which stores the target meaning, matched deterministic option, target NPC, attempt count, and current hint level. `FREEFORM_LATIN_SUBMIT` evaluates the answer with `SemanticLatinEvaluator`; only the existing `ConversationEngine`, `EffectRunner`, and scene systems may apply effects or transitions.

Direct Latin can resolve an option when the match is strong. Ambiguous Latin produces clarification suggestions rather than inventing an outcome. The interpreter validates option IDs, nearby NPC IDs, confidence, and the action-kind allowlist. Optional LLM output is JSON-only and cannot award XP, items, quest state, relationships, transitions, or save mutations.

`FreeformWorldResponseService` creates narration, NPC reaction text, feedback, and consequence presentation without mutating state. Rejections remain diegetic and keep suggested actions visible. Conversation runtime memory keeps the last ten freeform attempts and is discarded with the conversation unless deterministic effects preserve something important.

Hints progress through `nudge`, `vocabulary`, `structure`, and `example`. The first attempt does not reveal a canonical answer; repeated misses gradually expose more support.

The five principal Vicus flows are marked freeform-first and include examples, allowed action kinds, Latin-required kinds, and natural fallback rejection text. Authoring Studio exposes these fields, option aliases, match hints, and an interpretation test panel backed by `/api/authoring/freeform/interpret`. `/api/authoring/freeform/test-latin` evaluates a pending test against its authored option.
