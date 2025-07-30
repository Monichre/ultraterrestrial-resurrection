#!/usr/bin/env node

import { appendEntry, computeAck } from "../log.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

async function main() {
  console.log("💼 Creating work entry...\n");
  
  const agent = await question("Agent name (e.g., AGENT_A): ");
  const summary = await question("Summary (one line): ");
  
  console.log("\nWhat did you do? Enter empty line to finish:");
  const did = [];
  while (true) {
    const item = await question("- ");
    if (!item.trim()) break;
    did.push(`- ${item}`);
  }
  
  const working = await question("\nWhat's working (optional): ");
  const notWorking = await question("What's not working/risks (optional): ");
  
  console.log("\nFiles changed (format: path/to/file.ext (+X -Y)). Enter empty line to finish:");
  const filesChanged = [];
  while (true) {
    const file = await question("- ");
    if (!file.trim()) break;
    filesChanged.push(`- ${file}`);
  }
  
  console.log("\nNext steps (awaiting approval). Enter empty line to finish:");
  const nextSteps = [];
  let i = 1;
  while (true) {
    const step = await question(`${i}) `);
    if (!step.trim()) break;
    nextSteps.push(`${i}) ${step}`);
    i++;
  }
  
  const sections = {
    "Summary": `- ${summary}`
  };
  
  if (did.length > 0) sections["Did"] = did;
  if (working.trim()) sections["Working"] = [`- ${working}`];
  if (notWorking.trim()) sections["Not working / risks"] = [`- ${notWorking}`];
  if (filesChanged.length > 0) sections["Files changed"] = filesChanged;
  if (nextSteps.length > 0) sections["Next (awaiting approval)"] = nextSteps;
  
  await appendEntry({
    agent,
    type: "work",
    ack: computeAck(agent),
    sections
  });
  
  console.log("\n✅ Work entry added to LOG.md");
  rl.close();
}

main().catch(console.error);