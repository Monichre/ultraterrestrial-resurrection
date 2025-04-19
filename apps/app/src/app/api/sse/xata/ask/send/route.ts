import { NextRequest } from "next/server";
import { clients } from "../shared";
import { logDebug, encodeSSE, broadcastMessage } from "../utils";

/**
 * POST endpoint to handle sending messages to connected SSE clients
 * This enables bidirectional communication with Server-Sent Events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    logDebug("Message sending endpoint called", body);
    
    if (!body.type || !body.payload) {
      logDebug("Invalid message format", body);
      return Response.json(
        { error: "Message must include 'type' and 'payload' fields" },
        { status: 400 }
      );
    }
    
    // Use the broadcast function to send the message to all clients
    broadcastMessage(body.type, body.payload);
    
    logDebug(`Successfully broadcasted message of type: ${body.type}`);
    
    return Response.json({ 
      success: true, 
      recipients: clients.size,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logDebug("Error processing message", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 