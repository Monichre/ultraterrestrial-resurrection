import { NextRequest, NextResponse } from 'next/server';
import { Index } from '@upstash/search';

// Initialize Upstash Search client
const searchIndex = new Index({
  url: process.env.UPSTASH_SEARCH_URL!,
  token: process.env.UPSTASH_SEARCH_TOKEN!,
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '20');
    const docType = searchParams.get('type');
    const tags = searchParams.get('tags')?.split(',');

    if (!query) {
      return NextResponse.json({ 
        error: 'Query parameter is required' 
      }, { status: 400 });
    }

    // Build filter object if needed
    const filter: any = {};
    if (docType) {
      filter.doc_type = docType;
    }
    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }

    // Search documents
    const results = await searchIndex.query({
      q: query,
      topK: limit,
      ...(Object.keys(filter).length > 0 && { filter }),
    });

    return NextResponse.json({
      success: true,
      query,
      results: results.hits,
      total: results.count,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ 
      error: 'Failed to search documents',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}