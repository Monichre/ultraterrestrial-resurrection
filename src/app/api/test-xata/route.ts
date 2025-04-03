import { xata } from "@/db/xata";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, table, rules = [] } = body;
    
    console.log(`[Test Route] Testing Xata ask directly for table: ${table}`);
    console.log(`[Test Route] Question: ${question}`);
    console.log(`[Test Route] Rules:`, rules);
    
    if (!question || !table) {
      return Response.json({ error: "Missing required parameters" }, { status: 400 });
    }
    
    const dbTable = (xata.db as Record<string, unknown>)[table];
    
    if (!dbTable || typeof (dbTable as any).ask !== 'function') {
      return Response.json({ error: `Invalid table: ${table} or missing ask method` }, { status: 400 });
    }
    
    // Function to collect messages during the streaming response
    const messages: any[] = [];
    
    try {
      console.log(`[Test Route] Calling ask with streaming...`);
      
      // Track session ID
      let currentSessionId = "";
      
      // Run the ask function with a callback to collect messages
      const result = await (dbTable as any).ask(question, {
        rules,
        searchType: "keyword",
        search: {
          fuzziness: 0,
          prefix: "phrase",
        },
        onMessage: (message: any) => {
          console.log(`[Test Route] Message received:`, JSON.stringify({
            hasText: !!message.text,
            textLength: message.text?.length || 0,
            isDone: !!message.done,
            hasRecords: !!(message.records && message.records.length > 0),
            recordCount: message.records?.length || 0,
            keys: Object.keys(message)
          }));
          
          if (message.text) {
            console.log(`[Test Route] Text: "${message.text.substring(0, 50)}..."`);
          }
          
          // Store message for later inspection
          messages.push(message);
          
          // Update session ID if available
          if (message.sessionId) {
            currentSessionId = message.sessionId;
          }
        }
      });
      
      console.log(`[Test Route] Ask completed successfully`);
      
      // Return debug information about the result and collected messages
      return Response.json({
        success: true,
        result,
        messageCount: messages.length,
        messagesWithText: messages.filter(m => m.text).length,
        messagesWithRecords: messages.filter(m => m.records && m.records.length > 0).length,
        completionMessages: messages.filter(m => m.done).length,
        sessionId: currentSessionId
      });
    } catch (error) {
      console.error(`[Test Route] Error in Xata ask:`, error);
      return Response.json({
        error: error instanceof Error ? error.message : "Unknown error",
        errorType: error instanceof Error ? error.constructor.name : typeof error
      }, { status: 500 });
    }
  } catch (error) {
    console.error(`[Test Route] Error in request processing:`, error);
    return Response.json({
      error: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 });
  }
} 