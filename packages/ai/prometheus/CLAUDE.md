# CLAUDE.md

This file provides guidance to Claude when working with code in this repository.

## Project Overview

Prometheus AI is a Next.js research assistant application specialized in UFO/UAP (Unidentified Aerial Phenomena) information. The application provides an interactive AI agent interface with advanced document processing capabilities and immersive visual effects.

### Key Features

- Conversational AI agent with file upload and analysis capabilities
- Two distinct AI personalities: Prometheus and Daedalus frameworks
- Document processing tools (summarization, topic extraction, contextualization)
- Three.js background visualization with custom shader effects
- Modern UI built with Radix UI and Tailwind CSS

## Development Setup

### Installation & Commands

```bash
# Install dependencies
bun install

# Development server
bun run dev

# Production build
bun run build

# Start production server
bun run start

# Code linting
bun run lint
```

## Architecture Overview

### Core Technologies

- **Next.js**: React framework with TypeScript
- **Anthropic Claude**: AI model integration via AI SDK
- **React Three Fiber**: 3D visualization and shader effects
- **Framer Motion**: UI animations and transitions
- **Tailwind CSS + Radix UI**: Styling and component system
- **Storybook**: Component development environment

### Project Structure

```
app/
├── api/agent/           # AI agent API endpoints
├── layout.tsx           # Application layout
└── page.tsx            # Main landing page

components/
├── ui/                 # Reusable UI components
├── agent.tsx           # Main chat interface
├── CirclesShader.tsx   # Three.js visual effects
├── document-*.tsx      # Document processing components
└── error-boundary.tsx  # Error handling

lib/
├── prometheus.prompts.ts # Prometheus AI framework
├── daedalus.prompt.ts   # Daedalus AI framework
└── build-prompt.ts      # Prompt construction utilities

utils/
├── file-processing.ts   # Document analysis utilities
└── pdf-fallback.ts      # PDF processing fallbacks
```

## Core Components

### AI Agent Interface (`components/agent.tsx`)

The primary chat interface handling:
- User input and conversation management
- File upload and processing workflows
- Command palette with slash commands (`/analyze`, `/ingest`, `/research`, `/connect`)
- Real-time document analysis features

### API Integration (`app/api/agent/route.ts`)

Server endpoint managing:
- Anthropic Claude API communication
- Framework switching between Prometheus and Daedalus
- Custom tools for document analysis (illuminate, summarize, contextualize)
- Error handling and response formatting

### Document Processing System

Comprehensive file handling supporting:
- **Text formats**: Plain text, Markdown
- **Documents**: PDF (with PDF.js and fallback support)
- **Images**: Various formats with analysis capabilities
- **Processing tools**: Text extraction, summarization, topic identification

## AI Framework Design

### Prometheus Framework (`lib/prometheus.prompts.ts`)
Research-focused personality designed for "illuminating the unknown" with:
- Structured knowledge organization
- Analytical approach to UAP/UFO information
- Systematic information categorization

### Daedalus Framework (`lib/daedalus.prompt.ts`)
Navigation-oriented personality for "traversing information labyrinths" with:
- Complex information synthesis
- Contextual relationship mapping
- Strategic research guidance

## User Interface Features

### Interactive Elements
- **Command Palette**: Quick access to specialized functions
- **Document Options**: Context menus for file analysis
- **Loading States**: Visual feedback with typewriter animations
- **Error Handling**: Graceful degradation with toast notifications

### Visual Design
- **Three.js Background**: Custom shader effects and animations
- **Responsive Layout**: Mobile-first design approach
- **Accessibility**: ARIA compliance and keyboard navigation
- **Theme System**: Consistent styling with Tailwind CSS

## Implementation Details

### File Processing Pipeline
1. **Upload Detection**: Automatic file type identification
2. **Content Extraction**: Text parsing with PDF.js integration and fallbacks
3. **Analysis Tools**: Summarization, topic extraction, contextualization
4. **Response Integration**: Seamless incorporation into chat interface

### Error Handling Strategy
- **Boundary Components**: React error boundaries for component-level failures
- **API Resilience**: Graceful degradation for service interruptions
- **User Feedback**: Clear error messages and recovery suggestions
- **Fallback Systems**: Alternative processing methods for critical features

### Performance Optimizations
- **Build Configuration**: TypeScript and ESLint warnings suppressed in production
- **Asset Management**: Optimized Three.js rendering and shader compilation
- **Component Lazy Loading**: Strategic code splitting for faster initial loads

## Development Notes

### Current State
- Uses mock data for some responses (designed for extension with real data sources)
- Infrastructure prepared for URL ingestion functionality
- Storybook configured for component development and testing

### Configuration Files
- **Build Settings**: `next.config.mjs` with error suppression for production
- **Styling**: `tailwind.config.ts` with custom theme extensions
- **TypeScript**: `tsconfig.json` with strict type checking
- **Git Management**: Custom `.gitignore` for development artifacts

### Future Considerations
- Real data source integration for UAP/UFO information
- Enhanced document processing capabilities
- Additional AI framework personalities
- Extended visualization features


TO DO: 

1. Read @PROGRESS_REPORT.md - [PROGRESS REPORT](./PROGRESS_REPORT.md)
2. Read @STATUS.md - [STATUS REPORT](./STATUS.md)