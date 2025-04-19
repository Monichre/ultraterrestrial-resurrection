import { NextResponse } from 'next/server'
import { z } from 'zod'
import { 
  ResearchCategory,
  ResearchDepth
} from '@/services/resource-scrape'
import { processMultipleResources, processResource } from '@/services/knowledge-layer/process-resource'
import { EXTERNAL_RESOURCES } from '@/utils'

// Schema for batch processing request
const BatchProcessingSchema = z.object({
  resourceCount: z.number().min(1).max(50).optional(),
  useDeepResearch: z.boolean().optional(),
  researchDepth: z.enum([
    ResearchDepth.SURFACE, 
    ResearchDepth.MODERATE, 
    ResearchDepth.DEEP, 
    ResearchDepth.COMPREHENSIVE
  ]).optional(),
  categories: z.array(z.enum([
    ResearchCategory.SIGHTINGS,
    ResearchCategory.TESTIMONIES,
    ResearchCategory.ARTIFACTS,
    ResearchCategory.ORGANIZATIONS,
    ResearchCategory.PERSONNEL,
    ResearchCategory.EVENTS,
    ResearchCategory.THEORIES,
    ResearchCategory.LOCATIONS,
    ResearchCategory.PHENOMENA
  ])).optional(),
  recursiveLinks: z.boolean().optional(),
  linkDepth: z.number().min(1).max(3).optional(),
  urlFilter: z.string().optional(),
  customUrls: z.array(z.string().url()).optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate the request
    const { 
      resourceCount = 5,
      useDeepResearch = false,
      researchDepth = ResearchDepth.MODERATE,
      categories = [ResearchCategory.SIGHTINGS, ResearchCategory.EVENTS],
      recursiveLinks = false,
      linkDepth = 1,
      urlFilter = '',
      customUrls
    } = BatchProcessingSchema.parse(body)
    
    // If custom URLs are provided, use those instead of the external resources
    if (customUrls && customUrls.length > 0) {
      const processedResults = await Promise.all(
        customUrls.map(url => 
          processResource(url, {
            useDeepResearch,
            researchDepth,
            categories,
            recursiveLinks,
            linkDepth
          })
        )
      )
      
      return NextResponse.json({
        success: true,
        message: `Processed ${processedResults.length} custom URLs`,
        resourcesProcessed: processedResults.length,
        resourcesFailed: processedResults.filter(r => r.error).length,
        results: processedResults
      })
    }
    
    // Build a filter function based on the URL filter string
    let resourceFilter = (url: string) => true
    if (urlFilter) {
      const filterLower = urlFilter.toLowerCase()
      resourceFilter = (url: string) => url.toLowerCase().includes(filterLower)
    }
    
    // Process multiple resources with the given filter
    const results = await processMultipleResources({
      resourceCount,
      resourceFilter,
      useDeepResearch,
      researchDepth,
      categories,
      recursiveLinks,
      linkDepth
    })
    
    return NextResponse.json({
      success: true,
      message: `Processed ${results.totalProcessed} resources from the external resources list`,
      totalResources: EXTERNAL_RESOURCES.length,
      resourcesProcessed: results.totalProcessed,
      successCount: results.successCount,
      failureCount: results.failureCount,
      results: results.results
    })
  } catch (error) {
    console.error('Error in batch processing API:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        error: error instanceof Error ? error.name : 'UnknownError'
      },
      { status: 400 }
    )
  }
}

export async function GET(request: Request) {
  try {
    // Return the list of available external resources
    return NextResponse.json({
      success: true,
      message: 'External resources list retrieved',
      totalResources: EXTERNAL_RESOURCES.length,
      resources: EXTERNAL_RESOURCES
    })
  } catch (error) {
    console.error('Error retrieving external resources:', error)
    
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        error: error instanceof Error ? error.name : 'UnknownError'
      },
      { status: 500 }
    )
  }
}