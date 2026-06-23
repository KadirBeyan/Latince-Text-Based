import fs from "node:fs";
import path from "node:path";
import { ContentLoader } from "../server/src/game/content/ContentLoader";

function run() {
  const loader = new ContentLoader(path.resolve(process.cwd(), "data"));
  const content = loader.load();
  
  let markdown = `# Interaction Loop Migration Suggestions Report\n\n`;
  markdown += `This report outlines suggestions for migrating legacy choice/text/dialogue-response challenges to the new Stage 18 **Immersive RPG Interaction Loop** intents.\n\n`;

  let count = 0;
  for (const campaign of content.campaigns) {
    markdown += `## Campaign: ${campaign.title} (${campaign.id})\n\n`;
    for (const chapter of campaign.chapters) {
      markdown += `### Chapter: ${chapter.title} (${chapter.id})\n\n`;
      for (const quest of chapter.quests) {
        markdown += `#### Quest: ${quest.title} (${quest.id})\n\n`;
        for (const scene of quest.scenes) {
          if (scene.interactionModel || scene.dialogueSequence) {
            continue; // Already migrated
          }

          markdown += `##### Scene: ${scene.title} (${scene.id})\n`;
          markdown += `- **Current Input Mode:** \`${scene.inputMode}\`\n`;

          const intents: any[] = [];
          
          // 1. Process dialogue challenges / text challenges
          if (scene.dialogueChallenge) {
            const dc = scene.dialogueChallenge;
            intents.push({
              id: `speak_introduce_self`,
              labelTr: `Kendini tanıt`,
              verb: "speak",
              requiresLatin: true,
              targetMeaningTr: dc.targetMeaningTr,
              playerIntentTr: dc.playerIntentTr,
              canonicalAnswers: dc.canonicalAnswers,
              acceptedVariants: dc.acceptedVariants || [],
              rejectedMeanings: dc.rejectedMeanings || [],
              successNextSceneId: dc.successNextSceneId,
              failureNextSceneId: dc.failureNextSceneId,
              failureBehavior: "retry",
              responseReactions: dc.reactions
            });
          } else if (scene.textChallenge) {
            const tc = scene.textChallenge;
            intents.push({
              id: `answer_challenge`,
              labelTr: `Cevap ver`,
              verb: "speak",
              requiresLatin: true,
              targetMeaningTr: tc.prompt,
              canonicalAnswers: tc.expectedAnswers,
              acceptedVariants: tc.acceptedVariants || [],
              successNextSceneId: tc.successNextSceneId,
              failureNextSceneId: tc.failureNextSceneId,
              failureBehavior: "retry"
            });
          }

          // 2. Process choice list
          if (scene.choices && scene.choices.length > 0) {
            for (const [idx, choice] of scene.choices.entries()) {
              let verb = "custom";
              const label = choice.label.toLowerCase();
              if (label === "devam et") {
                verb = "wait";
              } else if (label.includes("konuş") || label.includes("söyle") || label.includes("tanıt")) {
                verb = "speak";
              } else if (label.includes("sor")) {
                verb = "ask";
              } else if (label.includes("incele") || label.includes("bak") || label.includes("oku")) {
                verb = "inspect";
              } else if (label.includes("dinle")) {
                verb = "listen";
              } else if (label.includes("bekle")) {
                verb = "wait";
              } else if (label.includes("ayrıl") || label.includes("git")) {
                verb = "leave";
              }

              intents.push({
                id: choice.id || `intent_${idx}`,
                labelTr: choice.label,
                descriptionTr: choice.description,
                verb,
                requiresLatin: false,
                conditions: choice.conditions || [],
                effects: choice.effects || [],
                nextSceneId: choice.nextSceneId
              });
            }
          }

          if (intents.length > 0) {
            count++;
            markdown += `\n**Suggested \`interactionModel\` Configuration:**\n`;
            markdown += `\`\`\`json\n{\n  "interactionModel": {\n    "mode": "interaction-loop",\n    "openingNarrationTr": "${scene.description}",\n    "intents": ${JSON.stringify(intents, null, 2).replace(/\n/g, "\n    ")}\n  }\n}\n\`\`\`\n\n`;
          }
        }
      }
    }
  }

  markdown += `\n**Total Suggested Migrations:** ${count} scenes.\n`;

  const reportDir = path.resolve(process.cwd(), "docs", "reports");
  fs.mkdirSync(reportDir, { recursive: true });
  fs.writeFileSync(path.join(reportDir, "interaction-migration-suggestions.md"), markdown, "utf8");
  console.log(`Generated migration suggestions report at docs/reports/interaction-migration-suggestions.md`);
}

run();
