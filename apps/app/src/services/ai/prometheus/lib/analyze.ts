// import { getXataClient, type DocumentsRecord } from "../db/xata/xata";
// import { generateObject } from "ai";
// import { openai } from "@ai-sdk/openai";
// import { z } from "zod";
// import { processDocument as vectorizeDocument } from "./vectorize";
// import pMap from "p-map";

// const analysisSchema = z.object({
//   summary: z.string().min(1),
//   keywords: z.array(z.string()),
//   entities: z.array(
//     z.object({
//       type: z.string(),
//       text: z.string(),
//       metadata: z.record(z.any()).optional(),
//     })
//   ),
// });

// type AnalysisResult = z.infer<typeof analysisSchema>;

// // Type definitions for document analysis
// type AnalysisTask = {
//   id: string;
//   task_type: "analyze" | "vectorize";
//   status: "pending" | "processing" | "processed" | "error";
//   created_at: string;
//   completed_at?: string;
//   error_message?: string;
// };

// type DocumentAnalysis = {
//   summary: string;
//   keywords: string[];
// };

// type DocumentEntity = {
//   entity_type: string;
//   entity_text: string;
//   metadata?: any;
// };

// type AnalysisMetadata = {
//   extracted_text?: string;
//   processing_status?: "pending" | "processing" | "processed" | "error";
//   processing_tasks?: AnalysisTask[];
//   analysis?: DocumentAnalysis;
//   entities?: DocumentEntity[];
//   error_message?: string;
//   error_timestamp?: string;
//   last_processed?: string;
// };

// // Constants for concurrent processing
// const CONCURRENT_TASKS = 2; // Number of concurrent tasks (analysis and entity storage)

// export async function analyzeDocument(documentId: string) {
//   const xata = getXataClient();
  
//   try {
//     console.log(`[Analysis] Starting analysis for document ${documentId}`);

//     // Get document
//     const document = await xata.db.documents.read(documentId);

//     if (!document) {
//       console.error("[Analysis] Document not found");
//       throw new Error("Document not found");
//     }

//     console.log(`[Analysis] Retrieved document: ${document.title || 'Untitled'}`);

//     const metadata = (document.metadata as AnalysisMetadata) || {};
//     const extractedText = metadata.extracted_text;

//     if (!extractedText) {
//       console.error("[Analysis] No extracted text found for document");
//       throw new Error("Document has no extracted text. Run text extraction first.");
//     }

//     console.log(`[Analysis] Found extracted text of length: ${extractedText.length}`);

//     // Create analysis task
//     const taskId = crypto.randomUUID();
//     const newTask: AnalysisTask = {
//       id: taskId,
//       task_type: "analyze",
//       status: "processing",
//       created_at: new Date().toISOString(),
//     };

//     const updatedMetadata: AnalysisMetadata = {
//       ...metadata,
//       processing_status: "processing",
//       processing_tasks: [
//         ...(metadata.processing_tasks || []),
//         newTask
//       ]
//     };

//     await xata.db.documents.update(documentId, {
//       metadata: updatedMetadata,
//       processed: false
//     });

//     console.log(`[Analysis] Created analysis task: ${taskId}`);

//     // Define processing tasks
//     const processingTasks = async () => {
//       // Task 1: Analyze content and update document
//       console.log("[Analysis] Starting content analysis with AI...");
//       const analysis = await analyzeContent(extractedText);
//       console.log("[Analysis] AI analysis complete", {
//         summaryLength: analysis.summary.length,
//         keywordsCount: analysis.keywords.length,
//         entitiesCount: analysis.entities.length,
//       });

//       // Update document with analysis results
//       console.log("[Analysis] Updating document with analysis results...");
//       const currentDoc = await xata.db.documents.read(documentId);
//       const currentMetadata = (currentDoc?.metadata as AnalysisMetadata) || {};
      
//       const analysisMetadata: AnalysisMetadata = {
//         ...currentMetadata,
//         analysis: {
//           summary: analysis.summary,
//           keywords: analysis.keywords,
//         },
//         processing_status: "processing",
//       };

//       await xata.db.documents.update(documentId, {
//         metadata: analysisMetadata,
//       });

//       // Task 2: Store entities in parallel batches
//       if (analysis.entities.length > 0) {
//         console.log(`[Analysis] Storing ${analysis.entities.length} entities...`);

//         // Convert entities to our format
//         const documentEntities: DocumentEntity[] = analysis.entities.map((entity) => ({
//           entity_type: entity.type,
//           entity_text: entity.text,
//           metadata: entity.metadata || null,
//         }));

//         // Split entities into batches of 10
//         const entityBatches = [];
//         for (let i = 0; i < documentEntities.length; i += 10) {
//           entityBatches.push(documentEntities.slice(i, i + 10));
//         }

//         // Store batches concurrently
//         await pMap(
//           entityBatches,
//           async (batch, batchIndex) => {
//             console.log(`[Analysis] Storing entity batch ${batchIndex + 1}/${entityBatches.length}`);
            
//             // For now, store entities in metadata until document_entities table is created
//             // TODO: Replace with dedicated document_entities table
//             const docForUpdate = await xata.db.documents.read(documentId);
//             const metadataForUpdate = (docForUpdate?.metadata as AnalysisMetadata) || {};
            
//             const updatedEntitiesMetadata: AnalysisMetadata = {
//               ...metadataForUpdate,
//               entities: [
//                 ...(metadataForUpdate.entities || []),
//                 ...batch
//               ]
//             };

//             await xata.db.documents.update(documentId, {
//               metadata: updatedEntitiesMetadata,
//             });

//             console.log(`[Analysis] Entity batch ${batchIndex + 1} stored successfully`);
//           },
//           {
//             concurrency: 3, // Process up to 3 batches at a time
//             stopOnError: true,
//           }
//         );

//         console.log("[Analysis] All entities stored successfully");
//       }
//     };

//     // Execute processing tasks
//     await processingTasks();

//     // Update analysis task status
//     const finalDoc = await xata.db.documents.read(documentId);
//     const finalMetadata = (finalDoc?.metadata as AnalysisMetadata) || {};
    
//     const completedTask: AnalysisTask = {
//       ...newTask,
//       status: "processed",
//       completed_at: new Date().toISOString(),
//     };

//     const finalAnalysisMetadata: AnalysisMetadata = {
//       ...finalMetadata,
//       processing_status: "processed",
//       last_processed: new Date().toISOString(),
//       processing_tasks: [
//         ...(finalMetadata.processing_tasks?.filter(t => t.id !== taskId) || []),
//         completedTask
//       ]
//     };

//     await xata.db.documents.update(documentId, {
//       metadata: finalAnalysisMetadata,
//     });

//     console.log("[Analysis] Analysis task marked as processed");

//     // Create vectorization task
//     const vectorizeTaskId = crypto.randomUUID();
//     const vectorizeTask: AnalysisTask = {
//       id: vectorizeTaskId,
//       task_type: "vectorize",
//       status: "pending",
//       created_at: new Date().toISOString(),
//     };

//     const vectorizeMetadata: AnalysisMetadata = {
//       ...finalAnalysisMetadata,
//       processing_tasks: [
//         ...finalAnalysisMetadata.processing_tasks || [],
//         vectorizeTask
//       ]
//     };

//     await xata.db.documents.update(documentId, {
//       metadata: vectorizeMetadata,
//     });

//     console.log("[Analysis] Created vectorization task");
//     console.log(`[Analysis] Analysis pipeline processed for document ${documentId}`);

//     // Trigger vectorization pipeline
//     console.log("[Analysis] Triggering vectorization pipeline...");
//     await vectorizeDocument(documentId);

//     return {
//       success: true,
//       documentId,
//       analysis: finalAnalysisMetadata.analysis,
//       entitiesCount: finalAnalysisMetadata.entities?.length || 0,
//     };

//   } catch (error) {
//     console.error("[Analysis] Pipeline error:", error);

//     // Update document status
//     console.log("[Analysis] Updating document status to error...");
//     try {
//       const errorDoc = await xata.db.documents.read(documentId);
//       const errorMetadata = (errorDoc?.metadata as AnalysisMetadata) || {};
      
//       const finalErrorMetadata: AnalysisMetadata = {
//         ...errorMetadata,
//         processing_status: "error",
//         error_message: error instanceof Error ? error.message : "Unknown error",
//         error_timestamp: new Date().toISOString(),
//         processing_tasks: errorMetadata.processing_tasks?.map(task => 
//           task.status === "processing" ? {
//             ...task,
//             status: "error" as const,
//             error_message: error instanceof Error ? error.message : "Unknown error",
//             completed_at: new Date().toISOString()
//           } : task
//         ) || []
//       };

//       await xata.db.documents.update(documentId, {
//         processed: false,
//         metadata: finalErrorMetadata,
//       });
//     } catch (updateError) {
//       console.error("[Analysis] Failed to update document error status:", updateError);
//     }

//     throw error;
//   }
// }

// async function analyzeContent(text: string): Promise<AnalysisResult> {
//   console.log("[Analysis] Starting content analysis...");

//   // Truncate text if too long (OpenAI has a token limit)
//   const maxLength = 15000; // Roughly 4000 tokens
//   const truncatedText = text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
//   console.log(`[Analysis] Text length: ${text.length}, truncated: ${truncatedText.length}`);

//   console.log("[Analysis] Calling OpenAI...");
//   const { object } = await generateObject({
//     model: openai("gpt-4o-mini"),
//     schema: analysisSchema,
//     prompt: `Please analyze the following text and extract key information. Generate a concise summary (max 200 words), up to 10 relevant keywords, and identify named entities (like people, organizations, locations, dates).

// Text to analyze:
// ${truncatedText}`,
//   });

//   if (!object) {
//     console.error("[Analysis] Failed to generate analysis - no object returned");
//     throw new Error("Failed to generate analysis");
//   }

//   console.log("[Analysis] Successfully generated analysis");
//   return object;
// }

// // Helper function to get document entities from metadata
// export async function getDocumentEntities(documentId: string): Promise<DocumentEntity[]> {
//   const xata = getXataClient();
//   const document = await xata.db.documents.read(documentId);
  
//   if (!document) {
//     throw new Error("Document not found");
//   }
  
//   const metadata = (document.metadata as AnalysisMetadata) || {};
//   return metadata.entities || [];
// }

// // Helper function to get document analysis from metadata
// export async function getDocumentAnalysis(documentId: string): Promise<DocumentAnalysis | null> {
//   const xata = getXataClient();
//   const document = await xata.db.documents.read(documentId);
  
//   if (!document) {
//     throw new Error("Document not found");
//   }
  
//   const metadata = (document.metadata as AnalysisMetadata) || {};
//   return metadata.analysis || null;
// }
