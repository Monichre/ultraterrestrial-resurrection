# Code Style and Conventions

## TypeScript/React Code Style

### File Naming
- **Components**: PascalCase for components, kebab-case for files
- **Example**: `Button.tsx`, `user-profile.tsx`
- **Directories**: kebab-case (`user-dashboard/`, `file-upload/`)

### Prettier Configuration (.prettierrc)
```json
{
  "semi": false,                    # No semicolons
  "singleQuote": true,             # Single quotes preferred
  "trailingComma": "es5",          # Trailing commas where valid in ES5
  "printWidth": 100,               # Line width: 100 characters
  "tabWidth": 2,                   # 2 space indentation
  "useTabs": false,                # Spaces, not tabs
  "bracketSpacing": false,         # No spaces in object brackets
  "arrowParens": "always",         # Always parentheses around arrow function args
  "jsxSingleQuote": true,          # Single quotes in JSX
  "jsxBracketSameLine": true       # JSX closing bracket on same line
}
```

### ESLint Rules (.eslintrc)
- **Extends**: `next/core-web-vitals`, `prettier`, `next`
- **Key Rules**:
  - `react/no-unescaped-entities`: "off"
  - `react/display-name`: "off" 
  - `@next/next/no-img-element`: "off"
  - `no-unused-vars`: "warn"
  - `@typescript-eslint/no-explicit-any`: "off"
  - `prefer-const`: "warn"

### Component Structure
```tsx
import {Slot} from '@radix-ui/react-slot'
import {type VariantProps, cva} from 'class-variance-authority'
import * as React from 'react'

import {cn} from '@/utils'

// Component definition with forwardRef
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({className, variant, size, asChild = false, ...props}, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({variant, size, className}))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export {Button, buttonVariants}
```

## Python Code Style (RAG System)

### File Organization
- **Snake_case** for Python files: `process_entities.py`, `main.py`
- **Classes**: PascalCase
- **Functions/Variables**: snake_case
- **Constants**: UPPER_SNAKE_CASE

### Dependencies (requirements.txt)
- **Core**: `python-dotenv`, `openai`, `anthropic`, `streamlit`
- **Data**: `pandas`, `numpy`, `PyPDF2`, `langchain`
- **AI/ML**: `sentence-transformers`, `faiss-cpu`, `tiktoken`
- **Vector Storage**: `upstash-vector`, `upstash-redis`

## Import Patterns

### Frontend (@apps/app/)
```tsx
// Database imports
import {XataClient} from '@db/xata'
import {askXata, searchXata} from '@db/xata/api'

// Core AI features
import {EnhancedEntityNodePOC} from '@/features/mindmap/nodes/enhanced-node-poc'
import {useSpatialGrouping} from '@/features/mindmap/hooks/use-spatial-grouping'

// Cross-package
import {AIComponent} from '@repo/ai'
```

### Backend (disclosure-rag/)
```python
# Core dependencies
from dotenv import load_dotenv
import openai
import streamlit as st

# Local modules
from lib.adapters.dual_rag_adapter import DualRAGAdapter
from agents.content_analysis_agent import ContentAnalysisAgent
```

## Project-Specific Conventions

### Component Organization
- **Feature-first structure**: Group related functionality together
- **Enhanced Nodes**: Common UI layer across ALL features
- **Contextual Intelligence**: Powers smart badges, filtering, suggestions
- **Spatial Intelligence**: Builds on contextual intelligence foundation

### Database Naming
- **Entity Models**: PascalCase (`Events`, `Testimonies`, `Personnel`)
- **Fields**: camelCase (`createdAt`, `updatedAt`, `fullName`)
- **Relationships**: kebab-case files (`event-subject-matter-experts.ts`)

### Documentation Standards
- **Always timestamp** documentation updates (EXACT DATE AND TIME)
- **Update CLAUDE.md** when finishing incremental tasks
- **Prefer editing** existing files over creating new ones
- **Never create** documentation files unless explicitly requested

## Critical Development Principles

### "Orchestration over Replacement"
- Existing AI infrastructure is sophisticated and well-integrated
- **85% AI connectivity** represents advanced integration, NOT incomplete work
- Enhance existing systems rather than rebuild them
- Contextual Intelligence is the foundation - all other systems depend on it

### File Organization Rules
- Use `@/` imports for apps/app paths
- Use workspace imports for packages (`@db/xata`, `@repo/ai`)
- Follow established patterns for consistency
- Enhanced Nodes serve as common UI layer across features