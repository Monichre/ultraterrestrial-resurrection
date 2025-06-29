# Research Canvas - Knowledge Base Integration

A Next.js research interface that provides access to the complete UFO/UAP knowledge base with 448 classified documents.

## Features

### 🔬 Research Canvas
- Interactive evidence analysis interface
- Case management and tracking
- Evidence cards with classification levels
- Data grids and network visualization

### 📚 Knowledge Base Browser
- **448 Documents**: CIA files, transcripts, research papers
- **Real-time Search**: Full-text search across all documents
- **Advanced Filtering**: By document type, tags, categories
- **Statistics Dashboard**: Overview of the complete archive

### 🕸️ Evidence Network
- Connection mapping between entities
- Popular research topics visualization
- Tag-based relationship discovery

### 🔐 Security Features
- Classification banners and security controls
- Document access controls
- Secure API integration

## Quick Start

### 1. Start the Knowledge Base API

```bash
cd ../disclosure-rag
./launch_api.sh
```

The API will be available at `http://localhost:8000`

### 2. Launch Research Canvas

```bash
./launch.sh
```

The interface will be available at `http://localhost:3000`

## Architecture

### Frontend (Next.js)
- **React Components**: Modern UI components with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **Custom Hooks**: Data fetching and state management
- **Responsive Design**: Works on desktop and mobile devices

### Backend Integration
- **FastAPI**: Knowledge base REST API
- **Real-time Data**: Live access to 448 documents
- **Search Engine**: Full-text search with faceted filtering
- **Caching**: Optimized performance with smart caching

## Data Sources

The knowledge base contains:

- **31 PDF Case Files**: CIA documents, UAP reports, congressional hearings
- **407 Transcripts**: Joe Rogan podcasts, military testimonies, disclosure interviews  
- **10 Research Articles**: Academic papers and investigations

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

## Development

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_KNOWLEDGE_BASE_API_URL=http://localhost:8000
```

### Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Project Structure

```
apps/research-canvas/
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── integrated-dashboard.tsx   # Main dashboard
│   ├── knowledge-base-browser.tsx # Knowledge base interface
│   └── ...
├── hooks/
│   └── use-knowledge-base.ts  # Data fetching hooks
├── lib/
│   ├── knowledge-base-api.ts  # API client functions
│   └── utils.ts              # Utility functions
├── app/                      # Next.js app directory
├── utils/                    # Data utilities
└── ...
```

## API Integration

### Available Endpoints

- `GET /stats` - Knowledge base statistics
- `GET /documents` - List documents with filtering
- `GET /documents/{id}` - Get specific document
- `GET /search` - Search documents
- `GET /tags` - Available tags
- `GET /categories` - Document categories

### Example Usage

```typescript
import { getDocuments, searchDocuments } from './lib/knowledge-base-api';

// Get CIA documents
const ciaFiles = await getDocuments({ 
  tags: 'cia', 
  docType: 'case_file' 
});

// Search for UFO sightings
const results = await searchDocuments({ 
  query: 'UFO sighting', 
  limit: 20 
});
```

## Customization

### Adding New Components
1. Create component in `components/` directory
2. Export from main dashboard
3. Add to navigation tabs if needed

### Extending the API
1. Add new functions to `lib/knowledge-base-api.ts`
2. Create hooks in `hooks/use-knowledge-base.ts`
3. Use in components

### Styling
- Uses Tailwind CSS for styling
- Dark theme optimized for research environments
- Sci-fi inspired design with classification elements

## Security Considerations

- All API calls are client-side (no sensitive data exposure)
- Classification banners for document security
- Environment-based API URL configuration
- No authentication required for local development

## Troubleshooting

### API Connection Issues
1. Ensure the knowledge base API is running on port 8000
2. Check the `.env.local` file has the correct API URL
3. Verify no firewall is blocking the connection

### Missing Documents
1. Check the API health endpoint: `http://localhost:8000/health`
2. Verify the knowledge base is indexed
3. Check the API logs for errors

### Performance Issues
1. The initial load fetches statistics and first 20 documents
2. Search and filtering are optimized for large datasets
3. Pagination prevents memory issues with large result sets

This research canvas provides a sophisticated interface for exploring the complete UFO/UAP knowledge base with modern web technologies and security considerations.