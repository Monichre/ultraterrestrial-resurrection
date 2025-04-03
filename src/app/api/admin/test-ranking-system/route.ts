import { NextResponse } from "next/server";
import { calculatePersonnelRanking } from "@/services/ranking/personnel-ranking.service";
import { xata } from "@/db/xata/client";

/**
 * Admin test endpoint to evaluate the personnel ranking system
 * 
 * This endpoint provides testing and debugging capabilities for the ranking system:
 * - Run ranking calculations with sample data
 * - View current rankings for all personnel
 * - Calculate but don't store rankings
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  // Test only - no authentication required
  // In production, this should be secured
  
  try {
    // Fetch current personnel rankings for comparison
    const personnel = await xata.db.personnel
      .select(["id", "name", "rank", "authority"])
      .sort("rank", "desc")
      .getAll()
      .then(res => res.map(person => ({
        id: person.id,
        name: person.name,
        rank: person.rank,
        authority: person.authority
      })));
    
    return NextResponse.json({
      success: true,
      message: "Current personnel rankings",
      personnel
    });
  } catch (error) {
    console.error("Error in test endpoint:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Define types for weight parameters and metrics
interface WeightParams {
  EVENT_PARTICIPATION: number;
  TOPIC_EXPERTISE: number;
  ORGANIZATIONAL_ROLE: number;
  DOCUMENTED_EVIDENCE: number;
  TESTIMONY_COUNT: number;
  QUOTE_COUNT: number;
}

interface PersonMetrics {
  eventParticipation: number;
  topicExpertise: number;
  organizationalAuthority: number;
  documentedContributions: number;
  testimonies: number;
  quotes: number;
}

export async function POST(request: Request) {
  // Test only - no authentication required
  // In production, this should be secured
  
  try {
    // Get parameters from request body
    const body = await request.json().catch(() => ({}));
    const { dryRun = true, weights } = body;
    
    // If dryRun is true, calculate but don't update the database
    let result;
    
    if (dryRun) {
      // Execute a preview calculation
      result = await previewRankingCalculation(weights);
    } else {
      // Execute the actual ranking calculation
      result = await calculatePersonnelRanking(weights);
    }
    
    return NextResponse.json({
      success: true,
      message: dryRun ? "Ranking preview calculated" : "Rankings updated",
      dryRun,
      ...result
    });
  } catch (error) {
    console.error("Error in test endpoint:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

/**
 * Calculate rankings without updating the database
 * This is useful for testing different weighting parameters
 */
async function previewRankingCalculation(weights?: WeightParams) {
  const startTime = new Date();
  const log = {
    startTime,
    recordsProcessed: 0,
    maxScore: 0,
    minScore: Infinity,
    avgScore: 0
  };
  
  try {
    // 1. Get all personnel records
    const personnel = await xata.db.personnel.getAll();
    log.recordsProcessed = personnel.length;
    
    // 2. Calculate scores and gather metrics for each person
    const personnelWithScores = await Promise.all(
      personnel.map(async (person) => {
        // Create a function to gather metrics that matches the one in the service
        const metrics = await gatherMetricsForPerson(person.id);
        const score = calculateScore(metrics, weights);
        return { 
          id: person.id, 
          name: person.name,
          score, 
          metrics,
          currentRank: person.rank,
          currentAuthority: person.authority
        };
      })
    );
    
    // 3. Calculate statistics
    let totalScore = 0;
    personnelWithScores.forEach(({ score }) => {
      log.maxScore = Math.max(log.maxScore, score);
      log.minScore = Math.min(log.minScore, score);
      totalScore += score;
    });
    log.avgScore = totalScore / personnelWithScores.length;
    
    // 4. Sort and calculate percentiles without updating
    const sortedScores = personnelWithScores
      .sort((a, b) => b.score - a.score)
      .map((person, index) => {
        const percentile = Math.floor(((personnelWithScores.length - index) / personnelWithScores.length) * 100);
        const rankChange = person.currentRank 
          ? Math.round(person.score) - person.currentRank 
          : null;
        const authorityChange = person.currentAuthority 
          ? percentile - person.currentAuthority 
          : null;
        
        return {
          ...person,
          newRank: Math.round(person.score),
          newAuthority: percentile,
          rankChange,
          authorityChange
        };
      });
    
    const endTime = new Date();
    const executionTimeMs = endTime.getTime() - startTime.getTime();
    
    return {
      preview: sortedScores,
      stats: {
        ...log,
        executionTimeMs,
        weightsUsed: weights
      }
    };
  } catch (error) {
    throw error;
  }
}

// Duplicated from the service file for testing purposes
// In a production environment, consider refactoring to share this code
async function gatherMetricsForPerson(personId: string): Promise<PersonMetrics> {
  const [
    eventExperts,
    topicExperts,
    orgMembers,
    testimonies,
    documents,
  ] = await Promise.all([
    xata.db["event-subject-matter-experts"].filter("subject-matter-expert.id", personId).getAll(),
    xata.db["topic-subject-matter-experts"].filter("subject-matter-expert.id", personId).getAll(),
    xata.db["organization-members"].filter("member.id", personId).getAll(),
    xata.db.testimonies.filter("witness.id", personId).getAll(),
    xata.db.documents.filter("author.id", personId).getAll(),
  ]);
  
  return {
    eventParticipation: eventExperts.length,
    topicExpertise: topicExperts.length,
    organizationalAuthority: orgMembers.length,
    documentedContributions: documents.length,
    testimonies: testimonies.length,
    quotes: 0,
  };
}

// Default weighting factors for calculation
const DEFAULT_WEIGHTS: WeightParams = {
  EVENT_PARTICIPATION: 1.0,
  TOPIC_EXPERTISE: 1.0,
  ORGANIZATIONAL_ROLE: 1.0,
  DOCUMENTED_EVIDENCE: 1.0,
  TESTIMONY_COUNT: 1.0,
  QUOTE_COUNT: 1.5,
};

function calculateScore(metrics: PersonMetrics, weights: WeightParams = DEFAULT_WEIGHTS): number {
  const actualWeights = weights || DEFAULT_WEIGHTS;
  
  return (
    metrics.eventParticipation * actualWeights.EVENT_PARTICIPATION +
    metrics.topicExpertise * actualWeights.TOPIC_EXPERTISE +
    metrics.organizationalAuthority * actualWeights.ORGANIZATIONAL_ROLE +
    metrics.documentedContributions * actualWeights.DOCUMENTED_EVIDENCE +
    metrics.testimonies * actualWeights.TESTIMONY_COUNT +
    metrics.quotes * actualWeights.QUOTE_COUNT
  );
}