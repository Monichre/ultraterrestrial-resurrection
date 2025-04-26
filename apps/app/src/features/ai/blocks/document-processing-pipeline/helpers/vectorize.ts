import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../db/types";
import { openai } from "@ai-sdk/openai";
import { embedMany } from "ai";
import pMap from "p-map";

// Constants for text chunking and processing
const CHUNK_SIZE = 512;
const CHUNK_OVERLAP = 128;
const MIN_CHUNK_LENGTH = 100;
const MAX_CHUNKS_PER_BATCH = 20;
const CONCURRENT_BATCHES = 3;

export async function processDocument(
	supabase: SupabaseClient<Database>,
	documentId: string,
) {
	try {
		// Get document
		console.log("[Vectorize] Retrieving document...");
		const { data: document, error: docError } = await supabase
			.from("doc_processor_documents")
			.select("*")
			.eq("id", documentId)
			.single();

		if (docError) throw docError;
		if (!document) throw new Error("Document not found");
		if (!document.extracted_text)
			throw new Error("Document has no extracted text");

		// Create vectorization task
		console.log("[Vectorize] Creating vectorization task...");
		const { data: task, error: taskError } = await supabase
			.from("doc_processor_processing_tasks")
			.insert({
				document_id: documentId,
				task_type: "vectorize",
				status: "processing" as const,
			})
			.select()
			.single();

		if (taskError) throw taskError;
		if (!task) throw new Error("Failed to create vectorization task");

		console.log(`[Vectorize] Created vectorization task: ${task.id}`);

		// Split text into chunks
		console.log("[Vectorize] Splitting text into chunks...");
		const chunks = splitIntoChunks(document.extracted_text);
		console.log(`[Vectorize] Created ${chunks.length} chunks`);

		// Prepare batches for processing
		const batches: TextChunk[][] = [];
		for (let i = 0; i < chunks.length; i += MAX_CHUNKS_PER_BATCH) {
			batches.push(chunks.slice(i, i + MAX_CHUNKS_PER_BATCH));
		}

		// Process batches concurrently
		let totalTokens = 0;
		const processedChunks = await pMap(
			batches,
			async (batch, batchIndex) => {
				console.log(
					`[Vectorize] Processing batch ${batchIndex + 1}/${batches.length}`,
				);

				// Generate embeddings for batch
				console.log(
					`[Vectorize] Generating embeddings for ${batch.length} chunks...`,
				);
				const { embeddings, usage } = await embedMany({
					model: openai.embedding("text-embedding-3-small"),
					values: batch.map((chunk) => chunk.content),
					maxRetries: 3,
					abortSignal: AbortSignal.timeout(30000), // 30 second timeout per batch
					headers: {
						"X-Batch-Number": `${batchIndex + 1}`,
						"X-Total-Batches": `${batches.length}`,
					},
				});

				// Debug embedding structure
				console.log("[Vectorize] Embedding structure check:", {
					embeddingsCount: embeddings.length,
					firstEmbedding: embeddings[0]
						? {
								type: typeof embeddings[0],
								isArray: Array.isArray(embeddings[0]),
								length: embeddings[0].length,
							}
						: "no embeddings",
				});

				// Validate embeddings
				const expectedDimensions = 1536; // text-embedding-3-small dimensions
				const hasValidEmbeddings = embeddings.every(
					(emb) => emb.length === expectedDimensions,
				);

				if (!hasValidEmbeddings) {
					const dimensions = embeddings.map((emb) => emb.length);
					throw new Error(
						`Invalid embedding dimensions. Expected ${expectedDimensions} dimensions, got: ${dimensions.join(", ")}`,
					);
				}

				totalTokens += usage?.tokens || 0;
				console.log(
					`[Vectorize] Embeddings generated for batch ${batchIndex + 1}:`,
					{
						chunks: batch.length,
						tokensUsed: usage?.tokens || 0,
						totalTokensSoFar: totalTokens,
						dimensions: embeddings[0].length,
					},
				);

				// Store chunks with embeddings
				const startIndex = batchIndex * MAX_CHUNKS_PER_BATCH;
				const { error: insertError } = await supabase
					.from("doc_processor_document_chunks")
					.insert(
						batch.map((chunk, index) => ({
							document_id: documentId,
							chunk_index: startIndex + index,
							content: chunk.content,
							token_count: chunk.tokenCount,
							embedding: Array.from(embeddings[index]), // Ensure embeddings are stored as regular arrays
							page_number: chunk.pageNumber || null,
							heading: chunk.heading || null,
						})),
					);

				if (insertError) {
					console.error(
						`[Vectorize] Error storing batch ${batchIndex + 1}:`,
						insertError,
					);
					throw insertError;
				}

				console.log(
					`[Vectorize] Stored batch ${batchIndex + 1} (${batch.length} chunks) successfully`,
				);
				return batch.length;
			},
			{
				concurrency: CONCURRENT_BATCHES,
				stopOnError: true, // Stop processing if any batch fails
			},
		);

		const totalProcessedChunks = processedChunks.reduce(
			(sum, count) => sum + count,
			0,
		);
		console.log(
			`[Vectorize] All batches processed. Total chunks: ${totalProcessedChunks}`,
		);

		// Update document status
		console.log("[Vectorize] Updating document status...");
		const { error: updateError } = await supabase
			.from("doc_processor_documents")
			.update({
				status: "processed" as const,
				updated_at: new Date().toISOString(),
			})
			.eq("id", documentId);

		if (updateError) {
			console.error("[Vectorize] Document update error:", updateError);
			throw updateError;
		}

		// Update task status with token usage
		console.log("[Vectorize] Updating task status...");
		await supabase
			.from("doc_processor_processing_tasks")
			.update({
				status: "processed" as const,
				metadata: { total_tokens: totalTokens },
				updated_at: new Date().toISOString(),
			})
			.eq("id", task.id);

		console.log(
			`[Vectorize] Vectorization completed for document ${documentId}`,
			{
				totalChunks: totalProcessedChunks,
				totalTokens,
				batches: batches.length,
			},
		);
	} catch (error) {
		console.error("[Vectorize] Error processing document:", error);

		// Update document status to error
		await supabase
			.from("doc_processor_documents")
			.update({
				status: "error" as const,
				error:
					error instanceof Error
						? error.message
						: "Unknown error during vectorization",
				updated_at: new Date().toISOString(),
			})
			.eq("id", documentId);

		// Update task status to error
		await supabase
			.from("doc_processor_processing_tasks")
			.update({
				status: "error" as const,
				error_message:
					error instanceof Error
						? error.message
						: "Unknown error during vectorization",
				updated_at: new Date().toISOString(),
			})
			.eq("task_type", "vectorize")
			.eq("document_id", documentId);

		throw error;
	}
}

type TextChunk = {
	content: string;
	tokenCount: number;
	pageNumber?: number;
	heading?: string;
};

function splitIntoChunks(text: string): TextChunk[] {
	console.log("[Vectorize:Split] Starting text splitting...");
	const chunks: TextChunk[] = [];
	const sentences = text.split(/(?<=[.!?])\s+/);

	let currentChunk = "";
	let currentTokenCount = 0;
	let sentenceCount = 0;

	for (const sentence of sentences) {
		const sentenceTokens = estimateTokenCount(sentence);

		if (
			currentTokenCount + sentenceTokens > CHUNK_SIZE &&
			currentChunk.length >= MIN_CHUNK_LENGTH
		) {
			chunks.push({
				content: currentChunk.trim(),
				tokenCount: currentTokenCount,
			});

			// Start new chunk with overlap
			const words = currentChunk.split(/\s+/);
			const overlapWords = words.slice(-Math.floor(CHUNK_OVERLAP / 4)); // Roughly 4 tokens per word
			currentChunk = overlapWords.join(" ") + " " + sentence;
			currentTokenCount = estimateTokenCount(currentChunk);
		} else {
			currentChunk += (currentChunk ? " " : "") + sentence;
			currentTokenCount += sentenceTokens;
		}

		sentenceCount++;
	}

	// Add final chunk if not empty and meets minimum length
	if (currentChunk.length >= MIN_CHUNK_LENGTH) {
		chunks.push({
			content: currentChunk.trim(),
			tokenCount: currentTokenCount,
		});
	}

	console.log("[Vectorize:Split] Text splitting processed", {
		totalChunks: chunks.length,
		averageChunkLength:
			chunks.reduce((sum, chunk) => sum + chunk.content.length, 0) /
			chunks.length,
		totalSentences: sentenceCount,
	});

	return chunks;
}

// Simple token count estimator (4 chars per token on average)
function estimateTokenCount(text: string): number {
	return Math.ceil(text.length / 4);
}
