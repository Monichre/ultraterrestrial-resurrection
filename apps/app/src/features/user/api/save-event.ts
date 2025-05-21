'use server'
import { xata } from '@/db/xata/client'
import path from 'path'
const fs = require( 'fs' )

const generateJsonFile = async (
  jsonObject: any,
  fileName: string
): Promise<any> => {
  const filePath = path.join(
    process.cwd(),
    'generated_files',
    `${fileName}.json`
  )
  const jsonString = JSON.stringify( jsonObject, null, 2 )

  try {
    await fs.mkdir( path.dirname( filePath ), { recursive: true } )
    await fs.writeFile( filePath, jsonString, 'utf8' )
    const file = await fs.readFile( filePath, 'utf8' )
    console.log( `File ${fileName}.json has been saved successfully.` )
    return file
  } catch ( error ) {
    console.error( `Error saving file ${fileName}.json:`, error )
  }
}

export const saveUserMindMap = async ( { user, mindMap }: any ) => {
  console.log( 'xata: ', xata )
  console.log( 'mindMap: ', mindMap )
  console.log( 'user: ', user )
  const { json, fileName } = mindMap

  const file = await generateJsonFile( json, fileName )
  const record = await xata.db.mindmaps.create( {
    json: JSON.stringify( json ),
    user,
  } )
  console.log( record )
  await xata.files.upload(
    { table: 'mindmaps', column: 'file', record: record.id },
    file
  )
  return await xata.db.mindmaps.get( record.id )
}

// import { getXataClient } from'@/db/xata'
// import type { EventsRecord } from'@/db/xata'
// import type { CreateUserSavedItemBase } from './actions.types'

// const xata = getXataClient()
export interface SaveEventForUserProps {
  userNote: any
  event: any
  theory?: any
  user?: any
}
export const saveEventForUser = async ( {
  userNote,
  event,
  theory,
  user,
}: {
  userNote: { content: string; title: string }
  event: any
  theory: any
  user: any
} ) => {


  const record = await xata.db[`user-saved-events`].create( {
    user,
    event,
    theory,
    note: userNote?.content,
    'note-title': userNote?.title,
  } )

  console.log( 'user-saved-events', record )
  return record
}
