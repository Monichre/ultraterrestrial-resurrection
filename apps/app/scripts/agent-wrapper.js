#!/usr/bin/env node

/**
 * Wrapper for Claude Code agents to automatically handle logging
 */

import { appendEntry, computeAck } from "../log.js";
import fs from "fs";
import path from "path";

const AGENT_NAME = process.env.CLAUDE_AGENT_NAME || "AGENT_A";

export async function checkIn(summary, tasks, questions = []) {
  console.log(`[${AGENT_NAME}] Creating check-in entry...`);
  
  const sections = {
    "Summary": `- ${summary}`,
    "Next (awaiting approval)": tasks.map((task, i) => `${i + 1}) ${task}`)
  };
  
  if (questions.length > 0) {
    sections["Questions for USER"] = questions.map(q => `- ${q}`);
  }
  
  await appendEntry({
    agent: AGENT_NAME,
    type: "checkin",
    ack: computeAck(AGENT_NAME),
    sections
  });
  
  console.log(`[${AGENT_NAME}] ✅ Check-in logged. Awaiting approval...`);
}

export async function logWork(summary, did = [], working = [], notWorking = [], filesChanged = [], nextSteps = []) {
  console.log(`[${AGENT_NAME}] Logging completed work...`);
  
  const sections = {
    "Summary": `- ${summary}`
  };
  
  if (did.length > 0) sections["Did"] = did.map(d => `- ${d}`);
  if (working.length > 0) sections["Working"] = working.map(w => `- ${w}`);
  if (notWorking.length > 0) sections["Not working / risks"] = notWorking.map(n => `- ${n}`);
  if (filesChanged.length > 0) sections["Files changed"] = filesChanged.map(f => `- ${f}`);
  if (nextSteps.length > 0) sections["Next (awaiting approval)"] = nextSteps.map((s, i) => `${i + 1}) ${s}`);
  
  await appendEntry({
    agent: AGENT_NAME,
    type: "work",
    ack: computeAck(AGENT_NAME),
    sections
  });
  
  console.log(`[${AGENT_NAME}] ✅ Work logged.`);
}

export async function waitForApproval(timeoutMs = 300000) { // 5 minute timeout
  const LOG = path.resolve("LOG.md");
  const startTime = Date.now();
  let lastSeq = getCurrentSeq();
  
  console.log(`[${AGENT_NAME}] Waiting for USER approval...`);
  
  while (Date.now() - startTime < timeoutMs) {
    if (!fs.existsSync(LOG)) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      continue;
    }
    
    const content = fs.readFileSync(LOG, 'utf8');
    const lines = content.split('\n');
    
    // Look for approval after our last sequence
    for (let i = lines.length - 1; i >= 0; i--) {
      const line = lines[i];
      const match = line.match(/^### \[agent=USER seq=(\d+) ack=(\d+) type=approve/);
      
      if (match) {
        const approvalSeq = parseInt(match[1]);
        const approvalAck = parseInt(match[2]);
        
        if (approvalSeq > lastSeq && approvalAck >= lastSeq) {
          console.log(`[${AGENT_NAME}] ✅ Approval received (seq=${approvalSeq})`);
          return true;
        }
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000)); // Check every 2 seconds
  }
  
  console.log(`[${AGENT_NAME}] ⏱️ Timeout waiting for approval`);
  return false;
}

function getCurrentSeq() {
  const SEQ = path.resolve(".log.seq");
  if (!fs.existsSync(SEQ)) return 0;
  const content = fs.readFileSync(SEQ, 'utf8').trim();
  return parseInt(content) || 0;
}

// Export for use in other scripts
export default {
  checkIn,
  logWork,
  waitForApproval,
  AGENT_NAME
};