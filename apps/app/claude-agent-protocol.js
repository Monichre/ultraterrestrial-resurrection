/**
 * Claude Code Agent Protocol
 * 
 * INSTRUCTIONS FOR CLAUDE CODE AGENTS:
 * 1. Import this file at the start of any coding session
 * 2. Call startWork() before making any changes
 * 3. Call completeWork() after finishing your changes
 */

import agent from './scripts/agent-wrapper.js';

export async function startWork(taskDescription, steps, questions = []) {
  console.log("\n🤖 CLAUDE AGENT PROTOCOL: Starting work sequence...\n");
  
  // Check in with planned work
  await agent.checkIn(taskDescription, steps, questions);
  
  // Wait for approval
  const approved = await agent.waitForApproval();
  
  if (!approved) {
    console.log("\n❌ No approval received. Cannot proceed with work.\n");
    process.exit(1);
  }
  
  console.log("\n✅ Approved! You may now proceed with implementation.\n");
  return true;
}

export async function completeWork(summary, changes) {
  console.log("\n🤖 CLAUDE AGENT PROTOCOL: Logging completed work...\n");
  
  const {
    did = [],
    working = [],
    issues = [],
    filesChanged = [],
    nextSteps = []
  } = changes;
  
  await agent.logWork(
    summary,
    did,
    working,
    issues,
    filesChanged,
    nextSteps
  );
  
  console.log("\n✅ Work has been logged. Check LOG.md for the complete record.\n");
}

// Example usage for Claude agents:
console.log(`
=== CLAUDE CODE AGENT PROTOCOL ===

To use this coordination system:

1. Before starting work:
   await startWork(
     "Add new feature X",
     ["Create component", "Add tests", "Update docs"],
     ["Should I use TypeScript?"]
   );

2. After completing work:
   await completeWork(
     "Implemented feature X successfully",
     {
       did: ["Created FeatureX component", "Added unit tests"],
       working: ["Component renders correctly", "Tests pass"],
       issues: ["Performance needs optimization"],
       filesChanged: ["src/FeatureX.tsx (+150 -0)", "tests/FeatureX.test.ts (+75 -0)"],
       nextSteps: ["Optimize render performance", "Add integration tests"]
     }
   );

Remember: NEVER start coding without approval!
`);