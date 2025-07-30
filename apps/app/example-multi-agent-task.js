#!/usr/bin/env node

/**
 * Example: Multiple agents working together on a feature
 */

import { AgentBase } from './agent-base.js';
import { MultiAgentCoordinator } from './multi-agent-coordinator.js';

async function simulateMultiAgentWork() {
  const coordinator = new MultiAgentCoordinator();
  
  // Create specialized agents
  const lead = new AgentBase("AGENT_LEAD", "coordinator");
  const frontend = new AgentBase("AGENT_FRONTEND", "UI developer");
  const backend = new AgentBase("AGENT_BACKEND", "API developer");
  const tester = new AgentBase("AGENT_TEST", "QA engineer");
  
  // Register all agents
  coordinator.registerAgent(lead);
  coordinator.registerAgent(frontend);
  coordinator.registerAgent(backend);
  coordinator.registerAgent(tester);
  
  console.log("🚀 Starting multi-agent collaboration example...\n");
  
  // Step 1: Lead breaks down the task
  console.log("📋 LEAD: Breaking down the task...");
  await lead.checkIn(
    "Implementing real-time notification system",
    [
      "AGENT_FRONTEND: Create notification UI components",
      "AGENT_BACKEND: Implement WebSocket server for notifications",
      "AGENT_TEST: Write integration tests for real-time features",
      "All agents: Integrate and test together"
    ],
    ["Design document approved", "WebSocket library selected"]
  );
  
  await delay(1000);
  
  // Step 2: Agents acknowledge and sync
  console.log("\n🤝 Agents acknowledging tasks...");
  
  await frontend.syncState("Ready to build notification UI components", {
    "Plan": [
      "- Create NotificationBell component",
      "- Add notification dropdown",
      "- Implement unread counter"
    ]
  });
  
  await backend.syncState("Ready to implement WebSocket server", {
    "Plan": [
      "- Set up Socket.io server",
      "- Create notification events",
      "- Add authentication middleware"
    ]
  });
  
  await tester.syncState("Ready to write tests once components are ready", {
    "Dependencies": [
      "- Need AGENT_FRONTEND to complete UI first",
      "- Need AGENT_BACKEND to complete WebSocket server"
    ]
  });
  
  await delay(1000);
  
  // Step 3: Lead approves all plans
  console.log("\n✅ LEAD: Approving all agent plans...");
  await lead.approveOthers([
    "AGENT_FRONTEND: Proceed with notification UI",
    "AGENT_BACKEND: Proceed with WebSocket server",
    "AGENT_TEST: Good plan to wait for implementations"
  ]);
  
  await delay(1000);
  
  // Step 4: Backend has a question
  console.log("\n❓ BACKEND: Asking for clarification...");
  await backend.askQuestion(
    "Need clarification on notification persistence",
    [
      "Should notifications be stored in database?",
      "What's the retention policy for read notifications?",
      "Should we support notification history?"
    ],
    "AGENT_LEAD"
  );
  
  await delay(1000);
  
  // Step 5: Lead responds
  console.log("\n💬 LEAD: Responding to questions...");
  await lead.syncState("Answering notification persistence questions", {
    "Response": [
      "- Yes, store notifications in database",
      "- Keep read notifications for 30 days",
      "- Support paginated history view"
    ]
  });
  
  await delay(1000);
  
  // Step 6: Frontend completes first part
  console.log("\n🎨 FRONTEND: Completing notification UI...");
  await frontend.logWork("Completed notification UI components", {
    "Did": [
      "Created NotificationBell component with badge",
      "Implemented dropdown with smooth animations",
      "Added unread counter with real-time updates"
    ],
    "Files changed": [
      "src/components/NotificationBell.tsx (+185 -0)",
      "src/components/NotificationDropdown.tsx (+220 -0)",
      "src/styles/notifications.css (+95 -0)"
    ],
    "Handoff": [
      "AGENT_BACKEND: UI ready for WebSocket integration",
      "AGENT_TEST: Components ready for unit testing"
    ]
  });
  
  await delay(1000);
  
  // Step 7: Backend integrates
  console.log("\n🔌 BACKEND: Implementing WebSocket integration...");
  await backend.logWork("Implemented WebSocket notification system", {
    "Did": [
      "Set up Socket.io with authentication",
      "Created notification event handlers",
      "Added database persistence layer"
    ],
    "Files changed": [
      "server/websocket/notifications.js (+340 -0)",
      "server/models/Notification.js (+85 -0)",
      "server/middleware/socketAuth.js (+65 -0)"
    ],
    "API Endpoints": [
      "POST /api/notifications - Send notification",
      "GET /api/notifications - Get notification history",
      "PUT /api/notifications/:id/read - Mark as read"
    ]
  });
  
  await delay(1000);
  
  // Step 8: Tester begins work
  console.log("\n🧪 TEST: Writing integration tests...");
  await tester.checkIn(
    "Writing comprehensive tests for notification system",
    [
      "Unit tests for React components",
      "WebSocket connection tests",
      "End-to-end notification flow tests"
    ]
  );
  
  // Step 9: Frontend discovers issue and asks backend
  console.log("\n🚨 FRONTEND: Found integration issue...");
  await frontend.askQuestion(
    "WebSocket connection dropping on route change",
    [
      "Should we maintain persistent connection?",
      "Or reconnect on each route change?",
      "What's the recommended pattern?"
    ],
    "AGENT_BACKEND"
  );
  
  await delay(1000);
  
  // Step 10: Backend responds with solution
  console.log("\n💡 BACKEND: Providing solution...");
  await backend.syncState("Solution for WebSocket reconnection issue", {
    "Solution": [
      "- Use persistent connection with reconnect logic",
      "- Implement exponential backoff for reconnects",
      "- Store pending notifications during disconnection"
    ],
    "Code Example": [
      "- See shared/websocket/ReconnectingSocket.js",
      "- Already implemented reconnection manager"
    ]
  });
  
  // Final summary
  await delay(2000);
  console.log("\n📊 Checking coordination summary...");
  const summary = await coordinator.getCoordinationSummary();
  
  console.log("\n=== COORDINATION SUMMARY ===");
  console.log(`Total Entries: ${summary.totalEntries}`);
  console.log("\nActivity by Agent:");
  Object.entries(summary.byAgent).forEach(([agent, count]) => {
    console.log(`  ${agent}: ${count} entries`);
  });
  console.log("\nActivity by Type:");
  Object.entries(summary.byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  
  console.log("\n✅ Multi-agent collaboration example completed!");
  console.log("Check LOG.md to see the complete coordination history.\n");
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run the simulation
simulateMultiAgentWork().catch(console.error);