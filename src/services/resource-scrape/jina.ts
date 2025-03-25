import axios from "axios"

export const READER_URL = 'https://r.jina.ai'
export const QUERY_URL = 'https://s.jina.ai'
export const SEGMENT_URL = 'https://segment.jina.ai'
export const EMBEDDING_URL = 'https://api.jina.ai/v1/embeddings'
export const RERANKER_URL = `https://api.jina.ai/v1/rerank`

export const scrapeWithJina = async ( url: string ) => {
  const source = `${READER_URL}/${url.trim()}`.replace( / /g, '%20' )
  const headers = {
    'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
    "X-Target-Selector": ".primary.primary-sidebar",
    "X-With-Links-Summary": "true",
    "X-With-Images-Summary": "true",
    "X-With-Generated-Alt": "true",
    "Accept": "application/json"
  }
  const response = await axios.get( source, { headers } )
    .then( response => {
      console.log( response.data )
      return response.data
    } )
    .catch( error => {
      console.error( error )
    } )
  console.log( "🚀 ~ file: index.ts:45 ~ scrapeWithJina ~ response:", response )


  return response
}