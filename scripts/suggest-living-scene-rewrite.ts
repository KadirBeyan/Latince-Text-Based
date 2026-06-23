import fs from "node:fs";
import path from "node:path";

const chaptersDir = path.resolve(process.cwd(), "data", "campaigns", "via-prima", "chapters");
const reportPath = path.resolve(process.cwd(), "docs", "reports", "living-scene-rewrite-suggestions.md");

fs.mkdirSync(path.dirname(reportPath), { recursive: true });

const files = fs.readdirSync(chaptersDir).filter(f => f.endsWith(".json"));
let md = `# Living Scene Rewrite Suggestions Report\n\n`;
md += `This report outlines scenes in Via Prima that are currently legacy Q&A or choices scenes and recommends how they can be migrated to the new interaction-loop and living scene model.\n\n`;

for (const file of files) {
  const chapterPath = path.join(chaptersDir, file);
  const chapter = JSON.parse(fs.readFileSync(chapterPath, "utf8"));
  md += `## Chapter: ${chapter.title || file}\n\n`;
  
  let suggestedCount = 0;
  for (const quest of chapter.quests || []) {
    for (const scene of quest.scenes || []) {
      const isLegacy = !scene.interactionModel && !scene.dialogueSequence && (!scene.revisitVariants || scene.revisitVariants.length === 0);
      if (isLegacy) {
        suggestedCount++;
        md += `### Scene: \`${scene.id}\` - *${scene.title}*\n`;
        md += `- **Current Input Mode**: \`${scene.inputMode}\`\n`;
        md += `- **Suggested Action**: Convert to \`interaction-loop\` or add living scene components.\n`;
        md += `- **Recommendations**:\n`;
        md += `  - Add \`ambientTemplates\`: \`["inspect_object", "remember_lesson"]\` to encourage environmental investigation.\n`;
        md += `  - Add a \`revisitVariants\` block to change description when visiting again. E.g.:\n`;
        md += '    ```json\n';
        md += '    "revisitVariants": [\n';
        md += '      {\n';
        md += '        "id": "' + scene.id + '_revisit",\n';
        md += '        "conditions": [\n';
        md += '          { "type": "SCENE_VISIT_COUNT_MIN", "sceneId": "' + scene.id + '", "count": 2 }\n';
        md += '        ],\n';
        md += '        "descriptionOverride": "Buraya daha önce gelmiştin. Çevre tanıdık geliyor..."\n';
        md += '      }\n';
        md += '    ]\n';
        md += '    ```\n\n';
      }
    }
  }
  if (suggestedCount === 0) {
    md += `*All scenes in this chapter are migrated or configured as living/interaction loop scenes.*\n\n`;
  }
}

fs.writeFileSync(reportPath, md, "utf8");
console.log(`Suggestions report written to: ${reportPath}`);
