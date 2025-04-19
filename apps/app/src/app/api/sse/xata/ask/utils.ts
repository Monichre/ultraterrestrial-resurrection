import { ReadableStreamDefaultController } from "stream/web";

// Type definition for SSE clients set 
export const clients = new Set<ReadableStreamDefaultController>();

// Debug flag - can be set to false in production
const DEBUG_LOGGING = true;

// Debug logging utility
export function logDebug(message: string, data?: unknown): void {
  if (DEBUG_LOGGING) {
    console.log(`[SSE Server] ${message}`, data ? data : "");
  }
}

// SSE message encoding
export function encodeSSE(event: string, data: string): string {
  return `event: ${event}\ndata: ${data}\n\n`;
}

// Enhanced broadcast function with improved error handling and connection verification
export function broadcastMessage(event: string, message: unknown): void {
  // Check if we have any connected clients
  if (clients.size === 0) {
    console.log(`[SSE Server] No clients connected to broadcast ${event} event`);
    return;
  }

  try {
    // Format the message consistently
    const eventPayload = {
      type: event,
      payload: message
    };
    
    // Convert to string
    const formattedMessage = encodeSSE("message", JSON.stringify(eventPayload));
    
    // Also send as direct event for specific handlers
    const directEventMessage = encodeSSE(event, JSON.stringify(message));
    
    console.log(`[SSE Server] Broadcasting to ${clients.size} clients: ${event}`);
    
    // Track results
    let successCount = 0;
    
    // Broadcast to all clients with error handling per client
    clients.forEach((client) => {
      try {
        // Check if client is still valid
        if (client) {
          // Send both formats for maximum compatibility
          client.enqueue(formattedMessage);
          client.enqueue(directEventMessage);
          successCount++;
        } else {
          // Clean up invalid client
          clients.delete(client);
        }
      } catch (err) {
        // Handle individual client errors and clean up errored client
        console.error(`[SSE Server] Error sending to client:`, err);
        try {
          clients.delete(client);
        } catch (deleteErr) {
          // Ignore cleanup errors
        }
      }
    });
    
    // Log broadcast results
    if (successCount > 0) {
      console.log(`[SSE Server] Successfully sent ${event} to ${successCount} clients`);
    }
  } catch (err) {
    console.error(`[SSE Server] Error broadcasting ${event} event`, err);
  }
} 