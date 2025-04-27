import "@ungap/with-resolvers";
import { getDocument } from "pdfjs-dist";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../db/types";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import mammoth from "mammoth";
import { analyzeDocument } from "./analyze";

type ExtractedContent = {
	text: string;
	metadata: {
		pageCount?: number;
		wordCount?: number;
	};
};

export async function processDocument(
	supabase: SupabaseClient<Database>,
	documentId: string,
) {
	const startTime = Date.now();
	try {
		console.log(`[Extract] Starting extraction for document ${documentId}`);

		// Get document
		const { data: document, error: docError } = await supabase
			.from("doc_processor_documents")
			.select("*")
			.eq("id", documentId)
			.single();

		if (docError || !document) {
			console.error("[Extract] Document fetch error:", docError);
			throw docError || new Error("Document not found");
		}

		console.log(
			`[Extract] Retrieved document: ${document.title} (${document.file_type})`,
			{
				size: document.file_size,
				mimeType: document.mime_type,
			},
		);

		// Create extraction task
		const { data: task, error: taskError } = await supabase
			.from("doc_processor_processing_tasks")
			.insert({
				document_id: documentId,
				task_type: "extract",
				status: "processing",
			})
			.select()
			.single();

		if (taskError) {
			console.error("[Extract] Task creation error:", taskError);
			throw taskError;
		}

		console.log(`[Extract] Created extraction task: ${task.id}`);

		// Download file
		console.log(`[Extract] Downloading file from: ${document.file_path}`);
		const { data: fileData, error: downloadError } = await supabase.storage
			.from("documents")
			.download(document.file_path.split("/documents/")[1]);

		if (downloadError || !fileData) {
			console.error("[Extract] File download error:", downloadError);
			throw downloadError || new Error("Failed to download file");
		}

		console.log(
			`[Extract] File downloaded successfully, size: ${fileData.size} bytes`,
		);

		// Extract content based on file type
		console.log(
			`[Extract] Starting content extraction for ${document.file_type} file`,
		);
		let content: ExtractedContent;
		switch (document.file_type) {
			case "pdf":
				content = await extractPdfContent(fileData);
				break;
			case "docx":
				content = await extractDocxContent(fileData);
				break;
			case "txt":
				content = await extractTextContent(fileData);
				break;
			default:
				console.error(`[Extract] Unsupported file type: ${document.file_type}`);
				throw new Error(`Unsupported file type: ${document.file_type}`);
		}

		console.log("[Extract] Content extracted successfully", {
			textLength: content.text.length,
			wordCount: content.metadata.wordCount,
			pageCount: content.metadata.pageCount,
		});

		// Update document with extracted content
		console.log("[Extract] Updating document with extracted content...");
		const { error: updateError } = await supabase
			.from("doc_processor_documents")
			.update({
				extracted_text: content.text,
				metadata: content.metadata,
				status: "processing" as const,
			})
			.eq("id", documentId);

		if (updateError) {
			console.error("[Extract] Document update error:", updateError);
			throw updateError;
		}

		console.log("[Extract] Document updated with extracted content");

		// Update task status
		await supabase
			.from("doc_processor_processing_tasks")
			.update({
				status: "processed" as const,
			})
			.eq("id", task.id);

		console.log("[Extract] Extraction task marked as processed");

		// Create and trigger analysis task
		const { error: analysisError } = await supabase
			.from("doc_processor_processing_tasks")
			.insert({
				document_id: documentId,
				task_type: "analyze",
				status: "pending" as const,
			});

		if (analysisError) {
			console.error("[Extract] Analysis task creation error:", analysisError);
			throw analysisError;
		}

		console.log("[Extract] Created analysis task");
		console.log(
			`[Extract] Extraction pipeline processed for document ${documentId}`,
		);

		// Trigger analysis pipeline
		// Need to return success to the client here..  then trigger the analyzeDocument from the upload-zone
		// console.log("[Extract] Triggering analysis pipeline...");
		// await analyzeDocument(supabase, documentId);
	} catch (error) {
		console.error("[Extract] Pipeline error:", error);

		// Update document status
		console.log("[Extract] Updating document status to error...");
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
			.eq("task_type", "extract")
			.single();

		if (task) {
			console.log("[Extract] Updating task status to error...");
			await supabase
				.from("doc_processor_processing_tasks")
				.update({
					status: "error",
					error: error instanceof Error ? error.message : "Unknown error",
				})
				.eq("id", task.id);
		}

		throw error;
	} finally {
		const duration = Date.now() - startTime;
		console.log(`[Extract] Pipeline processed in ${duration}ms`);
	}
}

async function extractPdfContent(file: Blob): Promise<ExtractedContent> {
	const startTime = Date.now();
	console.log("[Extract:PDF] Starting PDF extraction...", {
		fileSize: file.size,
		mimeType: file.type,
	});

	try {
		// @ts-ignore
		console.log("[Extract:PDF] Loading PDF worker...");
		await import("pdfjs-dist/build/pdf.worker.mjs");

		const buffer = await file.arrayBuffer();
		console.log("[Extract:PDF] File converted to ArrayBuffer");

		// Load PDF document
		console.log("[Extract:PDF] Loading PDF document...");
		const pdf = await getDocument({
			data: buffer,
			cMapUrl: "../../../node_modules/pdfjs-dist/cmaps/",
			cMapPacked: true,
			standardFontDataUrl: "../../../node_modules/pdfjs-dist/standard_fonts/",
			verbosity: 0,
		}).promise;

		console.log(
			`[Extract:PDF] PDF loaded successfully, pages: ${pdf.numPages}`,
		);

		let text = "";
		for (let i = 1; i <= pdf.numPages; i++) {
			console.log(`[Extract:PDF] Processing page ${i}/${pdf.numPages}`);
			const page = await pdf.getPage(i);
			const content = await page.getTextContent();
			text += content.items.map((item: any) => item.str).join(" ") + "\n";
		}

		const result = {
			text: text.trim(),
			metadata: {
				pageCount: pdf.numPages,
				wordCount: countWords(text),
			},
		};

		console.log("[Extract:PDF] PDF extraction processed", {
			textLength: result.text.length,
			wordCount: result.metadata.wordCount,
			pageCount: result.metadata.pageCount,
			duration: Date.now() - startTime,
			averageWordsPerPage: Math.round(
				result.metadata.wordCount / result.metadata.pageCount,
			),
		});

		return result;
	} catch (error) {
		console.error("[Extract:PDF] Error extracting PDF content:", error);
		throw error;
	}
}

async function extractDocxContent(file: Blob): Promise<ExtractedContent> {
	console.log("[Extract:DOCX] Starting DOCX extraction...");
	try {
		const arrayBuffer = await file.arrayBuffer();
		console.log("[Extract:DOCX] File converted to ArrayBuffer");

		const result = await mammoth.extractRawText({ arrayBuffer });
		const text = result.value;

		const content = {
			text,
			metadata: {
				wordCount: countWords(text),
			},
		};

		console.log("[Extract:DOCX] DOCX extraction processed", {
			textLength: content.text.length,
			wordCount: content.metadata.wordCount,
		});

		return content;
	} catch (error) {
		console.error("[Extract:DOCX] Error extracting DOCX content:", error);
		throw error;
	}
}

async function extractTextContent(file: Blob): Promise<ExtractedContent> {
	console.log("[Extract:TXT] Starting text extraction...");
	try {
		const text = await file.text();

		const content = {
			text,
			metadata: {
				wordCount: countWords(text),
			},
		};

		console.log("[Extract:TXT] Text extraction processed", {
			textLength: content.text.length,
			wordCount: content.metadata.wordCount,
		});

		return content;
	} catch (error) {
		console.error("[Extract:TXT] Error extracting text content:", error);
		throw error;
	}
}

function countWords(text: string): number {
	return text.trim().split(/\s+/).length;
}
