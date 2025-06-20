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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const docType = searchParams.get('type');
    const sortBy = searchParams.get('sort') || 'updated_at';
    const order = searchParams.get('order') || 'desc';

    // For browsing, we use a wildcard query to get all documents
    const filter: any = {};
    if (docType) {
      filter.doc_type = docType;
    }

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Browse all documents (using wildcard)
    const results = await searchIndex.query({
      q: '*',  // Wildcard to match all
      topK: limit,
      offset,
      ...(Object.keys(filter).length > 0 && { filter }),
    });

    // Get total count for pagination
    const totalResults = await searchIndex.info();

    return NextResponse.json({
      success: true,
      documents: results.hits,
      pagination: {
        page,
        limit,
        total: totalResults.numDocuments || 0,
        totalPages: Math.ceil((totalResults.numDocuments || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Browse error:', error);
    return NextResponse.json({ 
      error: 'Failed to browse documents',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}