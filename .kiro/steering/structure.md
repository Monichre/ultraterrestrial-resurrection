# Project Structure

## Monorepo Organization
UltraTerrestrial follows a monorepo pattern with Turborepo, organized into applications and shared packages.

```
ultraterrestrial-resurrection/
├── apps/                    # Applications (3 main apps)
├── packages/               # Shared packages (5 packages)
├── docs/                   # Project documentation
├── scripts/                # Build and utility scripts
└── *.md                   # Root documentation files
```

## Applications (`/apps/`)

### Main App (`/apps/app/`)
Primary Next.js application with the research platform interface.

**Key Structure:**
```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (site)/            # Public site routes
│   └── api/               # API endpoints
├── components/            # UI components (50+ categories)
├── features/              # Feature modules
│   ├── mindmap/           # Enhanced nodes, spatial grouping, tours
│   ├── 3d/                # Three.js visualizations
│   ├── ai/                # AI integration and chat
│   └── data-viz/          # Data visualization components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
└── utils/                 # Helper functions
```

### Disclosure RAG (`/apps/disclosure-rag/`)
Python-based RAG system with triple backend architecture.

**Key Structure:**
```
lib/
├── adapters/              # RAG system adapters
├── storage/               # Vector storage backends
├── entity_extraction/     # NER and entity processing
└── visualization/         # Data visualization tools
agents/                    # AI agent implementations
scripts/                   # Batch processing scripts
```

### Research Canvas (`/apps/research-canvas/`)
TipTap-based research editor with AI integration.

## Shared Packages (`/packages/`)

### Database (`/packages/db/`)
Xata integration with 29 entity models and 230,998+ records.

**Key Files:**
- `xata/models/` - Database entity definitions
- `xata/api/` - Database utilities (ask, search, xyflow integration)
- `xata/client.ts` - Xata client configuration

### AI (`/packages/ai/`)
AI processing components and external service integrations.

**Key Areas:**
- `components/` - AI UI components
- `integrations/` - External APIs (EXA, Firecrawl, Tavily)
- `prometheus/` - Advanced AI system

### Services (`/packages/services/`)
External service clients and deep research capabilities.

### Knowledge Base (`/packages/knowledge-base/`)
Document management with 448+ documents across case files and transcripts.

## File Naming Conventions

### Components
- **PascalCase** for React components: `EntityNetworkGraph.tsx`
- **kebab-case** for files: `entity-network-graph.tsx`
- **Storybook stories**: `ComponentName.stories.tsx`

### Features
- **kebab-case** directories: `mindmap/`, `data-viz/`
- **camelCase** for hooks: `useSpatialGrouping.ts`
- **PascalCase** for contexts: `MindmapContext.tsx`

### Database
- **kebab-case** for model files: `event-subject-matter-experts.ts`
- **camelCase** for API utilities: `askXata.ts`

## Import Patterns

### Workspace Imports
```typescript
import { XataClient } from '@db/xata'
import { askXata } from '@db/xata/api'
import { AIComponent } from '@repo/ai'
```

### Relative Imports
```typescript
// Within same feature
import { MindmapNode } from './components'
import { useSpatialGrouping } from '../hooks'

// Cross-feature (avoid when possible)
import { DataVizComponent } from '../../data-viz'
```

## Code Organization Principles

### Feature-First Structure
Group related functionality together rather than by file type:
```
features/mindmap/
├── components/
├── hooks/
├── utils/
├── types/
└── index.ts
```

### Shared vs Feature-Specific
- **Shared components** go in `/src/components/`
- **Feature-specific** components stay within feature directories
- **Cross-feature** dependencies should be minimal

### AI Integration Patterns
- **Contextual Intelligence** is the foundation layer
- **Enhanced Nodes** serve as the common UI layer
- **Spatial Intelligence** builds on contextual intelligence
- **Smart Tours** leverage both contextual and spatial systems

## Documentation Structure

### Root Level
- `README.md` - Project overview
- `ARCHITECTURE_OVERVIEW.md` - **MANDATORY FIRST READ**
- `PROJECT_STRUCTURE.md` - Detailed structure guide
- `TODO.md` - Active development tasks

### Feature Documentation
- Each major feature has its own documentation
- Work logs track implementation progress
- Agent documentation in `/docs/` and specialized directories

## Development Workflow

### New Components
1. Use `bun run new` for component generation
2. Create Storybook stories for UI components
3. Follow established naming conventions
4. Add to appropriate feature or shared location

### Database Changes
1. Update Xata schema through Xata dashboard
2. Run `xata codegen` to update types
3. Update model files in `/packages/db/xata/models/`
4. Test integration with existing systems

### AI Integration
1. Leverage existing Contextual Intelligence foundation
2. Use Enhanced Nodes for UI consistency
3. Follow "orchestration over replacement" philosophy
4. Maintain backward compatibility with existing systems