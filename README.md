# Latin RPG

## Stage 16: Dialogue-First RPG Mechanics & Semantic Latin Evaluation

Stage 16 transforms text challenges into dialogue-first interactions where players engage with NPCs, supported by a multi-step semantic evaluation pipeline (exact match, accepted variants, rejected meanings, LLM judge, and similarity fallbacks), retry attempts, NPC dialogue reactions, and a custom frontend Dialogue Stage interface.

Completion update: the modular Via Prima campaign has been migrated from its old text/hybrid challenge scenes to 116 `dialogue-response` scenes, preserving deterministic GameEngine-owned effects and transitions while moving the player-facing interaction into NPC dialogue.

- Documentation: [docs/dialogue-first-rpg-mechanics.md](file:///Users/kadirbeyan/Downloads/Latince%20Text%20Based/docs/dialogue-first-rpg-mechanics.md)

## Stage 15: Beta Readiness & End-to-End QA

Stage 15 adds release-oriented health checks, request performance aggregates, save integrity tooling, Playwright smoke flows, and a repeatable beta report. Audio/TTS is outside this stage.

```bash
npm run qa:check          # typecheck, content, saves, backend smoke
npm run test:e2e          # player, LLM settings, authoring, desktop API flows
npm run test:smoke        # isolated backend smoke/performance probe
npm run validate:content  # content and graph references
npm run check:saves       # migration and integrity summary
npm run beta:report       # docs/reports/beta-readiness-report.md
```

Runtime QA endpoints:

- `GET /api/system/smoke`
- `GET /api/system/performance`

Release sign-off uses `docs/beta-qa-checklist.md`. A beta blocker is any failure that prevents startup, new-game flow, save/load, critical content validation, deterministic play with LLM disabled, Tauri packaging, or isolated Authoring Preview. Spacing defects, advanced raw JSON fallbacks, and minor graph layout issues are non-blocking polish unless they prevent a core workflow.

Recommended release pass:

```bash
npm run typecheck
npm run build
npm test
npm run validate:content
npm run test:smoke
npm run test:e2e
npm run desktop:check
npm run desktop:build
npm run beta:report
```

## Stage 14.1: Authoring Studio Hardening & Preview v2

Authoring Studio now has form-based deep editors for scene learning focus, text challenges, choices, conditions, effects, rewards, and related nested payloads, while keeping collapsible Advanced JSON for escape hatches. Validation issues can focus the exact field path, Playtest Preview v2 runs isolated sessions through the real GameEngine action loop, desktop/local saves write to AppData content overrides by default, and LLM Draft Lab clearly marks real LLM versus safe fallback generation. See `docs/authoring-studio.md`.

## Stage 14: Visual Scene Graph Editor

Authoring Studio now includes a Visual Graph tab for chapter, quest, and scene-neighborhood graphs. It renders scenes as React Flow nodes, shows choice/success/failure/effect links, flags broken links, unreachable scenes, dead ends, cycles, and missing completion paths, and lets authors open selected nodes in the Scene Editor. Safe graph edit endpoints are gated by authoring writes, create backups, validate after changes, and roll back invalid edits. See `docs/visual-scene-graph-editor.md`.

## Stage 11.5: Latin Lexical Intelligence Engine

The app now includes a local/private Latin lexical engine for imported frequency dictionary EPUB data. It extracts lexical entries, normalizes lemmas, builds inflected form indexes, maps frequency to pedagogy levels, scores learning priority, and feeds Latin analysis, difficulty scoring, search, assessment pools, and dynamic vocabulary planning without replacing app-core vocabulary. See `docs/lexical-engine.md` and `docs/frequency-dictionary-import.md`.

A modular Node.js, Express, TypeScript, and SQLite backend for a text-based Latin RPG. This phase intentionally does not include LLM integration. The engine is built around deterministic actions, conditions, effects, events, JSON content, and save files.

## Setup

```bash
npm install
npm run dev
```

The server starts on `http://localhost:3001` by default. Set `PORT` to change it.

## Stage 3: React Frontend

The playable frontend lives in `client/` and talks to the backend through the game API. The frontend does not resolve game rules, grant XP, complete quests, change scenes, unlock skills, or decide Latin correctness. It sends actions and renders the returned `GameState`.

### Frontend

```bash
cd client
npm install
npm run dev
```

Useful frontend scripts:

```bash
npm run dev        # Start Vite dev server
npm run build      # Typecheck and build production assets
npm run preview    # Preview production build
npm run typecheck  # Run TypeScript checks
```

Environment example:

```bash
VITE_API_BASE=http://localhost:3001
```

The frontend defaults to `http://localhost:3001`, matching the backend default.

### Backend

This repo currently keeps the backend package at the repository root:

```bash
npm install
npm run dev
```

Set `PORT` only when you need a different local backend port.

### Usage

1. Start the backend.
2. Start the frontend.
3. Create a new game.
4. Choose an option.
5. Submit a Latin answer.
6. Toggle LLM settings when needed.
7. Test hint and narration generation.

## Scripts

```bash
npm run dev        # Start the backend with tsx watch
npm run build      # Build server TypeScript and client Vite assets
npm run typecheck  # Run strict TypeScript checks without emitting files
npm test           # Run server tests
```

## API

- `POST /api/game/new` with `{ "playerName": "Kadir", "campaignId": "via-prima" }`
- `GET /api/game/state/:saveId`
- `POST /api/game/action` with `{ "saveId": "...", "action": { "type": "CHOICE_SELECT", "choiceId": "enter_ludus" } }`
- `POST /api/game/reset` with `{ "saveId": "..." }`
- `GET /api/game/saves`
- `GET /api/content/validate`
- `GET /api/content/campaigns`
- `GET /api/health`
- `GET /api/system/info`
- `GET /api/settings`
- `POST /api/system/backup/create`
- `GET /api/system/integrity/saves`
- `GET /api/system/cache/stats`

## Example Actions

Choose an option:

```json
{
  "saveId": "SAVE_ID",
  "action": {
    "type": "CHOICE_SELECT",
    "choiceId": "enter_ludus"
  }
}
```

Submit text for a challenge:

```json
{
  "saveId": "SAVE_ID",
  "action": {
    "type": "TEXT_SUBMIT",
    "text": "Salve"
  }
}
```

Request a deterministic hint event:

```json
{
  "saveId": "SAVE_ID",
  "action": {
    "type": "REQUEST_HINT"
  }
}
```

## Content Model

Content is loaded from `data/`:

- `data/campaigns/*.json` contains campaigns, chapters, quests, scenes, choices, text challenges, conditions, and effects.
- `data/npcs.json` defines NPC references used by scenes.
- `data/items.json` defines item references used by inventory effects and conditions.
- `data/skills.json` defines skill references used by skill effects and conditions.

To add content, create or edit JSON files and run `GET /api/content/validate` or restart the server. Validation checks missing start chapters, start quests, start scenes, broken `nextSceneId` links, and unknown `itemId`, `skillId`, `questId`, `sceneId`, or `npcId` references.

## Stage 2: Latin Evaluation & LLM-Assisted Narration Layer

In this phase, we have introduced a Latin evaluation and LLM-assisted narration layer on top of our existing action-condition-effect-event game engine.

> [!IMPORTANT]
> **LLM as a Helper, Not the Arbiter**: The LLM does not modify the save files, grant XP, complete quests, or trigger scene transitions. These remain governed deterministically by `GameEngine`, `SceneSystem`, and `EffectRunner`. The LLM is strictly used for alternative correct answer evaluation, Turkish grammar/vocab feedback generation, dynamic NPC dialogue replies, atmospheric scene narration, and hints.

### Deterministic Fallback Logic
If `llmConfig` is omitted in requests, or if the LLM provider is offline/invalid:
- **Latin Evaluation**: Falls back to exact matching and Levenshtein similarity. If similarity is `>= 0.92`, it is accepted as correct with a minor warning. If between `0.75` and `0.91`, it is treated as a near-miss (incorrect).
- **Narration**: Falls back to the static `scene.description` text.
- **Hints**: Falls back to suggesting the first word of the expected answer.
- **NPC Dialogue**: Falls back to predefined positive or encouraging templates.
- **LLM Error Logging**: When LLM calls fail, the engine records an `LLM_ERROR` event in the save history and safely executes the fallback logic.

### LLM Configurations & Providers

To run actions with LLM support, include an optional `llmConfig` block. Supported providers: `"openai" | "lmstudio" | "ollama" | "custom"`.

#### Ollama Example
```json
{
  "provider": "ollama",
  "baseUrl": "http://localhost:11434/v1",
  "model": "gemma3:4b",
  "temperature": 0.2
}
```

#### LM Studio Example
```json
{
  "provider": "lmstudio",
  "baseUrl": "http://localhost:1234/v1",
  "model": "qwen2.5-7b-instruct",
  "temperature": 0.3
}
```

#### OpenAI Example
```json
{
  "provider": "openai",
  "baseUrl": "https://api.openai.com/v1",
  "apiKey": "sk-proj-YOUR_API_KEY",
  "model": "gpt-4o-mini",
  "temperature": 0.2
}
```

### New API Endpoints

1. **POST `/api/llm/test`**: Test your LLM connection.
   - Request Body: `LlmProviderConfig`
   - Response: `{ "success": true, "message": "OK" }` or error details.

2. **POST `/api/game/narration`**: Generate dynamic, atmospheric scene description.
   - Request Body: `{ "saveId": "...", "llmConfig": { ... } }`
   - Response: Narration object containing `narrationTr`, `npcLineLatin`, `npcLineTr`, `objectiveReminderTr`, and `mode`.

3. **POST `/api/game/hint`**: Retrieve a Turkish hint for the current challenge without giving away the answer.
   - Request Body: `{ "saveId": "...", "llmConfig": { ... } }`
   - Response: Hint object containing `hintTr`, `miniExampleLatin`, `miniExampleTr`.

### Submitting Actions with LLM

Submit player actions with the `llmConfig` block to evaluate Latin text challenge answers dynamically:

```json
{
  "saveId": "SAVE_ID",
  "action": {
    "type": "TEXT_SUBMIT",
    "text": "Salve, mi magister!"
  },
  "llmConfig": {
    "provider": "ollama",
    "baseUrl": "http://localhost:11434/v1",
    "model": "gemma3:4b",
    "temperature": 0.2
  }
}
```
This evaluates the player answer, runs the effects, triggers transitions, logs events (`TEXT_EVALUATED`, `NPC_REPLY_GENERATED`), and adds NPC replies and feedback to the dialogue log.

## Engine Shape

All player input goes through `GameEngine.submitAction(saveId, action)`. The engine loads the save, resolves the current scene, sends the action to the correct system, applies effects through `EffectRunner`, emits events through `EventBus`, persists the save, and returns a frontend-friendly `GameState`.

Text challenges currently use simple normalized exact matching. The architecture leaves room for future LLM evaluation or dynamic narration by adding new challenge evaluators or effect/event producers without replacing the save, content, or route layers.
# Stage 4: Content pipeline

## Content schema

Campaign files live in `data/campaigns`. The engine remains the only runtime authority; the editor only changes JSON content. Scenes can declare `learningFocus` (grammar, vocabulary, skills and difficulty), `pedagogy` (before/after explanations, common mistakes and graduated hints), and `reviewTags`. Text challenges support `acceptedVariants`, `strictness`, and `evaluationMode` in addition to required `expectedAnswers`.

Run `GET /api/content/validate` before shipping content. The validator returns `{ ok, errors, warnings }`, checks curriculum and game references, start ids, next-scene links, graph reachability, cycles, and incomplete challenge paths. Errors block editor saves; cycles and unreachable content are warnings.

## Latin curriculum

Curriculum data is in `data/latin/grammar.json`, `vocabulary.json`, and `examples.json`. Keep ids stable after campaign scenes reference them. A grammar topic needs its titles, level, explanation, examples, and tags. Vocabulary entries use `id`, `latin`, `turkish`, `pos`, `gender`, `declension`, `principalParts`, `level`, `tags`, and `examples`.

The read APIs are:

- `GET /api/content/latin/grammar`
- `GET /api/content/latin/vocabulary`
- `GET /api/content/latin/examples`

## Campaign editor

Run the server and client in development, enter a game, and click **Editor** in the top bar. Select a campaign and edit its scene tree, choices, text challenge, effects, and curriculum focus. Validate before saving. A valid save creates `data/backups/<campaignId>.<timestamp>.json` first. All `/api/editor/*` endpoints return 403 when `NODE_ENV=production`.

## Adaptive review

`ErrorMemorySystem` records Latin evaluator error tags on the save and relates them to the current scene's grammar and vocabulary. Repeated tags become due through `ReviewSystem`; suggestions appear in `GameState.uiHints` and are available from `GET /api/game/review/:saveId`. This stage suggests review but does not generate review scenes automatically.

## Safe LLM scene drafts

The editor can request a scene draft with selected grammar, vocabulary, location, NPCs, difficulty, count, and an enabled LLM configuration. The model is instructed to return JSON only. Responses are safely parsed and validated, returned with validation errors/warnings, and never written automatically. A broken response falls back to an empty draft with a parse error.

## Verification

```bash
npm run typecheck
npm test
cd client && npm run build
```

## Stage 10: Tauri Desktop Packaging

Via Prima now has a Tauri v2 desktop shell in `src-tauri/`. The React/Vite frontend is still in `client/`, and the game engine remains in the Node/Express backend. Tauri is used for the desktop window, local app data helpers, native directory/file picking, reveal/open commands, backend health/startup coordination, and packaging.

### Desktop Commands

```bash
npm run desktop:dev    # Tauri dev shell; starts backend and Vite via beforeDevCommand
npm run desktop:build  # Server build + client build + Tauri package
npm run desktop:check  # TS checks + cargo check
npm run desktop:clean  # Remove generated build outputs
```

macOS prerequisites: Rust/Cargo, Xcode Command Line Tools, Node.js, and npm. `@tauri-apps/cli` is installed as a root dev dependency, so `npm run tauri:dev` and `npm run tauri:build` use the local CLI.

### Local-First Data

The backend resolves app data through `server/src/config/AppPaths.ts`. Override with `VIA_PRIMA_APP_DATA_DIR` when needed.

- macOS: `~/Library/Application Support/ViaPrima`
- Windows: `%APPDATA%/ViaPrima`
- Linux: `~/.local/share/ViaPrima`

The app data directory contains `via-prima.sqlite`, `settings.json`, `backups/`, `logs/`, `cache/`, and `exports/`. `/api/health` and `/api/system/info` expose the resolved paths for the Systema panel.

### Production Runtime Policy

`server/src/config/RuntimeConfig.ts` centralizes runtime mode. In production, debug endpoints and editor write endpoints are disabled unless explicitly re-enabled with environment flags. Error responses avoid raw stack traces in production, and frontend crash reports are accepted at `POST /api/system/client-error`.

### Backup, Restore, Settings, and Integrity

System services live under `server/src/system/`:

- `SettingsService` reads/writes/imports/exports `settings.json`.
- `BackupService` creates full JSON backups, lists them, restores with an automatic safety backup, and supports save/full import-export endpoints.
- `SaveIntegrityService` checks save parseability, scene/quest references, generated quest consistency, and oversized logs.
- `CacheService` provides simple TTL cache stats and clear support.

The frontend Systema tab includes desktop info, LLM/model path settings, backup/restore, save integrity, and cache panels. In Tauri, model directory fields can use native folder picking; in web/dev mode the text inputs remain available.

### Sidecar Strategy

Development mode runs the backend as a normal local server on `localhost:3001` and Vite on `localhost:5173`. In desktop runtime, Tauri checks `GET /api/health`; if the backend is not already healthy, it starts `dist/server/src/index.js` with `NODE_ENV=production`, `VIA_PRIMA_DESKTOP=1`, `VIA_PRIMA_APP_DATA_DIR`, and a loopback `PORT`. If port `3001` is occupied by a non-Via Prima process, Tauri chooses an available loopback port and exposes it through the `get_backend_info` command. The frontend resolves the API base at runtime, so it follows that selected port automatically.

The package includes `dist/server`, `data`, root `package.json`, and `node_modules` as Tauri resources so the Node backend can resolve its runtime dependencies. The backend sidecar currently runs through a local `node` executable; set `VIA_PRIMA_BACKEND_CMD`, `VIA_PRIMA_BACKEND_ENTRY`, or `VIA_PRIMA_BACKEND_URL` when testing a different bundled runtime or externally managed backend. Keep the game engine and API authority in the backend.

### Verification

```bash
npm run typecheck
npm run build
npm test
npm --prefix client run typecheck
npm --prefix client run build
cargo check --manifest-path src-tauri/Cargo.toml
```

`cargo check` and `npm run desktop:build` require Rust/Cargo to be installed locally.

# Stage 9: Assessment, Placement & Learning Analytics

Stage 9 adds a backend-owned assessment layer for Latin learning progress. Saves now store placement/challenge attempts, an assessment profile, learning path, achievements, and analytics snapshots under schema version 5. Older v4 saves migrate with empty assessment arrays and optional profile/path fields.

## Backend systems

Assessment code lives in `server/src/assessment`:

- Question bank loading and deterministic placement/challenge set builders.
- Backend scoring for multiple-choice, Latin input, Turkish translation, parse-word, and fill-blank questions. Latin production uses the existing Latin evaluator; final scores and mastery remain deterministic backend values.
- Placement test start/answer/complete flow with profile updates and light mastery seeding that never lowers stronger existing mastery.
- Diagnostic reports from mastery, assessment attempts, error memory, and event history.
- Learning path generation from weak grammar/vocabulary targets, capped at five steps.
- Challenge mode with XP/currency rewards applied through `EffectRunner`.
- Analytics summaries, snapshots, mastery heatmap, error heatmap, and progress trend helpers.
- Achievement evaluation and unlock events.

Assessment content is in `data/assessment/question-bank.json` and `data/assessment/achievements.json`. The question bank currently contains 80 deterministic questions covering greetings, sum/esse, nominative, accusative, first/second declension nouns, present active verbs, imperatives, and basic reading/translation. `GET /api/content/validate` also validates assessment question and achievement content.

## Assessment endpoints

- `POST /api/assessment/placement/start`
- `POST /api/assessment/placement/answer`
- `POST /api/assessment/placement/complete`
- `GET /api/assessment/profile/:saveId`
- `GET /api/assessment/diagnostic/:saveId`
- `POST /api/assessment/learning-path/refresh`
- `GET /api/assessment/learning-path/:saveId`
- `POST /api/assessment/challenge/start`
- `POST /api/assessment/challenge/answer`
- `POST /api/assessment/challenge/complete`
- `GET /api/assessment/analytics/:saveId?range=session|daily|weekly|all-time`
- `POST /api/assessment/analytics/snapshot`
- `GET /api/assessment/achievements/:saveId`

## Frontend

The client adds assessment API/types and assessment components under `client/src/components/assessment`. RightPanel now has `Rota`, `Tabula`, and `Gloria` tabs. The `Lingua` tab includes placement and challenge flows, the TopBar shows the estimated level badge, and the reports button opens `Tabula`.

## Limitations

Placement is heuristic and deterministic in this first version; the A0-B2 labels are approximate Latin learning indicators rather than formal CEFR certification. LLMs can assist Latin explanation/evaluation through the existing evaluator path, but assessment scores, mastery, rewards, and profile updates are calculated by backend systems. Audio/TTS is intentionally untouched in this stage.

## Stage 11 - Via Prima Campaign Expansion

Via Prima now ships as an eight-chapter playable Latin learning campaign: Prologus, Ludus, Domus, Forum, Bibliotheca, Castra, Via Appia, and Capitolium. The expansion adds modular campaign files under `data/campaigns/via-prima/`, NPC/location profiles, A1/A2 grammar packs, chapter vocabulary packs, quest indexes, review templates, assessment questions, achievements, and campaign progress UI.

Content validation can be checked through `GET /api/content/validate` or by loading `ContentLoader` with `ContentValidator` in a test/script. The endpoint also returns `chapterReports` with quest, scene, text challenge, choice, hybrid, error, and warning counts per chapter. The runtime still reads `data/campaigns/via-prima.json` for compatibility, while the loader can also read the modular campaign/chapter structure.

Dynamic quest templates use the Stage 11 categories `chapter-review`, `npc-favor`, `location-rumor`, `grammar-remediation`, and `vocabulary-practice`.

## Stage 13 - Authoring Studio & Content QA

Stage 13 adds an in-app Authoring Studio for sustainable Via Prima content production. The Studio exposes a content tree, structured editors for campaign/chapter/quest/scene/NPC/location/Latin data, a validation dashboard, LLM Draft Lab, JSON diff viewer, backup-aware saves, and preview/playtest-ready scene rendering.

Backend services live under `server/src/authoring` with routes at `/api/authoring/*`. Runtime flags control Studio visibility, write permissions, and LLM draft generation separately from debug endpoints. Write endpoints validate paths, stay inside allowed content roots, create backups before writing, pretty-print JSON, and reject validation errors by default.

Frontend screens live under `client/src/components/authoring`. The TopBar opens the Studio through the `Authoring` button. Audio/TTS remains untouched.

See [docs/authoring-studio.md](docs/authoring-studio.md) for workflow, mode, backup, ID, validation, and safety details.

## Stage 17 - Cinematic Narrative Polish & RPG Atmosphere Layer

Stage 17 adds a frontend-only cinematic presentation layer for Via Prima. Backend-owned events are mapped into `NarrativeMoment` records, queued through a cinematic store, and rendered as accessible overlays, narrative toasts, scene title plates, reward reveals, and a user-friendly Eventa timeline.

The implementation lives under `client/src/components/cinematic`, `client/src/stores/cinematicStore.ts`, `client/src/types/narrativeTypes.ts`, and `client/src/utils/narrativeMomentMapper.ts`. It keeps game rules, XP, quest status, rewards, saves, and scene ownership in the backend.

Systema now includes cinematic preferences for overlays, scene transitions, reward animations, narrative toasts, and reduced motion. Authoring Studio includes non-saving cinematic previews for scene, dialogue, quest, and chapter editing.

See [docs/cinematic-narrative-layer.md](docs/cinematic-narrative-layer.md) for mapping rules, queue behavior, overlay types, accessibility notes, and authoring preview details.

## Stage 18 - Immersive RPG Interaction Loop

Stage 18 introduces the Immersive RPG Interaction Loop. Players select a contextual action intent first (Speak, Ask, Inspect, Listen, Wait, vb.). Latin translation is requested only when the chosen action requires it, replacing the old form-like question-answer loops. It also adds observation actions, consequence presentations, failure branches, and multi-turn linear dialogue sequences.

The implementation includes backend schema updates, engine action/state loop routing in `GameEngine.ts` and `SceneSystem.ts`, authoring validation rules, test-intent/suggestion routes in `authoringRoutes.ts`, migration scripts, and frontend interaction components.

See [docs/immersive-rpg-interaction-loop.md](docs/immersive-rpg-interaction-loop.md) for data models, flow details, and architecture notes.

