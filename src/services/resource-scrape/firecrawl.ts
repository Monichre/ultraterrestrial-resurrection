import { fireCrawl } from "@/lib/firecrawl"
import { EXTERNAL_RESOURCES } from '@/utils'
export const scrapeWithFireCrawl = async ( { url, formats = ['markdown', 'extract', 'screenshot'], extract = { prompt: 'Extract all data related to Events, Topics, Key Figures, Sightings, Artifacts, Testimonies, and any other relevant information as it concerns UFO/UAP Phenomenon' } }: { url: string, formats: string[], extract: { prompt: string } } ) => {
  return await fireCrawl.scrapeUrl( url, {
    formats,
    extract: {
      prompt: extract.prompt
    },
  } )
}


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

