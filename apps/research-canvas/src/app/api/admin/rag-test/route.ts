import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { url, apiKey } = await request.json()
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }
    
    // Test connection to RAG server
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
      // Short timeout for connection test
      signal: AbortSignal.timeout(5000)
    })
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`)
    }
    
    // Check if it's actually a RAG server by looking for expected response
    const data = await response.json()
    
    // The disclosure-rag server should return something like { status: "ok" }
    // Adjust this check based on your actual RAG server response
    if (data.status || data.health || data.message) {
      return NextResponse.json({ 
        success: true,
        message: 'Connection successful'
      })
    } else {
      throw new Error('Invalid server response')
    }
  } catch (error) {
    console.error('Connection test failed:', error)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Connection timeout' },
          { status: 408 }
        )
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Connection test failed' },
      { status: 500 }
    )
  }
}