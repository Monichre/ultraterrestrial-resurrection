import { fireCrawl } from "@/lib/firecrawl"
import { EXTERNAL_RESOURCES } from '@/utils'

// Resource categories for deep research
export enum ResearchDepth {
  SURFACE = 'surface',
  MODERATE = 'moderate',
  DEEP = 'deep',
  COMPREHENSIVE = 'comprehensive'
}

export enum ResearchCategory {
  SIGHTINGS = 'sightings',
  TESTIMONIES = 'testimonies',
  ARTIFACTS = 'artifacts',
  ORGANIZATIONS = 'organizations',
  PERSONNEL = 'personnel',
  EVENTS = 'events',
  THEORIES = 'theories',
  LOCATIONS = 'locations',
  PHENOMENA = 'phenomena'
}

type DeepResearchOptions = {
  depth: ResearchDepth;
  categories: ResearchCategory[];
  recursiveLinks?: boolean;
  linkDepth?: number;
  extractionModel?: string;
  searchParams?: Record<string, string>;
  maxResults?: number;
}

export const scrapeWithFireCrawl = async ( { url, formats = ['markdown', 'extract', 'screenshot'], extract = { prompt: 'Extract all data related to Events, Topics, Key Figures, Sightings, Artifacts, Testimonies, and any other relevant information as it concerns UFO/UAP Phenomenon' } }: { url: string, formats: string[], extract: { prompt: string } } ) => {
  return await fireCrawl.scrapeUrl( url, {
    formats,
    extract: {
      prompt: extract.prompt
    },
  } )
}

/**
 * Deep research feature utilizing Firecrawl's latest API capabilities
 * This function can perform targeted extraction based on research categories
 * and provides different depth levels of analysis.
 */
export const deepResearch = async (urls: string[], options: DeepResearchOptions) => {
  const { 
    depth = ResearchDepth.MODERATE, 
    categories = [ResearchCategory.SIGHTINGS], 
    recursiveLinks = false,
    linkDepth = 1,
    extractionModel = 'anthropic/claude-3-opus-20240229',
    searchParams = {},
    maxResults = 10
  } = options;
  
  // Adjust scraping parameters based on research depth
  const depthConfig = {
    [ResearchDepth.SURFACE]: {
      formats: ['markdown', 'extract'],
      limit: 50
    },
    [ResearchDepth.MODERATE]: {
      formats: ['markdown', 'extract', 'screenshot'],
      limit: 100
    },
    [ResearchDepth.DEEP]: {
      formats: ['markdown', 'extract', 'screenshot', 'html'],
      limit: 250
    },
    [ResearchDepth.COMPREHENSIVE]: {
      formats: ['markdown', 'extract', 'screenshot', 'html', 'text'],
      limit: 500
    }
  };
  
  // Build category-specific extraction prompts
  const categoryPrompts = {
    [ResearchCategory.SIGHTINGS]: 'Extract all UAP/UFO sighting data including dates, locations, witness details, object descriptions, and behavior patterns',
    [ResearchCategory.TESTIMONIES]: 'Extract all testimony data including witnesses, officials, credibility factors, consistency with other accounts, and key claims',
    [ResearchCategory.ARTIFACTS]: 'Extract all artifact data including physical evidence, analysis results, chain of custody, and scientific evaluations',
    [ResearchCategory.ORGANIZATIONS]: 'Extract all organization data including government agencies, research groups, private entities, and their connections to UAP/UFO research',
    [ResearchCategory.PERSONNEL]: 'Extract all data about key individuals including researchers, officials, witnesses, and their contributions to UAP/UFO disclosure',
    [ResearchCategory.EVENTS]: 'Extract all significant event data including major incidents, hearings, disclosures, and their historical context',
    [ResearchCategory.THEORIES]: 'Extract all theoretical frameworks explaining UAP/UFO phenomena including scientific hypotheses and alternative explanations',
    [ResearchCategory.LOCATIONS]: 'Extract all data about significant locations including hotspots, bases, and areas with recurring phenomena',
    [ResearchCategory.PHENOMENA]: 'Extract all data about specific types of UAP/UFO phenomena including patterns, classifications, and physical characteristics'
  };
  
  // Build the combined extraction prompt
  const extractionPrompt = categories
    .map(category => categoryPrompts[category])
    .join('. Also, ');
  
  // Configure and execute the deep research crawl
  const deepResearchResults = await Promise.all(
    urls.map(async (url) => {
      try {
        // Determine if we're using the new recursive crawl API
        if (recursiveLinks) {
          const crawlResponse = await fireCrawl.crawlUrl(url, {
            limit: depthConfig[depth].limit,
            maxDepth: linkDepth,
            followExternalLinks: true,
            scrapeOptions: {
              formats: depthConfig[depth].formats,
              extract: {
                prompt: extractionPrompt,
                model: extractionModel
              },
              searchParams
            }
          });
          
          return {
            source: url,
            data: crawlResponse,
            status: 'success',
            researchDepth: depth,
            categories
          };
        } else {
          // Use standard scrape for single-page analysis
          const scrapeResponse = await fireCrawl.scrapeUrl(url, {
            formats: depthConfig[depth].formats,
            extract: {
              prompt: extractionPrompt,
              model: extractionModel
            },
            searchParams
          });
          
          return {
            source: url,
            data: scrapeResponse,
            status: 'success',
            researchDepth: depth,
            categories
          };
        }
      } catch (error) {
        console.error(`Deep research failed for URL: ${url}`, error);
        return {
          source: url,
          error: error.message,
          status: 'failed',
          researchDepth: depth,
          categories
        };
      }
    })
  );
  
  // Filter to max results and return
  return deepResearchResults.slice(0, maxResults);
};

export const scrapeAllExternalDisclosureResources = async () => {
  const fullResourceScrape = await Promise.all(
    EXTERNAL_RESOURCES.map( async ( resource ) => {
      const scrapeResponse = await fireCrawl.scrapeUrl( resource, {
        formats: ['markdown', 'html'],
      } )
      return {
        source: resource,
        data: scrapeResponse,
      }
    } )
  )
  console.log( 'fullResourceScrape: ', fullResourceScrape )
  return fullResourceScrape
}

export const crawlAllExternalDisclosureResources = async () => {
  const fullResourceCrawl = await Promise.all(
    EXTERNAL_RESOURCES.map( async ( resource ) => {
      const crawlResponse = await fireCrawl.crawlUrl( resource, {
        limit: 100,
        scrapeOptions: {
          formats: ['markdown', 'html'],
        },
      } )
      return {
        source: resource,
        data: crawlResponse,
      }
    } )
  )
  console.log( 'fullResourceCrawl: ', fullResourceCrawl )
  return fullResourceCrawl
}

