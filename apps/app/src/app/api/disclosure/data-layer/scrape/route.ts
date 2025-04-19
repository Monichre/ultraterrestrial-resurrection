import { NextResponse } from 'next/server'
import { z } from 'zod'
import { 
  scrapeWithFireCrawl, 
  deepResearch,
  ResearchCategory,
  ResearchDepth
} from '@/services/resource-scrape'
import { processResource, processMultipleResources } from '@/services/knowledge-layer/process-resource'

// Schema for basic URL scrape
const BasicScrapeSchema = z.object({
  url: z.string().url(),
  formats: z.array(z.string()).optional(),
  extractPrompt: z.string().optional(),
})

// Schema for deep research request
const DeepResearchSchema = z.object({
  url: z.string().url().or(z.array(z.string().url())),
  depth: z.enum([
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
  processResults: z.boolean().optional(),
  maxResults: z.number().min(1).max(20).optional(),
  extractionModel: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Check if this is a deep research request
    if ('depth' in body || 'categories' in body || 'recursiveLinks' in body) {
      // Validate as deep research request
      const { 
        url, 
        depth = ResearchDepth.MODERATE, 
        categories = [ResearchCategory.SIGHTINGS], 
        recursiveLinks = false,
        linkDepth = 1,
        processResults = false,
        maxResults = 10,
        extractionModel = 'anthropic/claude-3-opus-20240229'
      } = DeepResearchSchema.parse(body)
      
      // Handle url as string or array
      const urlsToProcess = Array.isArray(url) ? url : [url]
      
      // Execute deep research
      const deepResearchResults = await deepResearch(urlsToProcess, {
        depth,
        categories,
        recursiveLinks,
        linkDepth,
        extractionModel,
        maxResults
      })
      
      // If processing is requested, run through the knowledge layer
      if (processResults) {
        // For each URL result, process it through the knowledge layer
        const processedResults = await Promise.all(
          urlsToProcess.map(singleUrl => 
            processResource(singleUrl, {
              useDeepResearch: true,
              researchDepth: depth,
              categories,
              recursiveLinks,
              linkDepth,
              extractionModel
            })
          )
        )
        
        return NextResponse.json({
          success: true,
          message: 'Deep research completed with processing',
          rawResults: deepResearchResults,
          processedResults
        })
      }
      
      return NextResponse.json({
        success: true,
        message: 'Deep research completed',
        results: deepResearchResults
      })
    } else {
      // Handle as basic scrape request
      const { url, formats, extractPrompt } = BasicScrapeSchema.parse(body)
      
      // Process the URL with standard scraping
      const result = await scrapeWithFireCrawl({
        url,
        formats: formats || ['markdown', 'extract'],
        extract: {
          prompt: extractPrompt || 'Extract all data related to Events, Topics, Key Figures, Sightings, Artifacts, Testimonies, and any other relevant information as it concerns UFO/UAP Phenomenon'
        }
      })
      
      return NextResponse.json({
        success: true,
        message: 'URL scraped successfully',
        result
      })
    }
  } catch (error) {
    console.error('Error in scrape API:', error)
    
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

// Also support GET for basic URL scraping
export async function GET(request: Request) {
  try {
    const url = new URL(request.url).searchParams.get('url')
    
    if (!url) {
      return NextResponse.json(
        {
          success: false,
          message: 'URL parameter is required'
        },
        { status: 400 }
      )
    }
    
    // Basic validation
    if (!url.startsWith('http')) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid URL format'
        },
        { status: 400 }
      )
    }
    
    // Process the URL with standard scraping
    const result = await scrapeWithFireCrawl({
      url,
      formats: ['markdown', 'extract'],
      extract: {
        prompt: 'Extract all data related to Events, Topics, Key Figures, Sightings, Artifacts, Testimonies, and any other relevant information as it concerns UFO/UAP Phenomenon'
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'URL scraped successfully',
      result
    })
  } catch (error) {
    console.error('Error in scrape API:', error)
    
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