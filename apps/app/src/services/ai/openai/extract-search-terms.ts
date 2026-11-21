import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'

const extractedEntitySchema = z.object( {
  name: z.string().min( 1 ).max( 120 ),
  type: z.enum( [
    'PERSONNEL',
    'ORGANIZATION',
    'EVENT',
    'LOCATION',
    'TOPIC',
    'DOCUMENT',
    'ARTIFACT',
    'SIGHTING',
    'TESTIMONY',
  ] ),
} )

const entityExtractionSchema = z.object( {
  entities: z.array( extractedEntitySchema ).max( 8 ),
} )

export type ExtractedSearchEntity = z.infer<typeof extractedEntitySchema>

const normalizeTerm = ( value: string ) => value.trim().replace( /\s+/g, ' ' )

const dedupeTerms = ( terms: string[] ) => {
  const seen = new Set<string>()

  return terms.reduce<string[]>( ( uniqueTerms, term ) => {
    const normalized = normalizeTerm( term )

    if ( !normalized ) return uniqueTerms

    const key = normalized.toLowerCase()

    if ( seen.has( key ) ) return uniqueTerms

    seen.add( key )
    uniqueTerms.push( normalized )

    return uniqueTerms
  }, [] )
}

const dedupeEntities = ( entities: ExtractedSearchEntity[] ) => {
  const uniqueTerms = dedupeTerms( entities.map( entity => entity.name ) )

  return uniqueTerms
    .map( term =>
      entities.find( entity => normalizeTerm( entity.name ).toLowerCase() === term.toLowerCase() )
    )
    .filter( ( entity ): entity is ExtractedSearchEntity => Boolean( entity ) )
}

export async function extractNamedSearchEntities( {
  text,
  query,
}: {
  text: string
  query?: string
} ): Promise<ExtractedSearchEntity[]> {
  const normalizedText = normalizeTerm( text || '' )
  const normalizedQuery = normalizeTerm( query || '' )

  if ( !normalizedText && !normalizedQuery ) return []

  try {
    const { object } = await generateObject( {
      model: openai( 'gpt-5.5' ),
      schema: entityExtractionSchema,
      prompt: `Extract the most specific searchable UFO/UAP disclosure entities from the text below.

Only return concrete entities or phrases that are useful as database search terms.
Prefer people, organizations, events, locations, documents, artifacts, sightings, testimonies, and well-defined topics.
Do not invent entities. Avoid generic filler unless it is the only searchable concept.

User query:
${normalizedQuery || normalizedText}

Relevant text:
${( normalizedText || normalizedQuery ).slice( 0, 4000 )}`,
    } )

    return dedupeEntities( object.entities )
  } catch ( error ) {
    console.error( 'Failed to extract named search entities:', error )
    return []
  }
}

export function toSearchTerms( entities: ExtractedSearchEntity[], fallbackQuery?: string ) {
  const searchTerms = dedupeTerms( entities.map( entity => entity.name ) )

  if ( searchTerms.length ) return searchTerms

  const normalizedFallback = normalizeTerm( fallbackQuery || '' )

  return normalizedFallback ? [normalizedFallback] : []
}
