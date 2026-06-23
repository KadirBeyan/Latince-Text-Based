import fs from "node:fs";
import path from "node:path";

type Campaign = {
  id: string;
  title: string;
  chapters: {
    id: string;
    title: string;
    quests: {
      id: string;
      title: string;
      scenes: {
        id: string;
        title: string;
        inputMode: string;
        textChallenge?: {
          prompt: string;
          expectedAnswers: string[];
          acceptedVariants?: string[];
        } | null;
        npcIds?: string[];
      }[];
    }[];
  }[];
};

function runMigrationSuggestions() {
  const campaignsDir = path.resolve(process.cwd(), "data", "campaigns");
  const reportsDir = path.resolve(process.cwd(), "docs", "reports");

  if (!fs.existsSync(campaignsDir)) {
    console.error(`Campaigns directory not found at: ${campaignsDir}`);
    return;
  }

  const campaignFiles = fs.readdirSync(campaignsDir).filter(f => f.endsWith(".json"));
  let markdown = `# Dialogue Challenge Migration Suggestions\n\n`;
  markdown += `This report outlines suggestions for migrating existing \`textChallenge\` configurations into dialogue-first configurations (\`DialogueResponseChallenge\`).\n\n`;

  let totalSuggested = 0;

  for (const file of campaignFiles) {
    const filePath = path.join(campaignsDir, file);
    const campaign = JSON.parse(fs.readFileSync(filePath, "utf-8")) as Campaign;

    markdown += `## Campaign: ${campaign.title} (${campaign.id})\n\n`;

    for (const chapter of campaign.chapters || []) {
      for (const quest of chapter.quests || []) {
        let questHasSuggestions = false;
        let questMarkdown = `### Quest: ${quest.title} (${quest.id})\n\n`;

        for (const scene of quest.scenes || []) {
          if (scene.textChallenge) {
            totalSuggested++;
            questHasSuggestions = true;
            const tc = scene.textChallenge;

            // Extract target meaning from prompt if possible
            // Example prompt: "Latince yaz: Sen Marcus'sun." -> "Sen Marcus'sun."
            let targetMeaning = tc.prompt || "";
            if (targetMeaning.includes("Latince yaz:")) {
              targetMeaning = targetMeaning.split("Latince yaz:")[1].trim();
            } else if (targetMeaning.includes("Latince:")) {
              targetMeaning = targetMeaning.split("Latince:")[1].trim();
            }

            // Clean up trailing punctuation
            targetMeaning = targetMeaning.replace(/[.!?]$/, "") + ".";

            // Suggest NPC and prompt
            const speakerNpcId = scene.npcIds?.[0] || "magister";
            const npcPromptLatin = "Quis es?"; // generic placeholder
            const npcPromptTr = "Kim olduğunu soruyor.";

            questMarkdown += `#### Scene: [${scene.title}](file:///${filePath}#scenes.${scene.id})\n`;
            questMarkdown += `- **Scene ID**: \`${scene.id}\`\n`;
            questMarkdown += `- **Old Prompt**: "${tc.prompt}"\n`;
            questMarkdown += `- **Proposed Dialogue Challenge JSON**:\n`;
            questMarkdown += `\`\`\`json\n`;
            questMarkdown += JSON.stringify({
              mode: "dialogue-response",
              speakerNpcId,
              npcPromptLatin,
              npcPromptTr,
              playerIntentTr: `Kendini tanıt/Cevap ver.`,
              targetMeaningTr: targetMeaning,
              canonicalAnswers: tc.expectedAnswers,
              acceptedVariants: tc.acceptedVariants || [],
              retryAllowed: true,
              maxAttempts: 3,
              evaluation: {
                allowEquivalentMeaning: true,
                allowWordOrderVariation: true,
                requireContextMatch: true,
                useLlmSemanticJudge: true,
                minimumConfidence: 0.5
              }
            }, null, 2) + "\n";
            questMarkdown += `\`\`\`\n\n`;
          }
        }

        if (questHasSuggestions) {
          markdown += questMarkdown;
        }
      }
    }
  }

  markdown += `\n**Total scenes analyzed**: ${totalSuggested}\n`;

  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const reportPath = path.join(reportsDir, "dialogue-migration-suggestions.md");
  fs.writeFileSync(reportPath, markdown, "utf-8");
  console.log(`Migration suggestions report written successfully to: ${reportPath}`);
}

runMigrationSuggestions();
