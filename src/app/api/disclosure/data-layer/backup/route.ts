
import { supabaseServer } from '@/db/supabase'
import { exec } from 'child_process'

import type { NextRequest } from 'next/server'
import { promisify } from 'node:util'
import path from 'path'
const fs = require( 'fs' ).promises

export async function POST( request: NextRequest ) {

  const XATA_API_KEY = process.env.XATA_API_KEY

  // Define the path to your Python script
  const scriptPath = path.join( process.cwd(), 'scripts/xata/xata_tools/xreplay.py' )
  const exportPath = path.join( process.cwd(), 'exports' )
  const command = `python3 ${scriptPath} python3 \
  --from_workspace UltraTerrestrial-kgubvq \
  --from_database ultraterrestrial \
  --from_branch main \
  --from_region us-east-1 \
  --from_XATA_API_KEY ${XATA_API_KEY} \
  --output file \
  --output_path ${exportPath} \
  --output_format csv`

  try {
    const { stdout, stderr } = await promisify( exec )( command )

    console.log("🚀 ~ file: route.ts:28 ~ POST ~ stdout:", stdout)
    // Check if export files were created
    
    

    try {
      // Get list of CSV files in exports directory
      const files = await fs.readdir(exportPath)

      console.log("🚀 ~ file: route.ts:38 ~ POST ~ files:", files)

    

      if (files.length === 0) {
        throw new Error('No CSV export files found')
      }


      // Upload each CSV file to Supabase storage
      const uploadPromises = files.map(async (filename: string) => {
        const filePath = path.join(exportPath, filename)
        const fileContent = await fs.readFile(filePath)

        console.log("🚀 ~ file: route.ts:53 ~ uploadPromises ~ fileContent:", fileContent)

        
        const { data, error } = await supabaseServer.storage
          .from('database-backups')
          .upload(
            `${new Date().toISOString().split('T')[0]}/${filename}`, 
            fileContent,
            {
              contentType: 'text/csv',
              upsert: true
            }
          )

        if (error) {
          throw error
        }

        return data
      })

      await Promise.all(uploadPromises)

      console.log(`Successfully uploaded ${files.length} backup files to Supabase storage`)

    } catch (err) {
      console.error('Error processing backup files:', err)
      throw err
    }

    
    return new Response( JSON.stringify( { output: stdout } ), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error(`Error executing Python script: ${error.message}`)
    return new Response(JSON.stringify({ error: error.stderr }), {
      status: 500, 
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

}
