#!/usr/bin/env node

/**
 * Live status viewer for the coordination log
 */

import fs from 'fs';
import path from 'path';

const LOG = path.resolve("LOG.md");

function parseLog() {
  if (!fs.existsSync(LOG)) {
    console.log("No log file found.");
    return [];
  }
  
  const content = fs.readFileSync(LOG, 'utf8');
  const entries = [];
  const lines = content.split('\n');
  
  let currentEntry = null;
  
  for (const line of lines) {
    const headerMatch = line.match(/^### \[agent=(\S+) seq=(\d+) ack=(\d+) type=(\S+) ts=([^\]]+)\]$/);
    
    if (headerMatch) {
      if (currentEntry) entries.push(currentEntry);
      
      currentEntry = {
        agent: headerMatch[1],
        seq: parseInt(headerMatch[2]),
        ack: parseInt(headerMatch[3]),
        type: headerMatch[4],
        timestamp: new Date(headerMatch[5]),
        sections: {}
      };
    } else if (currentEntry && line.startsWith('#### ')) {
      const section = line.substring(5);
      currentEntry.currentSection = section;
      currentEntry.sections[section] = [];
    } else if (currentEntry && currentEntry.currentSection && line.trim()) {
      currentEntry.sections[currentEntry.currentSection].push(line.trim());
    }
  }
  
  if (currentEntry) entries.push(currentEntry);
  
  return entries;
}

function getStatusEmoji(type) {
  switch(type) {
    case 'checkin': return '📋';
    case 'work': return '⚡';
    case 'approve': return '✅';
    case 'error': return '❌';
    case 'question': return '❓';
    default: return '📝';
  }
}

function formatTime(date) {
  return date.toLocaleTimeString();
}

function displayStatus() {
  if (process.argv[2] !== '--once') {
    console.clear();
  }
  console.log("🤖 LIVE AGENT COORDINATION STATUS\n");
  console.log("=" + "=".repeat(60) + "\n");
  
  const entries = parseLog();
  const lastFive = entries.slice(-5);
  
  // Current status
  const lastEntry = entries[entries.length - 1];
  if (lastEntry) {
    console.log(`📍 LATEST: ${lastEntry.agent} | ${getStatusEmoji(lastEntry.type)} ${lastEntry.type} | seq=${lastEntry.seq}`);
    
    if (lastEntry.sections.Summary) {
      console.log(`   ${lastEntry.sections.Summary[0]}`);
    }
    
    // Check for pending approvals
    const pendingApprovals = entries.filter(e => 
      e.type === 'checkin' && 
      !entries.some(a => a.type === 'approve' && a.ack >= e.seq)
    );
    
    if (pendingApprovals.length > 0) {
      console.log("\n⏳ PENDING APPROVALS:");
      pendingApprovals.forEach(p => {
        console.log(`   - ${p.agent} (seq=${p.seq}): ${p.sections.Summary?.[0] || 'No summary'}`);
      });
    }
  }
  
  // Recent activity
  console.log("\n📜 RECENT ACTIVITY:");
  lastFive.forEach(entry => {
    console.log(`   ${formatTime(entry.timestamp)} | ${entry.agent} | ${getStatusEmoji(entry.type)} ${entry.type}`);
  });
  
  // Agent summary
  const agentStats = {};
  entries.forEach(e => {
    if (!agentStats[e.agent]) {
      agentStats[e.agent] = { checkins: 0, work: 0, approvals: 0 };
    }
    if (e.type === 'checkin') agentStats[e.agent].checkins++;
    if (e.type === 'work') agentStats[e.agent].work++;
    if (e.type === 'approve') agentStats[e.agent].approvals++;
  });
  
  console.log("\n📊 AGENT STATISTICS:");
  Object.entries(agentStats).forEach(([agent, stats]) => {
    console.log(`   ${agent}: ${stats.checkins} checkins, ${stats.work} work entries${agent === 'USER' ? `, ${stats.approvals} approvals` : ''}`);
  });
  
  console.log("\n" + "=".repeat(60));
  console.log("Press Ctrl+C to exit | Updates every 5 seconds");
}

// Initial display
displayStatus();

// Refresh every 5 seconds
if (process.argv[2] !== '--once') {
  setInterval(displayStatus, 5000);
}