import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../db/types";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { processDocument as vectorizeDocument } from "./vectorize";
import pMap from "p-map";

const analysisSchema = z.object({
	summary: z.string().min(1),
	keywords: z.array(z.string()),
	entities: z.array(
		z.object({
			type: z.string(),
			text: z.string(),
			metadata: z.record(z.any()).optional(),
		}),
	),
});

type AnalysisResult = z.infer<typeof analysisSchema>;

// Constants for concurrent processing
const CONCURRENT_TASKS = 2; // Number of concurrent tasks (analysis and entity storage)

export async function analyzeDocument(
	supabase: SupabaseClient<Database>,
	documentId: string,
) {
	try {
		console.log(`[Analysis] Starting analysis for document ${documentId}`);

		// Get document
		const { data: document, error: docError } = await supabase
			.from("doc_processor_documents")
			.select("*")
			.eq("id", documentId)
			.single();

		if (docError || !document) {
			console.error("[Analysis] Document fetch error:", docError);
			throw docError || new Error("Document not found");
		}

		console.log(`[Analysis] Retrieved document: ${document.title}`);

		if (!document.extracted_text) {
			console.error("[Analysis] No extracted text found for document");
			throw new Error("Document has no extracted text");
		}

		console.log(
			`[Analysis] Found extracted text of length: ${document.extracted_text.length}`,
		);

		// Create analysis task
		const { data: task, error: taskError } = await supabase
			.from("doc_processor_processing_tasks")
			.insert({
				document_id: documentId,
				task_type: "analyze",
				status: "processing",
			})
			.select()
			.single();

		if (taskError) {
			console.error("[Analysis] Task creation error:", taskError);
			throw taskError;
		}

		console.log(`[Analysis] Created analysis task: ${task.id}`);

		// Define processing tasks
		const processingTasks = async () => {
			// Task 1: Analyze content and update document
			console.log("[Analysis] Starting content analysis with AI...");
			const analysis = await analyzeContent(document.extracted_text);
			console.log("[Analysis] AI analysis complete", {
				summaryLength: analysis.summary.length,
				keywordsCount: analysis.keywords.length,
				entitiesCount: analysis.entities.length,
			});

			// Update document with analysis results
			console.log("[Analysis] Updating document with analysis results...");
			const { error: updateError } = await supabase
				.from("doc_processor_documents")
				.update({
					analysis: {
						summary: analysis.summary,
						keywords: analysis.keywords,
					},
					status: "processing",
				})
				.eq("id", documentId);

			if (updateError) {
				console.error("[Analysis] Document update error:", updateError);
				throw updateError;
			}

			// Task 2: Store entities in parallel batches
			if (analysis.entities.length > 0) {
				console.log(
					`[Analysis] Storing ${analysis.entities.length} entities...`,
				);

				// Split entities into batches of 10
				const entityBatches = [];
				for (let i = 0; i < analysis.entities.length; i += 10) {
					entityBatches.push(analysis.entities.slice(i, i + 10));
				}

				// Store batches concurrently
				await pMap(
					entityBatches,
					async (batch, batchIndex) => {
						console.log(
							`[Analysis] Storing entity batch ${batchIndex + 1}/${entityBatches.length}`,
						);
						const { error: entityError } = await supabase
							.from("doc_processor_document_entities")
							.insert(
								batch.map((entity) => ({
									document_id: documentId,
									entity_type: entity.type,
									entity_text: entity.text,
									metadata: entity.metadata || null,
								})),
							);

						if (entityError) {
							console.error(
								`[Analysis] Entity batch ${batchIndex + 1} storage error:`,
								entityError,
							);
							throw entityError;
						}
						console.log(
							`[Analysis] Entity batch ${batchIndex + 1} stored successfully`,
						);
					},
					{
						concurrency: 3, // Process up to 3 batches at a time
						stopOnError: true,
					},
				);

				console.log("[Analysis] All entities stored successfully");
			}
		};

		// Execute processing tasks
		await processingTasks();

		// Update task status
		await supabase
			.from("doc_processor_processing_tasks")
			.update({
				status: "processed" as const,
			})
			.eq("id", task.id);

		console.log("[Analysis] Analysis task marked as processed");

		// Create vectorization task
		const { error: vectorizeError } = await supabase
			.from("doc_processor_processing_tasks")
			.insert({
				document_id: documentId,
				task_type: "vectorize",
				status: "pending" as const,
			});

		if (vectorizeError) {
			console.error(
				"[Analysis] Vectorization task creation error:",
				vectorizeError,
			);
			throw vectorizeError;
		}

		console.log("[Analysis] Created vectorization task");
		console.log(
			`[Analysis] Analysis pipeline processed for document ${documentId}`,
		);

		// Trigger vectorization pipeline
		console.log("[Analysis] Triggering vectorization pipeline...");
		await vectorizeDocument(supabase, documentId);
	} catch (error) {
		console.error("[Analysis] Pipeline error:", error);

		// Update document status
		console.log("[Analysis] Updating document status to error...");
		await supabase
			.from("doc_processor_documents")
			.update({
				status: "error",
				error: error instanceof Error ? error.message : "Unknown error",
			})
			.eq("id", documentId);

		// Update task status if it exists
		const { data: task } = await supabase
			.from("doc_processor_processing_tasks")
			.select("id")
			.eq("document_id", documentId)
			.eq("task_type", "analyze")
			.single();

		if (task) {
			console.log("[Analysis] Updating task status to error...");
			await supabase
				.from("doc_processor_processing_tasks")
				.update({
					status: "error",
					error: error instanceof Error ? error.message : "Unknown error",
				})
				.eq("id", task.id);
		}

		throw error;
	}
}

async function analyzeContent(text: string): Promise<AnalysisResult> {
	console.log("[Analysis] Starting content analysis...");

	// Truncate text if too long (OpenAI has a token limit)
	const maxLength = 15000; // Roughly 4000 tokens
	const truncatedText =
		text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
	console.log(
		`[Analysis] Text length: ${text.length}, truncated: ${truncatedText.length}`,
	);

	console.log("[Analysis] Calling OpenAI...");
	const { object } = await generateObject({
		model: openai("gpt-4o-mini"),
		schema: analysisSchema,
		prompt: `Please analyze the following text and extract key information. Generate a concise summary (max 200 words), up to 10 relevant keywords, and identify named entities (like people, organizations, locations, dates).

Text to analyze:
${truncatedText}`,
	});

	if (!object) {
		console.error(
			"[Analysis] Failed to generate analysis - no object returned",
		);
		throw new Error("Failed to generate analysis");
	}

	console.log("[Analysis] Successfully generated analysis");
	return object;
}
