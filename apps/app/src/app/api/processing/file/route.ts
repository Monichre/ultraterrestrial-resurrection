import { NextRequest } from 'next/server';
import { 
  processDocument,
  extractFileContent,
  type DocumentProcessingOptions
} from '@/services/resource-scrape/process-document';
import { xata } from '@db/client';

/**
 * Process uploaded file and extract content for AI analysis
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const optionsJson = formData.get('options') as string | null;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse options if present
    const options: DocumentProcessingOptions = optionsJson ? JSON.parse(optionsJson) : {};
    
    // Extract file content based on file type
    const fileContent = await extractFileContent(file);
    
    // Process document with all specified options
    const processedResult = await processDocument(file, fileContent, options);
    
    // Optionally store in database if needed
    try {
      // Store the document reference in Xata
      await xata.db.documentResources.create({
        resourceId: processedResult.resourceId,
        fileName: processedResult.fileName,
        fileType: processedResult.fileType,
        fileSize: processedResult.fileSize,
        summary: processedResult.summary,
        embedding: processedResult.embedding,
        processingOptions: JSON.stringify(processedResult.processingOptions),
        createdAt: new Date(),
      });
    } catch (dbError) {
      console.error('Warning: Failed to store document in database:', dbError);
      // Continue without failing the request
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        ...processedResult
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error: any) {
    console.error('Error processing file:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process file',
        details: error.message 
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}