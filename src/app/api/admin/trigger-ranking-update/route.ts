import { NextResponse } from "next/server";
import { calculatePersonnelRanking } from "@/services/ranking/personnel-ranking.service";

/**
 * Admin endpoint to manually trigger personnel ranking updates
 * 
 * This endpoint allows authorized administrators to trigger the ranking update process
 * and optionally provide custom weighting parameters.
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Define interface for weight parameters
interface WeightParams {
  EVENT_PARTICIPATION: number;
  TOPIC_EXPERTISE: number;
  ORGANIZATIONAL_ROLE: number;
  DOCUMENTED_EVIDENCE: number;
  TESTIMONY_COUNT: number;
  QUOTE_COUNT: number;
}

export async function POST(request: Request) {
  // Basic authentication check - in a production environment, this should
  // be replaced with a proper authentication mechanism (e.g., Clerk, NextAuth)
  const authHeader = request.headers.get("Authorization");
  
  // Simple token-based auth for demonstration
  // In production, use a more robust auth system with environment variables
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Authorization header required" }, { status: 401 });
  }
  
  const token = authHeader.split(" ")[1];
  
  // Simple auth check - replace with proper auth in production
  // In production, use process.env.ADMIN_API_TOKEN from environment variables
  if (token !== "dev_admin_token") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    // Get custom weights from request body if provided
    const body = await request.json().catch(() => ({}));
    const { weights } = body as { weights?: WeightParams };
    
    // Execute the ranking calculation with optional custom weights
    const result = await calculatePersonnelRanking(weights);
    
    return NextResponse.json({
      success: true,
      message: "Personnel rankings updated successfully",
      recordsProcessed: result.recordsProcessed,
      maxScore: result.maxScore,
      minScore: result.minScore,
      avgScore: result.avgScore,
      executionTimeMs: result.executionTimeMs,
      weightsUsed: result.weightsUsed,
    });
  } catch (error) {
    console.error("Error in manual ranking update:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}