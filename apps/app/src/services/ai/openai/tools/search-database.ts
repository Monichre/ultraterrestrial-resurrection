import { executeDatabaseTableQuery } from "@/db/xata/db/search-operations"

export const searchDatabase = async ( { table, searchTerms, searchFields, limit, sortBy, sortOrder, dateRange }: any ) => {
  const records = searchTerms?.length ? await Promise.all( searchTerms.map( async ( term: string ) => await executeDatabaseTableQuery( { table, keyword: term, searchFields, limit, sortBy, sortOrder, dateRange } ) ) ) : []

  console.log( "🚀 ~ file: search-database.ts:6 ~ searchDatabase ~ records:", records )

  return records.flat()
}
