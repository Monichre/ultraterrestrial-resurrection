/**
 * Quick Database Query Script
 * Simple queries to understand current database state
 */

import { xata } from './src/xata-typescript-sdk/client'

async function quickAnalysis() {
  console.log( "🔍 Quick Database Analysis\n" )

  try {
    // Test basic connectivity
    console.log( "Testing database connectivity..." )

    // Get sample counts from key tables
    const tables = ['events', 'personnel', 'topics', 'testimonies', 'organizations', 'users']

    for ( const tableName of tables ) {
      try {
        const records = await xata.db[tableName].getMany( { pagination: { size: 1 } } )
        const count = records.length
        console.log( `${tableName}: ${count > 0 ? 'Has data' : 'Empty'}` )
      } catch ( error ) {
        console.log( `${tableName}: ERROR - ${error.message}` )
      }
    }

    // Test a simple search
    console.log( "\nTesting search functionality..." )
    try {
      const searchResults = await xata.search.all( "UFO", {
        tables: ["events", "testimonies"],
        fuzziness: 1
      } )
      console.log( `Search results: ${searchResults.length} records found` )
    } catch ( error ) {
      console.log( `Search test failed: ${error.message}` )
    }

    // Check for embeddings
    console.log( "\nChecking vector embeddings..." )
    try {
      const eventsWithEmbeddings = await xata.db.events.filter( {
        embedding: { $ne: null }
      } ).getMany( { pagination: { size: 1 } } )

      console.log( `Events with embeddings: ${eventsWithEmbeddings.length > 0 ? 'Yes' : 'No'}` )
    } catch ( error ) {
      console.log( `Embeddings check failed: ${error.message}` )
    }

    console.log( "\n✅ Quick analysis complete!" )

  } catch ( error ) {
    console.error( "❌ Database analysis failed:", error.message )
  }
}

// Export for use in other scripts
export { quickAnalysis }

// Run if called directly
if ( require.main === module ) {
  quickAnalysis().catch( console.error )
}