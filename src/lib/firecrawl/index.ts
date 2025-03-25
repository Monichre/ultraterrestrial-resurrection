import FirecrawlApp from '@mendable/firecrawl-js'

export const fireCrawl = new FirecrawlApp( {
  apiKey: process.env.FIRECRAWL_API_KEY,

} )