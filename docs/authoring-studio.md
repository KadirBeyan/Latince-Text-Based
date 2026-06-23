# Authoring Studio

Authoring Studio is the in-app workspace for Via Prima content production and QA. It edits campaign, chapter, quest, scene, NPC, location, Latin grammar/vocabulary, assessment, and quest-template JSON through backend-owned services.

## Runtime Modes

`RuntimeConfig` exposes:

- `enableAuthoringStudio`
- `enableAuthoringWrites`
- `enableLlmDrafts`

Development and desktop local mode enable the Studio, writes, and draft generation by default. Production web keeps the Studio readable but requires `VIA_PRIMA_ENABLE_AUTHORING_WRITES=1` for writes. Packaged desktop can allow local writes through the same flag behavior. These flags are separate from debug endpoints.

## Content Tree

The Studio groups documents into Campaigns, Chapters, Quests, Scenes, NPCs, Locations, Latin Data, Assessment, and Templates. Quest and scene documents are tracked as fragments inside chapter JSON files, while NPC/location files and array-backed Latin/assessment/template entries are exposed as individual documents.

## Editors

Scene, Quest, Chapter, NPC, Location, and Latin Data editors provide structured fields plus advanced JSON editing. Scene editing now covers identity, location/NPC references, input mode, learning focus, text challenge answers, choices, conditions, effects, and rewards through form-based editors. Raw JSON remains available as a collapsible fallback for unknown or dangerous payloads.

## Form-Based Deep Editors

Stage 14.1 adds reusable editors for effects, conditions, reward bundles, learning focus, text challenges, choices, completion/unlock conditions, NPC memory effects, location flags, and world events. Numeric reward fields clamp to reasonable ranges, high rewards are flagged, known target ids are presented as selects where available, and unknown effect/condition payloads can still be repaired in Advanced JSON.

## Field-Level Validation Focus

Validation issues carry stable field paths such as `textChallenge.expectedAnswers`, `choices.2.nextSceneId`, `effects.3`, and `learningFocus.grammarIds`. Editors wrap important fields with `FieldAnchor`, and clicking a validation issue scrolls, opens the containing section, focuses the first input, and briefly highlights the target field.

## Validation Dashboard

Validation combines existing `ContentValidator`, content quality analysis, Latin grammar gate checks, reference checks, graph reachability, assessment checks, and Latin data shape checks. Scores start at 100 and drop for errors, warnings, and info issues:

- 90-100: strong
- 70-89: usable with warnings
- 0-69: needs QA

## LLM Draft Lab

LLM drafts never save automatically. The backend builds a constrained JSON prompt, receives/sanitizes JSON, applies Latin gate checks, runs Authoring validation, and returns a preview. Results include `generatedBy: "llm" | "fallback"` and an optional `fallbackReason`, so the UI can clearly distinguish real model generation from safe local fallback.

## Preview & Playtest

Preview v2 creates isolated two-hour preview sessions in memory and runs player actions through the real `GameEngine.submitAction` loop. Choices and text challenge submissions execute RuleEngine, EffectRunner, LatinEvaluator, transitions, event logging, mastery, NPC relationship, location, and quest state updates against a preview-only save. The response includes compact recent events and state diff data for XP, currency, flags, quest status, NPC relationship, location flags, and scene transitions.

## AppData Content Overrides

Desktop/local authoring writes default to `appDataDir/content-overrides/` rather than mutating packaged `data/` content. Content resolution order is override first, packaged data second. Broken override JSON is intentionally surfaced as an error instead of silently falling back to defaults. The System panel lists overrides and supports reset/export/import workflows.

## Override Reset, Export, Import

Override management lives in Authoring Studio/System UI and in `/api/authoring/overrides`. Reset deletes the override so packaged defaults are visible again. Export returns a JSON bundle of override files; import writes those files back into AppData override storage.

## Backup And Restore

Every write endpoint can create a backup before writing. Backups live under `data/.authoring-backups/YYYY-MM-DD/` with a hash of the original path. Restore requires write mode and a target path inside allowed content roots.

## Content ID Convention

`ContentIdService` provides Latin-aware slugging and suggestions:

- scenes: `chapter_short_title`
- quests: `chapter_quest_short_title`
- NPCs: `npc_name`
- locations: `location_title`

The service can ensure uniqueness against existing Authoring documents.

## Security Notes

Writes reject path traversal and only target allowed content roots: `data/campaigns`, `data/npcs`, `data/locations`, `data/latin`, `data/quests`, `data/assessment`, and `data/quest-templates`. JSON is parsed before writing, pretty-printed on save, and rejected on validation errors unless a non-production override is explicitly used.
