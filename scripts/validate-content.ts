import { ContentLoader } from "../server/src/game/content/ContentLoader";
import { ContentValidator } from "../server/src/game/content/ContentValidator";

const loader = new ContentLoader();
const result = new ContentValidator().validate(loader.load());
console.log(`Content validation: ${result.ok ? "PASS" : "FAIL"}`);
console.log(`Errors: ${result.errors.length}`);
console.log(`Warnings: ${result.warnings.length}`);
for (const issue of [...result.errors, ...result.warnings]) console.log(`[${issue.severity}] ${issue.code} ${issue.path}: ${issue.message}`);
if (!result.ok) process.exitCode = 1;
