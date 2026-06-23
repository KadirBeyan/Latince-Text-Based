# Beta Readiness Report

Generated: 2026-06-22T15:29:02.634Z

## Status

- PASS - Root typecheck
- PASS - Client typecheck
- PASS - Production build
- PASS - Server tests
- PASS - Content validation
- PASS - Smoke check
- PASS - Save integrity
- PASS - Browser E2E
- FAIL - Tauri desktop check

## Build And Test Details

### Root typecheck

~~~text
> latin-rpg@0.1.0 typecheck
> tsc --noEmit -p tsconfig.json
~~~

### Client typecheck

~~~text
> latin-rpg-client@0.1.0 typecheck
> tsc --noEmit
~~~

### Production build

~~~text
dist/assets/index-CQCneVzS.js                 654.73 kB │ gzip: 184.71 kB
✓ built in 1.57s


(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
~~~

### Server tests

~~~text
ℹ tests 87
ℹ suites 0
ℹ pass 87
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 844.406583
~~~

### Content validation

~~~text
[warning] SCENE_GRAPH_CYCLE quests.capitolium_main_secunda.scenes: Scene graph contains a cycle.
[warning] SCENE_GRAPH_CYCLE quests.capitolium_main_tertia.scenes: Scene graph contains a cycle.
[warning] SCENE_GRAPH_CYCLE quests.capitolium_main_quarta.scenes: Scene graph contains a cycle.
[warning] SCENE_GRAPH_CYCLE quests.capitolium_side_auxilium.scenes: Scene graph contains a cycle.
[warning] SCENE_GRAPH_CYCLE quests.capitolium_side_amicus.scenes: Scene graph contains a cycle.
[warning] SCENE_GRAPH_CYCLE quests.capitolium_side_nota.scenes: Scene graph contains a cycle.
[warning] SCENE_GRAPH_CYCLE quests.capitolium_side_brevis.scenes: Scene graph contains a cycle.
[warning] SCENE_GRAPH_CYCLE quests.capitolium_review_recapitulatio.scenes: Scene graph contains a cycle.
~~~

### Smoke check

~~~text
PASS AppData dirs
PASS Backup dir writable
PASS Cache service
PASS LLM config readable
PASS Model discovery service callable
PASS Authoring write mode - enabled
PASS Override service
Performance endpoint: PASS
~~~

### Save integrity

~~~text
> latin-rpg@0.1.0 check:saves
> tsx scripts/check-saves.ts

Save count: 1
Invalid save count: 0
Migration warnings: 0
Integrity warnings: 0
~~~

### Browser E2E

~~~text
[WebServer] (node:74906) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:74907) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
[WebServer] (node:75086) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
[WebServer] (Use `node --trace-warnings ...` to show where the warning was created)
(node:75088) Warning: The 'NO_COLOR' env is ignored due to the 'FORCE_COLOR' env being set.
(Use `node --trace-warnings ...` to show where the warning was created)
~~~

### Tauri desktop check

~~~text
> tsc --noEmit -p tsconfig.json


> latin-rpg-client@0.1.0 typecheck
> tsc --noEmit


sh: cargo: command not found
~~~

## Graph Validation

Content validation includes broken scene links, unreachable scenes, cycles, and missing transition paths. Current content has no critical graph errors; intentional cycles remain warnings.

## Authoring Maturity

Form editors cover core scene, choice, challenge, condition, effect, reward, quest, chapter, NPC, location, grammar, and vocabulary fields. Advanced JSON remains an explicit fallback.

## Performance Summary

Runtime aggregates are available from `GET /api/system/performance`; smoke health is available from `GET /api/system/smoke`. The production build currently reports a non-blocking main chunk size warning.

## Beta Blockers

- None detected by automated checks.

## Unverified Release Checks

- Tauri desktop check: toolchain unavailable or command failed; inspect details above.

## Non-Blocking Polish Items

- Browser E2E coverage is intentionally smoke-level and should grow with regressions.
- Desktop packaging must still be exercised on each release target.
- The client main JavaScript chunk is above Vite's 500 kB warning threshold.
- Some advanced authoring payloads remain available through raw JSON fallback.

## Known Issues

See `docs/beta-qa-checklist.md` for manual TODO items and release sign-off.
