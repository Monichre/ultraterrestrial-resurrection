# UltraTerrestrial Project: Product Requirements Document

## 1. Project Overview

### 1.1 General Description

UltraTerrestrial is a comprehensive platform designed to document, explore, and disseminate information about UFO/UAP (Unidentified Flying Objects/Unidentified Aerial Phenomena) topics. The project strives to create an engaging, interactive experience that allows users to explore historical events, track disclosure progress, analyze interconnected topics, and investigate evidence related to the UFO/UAP phenomena.

The platform combines cutting-edge visualization technologies, data management systems, and AI-powered analysis tools to present complex information in an accessible and engaging manner. UltraTerrestrial aims to be the definitive resource for researchers, enthusiasts, and the general public interested in the UFO/UAP subject matter.

### 1.2 Technology Stack

UltraTerrestrial is built on a modern, scalable technology stack:

**Frontend:**
- Next.js 15.x (React 19.x) as the core framework
- Three.js and React Three Fiber for 3D visualizations
- Tailwind CSS for styling
- Framer Motion for animations
- D3.js for data visualization
- MapBox/React-Map-GL for geographical displays
- Radix UI components for accessible UI elements

**Backend & Data:**
- Xata.io for database and vector storage
- OpenAI and Anthropic for AI capabilities
- Upstash for queue management and workflows
- Vercel for hosting and deployment
- Clerk for authentication

**Development Tools:**
- TypeScript for type safety
- ESLint and Prettier for code quality
- Storybook for component documentation
- Turborepo for monorepo management
- Bun for JavaScript runtime and package management

### 1.3 Key Objectives and Features

The UltraTerrestrial platform aims to deliver the following core features:

1. **Historical UFO Event Chronology**
   - Interactive 3D visualization of global UFO sightings
   - Timeline navigation with filtering capabilities
   - Detailed event documentation and analysis

2. **Disclosure Status Tracking**
   - Real-time updates on claims, hearings, and news
   - Progress indicators for disclosure milestones
   - Historical context for current developments

3. **Topic Analysis & Knowledge Graph**
   - Network visualization of connected topics and entities
   - Pattern recognition and trend analysis
   - AI-powered insight generation

4. **Key Figures Database**
   - Profiles of notable individuals in the UFO/disclosure space
   - Timeline of their involvement and contributions
   - Network analysis of relationships and connections

5. **Investigation Hub**
   - Evidence mapping and visualization
   - Collaborative research and analysis tools
   - Pattern recognition across disparate data points

6. **Digital Archive**
   - Searchable repository of documents and artifacts
   - Metadata tagging and cross-referencing
   - Chain of custody tracking

7. **Classified Locations Registry**
   - Mapping of suspected facilities
   - Historical activity analysis
   - Geospatial correlation with events

8. **Advanced Search and AI Integration**
   - Natural language query capabilities
   - AI-assisted research and content generation
   - Semantic search and vector embeddings

## 2. Monorepo Structure

The UltraTerrestrial project is organized as a monorepo using Turborepo, containing multiple applications and shared packages. This architecture promotes code reuse, maintains consistency across applications, and simplifies dependency management.

### 2.1 Apps Directory

The `/apps` directory contains standalone applications:

#### 2.1.1 `app` (Next.js Frontend)

The main user-facing application built with Next.js. This app implements the core user interface, data visualization components, and integration with backend services.

**Key Subdirectories:**
- `/src/app`: Next.js app router pages and API endpoints
- `/src/components`: UI components organized by functionality
- `/src/features`: Feature-specific modules and components
- `/src/lib`: Integration with external services (OpenAI, Anthropic, etc.)
- `/src/services`: Business logic and data processing services
- `/src/db`: Database connection and query modules
- `/src/contexts`: React context providers for state management
- `/src/hooks`: Custom React hooks
- `/src/utils`: Utility functions and helpers

The application follows the Next.js app router structure, with route groups for authentication (`(auth)`) and main site content (`(site)`).

#### 2.1.2 `agent-ui` (Agent Interface)

A specialized interface for administrative users and AI agents to manage data processing, curation, and knowledge base operations. It consists of:

- `back-end`: API and processing logic
- `front-end`: Administrative user interface

#### 2.1.3 `cli` (Command Line Interface)

A NodeJS CLI tool for data processing, importing, and database management operations. The CLI handles the ETL (Extract, Transform, Load) pipeline for various data sources.

**Main Features:**
- File discovery and onboarding
- Data processing and transformation
- Content review and validation
- Database insertion
- Status reporting and system monitoring

The CLI follows a modular command structure with specialized subcommands for each stage of the data processing pipeline.

#### 2.1.4 `disclosure-rag` (Retrieval-Augmented Generation)

A Python-based application for processing documents, extracting information, and implementing Retrieval-Augmented Generation (RAG) capabilities. This app handles:

- YouTube transcript generation
- Web content scraping and processing
- PDF document analysis
- Content summarization
- Vector embedding generation
- OpenAI integration for processing and analysis

### 2.2 Packages Directory

The `/packages` directory contains shared libraries and resources:

#### 2.2.1 `knowledge-base`

A centralized repository of data resources that can be imported and used across different applications. It contains:

- `case_files`: Documented UFO case information
- `transcripts`: Processed transcripts from videos and interviews
- `vector-store-files`: Files prepared for vector database storage
- `prompts`: Reusable AI prompt templates
- `python`: Python utilities for data processing
- `external_resources.json`: Configuration for external data sources

This package serves as a single source of truth for content that needs to be accessible across all applications.

#### 2.2.2 `docs`

Project documentation, architectural diagrams, and development guides. Includes:

- `agent-notes`: Documentation for AI agent behaviors
- `code-quality`: Code standards and best practices
- `personnel`: Information about key figures
- ERD diagrams and database schema documentation

## 3. Core Components & Features

### 3.1 3D Visualization Capabilities

The UltraTerrestrial platform features advanced 3D visualization components:

#### 3.1.1 Entity Network Graph

`EntityNetworkGraph3D` is a core visualization component that renders a force-directed 3D graph showing relationships between different entities (topics, events, personnel, etc.). It uses:

- `react-force-graph` for 3D graph rendering
- Custom node and edge styling based on entity types
- Interactive camera controls and node navigation
- Color-coding based on entity categories

The graph visualizes complex relationships between topics, personnel, events, organizations, and other entities, allowing users to explore connections and discover patterns.

#### 3.1.2 Globe Visualizations

Multiple globe visualization components display geographical data:

- Interactive Earth model showing event locations
- Heatmap overlays for sighting concentrations
- Time-based animation of sighting patterns
- Location-based filtering and exploration

These visualizations leverage Three.js, R3F (React Three Fiber), and specialized globe libraries like `react-globe.gl` and `three-globe`.

#### 3.1.3 Sci-Fi UI Components

The application features a rich set of sci-fi themed UI components that enhance the user experience:

- HUD (Heads-Up Display) interface elements
- Glitch effects and distortion animations
- Futuristic data panels and information displays
- Dynamic graph paper backgrounds
- Custom loaders and progress indicators

### 3.2 Database Integration

The application integrates with Xata.io for database storage, retrieval, and vector search capabilities:

#### 3.2.1 Data Access Layer

The data access layer (`/src/db/xata`) provides:

- Type-safe database client generation
- Table-specific CRUD operations
- Relationship handling and joins
- Serialization methods for frontend consumption

#### 3.2.2 Vector Search

Vector search functionality allows semantic searching across:

- Document content with embeddings
- Transcript analysis
- Entity similarity matching
- Related content discovery

#### 3.2.3 Ask API

The platform implements natural language query capabilities using Xata's Ask API:

- Question-answering functionality
- Context-aware responses
- Evidence-based information retrieval
- Citation of sources

### 3.3 Data Processing Pipeline

The data processing pipeline spans multiple applications:

#### 3.3.1 Data Collection

- YouTube transcript generation via `disclosure-rag`
- Web scraping for relevant content
- PDF document processing
- User-submitted content handling

#### 3.3.2 Data Processing

- Text analysis and entity extraction
- Content summarization and enrichment
- AI-driven metadata generation
- Vector embedding creation

#### 3.3.3 Data Storage

- Structured database records in Xata
- File storage for documents and media
- Vector storage for semantic search
- Relationship mapping and linking

#### 3.3.4 Data Visualization

- Network graph rendering
- Timeline representation
- Geographical mapping
- Statistical analysis displays

### 3.4 Knowledge Graph

The knowledge graph system represents the interconnected nature of UAP/UFO data:

#### 3.4.1 Entity Types

Major entity types in the knowledge graph include:

- Topics (subject areas, phenomena types)
- Events (specific sightings, incidents, hearings)
- Personnel (researchers, witnesses, officials)
- Organizations (government agencies, research groups)
- Testimonies (witness accounts, statements)
- Documents (reports, papers, declassified files)
- Locations (bases, sighting locations, facilities)
- Artifacts (physical evidence, media)

#### 3.4.2 Relationship Types

Entities are connected through various relationship types:

- Subject-matter expertise (connecting personnel to topics)
- Event participation (linking personnel to events)
- Organizational membership (connecting personnel to organizations)
- Testimonial relationships (linking witnesses to events)
- Documentary evidence (connecting documents to events/topics)
- Spatial relationships (linking events to locations)

The knowledge graph powers navigation, discovery, and AI-driven insights throughout the platform.

### 3.5 UI Component System

The application features an extensive UI component system with specialized categories:

#### 3.5.1 Sci-Fi Themed Interface

- Custom sci-fi HUD components
- Animated interface elements
- Particle effects and visual enhancements
- Glitch and distortion effects

#### 3.5.2 Data Visualization Components

- Charts and graphs for statistical representation
- Timeline components for chronological display
- Map components for geographical data
- Network diagrams for relationship visualization

#### 3.5.3 Interactive Elements

- Draggable elements
- Animated transitions
- Cursor effects and interactions
- Modal and drawer components

The UI system balances aesthetic appeal with usability, creating an immersive yet functional experience.

## 4. Data Model

### 4.1 Entity Relationships

The UltraTerrestrial data model consists of interconnected tables representing different entity types:

#### 4.1.1 Core Entities

1. **Topics**
   - Properties: name, summary, photo, photos, title, embedding
   - Relationships: subject-matter-experts, testimonies, events

2. **Personnel**
   - Properties: bio, role, photo, rank, credibility, popularity, name, authority, embedding
   - Relationships: organizations, events, topics, testimonies, documents

3. **Events**
   - Properties: name, description, location, coordinates, date, photos, metadata, title, summary, category, embedding
   - Relationships: subject-matter-experts, testimonies, topics

4. **Organizations**
   - Properties: name, specialization, description, photo, image, title, embedding
   - Relationships: members, testimonies, documents

5. **Sightings**
   - Properties: date, description, media_link, location details, shape, duration, comments, date_posted, coordinates
   - Relationships: user-saved-sightings

6. **Testimonies**
   - Properties: claim, summary, documentation, date, source, media, context, embedding
   - Relationships: witness, event, organization, topics

7. **Documents**
   - Properties: file, summary, embedding, title, date, url, metadata, images
   - Relationships: author, organization

8. **Artifacts**
   - Properties: name, description, photos, date, source, origin, images, embedding

#### 4.1.2 Junction Tables

1. **Event-Subject-Matter-Experts**
   - Links events to subject matter experts (personnel)

2. **Topic-Subject-Matter-Experts**
   - Links topics to subject matter experts (personnel)

3. **Organization-Members**
   - Links organizations to personnel members

4. **Topics-Testimonies**
   - Links topics to testimonies

5. **Event-Topic-Subject-Matter-Experts**
   - Complex relationship linking events, topics, and experts

#### 4.1.3 User-Related Tables

1. **Users**
   - Properties: email, name, photo, profile_image_url, external_id
   - Relationships: saved content, theories, mindmaps

2. **User Theories**
   - Properties: name, content, synopsis, diagrams
   - Relationships: saved entities (events, topics, personnel, etc.)

3. **User-Saved Entities**
   - Various tables tracking user-saved content (events, topics, personnel, etc.)
   - Each includes notes and connections to theories

### 4.2 Storage and Retrieval Patterns

The application employs several data access patterns:

#### 4.2.1 Direct Retrieval

- Single entity lookup by ID or unique property
- Relationship traversal for connected entities
- Filtered list retrieval with sorting and pagination

#### 4.2.2 Search Capabilities

- Full-text search across entity properties
- Vector search for semantic similarity
- Fuzzy matching for approximate results
- Faceted search with filtering options

#### 4.2.3 Aggregation and Analysis

- Entity count and distribution analysis
- Relationship density and connectivity metrics
- Temporal analysis for event patterns
- Geographical clustering and distribution

## 5. Development Workflow

### 5.1 Environment Setup

The UltraTerrestrial project utilizes a consistent development environment:

#### 5.1.1 Local Development

- Node.js/Bun for JavaScript runtime
- Python environment for disclosure-rag
- Environment variables (.env files) for configuration
- Local database setup with Xata CLI

#### 5.1.2 Development Commands

```bash
# Start the main app in development mode
bun run dev:app

# Run Storybook for component development
bun run storybook

# Build the main application
bun run build:app

# Run CLI commands
cd apps/cli && bun run dev
```

### 5.2 Build and Deployment

The project uses a structured build and deployment process:

#### 5.2.1 Build Pipeline

1. Dependency installation
2. Type checking with TypeScript
3. Linting with ESLint
4. Building with Next.js/Turborepo
5. Testing with Jest (when applicable)

#### 5.2.2 Deployment

- Vercel deployment for web applications
- Docker containerization for server components (where applicable)
- Environment-specific configuration management

### 5.3 Testing Approach

The project employs multiple testing strategies:

#### 5.3.1 Component Testing

- Storybook for visual testing and component documentation
- Unit tests for utility functions and isolated components
- Integration tests for connected component systems

#### 5.3.2 Data Integrity Testing

- Schema validation for data import/export
- Relationship integrity checks
- Data transformation validation

### 5.4 Code Quality Standards

The project maintains quality through:

- TypeScript for type safety and IDE support
- ESLint for code style and best practices
- Prettier for consistent formatting
- Code reviews and pull request workflows

## 6. Future Roadmap

Based on the project's current state and roadmap documentation, the following features and enhancements are planned for future development:

### 6.1 Near-Term Priorities

#### 6.1.1 Core Feature Enhancements

- **Advanced 3D Visualizations**
  - Implement AR integration for historical sighting visualization
  - Enhance heatmap displays with temporal analysis
  - Improve interactive world map performance and detail

- **Topic Tracker Improvements**
  - Dynamic topic mapping with machine learning categorization
  - Enhanced interconnection visualization
  - Trending topics algorithm implementation

- **Digital Archive Expansion**
  - Implement document scanning and OCR capabilities
  - Develop detailed metadata and annotation systems
  - Create interactive exhibits and guided tours

#### 6.1.2 User Experience Improvements

- **Community and User Engagement**
  - User accounts with personalized dashboards
  - Contribution tracking and recognition system
  - Topic-specific discussion forums

- **Mobile Optimization**
  - Responsive design improvements
  - Native mobile app development
  - Push notification system

### 6.2 Mid-Term Development Goals

#### 6.2.1 Advanced Analytical Capabilities

- **Data Analytics and Insights**
  - Trend analysis visualization
  - Predictive modeling using AI
  - Custom report generation

- **Investigation Hub Enhancement**
  - Threaded research paths implementation
  - Verification system for user-submitted information
  - Advanced filtering and search capabilities

#### 6.2.2 Content Expansion

- **Multimedia Integration**
  - Video library with curated content
  - Podcast and audio content hosting
  - User-submitted media management

- **Educational Resources**
  - Interactive learning modules
  - Expert webinars and live streams
  - Knowledge assessment tools

### 6.3 Long-Term Vision

#### 6.3.1 Platform Expansion

- **API and Integration**
  - Developer access through public API
  - Integration with external research platforms
  - Data export and sharing capabilities

- **Monetization Strategies**
  - Freemium model implementation
  - Premium subscription features
  - Merchandise and affiliate partnerships

#### 6.3.2 Advanced Research Tools

- **AI-Powered Analysis**
  - Automated pattern recognition
  - Cross-source correlation
  - Anomaly detection systems

- **Collaborative Research Environment**
  - Peer review system
  - Collaborative editing tools
  - Expert validation workflows

### 6.4 Implementation Considerations

#### 6.4.1 Technical Challenges

- **Data Accuracy and Verification**
  - Implement robust verification systems
  - Develop multi-source cross-referencing
  - Create community moderation tools

- **Scalability**
  - Optimize database performance for increased data volume
  - Implement caching strategies
  - Enhance real-time capabilities

#### 6.4.2 User Growth Strategy

- **Marketing and Community Building**
  - Targeted social media campaigns
  - Influencer partnerships
  - Content marketing strategy

- **User Retention**
  - Gamification elements
  - Regular content updates
  - Community engagement initiatives

## 7. Conclusion

The UltraTerrestrial project represents an ambitious platform dedicated to documenting and exploring UFO/UAP phenomena through a rich, interactive, and comprehensive experience. By leveraging cutting-edge technologies for visualization, data management, and AI-powered analysis, the platform aims to become the definitive resource for researchers, enthusiasts, and the general public interested in this domain.

The monorepo architecture, with its specialized applications and shared packages, provides a solid foundation for continued development and feature expansion. The comprehensive data model and knowledge graph approach enable powerful navigation, discovery, and insight generation capabilities that will evolve as the platform grows.

As development progresses according to the roadmap, UltraTerrestrial will continue to enhance its core features while expanding into new areas of functionality, always maintaining its commitment to accessibility, user engagement, and data integrity.
