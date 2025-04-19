import { NextRequest } from 'next/server';
import { xata } from '@/db/xata/client';

/**
 * Get cached resources by resourceId
 * This route allows retrieving context for resources that have been previously processed
 */
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const resourceId = url.searchParams.get('resourceId');
    
    if (!resourceId) {
      return new Response(JSON.stringify({ error: 'Resource ID is required' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Try to find the resource in web resources
    let resource = await xata.db.webResources.filter({
      resourceId
    }).getFirst();
    
    // If not found, check document resources
    if (!resource) {
      resource = await xata.db.documentResources.filter({
        resourceId
      }).getFirst();
    }
    
    if (!resource) {
      return new Response(JSON.stringify({ error: 'Resource not found' }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        resource
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error: any) {
    console.error('Error fetching resource context:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch resource context',
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

/**
 * List all available resource contexts
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { limit = 10, offset = 0, type } = body;
    
    let webResources: any[] = [];
    let documentResources: any[] = [];
    
    // Fetch resources by type or all if type is not specified
    if (!type || type === 'web') {
      webResources = await xata.db.webResources
        .sort('createdAt', 'desc')
        .getPaginated({
          pagination: {
            size: type ? limit : Math.floor(limit / 2),
            offset: offset
          }
        });
    }
    
    if (!type || type === 'document') {
      documentResources = await xata.db.documentResources
        .sort('createdAt', 'desc')
        .getPaginated({
          pagination: {
            size: type ? limit : Math.floor(limit / 2),
            offset: offset
          }
        });
    }
    
    // Combine and sort by createdAt
    const combinedResources = [
      ...webResources.map(r => ({ ...r, type: 'web' })),
      ...documentResources.map(r => ({ ...r, type: 'document' }))
    ].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, limit);
    
    return new Response(
      JSON.stringify({
        success: true,
        resources: combinedResources,
        total: webResources.length + documentResources.length
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error: any) {
    console.error('Error listing resources:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to list resources',
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