import {MindMapBottomMenu} from '@/features/mindmap/components/menus/mindmap-bottom-menu/mindmap-bottom-menu'
import {useAssistantInstructions} from '@assistant-ui/react'

export function BottomMenuAiWrapped() {
  useAssistantInstructions({
    instruction: `
     # MindMapBottomMenu: Logic, Features, Behavior, and Data Flow

## Overview

\`MindMapBottomMenu\` is a highly interactive, stateful React component (Next.js 15, functional style) that serves as the primary AI/Oracle input and control bar for the Mind Map feature. It orchestrates user input, AI chat, database search, and dynamic mind map graph updates, integrating with multiple contexts, actions, and UI modules.

---

## Key Modules and Architecture

- **Contexts**
  - \`useMindMap\`: Provides all graph manipulation and data loading functions (nodes, edges, queries, etc.).
  - \`useSessionNotes\`: Allows saving AI chat messages as session notes.

- **Actions**
  - \`initiateDatabaseTableQuery\`: Triggers a search/query against a database table.
  - \`xataToXYFlow\`: Converts database/AI results into graph nodes/edges for visualization.
  - \`askAIAction\`: Sends a question to the AI for a specific table/model.

- **AI Integration**
  - \`useAssistant\` (from \`@ai-sdk/react\`): Manages AI chat state, message history, input, and error handling.

- **UI Components**
  - \`OracleInput\`: Input field with command/model context.
  - \`OracleCommandMenu\`: Command palette for selecting actions (chat, search, scrape, etc.).
  - \`UltraterrestrialModelSelection\`: Model/entity type selector.
  - \`MindMapMessages\`: Renders chat/AI messages.
  - \`SessionNotes\`: Displays session notes.

---

## Features and Behaviors

### 1. **Session and Message Persistence**
- Generates or retrieves a unique session ID (UUID) per user/session, stored in \`localStorage\`.
- Persists chat messages to \`localStorage\` for session continuity.

### 2. **AI Chat and Oracle Actions**
- Supports freeform chat, deep research, scraping, and analysis via AI.
- Handles chat input, message submission, and displays AI responses.
- Error handling: Catches and displays AI errors in the UI.

### 3. **Database Search and Mind Map Updates**
- Allows searching for entities (events, personnel, organizations, etc.) by type and keyword.
- Prevents duplicate searches and nodes in the graph.
- Adds user input nodes, result nodes, and edges to the mind map.
- Supports dynamic layout (horizontal, vertical, radial, grid) based on entity type.

### 4. **Command Palette and Model Selection**
- Command menu (\`/\` key or UI): Enables switching between chat, search, scrape, and other actions.
- Model/entity type selector: Allows users to pick the domain for search or data loading.

### 5. **Keyboard and Input Handling**
- Enter: Submits chat or search based on active command.
- Backspace: Clears active command if input is empty.
- \`/\`: Opens command menu.
- Handles both controlled and event-driven input changes.

### 6. **Dynamic Node and Edge Management**
- Adds, updates, and positions nodes/edges in the mind map graph.
- Computes child node positions relative to parent nodes for clear visualization.
- Updates node data with AI/database results, errors, or status messages.

### 7. **Loading and Error States**
- Displays loading indicator when AI is processing.
- Shows error messages for AI or data loading failures.

---

## Data Flow

### User Input → Command/Model Selection → Action → Mind Map Update

1. **User Input**
   - User types in the Oracle input field.
   - Can trigger command menu (\`/\`), select a model/entity, or enter a command (chat, search, etc.).

2. **Command/Model Selection**
   - User selects a command (chat, search, scrape, etc.) and/or a model/entity type.
   - State is updated to reflect active command and selected model.

3. **Action Dispatch**
   - On Enter or form submit:
     - If chat: Message is sent to AI, response is displayed.
     - If search: Database query is performed, results are visualized in the mind map.
     - If model selected with no input: Loads top N records for that entity type.

4. **Mind Map Update**
   - New nodes and edges are added to the graph.
   - User input node is created for each query.
   - Result nodes are positioned and connected.
   - Node data is updated with results, errors, or status.

5. **Persistence and Side Effects**
   - Session ID and chat messages are persisted in \`localStorage\`.
   - Errors are logged and displayed.
   - AI messages can be saved as session notes.

---

## Key Functions and Hooks

- **runSearch({type, searchTerm})**
  - Checks for duplicate searches.
  - Adds user input node.
  - Calls \`initiateDatabaseTableQuery\`.
  - Adds result node and edge if new, updates user node with status.

- **handleLoadingRecords({data: {type}})**
  - Prevents duplicate queries.
  - Adds user input node.
  - Calls \`xataToXYFlow\` for data and layout.
  - Adds new nodes/edges, updates user node with results or errors.

- **handleOracleAction()**
  - Delegates to chat, search, or data loading based on command/model/input.

- **handleKeyDown(e)**
  - Handles Enter (submit), Backspace (clear command), \`/\` (open command menu), and default search.

- **handleChange(e)**
  - Updates input value, syncs with chat input if needed.

- **handleCommandSelect(commandId)**
  - Activates command from menu.

- **handleFormSubmit(e)**
  - Submits chat or triggers oracle action.

---

## Integration Points

- **Contexts:** Mind map state, session notes.
- **Actions:** Database queries, AI chat, data transformation.
- **UI:** Oracle input, command menu, model selection, chat/messages, error/loading states.

---

## Extensibility and Edge Cases

- Easily extendable to support new commands, entity types, or data sources.
- Handles duplicate prevention for both searches and nodes.
- Robust error handling for AI and data loading.
- Layout adapts to entity type for optimal visualization.
- Designed for both keyboard and mouse interaction.

---

## Data Types

- **MindMapNode:** Represents a node in the mind map (id, type, position, data, parentId).
- **SearchParams:** Type and search term for queries.
- **XataResponseRecord:** Generic record from database/AI.
- **CommandItem:** Command palette item (id, label, description, icon, prefix).

---

## Component Structure

- **MindMapBottomMenu**
  - Model selection menu
  - Command menu
  - Oracle input
  - Error/loading states
  - Chat/messages display

---

## Summary

\`MindMapBottomMenu\` is a central, extensible, and robust control surface for AI-driven mind map exploration, combining chat, search, and data visualization in a single, keyboard- and mouse-friendly UI. It leverages modern React/Next.js patterns, context-driven state, and modular actions for a seamless user experience.

    `,
  })

  return <MindMapBottomMenu />
}
