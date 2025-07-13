/**
 * AI File Processing Utilities
 * Handles text extraction and AI processing for various file types
 */

import { getDocument } from "pdfjs-dist"
import mammoth from "mammoth"

export interface ProcessingResult {
  text: string
  metadata: {
    pageCount?: number
    wordCount?: number
    fileType: string
    fileName: string
  }
}

/**
 * Extract text content from various file types
 */
export async function extractTextFromFile( file: File ): Promise<string> {
  const fileType = file.type.toLowerCase()

  try {
    // Handle different file types
    if ( fileType === 'application/pdf' ) {
      return await extractPdfText( file )
    } else if ( fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ) {
      return await extractDocxText( file )
    } else if ( fileType === 'application/msword' ) {
      return await extractDocText( file )
    } else if ( fileType.startsWith( 'image/' ) ) {
      // For images, return basic metadata since OCR isn't implemented
      return `[Image file: ${file.name}, Size: ${( file.size / 1024 ).toFixed( 1 )} KB]`
    } else if ( fileType.startsWith( 'text/' ) || fileType === 'text/markdown' ) {
      return await extractPlainText( file )
    } else {
      // Fallback: try to read as text
      return await extractPlainText( file )
    }
  } catch ( error ) {
    console.error( `Error extracting text from ${file.name}:`, error )
    throw new Error( `Failed to extract text from ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}` )
  }
}

/**
 * Process file with AI analysis
 */
export async function processFileWithAI( file: File, action: string = 'analyze' ): Promise<ProcessingResult> {
  const text = await extractTextFromFile( file )
  const wordCount = countWords( text )

  return {
    text,
    metadata: {
      wordCount,
      fileType: file.type,
      fileName: file.name,
      ...( file.type === 'application/pdf' && { pageCount: estimatePageCount( text ) } )
    }
  }
}

// Helper functions
async function extractPdfText( file: File ): Promise<string> {
  try {
    // @ts-ignore - Dynamic import for PDF.js worker
    await import( "pdfjs-dist/build/pdf.worker.mjs" )

    const buffer = await file.arrayBuffer()
    const pdf = await getDocument( {
      data: buffer,
      cMapUrl: "../../../node_modules/pdfjs-dist/cmaps/",
      cMapPacked: true,
      standardFontDataUrl: "../../../node_modules/pdfjs-dist/standard_fonts/",
      verbosity: 0,
    } ).promise

    let text = ""
    for ( let i = 1; i <= pdf.numPages; i++ ) {
      const page = await pdf.getPage( i )
      const content = await page.getTextContent()
      text += content.items.map( ( item: any ) => item.str ).join( " " ) + "\n"
    }

    return text.trim()
  } catch ( error ) {
    console.error( "PDF extraction error:", error )
    throw new Error( "Failed to extract PDF content" )
  }
}

async function extractDocxText( file: File ): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText( { arrayBuffer } )
    return result.value
  } catch ( error ) {
    console.error( "DOCX extraction error:", error )
    throw new Error( "Failed to extract DOCX content" )
  }
}

async function extractDocText( file: File ): Promise<string> {
  // Basic DOC support - limited without additional libraries
  try {
    const text = await file.text()
    return text
  } catch ( error ) {
    console.error( "DOC extraction error:", error )
    throw new Error( "DOC files require conversion to DOCX for full support" )
  }
}

async function extractPlainText( file: File ): Promise<string> {
  try {
    return await file.text()
  } catch ( error ) {
    console.error( "Text extraction error:", error )
    throw new Error( "Failed to read text content" )
  }
}

function countWords( text: string ): number {
  return text.trim().split( /\s+/ ).filter( word => word.length > 0 ).length
}

function estimatePageCount( text: string ): number {
  // Rough estimate: 250 words per page
  const wordCount = countWords( text )
  return Math.max( 1, Math.ceil( wordCount / 250 ) )
} 