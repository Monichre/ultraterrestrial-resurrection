import { executeDatabaseTableQuery } from "@/db/xata/db/search-operations"
import { xata } from "@db/xata/client"

export const searchDatabase = async ( { table, searchTerms, searchFields, limit = 3, sortBy, sortOrder, dateRange }: any ) => {
  if (!searchTerms?.length) return []

  try {
    // Use Xata's native search API for better relevancy scoring and reasoning
    const searchQuery = searchTerms.join(' ')
    
    console.log(`🔍 Searching ${table} for: "${searchQuery}"`)
    
    // Use Xata's search with relevancy scoring and highlighting
    const searchResults = await xata.search.all(searchQuery, {
      tables: [
        {
          table: table,
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
    })

    console.log(`📊 Xata search results:`, {
      totalCount: searchResults.totalCount,
      recordCount: searchResults.records?.length || 0,
      searchQuery
    })

    // Enhanced records with Xata's built-in reasoning
    const enhancedRecords = searchResults.records?.map((result: any) => {
      const record = result.record || result
      const xataMetadata = result.xata || record.xata || {}
      
      // Extract reasoning from Xata's built-in features
      const highlights = xataMetadata.highlight || {}
      const score = xataMetadata.score || 0
      
      // Generate reasoning based on Xata's relevancy data
      const highlightReasons = Object.entries(highlights).map(([field, matches]: [string, any]) => {
        const matchText = Array.isArray(matches) ? matches.join(', ') : matches
        return `matched in ${field}: ${matchText}`
      }).join('; ')
      
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
          explanation: `Selected with ${relevancyReason} (score: ${score.toFixed(3)}) because it ${highlightReasons || 'matches the search criteria'}`
        },
        // Preserve original Xata metadata
        xata: xataMetadata
      }
    }) || []

    console.log(`✅ Enhanced ${enhancedRecords.length} records with Xata reasoning`)
    
    return enhancedRecords

  } catch (error) {
    console.error('❌ Xata search failed, falling back to basic query:', error)
    
    // Fallback to original implementation
    const records = await Promise.all( 
      searchTerms.map( async ( term: string ) => 
        await executeDatabaseTableQuery( { 
          table, 
          keyword: term, 
          searchFields, 
          limit, 
          sortBy, 
          sortOrder, 
          dateRange 
        } ) 
      ) 
    )
    
    return records.flat()
  }
}
