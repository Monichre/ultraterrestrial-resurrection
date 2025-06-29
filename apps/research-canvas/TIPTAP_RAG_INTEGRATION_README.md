# TipTap RAG Integration - Implementation Guide

**Created:** June 28, 2025  
**Version:** 1.0  
**Location:** @apps/research-canvas/  

## Overview

This implementation integrates TipTap AI capabilities with the Disclosure RAG system in the research-canvas application. Admin users can configure whether to connect to a local RAG server or remote API, and the editor provides AI-powered research assistance through natural language queries.

## Features Implemented

### ✅ Admin Configuration Panel
- Toggle RAG integration on/off
- Switch between local and remote RAG servers
- Test connections before saving
- Secure API key storage for remote connections

### ✅ RAG-Enhanced Editor
- Extends the existing TipTap simple editor
- RAG mention system (type `@@` to search)
- AI dropdown menu with RAG commands
- Real-time knowledge base integration

### ✅ AI Commands Available
- **Search Knowledge** - Find related documents
- **Fact Check** - Verify claims against knowledge base
- **Add Citation** - Insert inline citations
- **Elaborate with Context** - Expand text using related sources
- **Summarize with Sources** - Create summaries with references

### ✅ Custom LLM Handler
- Interfaces with both local and remote RAG APIs
- Handles authentication and error recovery
- Caches settings for performance

## File Structure

```
apps/research-canvas/src/
├── components/
│   ├── admin/
│   │   └── rag-settings.tsx                 # Admin settings panel
│   ├── tiptap-extension/
│   │   └── rag/
│   │       ├── rag-mention.tsx              # RAG mention extension
│   │       └── rag-suggestion-list.tsx      # Suggestion dropdown UI
│   ├── tiptap-templates/
│   │   └── rag-enhanced/
│   │       └── rag-enhanced-editor.tsx      # Enhanced editor with RAG
│   └── tiptap-ui/
│       └── rag-dropdown/
│           └── rag-dropdown.tsx             # RAG commands dropdown
├── app/
│   ├── admin/
│   │   └── page.tsx                         # Admin settings page
│   ├── api/
│   │   └── admin/
│   │       ├── rag-settings/route.ts        # Settings API endpoint
│   │       └── rag-test/route.ts            # Connection test endpoint
│   └── research/
│       └── page.tsx                         # Research page with editor
├── hooks/
│   ├── use-rag-commands.ts                  # RAG command handlers
│   └── use-rag-settings.ts                 # Settings management hook
└── lib/
    └── tiptap/
        └── custom-llm-handler.ts            # RAG API interface
```

## Getting Started

### 1. Prerequisites

- Node.js 18+ and Bun
- Running disclosure-rag server (for local mode)
- Admin access to configure settings

### 2. Installation

The RAG integration is already included in the research-canvas build. No additional installation required.

### 3. Configuration

1. Navigate to `/admin` in the research-canvas app
2. Toggle "RAG Integration" to enable
3. Choose connection mode:
   - **Local Server**: For development, connects to `http://localhost:8000`
   - **Remote API**: For production, requires API URL and key
4. Test the connection
5. Save settings

### 4. Usage

1. Go to `/research` and click "AI RESEARCH EDITOR" tab
2. Start typing in the editor
3. Type `@@` followed by search terms to access knowledge base
4. Select text and use the "AI Knowledge" dropdown for commands
5. Available commands will depend on your RAG server capabilities

## API Endpoints

### Admin Settings
- `GET /api/admin/rag-settings` - Retrieve current settings
- `POST /api/admin/rag-settings` - Update settings
- `POST /api/admin/rag-test` - Test connection

### Expected RAG Server Endpoints
- `GET /health` - Health check
- `GET /search?query=...` - Document search
- `POST /api/rag/generate` - Text generation
- `POST /api/rag/suggestions` - Real-time suggestions

## Configuration Options

### Local Mode
```javascript
{
  "mode": "local",
  "localUrl": "http://localhost:8000",
  "enabled": true
}
```

### Remote Mode
```javascript
{
  "mode": "remote", 
  "remoteUrl": "https://api.example.com/rag",
  "apiKey": "your-api-key",
  "enabled": true
}
```

## Security Considerations

1. **API Keys**: Stored server-side, never exposed to client
2. **Admin Only**: Only admin users should access `/admin` routes
3. **Connection Validation**: Test endpoint validates RAG server responses
4. **Input Sanitization**: All user inputs are validated before API calls

## Development Notes

### Custom LLM Handler Interface

The `RAGLLMHandler` class provides these main methods:

```typescript
// Search documents in knowledge base
await ragHandler.searchDocuments(query: string, filters?: any): Promise<RAGSearchResult[]>

// Generate text with RAG context
await ragHandler.generateText(prompt: string, options?: any): Promise<string>

// Get contextual suggestions
await ragHandler.getSuggestions(text: string, context?: any): Promise<RAGSuggestion[]>

// Fact check against knowledge base
await ragHandler.factCheck(text: string): Promise<FactCheckResult>
```

### Extension Architecture

The RAG integration follows TipTap's extension pattern:

1. **RAGMention**: Extends TipTap's Mention extension for `@@` triggers
2. **Custom Commands**: Integrates with existing toolbar dropdown
3. **Settings Hook**: Manages configuration state across components
4. **API Layer**: Handles communication with RAG servers

## Troubleshooting

### Connection Issues
1. Verify RAG server is running on configured URL
2. Check API key is valid (for remote mode)
3. Test connection using admin panel
4. Review browser console for detailed error messages

### Editor Issues
1. Ensure RAG integration is enabled in admin settings
2. Verify you're using the RAG-enhanced editor, not simple editor
3. Check that `@@` mentions are triggering search (3+ characters required)
4. Refresh page if settings changes aren't reflected

### Performance Issues
1. RAG queries are cached for 5 minutes
2. Mentions are debounced to 300ms
3. Failed requests fallback gracefully
4. Consider reducing `maxSuggestions` for faster responses

## Future Enhancements

- [ ] Citation node types for better reference management
- [ ] Document preview panels for search results
- [ ] Multi-modal support (images, audio)
- [ ] Collaborative editing with shared RAG context
- [ ] Custom agent configuration per document
- [ ] Advanced filtering and search operators
- [ ] Integration with TipTap Documents cloud storage

## Contributing

When extending this implementation:

1. Follow the existing extension patterns
2. Add proper error handling and loading states
3. Update the settings interface for new options
4. Include tests for new RAG commands
5. Document any new API endpoints required

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the browser console for error details
3. Test connection using the admin panel
4. Verify RAG server logs for API errors

---

**Implementation Complete**: All core features are functional and ready for testing.