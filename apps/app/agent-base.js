// agent-base.js
import { appendEntry, computeAck } from "./log.js";

export class AgentBase {
  constructor(agentName, role) {
    this.name = agentName;
    this.role = role;
    this.lastSeenSeq = 0;
  }

  async checkIn(summary, tasks, dependencies = []) {
    const sections = {
      "Summary": `- ${summary}`,
      "Next (awaiting approval)": tasks.map((t, i) => `${i + 1}) ${t}`)
    };
    
    if (dependencies.length > 0) {
      sections["Dependencies"] = dependencies.map(d => `- ${d}`);
    }
    
    await appendEntry({
      agent: this.name,
      type: "checkin",
      ack: computeAck(this.name),
      sections
    });
  }

  async syncState(message, data = {}) {
    await appendEntry({
      agent: this.name,
      type: "sync",
      ack: computeAck(this.name),
      sections: {
        "Summary": `- ${message}`,
        ...data
      }
    });
  }

  async askQuestion(summary, questions, targetAgent = null) {
    const sections = {
      "Summary": `- ${summary}`
    };
    
    const questionKey = targetAgent 
      ? `Questions for ${targetAgent}`
      : "Questions for ALL";
      
    sections[questionKey] = questions.map(q => `- ${q}`);
    
    await appendEntry({
      agent: this.name,
      type: "question",
      ack: computeAck(this.name),
      sections
    });
  }

  async handoff(summary, handoffs) {
    await appendEntry({
      agent: this.name,
      type: "work",
      ack: computeAck(this.name),
      sections: {
        "Summary": `- ${summary}`,
        "Handoff": handoffs.map(h => `- ${h}`)
      }
    });
  }

  async approveOthers(approvals) {
    await appendEntry({
      agent: this.name,
      type: "approve",
      ack: computeAck(this.name),
      sections: {
        "Approval": approvals.map(a => `- ${a}`)
      }
    });
  }

  async logWork(summary, details) {
    const sections = {
      "Summary": `- ${summary}`
    };
    
    // Add all provided details as sections
    Object.entries(details).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        sections[key] = value.map(v => `- ${v}`);
      } else {
        sections[key] = [`- ${value}`];
      }
    });
    
    await appendEntry({
      agent: this.name,
      type: "work",
      ack: computeAck(this.name),
      sections
    });
  }

  async waitForApproval() {
    // This would check LOG.md for approval of this agent's last checkin
    // For now, returning true after a delay
    console.log(`[${this.name}] Waiting for approval...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    return true;
  }
}