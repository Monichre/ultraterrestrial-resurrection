import { UFO_VECTOR_DATA_STORE_ID } from '@/lib/openai'
import { openai } from '@/lib/openai/client'
import { writeLogToFile } from '@/utils'

// Create a new assistant
export async function GET() {
  let moreFiles = true
  const files: any = []
  let after = null
  const getFiles = async ( last_id: string | null ) =>
    last_id
      ? await openai.beta.vectorStores.files.list( UFO_VECTOR_DATA_STORE_ID, {
        limit: 100,
        after: last_id,
      } )
      : await openai.beta.vectorStores.files.list( UFO_VECTOR_DATA_STORE_ID, {
        limit: 100,
      } )

  while ( moreFiles ) {
    const res: any = await getFiles( after )
    const {
      body: { has_more, last_id },
      data,
    } = res
    moreFiles = has_more
    console.log( 'moreFiles: ', moreFiles )
    after = last_id
    console.log( 'after: ', after )

    if ( data?.length ) {
      data.forEach( ( file: any ) => {
        files.push( file )
      } )
    }
  }

  console.log( 'files: ', files )
  // await writeLogToFile(files, 'vector-store-files.json')
  return Response.json( { files } )
}
