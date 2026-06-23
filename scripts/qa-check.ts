import { spawnSync } from "node:child_process";

const commands: Array<[string, string[]]> = [
  ["npm", ["run", "typecheck"]],
  ["npm", ["--prefix", "client", "run", "typecheck"]],
  ["npm", ["run", "validate:content"]],
  ["npm", ["run", "check:saves"]],
  ["npm", ["run", "test:smoke"]],
];
let failed = false;
for (const [command, args] of commands) {
  console.log(`\n> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, { cwd: process.cwd(), stdio: "inherit", env: process.env });
  if (result.status !== 0) failed = true;
}
process.exitCode = failed ? 1 : 0;
