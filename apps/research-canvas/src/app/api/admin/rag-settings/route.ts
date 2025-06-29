import { NextRequest, NextResponse } from 'next/server'

// Temporary in-memory storage for settings
// In production, use a database or secure environment variables
let ragSettings = {
  mode: 'local' as 'local' | 'remote',
  localUrl: 'http://localhost:8000',
  remoteUrl: '',
  apiKey: '',
  enabled: false
}

export async function GET(request: NextRequest) {
  // TODO: Add authentication check here
  // For now, returning settings without auth for development
  
  // Don't send API key in response
  const { apiKey, ...publicSettings } = ragSettings
  
  return NextResponse.json({
    ...publicSettings,
    hasApiKey: !!apiKey
  })
}

export async function POST(request: NextRequest) {
  // TODO: Add authentication check here
  // Only admins should be able to update settings
  
  try {
    const body = await request.json()
    
    // Validate input
    if (!body.mode || !['local', 'remote'].includes(body.mode)) {
      return NextResponse.json(
        { error: 'Invalid mode' },
        { status: 400 }
      )
    }
    
    if (body.mode === 'local' && !body.localUrl) {
      return NextResponse.json(
        { error: 'Local URL is required' },
        { status: 400 }
      )
    }
    
    if (body.mode === 'remote' && (!body.remoteUrl || !body.apiKey)) {
      return NextResponse.json(
        { error: 'Remote URL and API key are required' },
        { status: 400 }
      )
    }
    
    // Update settings
    ragSettings = {
      mode: body.mode,
      localUrl: body.localUrl || ragSettings.localUrl,
      remoteUrl: body.remoteUrl || ragSettings.remoteUrl,
      apiKey: body.apiKey || ragSettings.apiKey,
      enabled: body.enabled ?? ragSettings.enabled
    }
    
    // In production, save to database or environment
    // For now, just keeping in memory
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving RAG settings:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}