import { openai } from '@ai-sdk/openai'
import { embed, embedMany } from 'ai'
// import { Configuration, OpenAIApi } from "openai";

const embeddingModel = openai.embedding( 'text-embedding-ada-002' )

// Function to calculate cosine similarity between two embeddings
export function cosineSimilarity( vec1: number[], vec2: number[] ): number {
  const dotProduct = vec1.reduce( ( acc, v, i ) => acc + v * vec2[i], 0 )
  const normVec1 = Math.sqrt( vec1.reduce( ( acc, v ) => acc + v * v, 0 ) )
  const normVec2 = Math.sqrt( vec2.reduce( ( acc, v ) => acc + v * v, 0 ) )
  return dotProduct / ( normVec1 * normVec2 )
}


const generateChunks = ( input: string ): string[] => {
  return input
    .trim()
    .split( '.' )
    .filter( i => i !== '' )
}

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks( value )
  const { embeddings } = await embedMany( {
    model: embeddingModel,
    values: chunks,
  } )
  return embeddings.map( ( e, i ) => ( { content: chunks[i], embedding: e } ) )
}

export const generateEmbedding = async ( value: string ): Promise<number[]> => {
  const input = value.replaceAll( '\\n', ' ' )
  const { embedding } = await embed( {
    model: embeddingModel,
    value: input,
  } )
  return embedding
}

