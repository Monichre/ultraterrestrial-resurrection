# CLAUDE.md - Project Guidelines

## Build and Development Commands

- `bun dev` or `npm run dev` - Start development server
- `bun build` or `npm run build` - Build for production
- `bun lint` or `npm run lint` - Run ESLint
- `bun storybook` or `npm run storybook` - Launch Storybook
- `bun new` or `npm run new` - Use plop to scaffold components
- Testing: `bun vitest`, `bun vitest --browser`, `bun vitest --coverage`

## Code Style Guidelines

- Use TypeScript for all code; prefer interfaces over types
- Use functional components with React Server Components when possible
- Minimize `use client`, `useEffect`, and `setState`
- Follow Shadcn UI, Radix, and Tailwind for styling
- Use named exports for components and lowercase with dashes for directories
- Prefer early returns for better readability
- Use descriptive variable names with auxiliary verbs (isLoading, hasError)
- For event handlers, use "handle" prefix (handleClick, handleSubmit)
- Implement accessibility features (aria-labels, keyboard navigation)
- Optimize components with Suspense and dynamic loading
- Follow mobile-first responsive design with Tailwind
- Add the above to memory

## Project Documentation

- [README.md](./README.md) - Main project overview and introduction
- [Feature Roadmap](./apps/app/docs/roadmap.md) - Planned features and development timeline
- [ERD Diagram](./erd-diagram.mermaid) - Entity relationship diagram for the database

## Claude Tasks

## Claude Tasks

### Research and Analysis

- **Deep Research**: Comprehensive extraction and analysis of entities from external content
  - See [Deep Research Extension Plan](docs/agent-notes/deep-research-extension-plan.md) for implementation details
  - Focuses on extracting new information and entities from external sources
  - Works with unstructured content that needs processing

- **Analysis**: Relationship discovery between selected entities in the mind map
  - Operates on internal data (nodes already in the mind map)
  - Focuses on understanding relationships between selected elements
  - Shows patterns, connections, and insights about the selected data

### Agent Architecture

The project implements a modular agentic architecture for orchestrating research and analysis tasks:

- **Agent Coordinator**: Orchestrates specialized agents for different tasks
- **Specialized Agents**: Content extraction, validation, relationship analysis
- **Process Definitions**: Structured workflows for research and analysis

For full implementation details, see the [Agentic Architecture Plan](docs/agent-notes/agentic-architecture-plan.md).

## AI Agent Roles

The project uses specialized AI agent roles to support different aspects of the platform:

1. **Historical Timeline Analyst** - Organizes chronological UFO events and identifies patterns
2. **Data Visualization Specialist** - Creates optimal visualizations for UFO/UAP data
3. **Claims & Evidence Evaluator** - Assesses credibility of testimonies and evidence
4. **Research Network Mapper** - Maps connections between people, events, and locations
5. **Documentation Librarian** - Curates and organizes UFO-related documentation

## Project Vision

For a comprehensive overview of the project vision and features, see the [project pitch document](docs/pitch.md) which outlines:

- Core data models (Events, Testimonies, Key Figures, Organizations, Topics, etc.)
- Interactive visualization capabilities
- Topic tracking and relationship mapping
- User contribution and community features
- Educational components and multimedia integration

The platform aims to be the definitive resource for tracking the state of UFO/UAP disclosure as it unfolds.
