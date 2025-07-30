#!/usr/bin/env node

import { appendEntry, computeAck } from "../log.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

async function main() {
  console.log("✅ Creating USER approval entry...\n");
  
  const approval = await question("Approval instructions (e.g., 'Proceed with steps 1-2. Hold 3'): ");
  
  await appendEntry({
    agent: "USER",
    type: "approve",
    ack: computeAck("USER"),
    sections: {
      "Approval": `- ${approval}`
    }
  });
  
  console.log("\n✅ Approval entry added to LOG.md");
  rl.close();
}

main().catch(console.error);