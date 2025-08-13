import { xata } from "@db/xata/client"
import { searchXata } from "@db/xata/api"

// Table name mapping to handle singular/plural conversions
const TABLE_NAME_MAP: Record<string, string> = {
  // Singular -> Plural mappings
  'document': 'documents',
  'event': 'events',
  'testimony': 'testimonies',
  'person': 'personnel',
  'personnel': 'personnel', // Already plural
  'topic': 'topics',
  'organization': 'organizations',
  'sighting': 'sightings',
  'artifact': 'artifacts',
  'location': 'locations',
  'user': 'users',
  'tag': 'tags',
  'theory': 'theories',
  'mindmap': 'mindmaps',
  'summary-file': 'summary-files',


  // Common API naming patterns -> Database table names
  'DOCUMENT': 'documents',
  'EVENT': 'events',
  'TESTIMONY': 'testimonies',
  'PERSONNEL': 'personnel',
  'TOPIC': 'topics',
  'ORGANIZATION': 'organizations',
  'SIGHTING': 'sightings',
  'ARTIFACT': 'artifacts',
  'LOCATION': 'locations',
  'USER': 'users'
}

export const searchDatabase = async ( { table, searchTerms, searchFields, limit = 3 }: any ) => {
  if ( !searchTerms?.length ) return []

  // Map table name to correct database table name
  let normalizedTable = table?.toLowerCase()
  const originalTable = table

  if ( TABLE_NAME_MAP[normalizedTable] ) {
    normalizedTable = TABLE_NAME_MAP[normalizedTable]
  } else if ( TABLE_NAME_MAP[table] ) {
    normalizedTable = TABLE_NAME_MAP[table]
  }

  console.log( `🔄 Table mapping: "${originalTable}" -> "${normalizedTable}"` )

  try {

    // Use Xata's native search API for better relevancy scoring and reasoning
    const searchQuery = searchTerms.join( ' ' )

    console.log( `🔍 Searching ${normalizedTable} for: "${searchQuery}"` )

    // Use Xata's search with relevancy scoring and highlighting
    const searchResults = await xata.search.all( searchQuery, {
      tables: [
        {
          table: normalizedTable,
          target: searchFields || ['name', 'title', 'description', 'summary'], // Default search fields
          boosters: [
            // Boost more recent records
            {
              dateBooster: {
                column: 'xata.createdAt',
                decay: 0.3,
                scale: '365d', // Boost records from last year
                factor: 2
              }
            }
          ]
        }
      ],
      page: {
        size: limit,
        offset: 0
      },
      fuzziness: 1, // Allow typo tolerance
      highlight: {
        enabled: true
      }
    } )

    console.log( `📊 Xata search results:`, {
      totalCount: searchResults.totalCount,
      recordCount: searchResults.records?.length || 0,
      searchQuery
    } )

    // Enhanced records with Xata's built-in reasoning
    const enhancedRecords = searchResults.records?.map( ( result: any ) => {
      const record = result.record || result
      const xataMetadata = result.xata || record.xata || {}

      // Extract reasoning from Xata's built-in features
      const highlights = xataMetadata.highlight || {}
      const score = xataMetadata.score || 0

      // Generate reasoning based on Xata's relevancy data
      const highlightReasons = Object.entries( highlights ).map( ( [field, matches]: [string, any] ) => {
        const matchText = Array.isArray( matches ) ? matches.join( ', ' ) : matches
        return `matched in ${field}: ${matchText}`
      } ).join( '; ' )

      const relevancyReason = score > 0.5 ? 'high relevance' :
        score > 0.2 ? 'moderate relevance' : 'low relevance'

      return {
        ...record,
        // Add Xata's built-in reasoning
        xataReasoning: {
          score: score,
          relevancyLevel: relevancyReason,
          highlightReasons: highlightReasons || 'General content match',
          searchTerms: searchQuery,
          explanation: `Selected with ${relevancyReason} (score: ${score.toFixed( 3 )}) because it ${highlightReasons || 'matches the search criteria'}`
        },
        // Preserve original Xata metadata
        xata: xataMetadata
      }
    } ) || []

    console.log( `✅ Enhanced ${enhancedRecords.length} records with Xata reasoning` )

    return enhancedRecords

  } catch ( error ) {
    console.error( '❌ Xata search failed, falling back to basic query:', error )

    // Fallback to original implementation
    const records = await Promise.all(
      searchTerms.map( async ( term: string ) =>
        await searchXata( {
          query: term,
          table: normalizedTable,
          id: undefined
        } )
      )
    )

    return records.flat()
  }
}
