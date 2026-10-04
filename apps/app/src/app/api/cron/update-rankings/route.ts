import { NextResponse } from "next/server";
import { calculatePersonnelRanking } from "@/services/ranking/personnel-ranking.service";

/**
 * This endpoint is intended to be called by Vercel's cron job
 * It runs the personnel ranking calculation and updates the database
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  // Check if the request is coming from Vercel cron or authorized admin
  // const authHeader = request.headers.get("Authorization");
  
  // Uncomment to secure with a token in production
  // We should use a secure token from environment variables
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }
  
  try {
    // Execute the ranking calculation
    const result = await calculatePersonnelRanking();
    
    return NextResponse.json({
      success: true,
      message: "Personnel rankings updated successfully",
      recordsProcessed: result.recordsProcessed,
      maxScore: result.maxScore,
      minScore: result.minScore,
      avgScore: result.avgScore,
      executionTimeMs: result.executionTimeMs,
    });
  } catch (error) {
    console.error("Error in ranking cron job:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}