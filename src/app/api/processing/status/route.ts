import { NextResponse } from 'next/server';
import { Queue } from '@upstash/queue';

const queue = new Queue({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
});

export async function GET() {
  try {
    // Get queue info
    const size = await queue.size();
    
    return NextResponse.json({
      status: 'ok',
      queueSize: size,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting queue status:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { 
      status: 500 
    });
  }
}