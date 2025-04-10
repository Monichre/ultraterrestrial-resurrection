import { processResource, type ResourceProcessingOptions } from "@/services/knowledge-layer/process-resource";
import { xata } from '@/db/xata/client';

/**
 * Process web resource URL with deep research capabilities
 */
export async function POST(req: Request) {
  try {
    const input: {
      resourceUrl: string | null;
      options?: ResourceProcessingOptions;
      metadata?: Record<string, any>;
    } = await req.json();
    
    if (!input.resourceUrl) {
      return new Response(JSON.stringify({ error: 'Resource URL is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Process the URL with optional deep research settings
    const processedResult = await processResource(input.resourceUrl, input.options || {});
    
    // Generate a unique resource ID if not already present
    const resourceId = processedResult.resourceId || `web-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Store in database
    try {
      // Store the web resource reference in Xata
      await xata.db.webResources.create({
        resourceId,
        url: input.resourceUrl,
        summary: processedResult.summary,
        embedding: processedResult.embedding,
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
        processingOptions: JSON.stringify(input.options || {}),
        createdAt: new Date(),
      });
    } catch (dbError) {
      console.error('Warning: Failed to store web resource in database:', dbError);
      // Continue without failing the request
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        resourceId,
        url: input.resourceUrl,
        summary: processedResult.summary,
        processingOptions: input.options || {},
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error: any) {
    console.error('Error processing resource:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process resource',
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
