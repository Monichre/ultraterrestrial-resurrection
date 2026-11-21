import { readById, getSql } from "@db/postgres"
import { openai } from "@ai-sdk/openai"
import { embedMany } from "ai"
import pMap from "p-map"

// Constants for text chunking and processing
const CHUNK_SIZE = 512
const CHUNK_OVERLAP = 128
const MIN_CHUNK_LENGTH = 100
const MAX_CHUNKS_PER_BATCH = 20
const CONCURRENT_BATCHES = 3

// Type definitions for document processing
type ProcessingTask = {
  id: string
  task_type: "vectorize"
  status: "processing" | "processed" | "error"
  created_at: string
  completed_at?: string
  error_message?: string
}

type DocumentMetadata = {
  extracted_text?: string
  processing_status?: "pending" | "processing" | "processed" | "error"
  processing_tasks?: ProcessingTask[]
  error_message?: string
  error_timestamp?: string
  last_processed?: string
  total_tokens?: number
  total_chunks?: number
  // Store chunks in metadata until document_chunks table is created
  chunks?: DocumentChunkData[]
}

type DocumentChunkData = {
  chunk_index: number
  content: string
  token_count: number
  embedding: number[]
  page_number?: number
  heading?: string
}

export async function processDocument( documentId: string ) {


  try {
    // Get document
    console.log( "[Vectorize] Retrieving document..." )
    const document = await readById( "documents", documentId )

    if ( !document ) throw new Error( "Document not found" )

    const metadata = ( document.metadata as DocumentMetadata ) || {}
    const extractedText = metadata.extracted_text

    if ( !extractedText ) {
      throw new Error( "Document has no extracted text. Run text extraction first." )
    }

    // Create vectorization task
    console.log( "[Vectorize] Creating vectorization task..." )
    const taskId = crypto.randomUUID()
    const newTask: ProcessingTask = {
      id: taskId,
      task_type: "vectorize",
      status: "processing",
      created_at: new Date().toISOString(),
    }

    const updatedMetadata: DocumentMetadata = {
      ...metadata,
      processing_status: "processing",
      processing_tasks: [
        ...( metadata.processing_tasks || [] ),
        newTask
      ]
    }

    const sql = getSql()
    await sql`UPDATE documents SET metadata = ${JSON.stringify( updatedMetadata )}, xata_updatedat = NOW() WHERE id = ${documentId}`

    console.log( `[Vectorize] Created vectorization task: ${taskId}` )

    // Split text into chunks
    console.log( "[Vectorize] Splitting text into chunks..." )
    const chunks = splitIntoChunks( extractedText )
    console.log( `[Vectorize] Created ${chunks.length} chunks` )

    // Prepare batches for processing
    const batches: TextChunk[][] = []
    for ( let i = 0; i < chunks.length; i += MAX_CHUNKS_PER_BATCH ) {
      batches.push( chunks.slice( i, i + MAX_CHUNKS_PER_BATCH ) )
    }

    // Process batches concurrently
    let totalTokens = 0
    const processedChunks = await pMap(
      batches,
      async ( batch, batchIndex ) => {
        console.log( `[Vectorize] Processing batch ${batchIndex + 1}/${batches.length}` )

        // Generate embeddings for batch
        console.log( `[Vectorize] Generating embeddings for ${batch.length} chunks...` )
        const { embeddings, usage } = await embedMany( {
          model: openai.embedding( "text-embedding-3-small" ),
          values: batch.map( ( chunk ) => chunk.content ),
          maxRetries: 3,
          abortSignal: AbortSignal.timeout( 30000 ), // 30 second timeout per batch
          headers: {
            "X-Batch-Number": `${batchIndex + 1}`,
            "X-Total-Batches": `${batches.length}`,
          },
        } )

        // Debug embedding structure
        console.log( "[Vectorize] Embedding structure check:", {
          embeddingsCount: embeddings.length,
          firstEmbedding:
            embeddings[0] ?
              {
                type: typeof embeddings[0],
                isArray: Array.isArray( embeddings[0] ),
                length: embeddings[0].length,
              }
              : "no embeddings",
        } )

        // Validate embeddings
        const expectedDimensions = 1536 // text-embedding-3-small dimensions
        const hasValidEmbeddings = embeddings.every( ( emb ) => emb.length === expectedDimensions )

        if ( !hasValidEmbeddings ) {
          const dimensions = embeddings.map( ( emb ) => emb.length )
          throw new Error(
            `Invalid embedding dimensions. Expected ${expectedDimensions} dimensions, got: ${dimensions.join( ", " )}`
          )
        }

        totalTokens += usage?.tokens || 0
        console.log( `[Vectorize] Embeddings generated for batch ${batchIndex + 1}:`, {
          chunks: batch.length,
          tokensUsed: usage?.tokens || 0,
          totalTokensSoFar: totalTokens,
          dimensions: embeddings[0].length,
        } )

        // Store chunks with embeddings in document metadata
        // TODO: Replace with document_chunks table when available
        const startIndex = batchIndex * MAX_CHUNKS_PER_BATCH
        const chunkData: DocumentChunkData[] = batch.map( ( chunk, index ) => ( {
          chunk_index: startIndex + index,
          content: chunk.content,
          token_count: chunk.tokenCount,
          embedding: Array.from( embeddings[index] ), // Ensure embeddings are stored as regular arrays
          page_number: chunk.pageNumber || undefined,
          heading: chunk.heading || undefined,
        } ) )

        console.log( `[Vectorize] Processed batch ${batchIndex + 1} (${batch.length} chunks) successfully` )
        return chunkData
      },
      {
        concurrency: CONCURRENT_BATCHES,
        stopOnError: true, // Stop processing if any batch fails
      }
    )

    // Flatten all processed chunks
    const allChunks = processedChunks.flat()
    const totalProcessedChunks = allChunks.length
    console.log( `[Vectorize] All batches processed. Total chunks: ${totalProcessedChunks}` )

    // Update document with chunks and final status
    console.log( "[Vectorize] Updating document with chunks and status..." )
    const completedTask: ProcessingTask = {
      ...newTask,
      status: "processed",
      completed_at: new Date().toISOString(),
    }

    const finalMetadata: DocumentMetadata = {
      ...updatedMetadata,
      processing_status: "processed",
      last_processed: new Date().toISOString(),
      total_tokens: totalTokens,
      total_chunks: totalProcessedChunks,
      chunks: allChunks,
      processing_tasks: [
        ...( updatedMetadata.processing_tasks?.filter( t => t.id !== taskId ) || [] ),
        completedTask
      ]
    }

    const sql2 = getSql()
    await sql2`UPDATE documents SET metadata = ${JSON.stringify( finalMetadata )}, xata_updatedat = NOW() WHERE id = ${documentId}`

    console.log( `[Vectorize] Vectorization completed for document ${documentId}`, {
      totalChunks: totalProcessedChunks,
      totalTokens,
      batches: batches.length,
    } )

    return {
      success: true,
      documentId,
      totalChunks: totalProcessedChunks,
      totalTokens,
      batches: batches.length,
    }

  } catch ( error ) {
    console.error( "[Vectorize] Error processing document:", error )

    // Update document status to error
    try {
      const currentDoc = await readById( "documents", documentId )
      const currentMetadata = ( currentDoc?.metadata as DocumentMetadata ) || {}

      const errorMetadata: DocumentMetadata = {
        ...currentMetadata,
        processing_status: "error",
        error_message: error instanceof Error ? error.message : "Unknown error during vectorization",
        error_timestamp: new Date().toISOString(),
        processing_tasks: currentMetadata.processing_tasks?.map( task =>
          task.status === "processing" ? {
            ...task,
            status: "error" as const,
            error_message: error instanceof Error ? error.message : "Unknown error",
            completed_at: new Date().toISOString()
          } : task
        ) || []
      }

      const sqlErr = getSql()
      await sqlErr`UPDATE documents SET metadata = ${JSON.stringify( errorMetadata )}, xata_updatedat = NOW() WHERE id = ${documentId}`
    } catch ( updateError ) {
      console.error( "[Vectorize] Failed to update document error status:", updateError )
    }

    throw error
  }
}

type TextChunk = {
  content: string
  tokenCount: number
  pageNumber?: number
  heading?: string
}

function splitIntoChunks( text: string ): TextChunk[] {
  console.log( "[Vectorize:Split] Starting text splitting..." )
  const chunks: TextChunk[] = []
  const sentences = text.split( /(?<=[.!?])\s+/ )

  let currentChunk = ""
  let currentTokenCount = 0
  let sentenceCount = 0

  for ( const sentence of sentences ) {
    const sentenceTokens = estimateTokenCount( sentence )

    if ( currentTokenCount + sentenceTokens > CHUNK_SIZE && currentChunk.length >= MIN_CHUNK_LENGTH ) {
      chunks.push( {
        content: currentChunk.trim(),
        tokenCount: currentTokenCount,
      } )

      // Start new chunk with overlap
      const words = currentChunk.split( /\s+/ )
      const overlapWords = words.slice( -Math.floor( CHUNK_OVERLAP / 4 ) ) // Roughly 4 tokens per word
      currentChunk = overlapWords.join( " " ) + " " + sentence
      currentTokenCount = estimateTokenCount( currentChunk )
    } else {
      currentChunk += ( currentChunk ? " " : "" ) + sentence
      currentTokenCount += sentenceTokens
    }

    sentenceCount++
  }

  // Add final chunk if not empty and meets minimum length
  if ( currentChunk.length >= MIN_CHUNK_LENGTH ) {
    chunks.push( {
      content: currentChunk.trim(),
      tokenCount: currentTokenCount,
    } )
  }

  console.log( "[Vectorize:Split] Text splitting processed", {
    totalChunks: chunks.length,
    averageChunkLength: chunks.reduce( ( sum, chunk ) => sum + chunk.content.length, 0 ) / chunks.length,
    totalSentences: sentenceCount,
  } )

  return chunks
}

// Simple token count estimator (4 chars per token on average)
function estimateTokenCount( text: string ): number {
  return Math.ceil( text.length / 4 )
}

// Helper function to get document chunks from metadata
export async function getDocumentChunks( documentId: string ): Promise<DocumentChunkData[]> {

  const document = await readById( "documents", documentId )

  if ( !document ) {
    throw new Error( "Document not found" )
  }

  const metadata = ( document.metadata as DocumentMetadata ) || {}
  return metadata.chunks || []
}

// Helper function to search document chunks by similarity
export async function searchDocumentChunks(
  documentId: string,
  query: string,
  limit: number = 5
): Promise<DocumentChunkData[]> {
  // Generate embedding for query
  const { embeddings } = await embedMany( {
    model: openai.embedding( "text-embedding-3-small" ),
    values: [query],
  } )

  const queryEmbedding = embeddings[0]
  const chunks = await getDocumentChunks( documentId )

  // Calculate cosine similarity for each chunk
  const chunksWithSimilarity = chunks.map( chunk => ( {
    ...chunk,
    similarity: cosineSimilarity( queryEmbedding, chunk.embedding )
  } ) )

  // Sort by similarity and return top results
  return chunksWithSimilarity
    .sort( ( a, b ) => b.similarity - a.similarity )
    .slice( 0, limit )
}

// Helper function to calculate cosine similarity
function cosineSimilarity( a: number[], b: number[] ): number {
  const dotProduct = a.reduce( ( sum, val, i ) => sum + val * b[i], 0 )
  const magnitudeA = Math.sqrt( a.reduce( ( sum, val ) => sum + val * val, 0 ) )
  const magnitudeB = Math.sqrt( b.reduce( ( sum, val ) => sum + val * val, 0 ) )
  return dotProduct / ( magnitudeA * magnitudeB )
}
