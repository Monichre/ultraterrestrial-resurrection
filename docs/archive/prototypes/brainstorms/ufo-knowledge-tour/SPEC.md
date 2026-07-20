# UFO Knowledge Graph Guided Tour System

## Concept & Vision

An intelligent multi-agent system where specialized AI agents collaborate to create an immersive, interactive guided tour through a knowledge graph of UFO data. The system feels like having a team of expert researchers, analysts, and storytellers working together to reveal the mysteries of UFO phenomena. Users experience a curated journey with narrative flow, deep insights, and responsive exploration.

The system embodies the aesthetic of a retro-futuristic space exploration control center—deep space blues, holographic data displays, and subtle cosmic imagery that evokes wonder and discovery.

## Design Language

### Aesthetic Direction
**"Cosmic Observatory"** — A sleek, dark interface reminiscent of a spacecraft's command center with holographic projections, data visualizations that feel like star maps, and UI elements that pulse with subtle cosmic energy.

### Color Palette
- **Primary**: `#0A0E1A` (Deep Space)
- **Secondary**: `#1A2744` (Nebula Blue)
- **Accent**: `#00D4FF` (Plasma Cyan)
- **Highlight**: `#7B68EE` (Nebula Purple)
- **Alert**: `#FF6B6B` (Signal Red)
- **Text Primary**: `#E8F4FF` (Starlight)
- **Text Secondary**: `#8BA4C7` (Moonlight)

### Typography
- **Headings**: "Space Grotesk" — geometric, futuristic
- **Body**: "IBM Plex Mono" — technical, readable
- **Accents**: "Orbitron" — for data labels and stats

### Spatial System
- 8px base unit
- Generous padding (24-48px) for breathing room
- Card-based layout with subtle glow borders
- Grid-based data visualization areas

### Motion Philosophy
- Smooth, cosmic transitions (300-500ms ease-out)
- Data "materializing" effects on load
- Pulsing glow on interactive elements
- Parallax star field background
- Node connections that "light up" during tour progression

### Visual Assets
- Custom SVG icons with glowing effects
- Animated star field background
- Holographic card effects with subtle transparency
- Circuit-line decorative elements

## Layout & Structure

### Main Interface
```
┌─────────────────────────────────────────────────────────┐
│  [Logo] UFO Knowledge Graph Explorer    [Tour Controls] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │           KNOWLEDGE GRAPH VISUALIZATION        │   │
│  │        (Interactive SVG/Canvas with nodes)      │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌──────────────────────┐  ┌──────────────────────┐   │
│  │    TOUR GUIDE        │  │   DATA INSIGHTS      │   │
│  │    (Narrative Panel) │  │   (Deep Dive Panel)  │   │
│  └──────────────────────┘  └──────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │            INTERACTION PANEL                     │   │
│  │  [Question Input] [Navigation] [Tour Progress]  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Agent Team Structure
1. **Tour Guide Agent** (Narrator) — Leads the tour, provides context and storytelling
2. **Graph Navigator Agent** — Manages tour path, decides what nodes to visit next
3. **Data Analyst Agent** — Provides deep insights on current topic, answers questions
4. **Visualization Agent** — Prepares data for display, creates visual representations
5. **Interaction Coordinator** — Handles user input, routes requests to appropriate agents

### Responsive Strategy
- Full experience on desktop with multi-panel layout
- Stacked panels on tablet
- Single-panel focus mode on mobile with swipe navigation

## Features & Interactions

### Core Tour Features
1. **Curated Tour Path** — Pre-planned route through knowledge graph
2. **Branching Exploration** — Can dive deeper into specific topics
3. **Interactive Q&A** — Ask questions about current topic
4. **Visual Node Navigation** — Click nodes to explore
5. **Progress Tracking** — Visual tour progress indicator

### Agent Interactions
- **Tour Start**: Guide introduces tour, Navigator plots path
- **Node Visit**: All agents coordinate to load content, visuals, and insights
- **User Question**: Coordinator routes to Analyst, prepares response
- **Exploration**: Navigator can redirect tour based on user interest
- **Tour End**: Guide summarizes, offers next steps

### Interaction Details
- **Node Hover**: Glow effect, tooltip preview
- **Node Click**: Full node content loads in panels
- **Question Submit**: Loading state, coordinated response
- **Progress Update**: Smooth progress bar animation

### Error Handling
- Graceful degradation if an agent fails
- Fallback to simpler response
- User-friendly error messages
- "Contact another agent" option

### States
- **Loading**: Skeleton UI with pulsing animations
- **Idle**: Subtle ambient animations, ready state
- **Active Tour**: Dynamic updates, progress tracking
- **Question Mode**: Focused interaction state

## Component Inventory

### 1. Header Bar
- Logo with glow effect
- Tour title
- Control buttons (start, pause, reset)
- States: default, tour-active

### 2. Knowledge Graph Canvas
- SVG-based interactive visualization
- Node types: Event, Location, Entity, Concept (different shapes/colors)
- Connection lines with labels
- States: loading, interactive, node-selected, tour-highlight

### 3. Tour Guide Panel
- Avatar/icon for Guide Agent
- Narrative text area
- Context indicators
- States: speaking, listening, transitioning

### 4. Data Insights Panel
- Key statistics display
- Related data points
- Analyst findings
- States: loading, populated, expanded

### 5. Visualization Panel
- Dynamic data displays
- Charts, maps, timelines
- Generated on-the-fly
- States: loading, rendered, error

### 6. Interaction Bar
- Question input field
- Submit button
- Navigation controls (prev/next)
- Tour progress indicator
- States: idle, typing, processing, complete

### 7. Node Tooltip
- Node name and type
- Brief description
- Quick stats
- "Explore" button

## Technical Approach

### Framework
- **LangGraph** for multi-agent state management
- **React + Vite** for frontend
- **TypeScript** for type safety

### Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    MAIN APPLICATION                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │              LangGraph State Graph                    │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │  │
│  │  │  Tour   │ │ Graph    │ │ Analyst │ │ Visual   │ │  │
│  │  │  Guide  │→│Navigator │→│  Agent  │→│ Agent    │ │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │  │
│  │       ↑                                    ↓        │  │
│  │       └──────────── Interaction Coordinator ←───────┘  │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                               │
│  - Knowledge Graph (Nodes + Edges)                          │
│  - Tour State                                               │
│  - Conversation Memory                                      │
└─────────────────────────────────────────────────────────────┘
```

### Agent Responsibilities
1. **Tour Guide**: "You are an engaging storyteller presenting UFO phenomena data..."
2. **Navigator**: "You plan optimal paths through the knowledge graph..."
3. **Analyst**: "You provide deep data analysis and answer questions..."
4. **Visualizer**: "You prepare data for visual presentation..."
5. **Coordinator**: "You manage user interactions and route requests..."

### Data Model
```typescript
interface KGNode {
  id: string;
  type: 'event' | 'location' | 'entity' | 'concept';
  name: string;
  description: string;
  properties: Record<string, any>;
  connections: string[];
}

interface KGEdge {
  source: string;
  target: string;
  relationship: string;
  weight: number;
}

interface TourState {
  currentNode: string;
  path: string[];
  visited: string[];
  context: Record<string, any>;
  responses: Record<string, string>;
}
```

### API Design
- `/api/tour/start` — Initialize tour
- `/api/tour/next` — Get next node in tour
- `/api/tour/query` — Submit question to agents
- `/api/graph/node/:id` — Get node details
- `/api/agent/respond` — Get agent response