import fs from "node:fs";
import path from "node:path";

const chaptersDir = path.resolve(process.cwd(), "data", "campaigns", "via-prima", "chapters");
const reportPath = path.resolve(process.cwd(), "docs", "reports", "living-scene-coverage.md");

fs.mkdirSync(path.dirname(reportPath), { recursive: true });

const files = fs.readdirSync(chaptersDir).filter(f => f.endsWith(".json"));

let totalScenes = 0;
let interactionLoopScenes = 0;
let dialogueSequenceScenes = 0;
let revisitVariantScenes = 0;
let ambientTemplateScenes = 0;

let chapterStats: Array<{
  chapterName: string;
  total: number;
  interactionLoop: number;
  dialogueSequence: number;
  revisitVariant: number;
  ambientTemplate: number;
}> = [];

for (const file of files) {
  const chapterPath = path.join(chaptersDir, file);
  const chapter = JSON.parse(fs.readFileSync(chapterPath, "utf8"));
  
  let chTotal = 0;
  let chInteractionLoop = 0;
  let chDialogueSequence = 0;
  let chRevisit = 0;
  let chAmbient = 0;

  for (const quest of chapter.quests || []) {
    for (const scene of quest.scenes || []) {
      chTotal++;
      if (scene.interactionModel) chInteractionLoop++;
      if (scene.dialogueSequence) chDialogueSequence++;
      if (scene.revisitVariants && scene.revisitVariants.length > 0) chRevisit++;
      if (scene.ambientTemplates && scene.ambientTemplates.length > 0) chAmbient++;
    }
  }

  totalScenes += chTotal;
  interactionLoopScenes += chInteractionLoop;
  dialogueSequenceScenes += chDialogueSequence;
  revisitVariantScenes += chRevisit;
  ambientTemplateScenes += chAmbient;

  chapterStats.push({
    chapterName: chapter.title || file,
    total: chTotal,
    interactionLoop: chInteractionLoop,
    dialogueSequence: chDialogueSequence,
    revisitVariant: chRevisit,
    ambientTemplate: chAmbient
  });
}

const livingSceneCoveragePercent = totalScenes > 0 ? ((revisitVariantScenes + ambientTemplateScenes) / (totalScenes * 2) * 100).toFixed(1) : "0";
const interactionLoopPercent = totalScenes > 0 ? ((interactionLoopScenes + dialogueSequenceScenes) / totalScenes * 100).toFixed(1) : "0";

let md = `# Living Scene Coverage Report\n\n`;
md += `This report outlines the coverage and adoption of Stage 19's "Living Scene" and "Interaction Loop" mechanics across all campaign chapters in Via Prima.\n\n`;

md += `## Global Coverage Metrics\n\n`;
md += `- **Total Scenes**: ${totalScenes}\n`;
md += `- **Interaction Loop Scenes**: ${interactionLoopScenes} (${(totalScenes > 0 ? (interactionLoopScenes / totalScenes * 100).toFixed(1) : 0)}%)\n`;
md += `- **Dialogue Sequence Scenes**: ${dialogueSequenceScenes} (${(totalScenes > 0 ? (dialogueSequenceScenes / totalScenes * 100).toFixed(1) : 0)}%)\n`;
md += `- **Scenes with Revisit Variants**: ${revisitVariantScenes} (${(totalScenes > 0 ? (revisitVariantScenes / totalScenes * 100).toFixed(1) : 0)}%)\n`;
md += `- **Scenes with Ambient Actions**: ${ambientTemplateScenes} (${(totalScenes > 0 ? (ambientTemplateScenes / totalScenes * 100).toFixed(1) : 0)}%)\n`;
md += `- **Total Interaction Loop Coverage**: ${interactionLoopPercent}%\n`;
md += `- **Living Scene Feature Coverage Score**: ${livingSceneCoveragePercent}%\n\n`;

md += `## Chapter Breakdown\n\n`;
md += `| Chapter | Total Scenes | Interaction Loop | Dialogue Sequence | Revisit Variants | Ambient Actions |\n`;
md += `|---|---|---|---|---|---|\n`;
for (const ch of chapterStats) {
  md += `| ${ch.chapterName} | ${ch.total} | ${ch.interactionLoop} | ${ch.dialogueSequence} | ${ch.revisitVariant} | ${ch.ambientTemplate} |\n`;
}

fs.writeFileSync(reportPath, md, "utf8");
console.log(`Coverage report written to: ${reportPath}`);
