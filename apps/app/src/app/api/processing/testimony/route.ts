import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Queue } from '@/lib/upstash/queue'

const queue = new Queue({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!
})

const TestimonyBodySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().optional(),
  source: z.string().optional(),
  context: z.string().optional(),
  claims: z.array(z.string()).optional(),
  personnel: z.array(z.object({
    name: z.string(),
    role: z.string().optional(),
    bio: z.string().optional(),
    authorityMetrics: z.object({
      rank: z.number().optional(),
      credibility: z.number().optional(),
    }).optional(),
  })).optional(),
  events: z.array(z.object({
    title: z.string(),
    location: z.string().optional(),
    date: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
  organizations: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
  })).optional(),
})

interface TestimonyQueueItem {
  type: 'testimony'
  action: 'create' | 'update'
  data: z.infer<typeof TestimonyBodySchema>
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate incoming data
    const parsed = TestimonyBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const data = parsed.data

    // Add to processing queue
    await queue.push({
      type: 'testimony',
      action: 'create',
      data
    } as TestimonyQueueItem)

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