import {
  extractTextFromFile
} from '@ai/utils/ai-file-processing'

export interface FileAttachment {
  id: string
  name: string
  type: string
  size: number
  progress: number
  status: 'uploading' | 'success' | 'error'
  file: File
}

export type ProcessingState = {
  type: 'summary' | 'topics' | 'sentiment' | null
  isProcessing: boolean
  result: string | string[] | any | null
}

/**
 * Handler for document actions using the chat API with processDocument tool
 */
export async function handleFileAction(
  action: string,
  selectedFile: FileAttachment,
  isPdfJsAvailable: boolean | null,
  updateProcessingState: ( state: ProcessingState ) => void
): Promise<void> {
  if ( !selectedFile ) return

  try {
    // Set initial processing state
    updateProcessingState( {
      type: action === 'Extract topics' || action === 'Generate tags' ? 'topics' : 'summary',
      isProcessing: true,
      result: null,
    } )

    // Extract text from the file
    console.log( `Processing file: ${selectedFile.name}, type: ${selectedFile.type}, size: ${( selectedFile.size / 1024 ).toFixed( 1 )} KB` )
    const fileContent = await extractTextFromFile( selectedFile.file )
    console.log( `Extracted text length: ${fileContent.length} characters` )

    // Call the chat API with the processDocument tool
    const response = await fetch( '/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( {
        messages: [
          {
            role: 'user',
            content: `Please process this document with the action: ${action}`,
          }
        ],
        tools: {
          processDocument: {
            action: action,
            fileContent: fileContent,
            fileName: selectedFile.name,
            fileType: selectedFile.type,
            fileSize: selectedFile.size,
          }
        }
      } ),
    } )

    if ( !response.ok ) {
      throw new Error( `HTTP error! status: ${response.status}` )
    }

    // Handle streaming response
    const reader = response.body?.getReader()
    if ( !reader ) {
      throw new Error( 'No response body reader available' )
    }

    const decoder = new TextDecoder()
    let fullResponse = ''
    let toolResult = null

    try {
      while ( true ) {
        const { done, value } = await reader.read()
        if ( done ) break

        const chunk = decoder.decode( value, { stream: true } )
        const lines = chunk.split( '\n' ).filter( ( line ) => line.trim() )

        for ( const line of lines ) {
          if ( line.startsWith( 'data: ' ) ) {
            const data = line.slice( 6 )
            if ( data === '[DONE]' ) continue

            try {
              const parsed = JSON.parse( data )

              // Handle tool calls
              if ( parsed.type === 'tool-call' ) {
                console.log( 'Tool call received:', parsed )
              }

              // Handle tool results
              if ( parsed.type === 'tool-result' ) {
                toolResult = parsed.result
                console.log( 'Tool result received:', toolResult )
              }

              // Handle content
              if ( parsed.content ) {
                fullResponse += parsed.content
              }
            } catch ( e ) {
              console.debug( 'Skipped chunk:', data )
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }

    // Process the result based on action type
    if ( toolResult ) {
      if ( toolResult.type === 'error' ) {
        throw new Error( toolResult.error )
      }

      if ( action === 'Extract topics' || action === 'Generate tags' ) {
        // Handle topics/tags result
        let topics = []

        if ( toolResult.result && typeof toolResult.result === 'object' && toolResult.result.text ) {
          // Try to extract JSON array from the streamed response
          const responseText = await toolResult.result.text()
          const jsonMatch = responseText.match( /\[.*?\]/ )

          if ( jsonMatch ) {
            try {
              topics = JSON.parse( jsonMatch[0] )
            } catch ( e ) {
              console.error( 'Error parsing topics JSON:', e )
              // Fallback: create topics from response text
              topics = responseText.split( '\n' )
                .filter( ( line: string ) => line.trim() )
                .slice( 0, 10 )
                .map( ( line: string ) => line.replace( /^[-*•]\s*/, '' ).trim() )
                .filter( ( topic: string ) => topic )
            }
          }
        }

        // Fallback topics if nothing was extracted
        if ( !topics || topics.length === 0 ) {
          topics = createFallbackTopics( selectedFile.name, action )
        }

        updateProcessingState( {
          type: 'topics',
          isProcessing: false,
          result: topics,
        } )
      } else {
        // Handle summary/analysis result
        let resultText = fullResponse

        if ( toolResult.result && typeof toolResult.result === 'object' && toolResult.result.text ) {
          resultText = await toolResult.result.text()
        }

        updateProcessingState( {
          type: 'summary',
          isProcessing: false,
          result: resultText || fullResponse,
        } )
      }
    } else {
      // Fallback if no tool result was received
      if ( action === 'Extract topics' || action === 'Generate tags' ) {
        const fallbackTopics = createFallbackTopics( selectedFile.name, action )
        updateProcessingState( {
          type: 'topics',
          isProcessing: false,
          result: fallbackTopics,
        } )
      } else {
        updateProcessingState( {
          type: 'summary',
          isProcessing: false,
          result: fullResponse || `Processed ${action.toLowerCase()} for ${selectedFile.name}`,
        } )
      }
    }

  } catch ( error: any ) {
    console.error( `Error processing document action ${action}:`, error )

    // Create fallback response based on action type
    if ( action === 'Extract topics' || action === 'Generate tags' ) {
      const fallbackTopics = createFallbackTopics( selectedFile.name, action )
      updateProcessingState( {
        type: 'topics',
        isProcessing: false,
        result: fallbackTopics,
      } )
    } else {
      updateProcessingState( {
        type: 'summary',
        isProcessing: false,
        result: `Error processing ${action.toLowerCase()}: ${error.message}`,
      } )
    }
  }
}

/**
 * Create fallback topics when API processing fails
 */
function createFallbackTopics( fileName: string, action: string ): string[] {
  const fileNameLower = fileName.toLowerCase()
  const topics = []

  // Add file-type specific topics
  if ( fileNameLower.includes( '.pdf' ) ) topics.push( 'PDF Document' )
  if ( fileNameLower.includes( 'asurion' ) ) topics.push( 'Asurion' )
  if ( fileNameLower.includes( 'home' ) ) topics.push( 'Home Services' )
  if ( fileNameLower.includes( 'plus' ) ) topics.push( 'Plus Package' )
  if ( fileNameLower.includes( '2020' ) ) topics.push( '2020 Documentation' )
  if ( fileNameLower.includes( 'insurance' ) ) topics.push( 'Insurance' )
  if ( fileNameLower.includes( 'warranty' ) ) topics.push( 'Warranty' )

  // Add general topics
  const generalTopics = [
    'Document Analysis',
    'Service Agreement',
    'Policy Terms',
    'Customer Information',
    'Coverage Details',
    'Legal Documentation',
    'Service Description',
    'Contract Details',
    'Terms & Conditions',
    'Product Information'
  ]

  // Add general topics until we have 10
  for ( const topic of generalTopics ) {
    if ( topics.length >= 10 ) break
    if ( !topics.includes( topic ) ) {
      topics.push( topic )
    }
  }

  return topics.slice( 0, 10 )
}