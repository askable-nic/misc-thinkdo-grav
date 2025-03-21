const path = require("path");
const fs = require("fs");

const contentPath = path.resolve(__dirname, "content");

const json = require(path.join(contentPath, `${process.argv[2]}.json`));

let md = "";

md += `# ${json.metadata.title}\n\n`;
for (const phase of json.children) {
  md += `# ${phase.metadata.title}\n\n`;
  for (const step of phase.children) {
    md += `## ${step.metadata.title}\n\n`;
    switch (step.template) {
      case "session":
        md += "| Activity | Length | Teams |\n";
        md += "| --- | --- | --- |\n";
        for (const activity of step.children) {
          md += `| ${activity.metadata.title} | ${activity.metadata.content.length} | ${activity.metadata.content.teams} |\n`;
        }
        md += "\n";
        for (const activity of step.children) {
          if (activity.template !== "activity") {
            continue;
          }
          // md += `#### ${activity.metadata.title} *(${activity.metadata.content.length} / ${activity.metadata.content.teams})*\n\n`;
          md += `### ${activity.metadata.title}\n\n`;
          md += `${activity.content}\n\n`;
          if (activity.children.length > 0) {
            // md += `\`\`\`${JSON.stringify(
            //   activity.children,
            //   undefined,
            //   2
            // )}\`\`\`\n`;
            for (const subActivity of activity.children) {
              md += `#### ${subActivity.metadata.title}\n\n`;
              md += `${subActivity.content}\n\n`;
            }
          }
        }
        break;
      case "default":
      default:
        md += `${step.content.trim()}\n\n`;
        if (step.children.length > 0) {
          md += `\`\`\`${JSON.stringify(step.children, undefined, 2)}\`\`\`\n`;
        }
        break;
    }
  }
}

fs.writeFileSync(path.join(contentPath, `${process.argv[2]}.md`), md);
