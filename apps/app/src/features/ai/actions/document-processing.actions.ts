"use server";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./db/types";

import { processDocument } from "./pipeline/extract";
import { revalidatePath } from "next/cache";
import { analyzeDocument } from "./pipeline/analyze";

import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

if (!process.env.NEXT_PUBLIC_BLOCKS_SUPABASE_URL) {
	throw new Error("Missing env.NEXT_PUBLIC_BLOCKS_SUPABASE_URL");
}
if (!process.env.BLOCKS_SUPABASE_SERVICE_ROLE_KEY) {
	throw new Error("Missing env.BLOCKS_SUPABASE_SERVICE_ROLE_KEY");
}

// Create Supabase client with service role for admin access
const supabaseAdmin = createClient<Database>(
	process.env.NEXT_PUBLIC_BLOCKS_SUPABASE_URL,
	process.env.BLOCKS_SUPABASE_SERVICE_ROLE_KEY,
	{
		auth: {
			persistSession: false,
		},
	},
);

export async function uploadDocument(formData: FormData) {
	try {
		const file = formData.get("file") as File;
		if (!file) throw new Error("No file provided");

		// Get file metadata
		const fileType = getFileType(file.name);
		if (!fileType) throw new Error("Unsupported file type");

		// Generate file hash
		const buffer = await file.arrayBuffer();
		const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const fileHash = hashArray
			.map((b) => b.toString(16).padStart(2, "0"))
			.join("");

		// Check for duplicate
		const { data: existingDoc } = await supabaseAdmin
			.from("doc_processor_documents")
			.select("id")
			.eq("file_hash", fileHash)
			.single();

		if (existingDoc) throw new Error("This document has already been uploaded");

		// Upload file
		const filePath = `documents/${fileHash}/${file.name}`;
		const { error: uploadError } = await supabaseAdmin.storage
			.from("documents")
			.upload(filePath, buffer, {
				contentType: file.type,
				upsert: false,
			});

		if (uploadError) throw uploadError;

		const {
			data: { publicUrl },
		} = supabaseAdmin.storage.from("documents").getPublicUrl(filePath);

		// Create document record
		const { data: document, error: insertError } = await supabaseAdmin
			.from("doc_processor_documents")
			.insert({
				title: file.name,
				file_path: publicUrl,
				file_type: fileType,
				file_size: file.size,
				mime_type: file.type,
				file_hash: fileHash,
				status: "pending",
			})
			.select()
			.single();

		if (insertError) throw insertError;

		// Create initial task
		const { data: task, error: taskError } = await supabaseAdmin
			.from("doc_processor_processing_tasks")
			.insert({
				document_id: document.id,
				task_type: "extract",
				status: "pending",
			})
			.select()
			.single();

		if (taskError) throw taskError;

		revalidatePath("/");
		return { success: true as const, document, tasks: [task] };
	} catch (error) {
		console.error("Upload error:", error);
		return {
			success: false as const,
			error: error instanceof Error ? error.message : "Upload failed",
		};
	}
}

export async function startExtraction(documentId: string) {
	try {
		await processDocument(supabaseAdmin, documentId);
		return { success: true as const };
	} catch (error) {
		console.error("Extraction error:", error);
		return {
			success: false as const,
			error: error instanceof Error ? error.message : "Extraction failed",
		};
	}
}

export async function startAnalysis(documentId: string) {
	try {
		await analyzeDocument(supabaseAdmin, documentId);
		return { success: true as const };
	} catch (error) {
		console.error("Analysis error:", error);
		return {
			success: false as const,
			error: error instanceof Error ? error.message : "Extraction failed",
		};
	}
}

export async function getDocuments() {
	const { data: documents } = await supabaseAdmin
		.from("doc_processor_documents")
		.select("*")
		.order("created_at", { ascending: false });

	return documents || [];
}

function getFileType(
	fileName: string,
): Database["public"]["Enums"]["document_type"] | null {
	const ext = fileName.split(".").pop()?.toLowerCase();
	switch (ext) {
		case "pdf":
			return "pdf";
		case "docx":
			return "docx";
		case "txt":
			return "txt";
		default:
			return null;
	}
}

export async function getDocumentStatus(documentId: string) {
	try {
		// Get document
		const { data: document, error: docError } = await supabaseAdmin
			.from("doc_processor_documents")
			.select("*")
			.eq("id", documentId)
			.single();

		if (docError) throw docError;
		if (!document) throw new Error("Document not found");

		// Get tasks
		const { data: tasks, error: tasksError } = await supabaseAdmin
			.from("doc_processor_processing_tasks")
			.select("*")
			.eq("document_id", documentId)
			.order("created_at", { ascending: false });

		if (tasksError) throw tasksError;

		return {
			success: true,
			document,
			tasks: tasks || [],
		};
	} catch (error) {
		console.error("Error fetching document status:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "Failed to fetch document status",
		};
	}
}

// Constants for search
const VECTOR_SIMILARITY_THRESHOLD = 0.6;
const MAX_RESULTS = 10;
const EMBEDDING_TIMEOUT_MS = 10000;
const FULL_TEXT_WEIGHT = 1.0;
const SEMANTIC_WEIGHT = 1.0;
const RRF_K = 50;

export async function searchDocumentChunks(query: string, documentId?: string) {
	try {
		console.log("[Search] Starting hybrid search:", {
			query,
			documentId: documentId || "all",
			maxResults: MAX_RESULTS,
			weights: { fullText: FULL_TEXT_WEIGHT, semantic: SEMANTIC_WEIGHT },
		});

		const { embedding, usage } = await embed({
			model: openai.embedding("text-embedding-3-small"),
			value: query,
			maxRetries: 3,
			abortSignal: AbortSignal.timeout(EMBEDDING_TIMEOUT_MS),
		});

		if (!embedding) throw new Error("Failed to generate query embedding");

		const { data: matches, error } = await supabaseAdmin.rpc(
			"hybrid_search_documents",
			{
				query_text: query,
				query_embedding: embedding,
				match_count: MAX_RESULTS,
				full_text_weight: FULL_TEXT_WEIGHT,
				semantic_weight: SEMANTIC_WEIGHT,
				rrf_k: RRF_K,
			},
		);

		if (error) throw error;

		const filteredMatches = documentId
			? matches.filter((match) => match.id === documentId)
			: matches;

		console.log("[Search] Search completed:", {
			totalResults: filteredMatches?.length || 0,
			filteredByDocument: documentId ? "yes" : "no",
			averageScore: filteredMatches?.length
				? filteredMatches.reduce((acc, m) => acc + m.combined_score, 0) /
					filteredMatches.length
				: null,
		});

		return {
			success: true as const,
			matches: filteredMatches || [],
		};
	} catch (error) {
		console.error("[Search] Search failed:", error);
		return {
			success: false as const,
			error:
				error instanceof Error ? error.message : "Failed to search documents",
		};
	}
}
