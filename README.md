# Via Prima

Via Prima is a dialogue-first Latin learning RPG. It combines a deterministic text-based game engine, Turkish learning feedback, optional local or OpenAI-compatible LLM assistance, an in-app authoring studio, and a Tauri desktop shell.

The player explores a modular Roman world, talks to NPCs, answers Latin challenges, builds mastery, unlocks locations, earns rewards, and progresses through the `via-prima` campaign. Core game state changes are always owned by the backend engine, so LLM output can help with evaluation and narration without becoming the arbiter of saves, XP, quest completion, or scene transitions.

## Highlights

- Dialogue-first gameplay with NPC responses, retry handling, semantic Latin evaluation, and deterministic fallbacks.
- Modular campaign content under `data/`, including chapters, quests, scenes, NPCs, locations, items, skills, grammar, vocabulary, assessment data, and quest templates.
- Latin intelligence layer for normalization, morphology, grammar hints, difficulty scoring, lexical search, vocabulary planning, and imported frequency dictionary data.
- Optional LLM integrations for semantic judging, narration, hints, model discovery, generated quests, and authoring drafts.
- Authoring Studio for editing and validating campaign content, previewing scenes, inspecting diffs, managing content overrides, and drafting JSON safely.
- Visual Scene Graph editor with reachability, broken-link, dead-end, cycle, and completion-path checks.
- Assessment systems for placement, analytics, learning paths, achievements, mastery tracking, and challenge modes.
- Local desktop packaging with Tauri 2, AppData-aware saves, backups, cache tools, and content overrides.
- QA tooling for type checks, tests, content validation, save integrity, smoke tests, Playwright flows, and beta reports.

## Stage 22: Freeform Latin Roleplay

Vicus conversations now accept Turkish action descriptions and direct Latin utterances. Speech intent opens an in-world Latin expression prompt, semantic evaluation supports retrying with progressive hints, and NPC/world feedback remains separate from deterministic effects. See [docs/freeform-latin-roleplay-core.md](docs/freeform-latin-roleplay-core.md).

## Tech Stack

- **Frontend:** React 18, Vite, TypeScript, React Flow, Phosphor Icons
- **Backend:** Node.js, Express, TypeScript, SQLite via `better-sqlite3`
- **Desktop:** Tauri 2 and Rust
- **Testing:** Node test runner, Playwright, custom QA/content/save scripts
- **Content:** JSON files in `data/`, validated by backend services

## Requirements

- Node.js 22 or newer is recommended.
- npm
- Rust toolchain for desktop/Tauri commands.
- Tauri platform prerequisites for your operating system.
- Optional: Ollama, LM Studio, OpenAI, or another OpenAI-compatible endpoint for LLM features.

## Quick Start

Install dependencies:

```bash
npm install
npm --prefix client install
```

Run the backend:

```bash
npm run dev
```

Run the web client in another terminal:

```bash
npm run client:dev
```

Open the Vite URL shown in the terminal. The client defaults to `http://localhost:3001` for the API.

## Desktop App

Run the Tauri desktop app:

```bash
npm run desktop:dev
```

Build the desktop bundle:

```bash
npm run desktop:build
```

Useful desktop checks:

```bash
npm run desktop:check
npm run desktop:clean
```

The desktop product name is **Via Prima**. Tauri starts the backend and client during development, then bundles the built server, frontend, data files, package metadata, and dependencies for desktop builds.

## Scripts

```bash
npm run dev               # Start backend with tsx watch
npm run server:dev        # Same as dev
npm run client:dev        # Start Vite client
npm run build             # Build server and client
npm run server:build      # Compile backend TypeScript
npm run client:build      # Build frontend
npm run typecheck         # Backend TypeScript check
npm test                  # Backend/unit tests
npm run test:e2e          # Playwright end-to-end tests
npm run test:smoke        # Backend smoke/performance probe
npm run qa:check          # Typecheck, content, saves, backend smoke
npm run validate:content  # Validate content and graph references
npm run check:saves       # Save migration and integrity summary
npm run beta:report       # Generate beta readiness report
```

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

## Project Structure

```text
client/              React/Vite app
server/              Express backend, game engine, systems, routes, tests
src-tauri/           Tauri desktop shell
data/                Campaign, Latin, assessment, NPC, location, quest data
docs/                Design notes, feature docs, QA guides, generated reports
e2e/                 Playwright specs
scripts/             QA, validation, import, reporting, and migration helpers
shared/              Shared TypeScript game types
```

## Runtime Architecture

The backend is the source of truth for rules and persistence. The frontend sends actions and renders returned state; it does not grant rewards, complete quests, validate game transitions, or decide Latin correctness on its own.

Important backend areas:

- `server/src/game/core/` - Game engine, rule execution, effects, event bus, state service.
- `server/src/game/systems/` - quests, scenes, mastery, inventory, progression, review, dialogue, NPC memory, generated content, world events, and location state.
- `server/src/latin/` - Latin normalization, tokenization, morphology, semantic evaluation, feedback, exercise generation, and grammar gating.
- `server/src/lexicon/` - lexical index, frequency dictionary import, search, difficulty, priority, and stats services.
- `server/src/authoring/` - authoring content services, validation, preview sessions, draft generation, IDs, and graph tooling.
- `server/src/system/` - settings, logging, cache, backups, request metrics, and save integrity.

## API Overview

Core routes are mounted by the Express server:

- `/api/game` - new games, state, saves, actions, narration, hints, generated quests.
- `/api/latin` - Latin analysis and learning helpers.
- `/api/llm` - provider testing, model discovery, and LLM settings workflows.
- `/api/assessment` - placement, scoring, achievements, analytics, and learning paths.
- `/api/lexicon` - lexical search, stats, import, and vocabulary planning.
- `/api/authoring` - content tree, documents, validation, preview, graph, drafts, overrides.
- `/api/system` - info, settings, backups, cache, save integrity, smoke, performance.
- `/api/debug` - development/debug tools.

Example action request:

```json
{
  "saveId": "SAVE_ID",
  "action": {
    "type": "CHOICE_SELECT",
    "choiceId": "enter_ludus"
  }
}
```

Example Latin response:

```json
{
  "saveId": "SAVE_ID",
  "action": {
    "type": "TEXT_SUBMIT",
    "text": "Salve"
  }
}
```

## LLM Support

LLM features are optional. Supported provider styles include:

- `openai`
- `lmstudio`
- `ollama`
- `custom`

LLMs can help with semantic answer judging, Turkish feedback, hints, narration, dynamic NPC replies, generated quest suggestions, and authoring drafts. If the provider is missing, offline, invalid, or returns unsafe output, the app falls back to deterministic local behavior.

Example Ollama-style config:

```json
{
  "provider": "ollama",
  "baseUrl": "http://localhost:11434/v1",
  "model": "gemma3:4b",
  "temperature": 0.2
}
```

Example OpenAI-style config:

```json
{
  "provider": "openai",
  "baseUrl": "https://api.openai.com/v1",
  "apiKey": "sk-proj-YOUR_API_KEY",
  "model": "gpt-4o-mini",
  "temperature": 0.2
}
```

## Content Workflow

Primary content lives in `data/`:

- `data/campaigns/` - campaign, chapter, quest, and scene JSON
- `data/npcs/` and `data/npcs.json` - NPC definitions
- `data/locations/` - location definitions
- `data/latin/` - grammar, examples, and vocabulary data
- `data/assessment/` - question bank and achievements
- `data/quest-templates/` - dynamic quest templates
- `data/imported/` - normalized imported lexical resources

Validate content after edits:

```bash
npm run validate:content
```

Authoring Studio can edit content through backend-owned services. In desktop/local modes, writes use AppData content overrides by default instead of mutating packaged data directly. The System panel can list, export, import, reset, and inspect these overrides.

## Documentation

- [Authoring Studio](docs/authoring-studio.md)
- [Visual Scene Graph Editor](docs/visual-scene-graph-editor.md)
- [Dialogue-First RPG Mechanics](docs/dialogue-first-rpg-mechanics.md)
- [Immersive RPG Interaction Loop](docs/immersive-rpg-interaction-loop.md)
- [Cinematic Narrative Layer](docs/cinematic-narrative-layer.md)
- [Lexical Engine](docs/lexical-engine.md)
- [Frequency Dictionary Import](docs/frequency-dictionary-import.md)
- [Content Guide](docs/content-guide.md)
- [Beta QA Checklist](docs/beta-qa-checklist.md)
- [Beta Readiness Report](docs/reports/beta-readiness-report.md)

## Development Notes

- The backend validates loaded content at startup and exits on blocking content errors.
- Save migrations live under `server/src/game/save/migrations/`.
- LLM output is guarded and repaired before use where applicable.
- Generated authoring drafts are previews only; they do not save automatically.
- Runtime QA endpoints include `/api/system/smoke` and `/api/system/performance`.
- Audio/TTS is not part of the current beta scope.

## License

No license has been declared yet.
