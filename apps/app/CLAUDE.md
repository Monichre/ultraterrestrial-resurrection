# CLAUDE.md - Project Guidelines

## Build and Development Commands

- `bun dev` or `npm run dev` - Start development server
- `bun build` or `npm run build` - Build for production
- `bun lint` or `npm run lint` - Run ESLint
- `bun storybook` or `npm run storybook` - Launch Storybook
- `bun new` or `npm run new` - Use plop to scaffold components
- Testing: `bun vitest`, `bun vitest --browser`, `bun vitest --coverage`
- Use Bun - always

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

- [README.md](../../README.md) - Main project overview and introduction
- [Feature Roadmap](./apps/app/docs/roadmap.md) - Planned features and development timeline
- [ERD Diagram](./erd-diagram.mermaid) - Entity relationship diagram for the database
- `repomix-output.md`

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
clau

**Project Summary:** *`./repomix-output.md`

- You are in charge of completing the personnel ranking system feature. Docs can be found here: .cursor/rules/features/personnel-ranking-system.mdc

- Remember everything we've discussed

## Smart Tour Integration

### Phase 1 Completion Work Log

Key Highlights:
- Phase 1 COMPLETED: Smart Node Integration with 5 badge types
- Integration Score: Improved from 65% to 85%
- Enhanced Nodes: Now 100% integrated (was 10%)
- Zero Breaking Changes: All existing functionality preserved

Technical Achievements:
- Smart badge system with tour context awareness
- Historical significance detection with timeline analysis
- Staggered animations (0.1-0.4s delays) for polished UX
- Multi-field date parsing for robust temporal context

Ready for Phase 2:
- The foundation is now solid for Spatial Intelligence Integration - connecting tours with auto-grouping and proximity analysis
- The work log is saved as a standalone file that can be referenced for project documentation and progress tracking