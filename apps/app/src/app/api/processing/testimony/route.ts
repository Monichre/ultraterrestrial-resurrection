import { NextResponse } from 'next/server';
import { Queue } from '@/lib/upstash/queue';

const queue = new Queue({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
});

interface TestimonyQueueItem {
  type: 'testimony';
  action: 'create' | 'update';
  data: {
    title: string;
    summary?: string;
    source?: string;
    context?: string;
    claims?: string[];
    personnel?: Array<{
      name: string;
      role?: string;
      bio?: string;
      authorityMetrics?: {
        rank?: number;
        credibility?: number;
      };
    }>;
    events?: Array<{
      title: string;
      location?: string;
      date?: string;
      description?: string;
    }>;
    organizations?: Array<{
      name: string;
      description?: string;
    }>;
  };
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validate incoming data
    if (!data.title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Add to processing queue
    await queue.push({
      type: 'testimony',
      action: 'create',
      data
    } as TestimonyQueueItem);

    return NextResponse.json({ 
      message: 'Testimony queued for processing',
      status: 'pending'
    });

  } catch (error) {
    console.error('Error processing testimony:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { 
      status: 500 
    });
  }
}