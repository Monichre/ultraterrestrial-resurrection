import { KnowledgeItem } from './types';

// Content extraction based on file type
export async function extractContent(item: KnowledgeItem): Promise<string> {
  switch (item.contentType.toLowerCase()) {
    case 'text':
    case 'plain/text':
      return item.content;
    case 'html':
      return htmlToMarkdown(item.content);
    case 'pdf':
      // In a full implementation, this would use a PDF parser library
      return item.content;
    case 'markdown':
    case 'md':
      return item.content;
    default:
      return item.content;
  }
}

// Content chunking for large documents
export function chunkContent(content: string, chunkSize = 1000, overlap = 200): string[] {
  if (!content || content.length <= chunkSize) {
    return [content];
  }

  const chunks: string[] = [];
  let startIndex = 0;

  while (startIndex < content.length) {
    // Find a good breaking point (end of sentence or paragraph)
    let endIndex = Math.min(startIndex + chunkSize, content.length);
    if (endIndex < content.length) {
      // Try to find a sentence ending or paragraph break
      const possibleBreakPoints = [
        content.lastIndexOf('. ', endIndex),
        content.lastIndexOf('.\n', endIndex),
        content.lastIndexOf('\n\n', endIndex),
        content.lastIndexOf('. ', endIndex)
      ];
      
      // Find the furthest valid break point
      const breakPoint = Math.max(...possibleBreakPoints.filter(p => p > startIndex));
      
      if (breakPoint > startIndex) {
        endIndex = breakPoint + 1; // Include the period or newline
      }
    }

    chunks.push(content.substring(startIndex, endIndex));
    startIndex = Math.max(startIndex, endIndex - overlap);
  }

  return chunks;
}

// Content transformation utilities
export function htmlToMarkdown(html: string): string {
  // Simple HTML to markdown conversion
  // In a production implementation, use a library like turndown
  const markdown = html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<a href="(.*?)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<ul[^>]*>(.*?)<\/ul>/gis, '$1\n')
    .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<br\s?\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ''); // Remove remaining HTML tags
  
  return markdown.trim();
}

export function markdownToText(markdown: string): string {
  // Simple markdown to plain text conversion
  return markdown
    .replace(/#{1,6}\s+([^\n]+)/g, '$1\n') // Headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
    .replace(/\*([^*]+)\*/g, '$1') // Italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/- ([^\n]+)/g, '$1\n') // List items
    .replace(/\n{3,}/g, '\n\n') // Multiple newlines
    .trim();
}

// Metadata extraction
export function extractMetadataFromContent(content: string, contentType: string): Record<string, any> {
  const metadata: Record<string, any> = {};
  
  // Extract possible title
  if (contentType.includes('html')) {
    const titleMatch = content.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      metadata.title = titleMatch[1].trim();
    }
    
    // Extract meta tags
    const metaMatches = content.matchAll(/<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]+)"/gi);
    for (const match of metaMatches) {
      if (match[1] && match[2]) {
        metadata[match[1].toLowerCase()] = match[2].trim();
      }
    }
  } else if (contentType.includes('markdown') || contentType.includes('md')) {
    // Look for a header at the start
    const headerMatch = content.match(/^#\s+(.+)$/m);
    if (headerMatch && headerMatch[1]) {
      metadata.title = headerMatch[1].trim();
    }
    
    // Look for frontmatter
    const frontmatterMatch = content.match(/^---\s+([\s\S]+?)\s+---/);
    if (frontmatterMatch && frontmatterMatch[1]) {
      const frontmatter = frontmatterMatch[1];
      const lines = frontmatter.split('\n');
      
      for (const line of lines) {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
          const value = valueParts.join(':').trim();
          if (value) {
            metadata[key.trim().toLowerCase()] = value;
          }
        }
      }
    }
  }
  
  // Extract possible date
  const datePatterns = [
    /\d{4}-\d{2}-\d{2}/,       // YYYY-MM-DD
    /\d{2}\/\d{2}\/\d{4}/,     // MM/DD/YYYY
    /\d{2}\.\d{2}\.\d{4}/      // DD.MM.YYYY
  ];
  
  for (const pattern of datePatterns) {
    const dateMatch = content.match(pattern);
    if (dateMatch && !metadata.date) {
      metadata.date = dateMatch[0];
      break;
    }
  }
  
  return metadata;
}

// File type detection
export function detectFileType(filename: string, content?: string): string {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  switch (extension) {
    case 'txt':
      return 'text';
    case 'html':
    case 'htm':
      return 'html';
    case 'pdf':
      return 'pdf';
    case 'md':
    case 'markdown':
      return 'markdown';
    case 'json':
      return 'json';
    case 'xml':
      return 'xml';
    case 'csv':
      return 'csv';
    default:
      // Try to detect from content if available
      if (content) {
        if (content.trimStart().startsWith('<html') || content.includes('<!DOCTYPE html>')) {
          return 'html';
        }
        if (content.trimStart().startsWith('{') && content.trimEnd().endsWith('}')) {
          try {
            JSON.parse(content);
            return 'json';
          } catch (e) {
            // Not valid JSON
          }
        }
        if (content.trimStart().startsWith('#')) {
          return 'markdown';
        }
      }
      
      return 'text'; // Default to text
  }
}

// Content comparison (simple implementation)
export function compareContent(item1: KnowledgeItem, item2: KnowledgeItem): number {
  // 0 = completely different, 1 = identical
  if (!item1.content || !item2.content) return 0;
  
  // If vectors are available, compute cosine similarity
  if (item1.vector && item2.vector) {
    return cosineSimilarity(item1.vector, item2.vector);
  }
  
  // Simple text comparison (Jaccard similarity of words)
  const words1 = new Set(item1.content.toLowerCase().split(/\W+/).filter(w => w.length > 1));
  const words2 = new Set(item2.content.toLowerCase().split(/\W+/).filter(w => w.length > 1));
  
  if (words1.size === 0 || words2.size === 0) return 0;
  
  // Count intersection
  let intersection = 0;
  for (const word of words1) {
    if (words2.has(word)) {
      intersection++;
    }
  }
  
  // Jaccard similarity: intersection size / union size
  return intersection / (words1.size + words2.size - intersection);
}

// Content validation
export function validateContent(content: string, contentType: string): boolean {
  if (!content) return false;
  
  switch (contentType.toLowerCase()) {
    case 'json':
      try {
        JSON.parse(content);
        return true;
      } catch (e) {
        return false;
      }
    case 'html':
      return content.includes('<html') || content.includes('</body>');
    case 'pdf':
      // Basic check for PDF header
      return content.startsWith('%PDF-');
    default:
      return content.length > 0;
  }
}

// Helper function for vector similarity
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}