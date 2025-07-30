// multi-agent-coordinator.js
import fs from 'fs';
import path from 'path';
import { AgentBase } from './agent-base.js';

export class MultiAgentCoordinator {
  constructor() {
    this.agents = new Map();
    this.LOG = path.resolve("LOG.md");
  }

  registerAgent(agent) {
    this.agents.set(agent.name, agent);
  }

  async findTasksForAgent(agentName) {
    const entries = this.parseLog();
    const tasks = [];
    
    // Look for tasks assigned to this agent
    entries.forEach(entry => {
      if (entry.sections["Next (awaiting approval)"]) {
        entry.sections["Next (awaiting approval)"].forEach(task => {
          if (task.includes(agentName)) {
            tasks.push({
              from: entry.agent,
              seq: entry.seq,
              task: task
            });
          }
        });
      }
      
      if (entry.sections["Handoff"]) {
        entry.sections["Handoff"].forEach(handoff => {
          if (handoff.includes(agentName)) {
            tasks.push({
              from: entry.agent,
              seq: entry.seq,
              task: handoff,
              type: 'handoff'
            });
          }
        });
      }
    });
    
    return tasks;
  }

  async findQuestionsForAgent(agentName) {
    const entries = this.parseLog();
    const questions = [];
    
    entries.forEach(entry => {
      const questionKey = `Questions for ${agentName}`;
      if (entry.sections[questionKey]) {
        questions.push({
          from: entry.agent,
          seq: entry.seq,
          questions: entry.sections[questionKey]
        });
      }
      
      // Also check "Questions for ALL"
      if (entry.sections["Questions for ALL"]) {
        questions.push({
          from: entry.agent,
          seq: entry.seq,
          questions: entry.sections["Questions for ALL"]
        });
      }
    });
    
    return questions;
  }

  async getAgentStatus(agentName) {
    const entries = this.parseLog();
    const agentEntries = entries.filter(e => e.agent === agentName);
    
    if (agentEntries.length === 0) {
      return { status: 'inactive', lastAction: null };
    }
    
    const lastEntry = agentEntries[agentEntries.length - 1];
    
    // Determine status based on last entry type
    let status = 'active';
    if (lastEntry.type === 'checkin') {
      // Check if approved
      const approved = entries.some(e => 
        e.type === 'approve' && 
        e.seq > lastEntry.seq &&
        e.sections.Approval?.some(a => a.includes(agentName))
      );
      status = approved ? 'approved' : 'waiting_approval';
    }
    
    return {
      status,
      lastAction: lastEntry,
      pendingTasks: await this.findTasksForAgent(agentName),
      pendingQuestions: await this.findQuestionsForAgent(agentName)
    };
  }

  parseLog() {
    if (!fs.existsSync(this.LOG)) return [];
    
    const content = fs.readFileSync(this.LOG, 'utf8');
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

  async waitForDependencies(agentName, dependencies) {
    console.log(`[${agentName}] Waiting for dependencies:`, dependencies);
    
    // Check if dependencies are met
    const checkDependencies = () => {
      const entries = this.parseLog();
      return dependencies.every(dep => {
        return entries.some(e => 
          e.type === 'work' && 
          e.sections.Summary && 
          e.sections.Summary.some(s => s.includes(dep))
        );
      });
    };
    
    // Poll until dependencies are met
    while (!checkDependencies()) {
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    console.log(`[${agentName}] All dependencies met!`);
    return true;
  }

  // Get a summary of all agent activities
  async getCoordinationSummary() {
    const entries = this.parseLog();
    const summary = {
      totalEntries: entries.length,
      byAgent: {},
      byType: {},
      pendingApprovals: [],
      activeWork: [],
      questions: []
    };
    
    entries.forEach(entry => {
      // Count by agent
      if (!summary.byAgent[entry.agent]) {
        summary.byAgent[entry.agent] = 0;
      }
      summary.byAgent[entry.agent]++;
      
      // Count by type
      if (!summary.byType[entry.type]) {
        summary.byType[entry.type] = 0;
      }
      summary.byType[entry.type]++;
      
      // Track pending items
      if (entry.type === 'checkin') {
        const approved = entries.some(e => 
          e.type === 'approve' && 
          e.seq > entry.seq
        );
        if (!approved) {
          summary.pendingApprovals.push({
            agent: entry.agent,
            seq: entry.seq,
            summary: entry.sections.Summary?.[0] || 'No summary'
          });
        }
      }
      
      if (entry.type === 'question') {
        summary.questions.push({
          from: entry.agent,
          seq: entry.seq,
          questions: entry.sections["Questions for ALL"] || 
                     entry.sections["Questions for USER"] ||
                     Object.entries(entry.sections)
                       .filter(([k]) => k.startsWith("Questions for"))
                       .map(([k, v]) => v)
                       .flat()
        });
      }
    });
    
    return summary;
  }
}