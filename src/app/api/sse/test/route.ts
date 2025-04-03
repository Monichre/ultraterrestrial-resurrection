import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'; // Ensure dynamic routing for streaming

export async function GET() {
  const encoder = new TextEncoder();
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();

  // Example: Send initial data and handle client disconnects
  writer.write(encoder.encode("data: Connection established\n\n"));
  
  setInterval(() => {
    writer.write(encoder.encode(`data: ${JSON.stringify({ time: new Date() })}\n\n`));
  }, 1000);

  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
