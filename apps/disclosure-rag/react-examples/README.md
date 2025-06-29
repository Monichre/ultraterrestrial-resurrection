# UFO/UAP Knowledge Base - React Integration

This directory contains TypeScript React components and API utilities for building a custom dashboard interface to access the UFO/UAP Knowledge Base.

## Quick Start

### 1. Start the API Server

```bash
cd apps/disclosure-rag
./launch_api.sh
```

The API will be available at `http://localhost:8000` with interactive docs at `http://localhost:8000/docs`

### 2. Install in Your React Project

Copy these files to your React/NextJS project:

```
src/
├── lib/
│   └── api.ts                 # API functions
├── hooks/
│   └── useKnowledgeBase.ts    # React hooks
└── components/
    ├── KnowledgeBaseDashboard.tsx
    ├── StatsOverview.tsx
    └── [other components]
```

### 3. Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 4. Usage in Your App

```tsx
import { KnowledgeBaseDashboard } from './components/KnowledgeBaseDashboard';

export default function App() {
  return <KnowledgeBaseDashboard />;
}
```

## API Endpoints

### Core Endpoints

- `GET /stats` - Knowledge base statistics
- `GET /documents` - List documents with filtering
- `GET /documents/{id}` - Get specific document
- `GET /search` - Search documents
- `GET /tags` - Available tags
- `GET /categories` - Document categories

### Example API Calls

```typescript
import { getStats, searchDocuments, getDocuments } from './lib/api';

// Get overview statistics
const stats = await getStats();

// Search for UFO sightings
const results = await searchDocuments({ 
  query: 'UFO sighting', 
  docType: 'transcript' 
});

// Get CIA documents
const ciaDoc = await getDocuments({ 
  tags: 'cia', 
  limit: 10 
});
```

## React Hooks

### `useKnowledgeBaseStats()`
```tsx
const { stats, loading, error, refetch } = useKnowledgeBaseStats();
```

### `useDocuments(filters)`
```tsx
const { 
  documents, 
  loading, 
  hasMore, 
  loadMore, 
  refresh 
} = useDocuments({ docType: 'case_file' });
```

### `useSearch()`
```tsx
const { results, loading, search, clearResults } = useSearch();

// Search for documents
search({ query: 'Project Blue Book', limit: 20 });
```

## Data Types

The API returns strongly-typed data:

```typescript
interface DocumentSummary {
  id: string;
  title: string;
  doc_type: 'case_file' | 'transcript' | 'article' | 'research';
  path: string;
  modified: string;
  file_type: string;
  tags: string[];
  size_mb?: number;
  size_kb?: number;
  category?: string;    // For case files
  topic?: string;       // For transcripts
  date_folder?: string; // For transcripts
}
```

## Component Architecture

### KnowledgeBaseDashboard
Main dashboard component with tabs for overview, search, and browsing.

### StatsOverview 
Displays knowledge base statistics with charts and metrics.

### DocumentList
Renders paginated document lists with infinite scroll.

### FilterPanel
Sidebar with filtering options by type, tags, and categories.

### DocumentSearch
Search input with real-time suggestions.

## Customization

### Styling
Components use Tailwind CSS classes. Customize the design by:

1. Modifying the className props
2. Creating your own CSS modules
3. Using your preferred styling system (styled-components, emotion, etc.)

### Data Processing
Add custom data transformations in the hooks:

```typescript
const enhancedDocuments = useMemo(() => {
  return documents.map(doc => ({
    ...doc,
    customField: processDocument(doc)
  }));
}, [documents]);
```

### Additional Features
Extend the dashboard with:

- Document preview modals
- Advanced filtering
- Export functionality  
- Real-time updates via WebSocket
- Custom visualizations

## Production Deployment

### API Server
Deploy the FastAPI server using:
- **Docker**: Containerize with `uvicorn`
- **Cloud**: AWS Lambda, Google Cloud Run, etc.
- **VPS**: nginx + uvicorn

### Frontend
Deploy React app to:
- **Vercel**: Perfect for NextJS
- **Netlify**: Great for React SPA  
- **AWS S3 + CloudFront**: Static hosting

### Environment Setup
Update API URL for production:

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Available Data

The knowledge base contains **448 documents**:

- **31 PDF case files**: CIA documents, UAP reports, congressional hearings
- **407 transcripts**: Joe Rogan podcasts, military testimonies, disclosure interviews  
- **10 research articles**: Academic papers and investigations

### Document Categories

**Case Files:**
- CIA Documents (RDP series)
- UFO/UAP Reports  
- Project Blue Book files
- Congressional Hearings
- Witness Testimony
- Roswell Incident files

**Transcripts:**
- Joe Rogan Podcast episodes
- Military/Navy testimonies
- Disclosure-related interviews
- David Grusch testimonies
- Luis Elizondo interviews

### Search Examples

```typescript
// Find all CIA documents
searchDocuments({ query: 'CIA', docType: 'case_file' })

// Military testimonies about UFOs
searchDocuments({ query: 'military UFO testimony' })

// Recent disclosure interviews  
searchDocuments({ query: 'disclosure', tags: 'elizondo' })

// Project Blue Book files
searchDocuments({ query: 'Blue Book' })
```

## Support

- **API Documentation**: Visit `http://localhost:8000/docs` when running
- **Health Check**: `GET /health` endpoint for monitoring
- **Error Handling**: All hooks include error states
- **TypeScript**: Full type safety included

This integration provides a complete foundation for building sophisticated UFO/UAP research dashboards with modern React patterns.