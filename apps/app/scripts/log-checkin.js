#!/usr/bin/env node

import { appendEntry, computeAck } from "../log.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

async function main() {
  console.log("📋 Creating checkin entry...\n");
  
  const agent = await question("Agent name (e.g., AGENT_A): ");
  const summary = await question("Summary (one line): ");
  
  console.log("\nNext steps (awaiting approval). Enter empty line to finish:");
  const nextSteps = [];
  let i = 1;
  while (true) {
    const step = await question(`${i}) `);
    if (!step.trim()) break;
    nextSteps.push(`${i}) ${step}`);
    i++;
  }
  
  const questions = await question("\nQuestions for USER (optional, press enter to skip): ");
  
  const sections = {
    "Summary": `- ${summary}`,
    "Next (awaiting approval)": nextSteps
  };
  
  if (questions.trim()) {
    sections["Questions for USER"] = [`- ${questions}`];
  }
  
  await appendEntry({
    agent,
    type: "checkin",
    ack: computeAck(agent),
    sections
  });
  
  console.log("\n✅ Checkin entry added to LOG.md");
  rl.close();
}

main().catch(console.error);