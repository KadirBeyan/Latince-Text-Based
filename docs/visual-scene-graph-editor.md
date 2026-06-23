# Visual Scene Graph Editor

Stage 14 adds a Visual Scene Graph Editor to Authoring Studio. It is an authoring and QA tool for reading campaign, chapter, quest, and selected-scene neighborhoods as a node graph. The runtime game engine remains the only authority for rules and scene transitions.

## Node Types

- `chapter-start` and `quest-start` show entry gates.
- `choice-scene`, `text-challenge-scene`, and `hybrid-scene` show regular playable scenes by input mode.
- `review-scene`, `completion-scene`, `dead-end`, and `missing-scene` highlight authoring states and risks.

## Edge Types

Edges are created from `choice.nextSceneId`, scene success/failure paths, text challenge success/failure paths, `GO_TO_SCENE` effects, and chapter/quest starts. Conditioned choices are shown as `condition-locked`; broken targets point to red `missing-scene` nodes.

## Issue Codes

The analyzer reports broken links, unreachable scenes, dead ends, missing success/failure paths, cross-chapter links, cross-quest links, cycles, missing completion paths, invalid conditions, and invalid effect targets.

## Read-Only Mode

The first graph view is read-first: authors can load chapter, quest, or scene-neighborhood graphs, select nodes and edges, inspect incoming/outgoing links, open a scene in the Scene Editor, and refresh layout.

## Safe Edit Mode

Edit mode is gated by `enableAuthoringWrites`. Edge target changes, optional edge deletion, and connected scene creation call write endpoints that create a backup before writing, validate content after writing, and roll back on validation errors.

## LLM Branch Draft Flow

The branch draft endpoint returns sanitized draft scene placeholders and never auto-saves. Applying generated branches remains disabled until an explicit preview, validation, and approval flow is connected.

## Backup And Validation

Graph write endpoints use the authoring file backup service before edits. If validation fails after an edit, the service restores the pre-edit content and returns validation errors to the UI.

## Chapter And Quest Graphs

Use Authoring Studio's Visual Graph tab or the Graph button in the editor header. Chapter graphs show all quest starts and chapter entry gates. Quest graphs focus on one quest and flag missing completion paths.

## Playtest Integration

The inspector exposes a Playtest action placeholder beside scene navigation. The existing Authoring Preview service remains separate and can be wired to start from the selected graph node in the next stage.
