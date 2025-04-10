import { getClaudeSummary } from "@/services/ai/claude/get-claude-response";
import { generateEmbeddings } from "@/services/ai/embeddings/embedding";
import { SUMMARIZE_PROMPT } from "@/services/ai/prompts/summarize.prompt";
import { ResearchCategory, ResearchDepth } from "./firecrawl";

/**
 * Options for document processing
 */
export interface DocumentProcessingOptions {
  categories?: ResearchCategory[];
  researchDepth?: ResearchDepth;
  extractEntities?: boolean;
}

/**
 * Process uploaded document files
 */
export async function processDocument(
  file: File,
  fileContent: string,
  options: DocumentProcessingOptions = {}
) {
  const {
    categories = [
      ResearchCategory.EVENTS,
      ResearchCategory.SIGHTINGS,
      ResearchCategory.TESTIMONIES,
    ],
    researchDepth = ResearchDepth.MODERATE,
    extractEntities = true,
  } = options;

  // Build processing prompt based on categories and depth
  let processingPrompt = "Process this document and extract relevant information";
  
  if (categories.length > 0) {
    processingPrompt += ` focusing on ${categories.join(", ")}`;
  }
  
  // Adjust processing detail based on research depth
  switch (researchDepth) {
    case ResearchDepth.SURFACE:
      processingPrompt += ". Provide a brief overview of key points.";
      break;
    case ResearchDepth.MODERATE:
      processingPrompt += ". Extract main topics, entities, and key information.";
      break;
    case ResearchDepth.DEEP:
      processingPrompt += ". Perform detailed analysis, extract all relevant entities, relationships, and contextual details.";
      break;
    case ResearchDepth.COMPREHENSIVE:
      processingPrompt += ". Perform exhaustive analysis, extract all possible entities, relationships, chronology, and nuanced details.";
      break;
  }

  // Process with Claude for summarization and extraction
  const summary = await getClaudeSummary({
    system: SUMMARIZE_PROMPT,
    content: fileContent,
    prompt: processingPrompt,
  });

  // Generate embeddings for vector search
  const embedding = await generateEmbeddings(summary);

  // Return processed document data
  return {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    summary,
    embedding,
    processingOptions: {
      categories,
      researchDepth,
      extractEntities,
    },
    resourceId: `file-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  };
}

/**
 * Extract text content from different file types
 */
export async function extractFileContent(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  
  // Convert the file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  // Extract content based on file type
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    // For PDF files - In production, you'd use a library like pdf-parse
    return buffer.toString('utf-8');
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
    fileName.endsWith('.docx')
  ) {
    // For DOCX files - In production, you'd use a library like mammoth
    return buffer.toString('utf-8');
  } else if (
    fileType === 'text/plain' || 
    fileName.endsWith('.txt') ||
    fileName.endsWith('.md') ||
    fileName.endsWith('.markdown')
  ) {
    // For plain text files
    return buffer.toString('utf-8');
  } else {
    // Default text extraction
    try {
      return buffer.toString('utf-8');
    } catch (e) {
      throw new Error(`Unsupported file type: ${fileType}`);
    }
  }
}