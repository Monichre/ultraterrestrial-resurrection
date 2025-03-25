import { NextResponse } from 'next/server'
async function executeCommand( command: string ): Promise<{ success: boolean; output?: string; error?: any }> {
  try {
    // Instead of executing shell commands, we'll need to handle the operations directly
    if ( command.startsWith( 'mkdir' ) ) {
      // For mkdir operations, we can use Node's fs promises API
      const fs = require( 'fs/promises' )
      const path = command.split( ' ' ).pop()!
      await fs.mkdir( path, { recursive: true } )
      return { success: true }
    }

    if ( command.startsWith( 'python3' ) ) {
      // For Python script execution, we'll need to handle this differently
      // You may want to:
      // 1. Use a direct API call to Xata instead of Python script
      // 2. Move this logic to a separate service/endpoint
      // 3. Use Node-based alternatives for the functionality
      throw new Error( 'Python script execution not supported - please use direct API calls instead' )
    }

    return { success: false, error: 'Unsupported command' }
  } catch ( error: any ) {
    return { success: false, error: error.message }
  }
}

// Function to process CSV data
function parseCSV( csvContent: string ) {
  const lines = csvContent.trim().split( "\n" )
  if ( lines.length < 2 ) return { headers: [], records: [] }

  const headers = lines[0].split( "," ).map( h => h.trim() )
  const records = lines.slice( 1 ).map( line => {
    const values = line.split( "," ).map( v => v.trim() )
    return headers.reduce( ( obj: any, header, index ) => {
      let value = values[index]
      if ( value === "true" ) value = true
      else if ( value === "false" ) value = false
      else if ( !isNaN( Number( value ) ) && value !== "" ) value = Number( value )
      obj[header] = value
      return obj
    }, {} )
  } )

  return { headers, records }
}

export async function POST() {
  console.log( "Starting Xata export..." )
  const exportDir = "../exports/xata"

  try {
    // 1. Create export directory if it doesn't exist
    await executeCommand( `mkdir -p ${exportDir}` )

    // 2. Export from Xata using xata_tools
    console.log( "Exporting data from Xata..." )
    const exportCommand = `python3 xreplay.py \
      --from_workspace UltraTerrestrial-kgubvq \
      --from_database ultraterrestrial \
      --from_branch main \
      --from_region us-east-1 \
      --from_XATA_API_KEY xau_LKJxzxjzXasEUXxjmhCBACdTCvi5Ed2v1 \
      --output file \
      --output_path ${exportDir} \
      --output_format csv`

    const exportResult = await executeCommand( exportCommand )
    if ( !exportResult.success ) {
      throw new Error( `Xata export failed: ${exportResult.error}` )
    }

    // 3. Get list of exported files
    const { output: fileList } = await executeCommand( `ls ${exportDir}` )
    if ( !fileList ) {
      throw new Error( "No files found in export directory" )
    }

    const files = fileList.split( "\n" ).filter( f => f.endsWith( ".csv" ) )
    console.log( `Found ${files.length} files to export` )

    // 4. Read each CSV file
    const exportedData: Record<string, any[]> = {}

    for ( const file of files ) {
      const tableName = file.replace( ".csv", "" )
      console.log( `Reading table: ${tableName}` )

      try {
        // Read CSV file
        const { output: csvContent } = await executeCommand( `cat ${exportDir}/${file}` )
        if ( !csvContent ) {
          throw new Error( `Failed to read CSV file for table ${tableName}` )
        }

        const { records } = parseCSV( csvContent )
        exportedData[tableName] = records

      } catch ( error ) {
        console.error( `Error processing table ${tableName}:`, error )
      }
    }

    // 5. Clean up exports
    await executeCommand( `rm -rf ${exportDir}/*` )

    // Return the exported data
    return NextResponse.json( {
      success: true,
      data: exportedData
    } )

  } catch ( error: any ) {
    console.error( "Export failed:", error )
    return NextResponse.json( {
      success: false,
      error: error.message
    }, { status: 500 } )
  }
}
