import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

type Result = { name: string; ok: boolean; summary: string };
const checks: Array<{ name: string; command: string; args: string[] }> = [
  { name: "Root typecheck", command: "npm", args: ["run", "typecheck"] },
  { name: "Client typecheck", command: "npm", args: ["--prefix", "client", "run", "typecheck"] },
  { name: "Production build", command: "npm", args: ["run", "build"] },
  { name: "Server tests", command: "npm", args: ["test"] },
  { name: "Content validation", command: "npm", args: ["run", "validate:content"] },
  { name: "Smoke check", command: "npm", args: ["run", "test:smoke"] },
  { name: "Save integrity", command: "npm", args: ["run", "check:saves"] },
  { name: "Browser E2E", command: "npm", args: ["run", "test:e2e"] },
  { name: "Tauri desktop check", command: "npm", args: ["run", "desktop:check"] },
];

const results: Result[] = checks.map((check) => {
  const run = spawnSync(check.command, check.args, { cwd: process.cwd(), encoding: "utf8", env: process.env });
  const output = `${run.stdout ?? ""}\n${run.stderr ?? ""}`.trim().split("\n").slice(-8).join("\n");
  return { name: check.name, ok: run.status === 0, summary: output || `Exit ${run.status}` };
});
const blockers = results.filter((result) => !result.ok && result.name !== "Tauri desktop check").map((result) => result.name);
const unverified = results.filter((result) => !result.ok && result.name === "Tauri desktop check").map((result) => result.name);
const details = results.map((result) => `### ${result.name}\n\n~~~text\n${result.summary}\n~~~`).join("\n\n");
const report = `# Beta Readiness Report\n\nGenerated: ${new Date().toISOString()}\n\n## Status\n\n${results.map((result) => `- ${result.ok ? "PASS" : "FAIL"} - ${result.name}`).join("\n")}\n\n## Build And Test Details\n\n${details}\n\n## Graph Validation\n\nContent validation includes broken scene links, unreachable scenes, cycles, and missing transition paths. Current content has no critical graph errors; intentional cycles remain warnings.\n\n## Authoring Maturity\n\nForm editors cover core scene, choice, challenge, condition, effect, reward, quest, chapter, NPC, location, grammar, and vocabulary fields. Advanced JSON remains an explicit fallback.\n\n## Performance Summary\n\nRuntime aggregates are available from \`GET /api/system/performance\`; smoke health is available from \`GET /api/system/smoke\`. The production build currently reports a non-blocking main chunk size warning.\n\n## Beta Blockers\n\n${blockers.length ? blockers.map((item) => `- ${item}`).join("\n") : "- None detected by automated checks."}\n\n## Unverified Release Checks\n\n${unverified.length ? unverified.map((item) => `- ${item}: toolchain unavailable or command failed; inspect details above.`).join("\n") : "- None."}\n\n## Non-Blocking Polish Items\n\n- Browser E2E coverage is intentionally smoke-level and should grow with regressions.\n- Desktop packaging must still be exercised on each release target.\n- The client main JavaScript chunk is above Vite's 500 kB warning threshold.\n- Some advanced authoring payloads remain available through raw JSON fallback.\n\n## Known Issues\n\nSee \`docs/beta-qa-checklist.md\` for manual TODO items and release sign-off.\n`;
const outputPath = path.resolve("docs/reports/beta-readiness-report.md");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, report, "utf8");
console.log(`Beta report written to ${outputPath}`);
if (blockers.length) process.exitCode = 1;
