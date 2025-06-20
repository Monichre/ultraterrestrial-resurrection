import { NextRequest, NextResponse } from 'next/server';
import { Index } from '@upstash/search';

// Initialize Upstash Search client
const searchIndex = new Index({
  url: process.env.UPSTASH_SEARCH_URL!,
  token: process.env.UPSTASH_SEARCH_TOKEN!,
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch specific document by ID
    // Note: Upstash Search doesn't have a direct fetch by ID,
    // so we search with the ID as query and filter
    const results = await searchIndex.query({
      q: id,
      topK: 1,
      filter: { id },
    });

    if (!results.hits || results.hits.length === 0) {
      return NextResponse.json({ 
        error: 'Document not found' 
      }, { status: 404 });
    }

    const document = results.hits[0];

    return NextResponse.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch document',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}