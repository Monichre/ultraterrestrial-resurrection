# Deep Research Package

This package provides a unified interface for advanced web research, content extraction, and knowledge processing by integrating both Firecrawl and Exa AI capabilities.

## Features

- **Web Extraction**: Extract content from websites using Firecrawl with agent capabilities
- **Semantic Search**: Find relevant content based on queries using Exa's neural search
- **Similar Content Discovery**: Find content similar to reference URLs
- **Question Answering**: Generate answers to questions with citations using web content
- **Content Processing**: Clean, filter, and structure web content
- **Summarization**: Create concise summaries of lengthy content

## Installation

```bash
npm install @ultraterrestrial/deep-research
```

## Usage

### Firecrawl Integration

```typescript
import { enhancedScrapeContent, deepResearch } from '@ultraterrestrial/deep-research';

// Enhanced scraping with agent capabilities
const content = await enhancedScrapeContent(
  'https://example.com/complex-page',
  { formats: ['markdown', 'html'] },
  { model: 'FIRE-1', prompt: 'Click through pagination and extract all articles' }
);

// Deep research on a topic
const research = await deepResearch(
  'quantum computing advancements',
  {
    depth: 'DEEP',
    maxUrls: 10,
    categories: ['RESEARCH', 'ACADEMIC']
  }
);
```

### Exa API Integration

```typescript
import { search, answer, findSimilar } from '@ultraterrestrial/deep-research';

// Semantic search with content retrieval
const results = await search('latest climate change research', {
  numResults: 5,
  text: true,
  highlights: true
});

// Generate answers with citations
const response = await answer('What are the latest advancements in fusion energy?');
console.log(response.answer); // The generated answer
console.log(response.citations); // Source citations

// Find similar content
const similar = await findSimilar('https://example.com/article-about-ai', {
  numResults: 3,
  excludeSourceDomain: true
});
```

### Content Utilities

```typescript
import { extractText, createResearchDocument, summarizeResults } from '@ultraterrestrial/deep-research';

// Process search results
const text = extractText(searchResults, 10000);

// Create structured research document
const document = createResearchDocument('AI safety research', searchResults);

// Generate a summary
const summary = await summarizeResults(searchResults);
```

## API Reference

See the JSDoc comments in the source code for detailed API documentation.

## License

MIT 