import { askXataWithAi } from '@/db/xata'
import { getClaudeSummary } from '@/services/ai/claude/get-claude-response'
import { generateEmbeddings } from '@/services/ai/embeddings/embedding'
import { RESEARCH_TO_DATABASE_SCHEMA_V1_PROMPT } from '@/services/ai/prompts/database-schemas/v1.prompt'
import { scrapeWithFireCrawl } from '@/services/resource-scrape'

export const processResource = async ( resourceUrl: string ) => {
  const memorySeries = []


  /*
  Steps:
  1. Instantiate Claude, 01-mini, Xata and Firecrawl Agents with proper prompt assignments 
  2. Scrape the resource
  3. Identify and extract key data from resource
  4. Summarize the content
  5. Map the data to the database schema
  6. Generate embeddings for the data`
  7. Tap Xata to check for existing entries
  8. If entry exists, update the entry?
  9. If entry does not exist, create a new entry
  10. Return the entry

  con
  
  NOTE: A fully new resource should result in a summary, an embedding, and a new entry in the database.
  */
  // instantiate claude with DATABASE_SCHEMA_V1_PROMPT

  // instantiate openAI with 
  const pageContent = await scrapeWithFireCrawl( {
    url: resourceUrl, formats: ['markdown', 'extract', 'screenshot'], extract: {
      prompt: `Process this webpage by extract all data related to Events, Topics, Key Figures, Sightings, Artifacts, Testimonies, and any other relevant information as it concerns UFO/UAP Phenomenon`
    }
  } )

  console.log( "🚀 ~ file: process-resource.ts:35 ~ processResource ~ pageContent:", pageContent )


  const summary = await getClaudeSummary( { system: RESEARCH_TO_DATABASE_SCHEMA_V1_PROMPT, content: pageContent?.data?.markdown ?? '', prompt: 'Process this page data and summarize it accordingly' } )

  console.log( "🚀 ~ file: process-resource.ts:40 ~ processResource ~ summary:", summary )

  const embedding = await generateEmbeddings( summary )

  console.log( "🚀 ~ file: process-resource.ts:44 ~ processResource ~ embedding:", embedding )

  const doesItExist = await askXataWithAi( `Are there records in the database for any of the following information? ${summary}` )


  console.log( "🚀 ~ file: process-resource.ts:51 ~ processResource ~ doesItExist:", doesItExist )





}
