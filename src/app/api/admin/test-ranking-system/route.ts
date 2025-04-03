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
    // Use Xata's summarize to efficiently get rank statistics
    const rankSummary = await xata.db.personnel
      .summarize({
        summaries: {
          avgRank: { avg: "rank" },
          maxRank: { max: "rank" },
          minRank: { min: "rank" },
          count: { count: "*" }
        }
      });
    
    // Fetch current personnel rankings for comparison (limited to top 20)
    const personnel = await xata.db.personnel
      .select(["id", "name", "rank", "authority"])
      .sort("rank", "desc")
      .getPaginated({
        pagination: { size: 20 }
      });
    
    return NextResponse.json({
      success: true,
      message: "Current personnel rankings",
      statistics: rankSummary.summaries,
      personnel: personnel.records,
      pagination: {
        count: personnel.pagination.count,
        size: personnel.pagination.size,
        hasNextPage: personnel.hasNextPage(),
        total: rankSummary.summaries.count
      }
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
 * Calculate rankings without updating the database, using Xata's aggregation methods
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
    
    // 2. Pre-compute metrics using Xata aggregations
    const metrics = await gatherAllMetricsForPreview();
    
    // 3. Calculate scores for each person
    const personnelWithScores = personnel.map(person => {
      const personMetrics = metrics[person.id] || {
        eventParticipation: 0,
        topicExpertise: 0,
        organizationalAuthority: 0,
        documentedContributions: 0,
        testimonies: 0,
        quotes: 0
      };
      
      const score = calculateScore(personMetrics, weights);
      return { 
        id: person.id, 
        name: person.name,
        score, 
        metrics: personMetrics,
        currentRank: person.rank,
        currentAuthority: person.authority
      };
    });
    
    // 4. Calculate statistics
    let totalScore = 0;
    personnelWithScores.forEach(({ score }) => {
      log.maxScore = Math.max(log.maxScore, score);
      log.minScore = Math.min(log.minScore, score);
      totalScore += score;
    });
    log.avgScore = totalScore / personnelWithScores.length;
    
    // 5. Sort and calculate percentiles without updating
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
      preview: sortedScores.slice(0, 50), // Limit to top 50 for performance
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

/**
 * Gather metrics for all personnel using Xata's aggregation methods for preview calculations
 * 
 * @returns Object mapping personnel IDs to their metrics
 */
async function gatherAllMetricsForPreview(): Promise<Record<string, PersonMetrics>> {
  // Create a map to store metrics for each person
  const metricsMap: Record<string, PersonMetrics> = {};

  // 1. Get event expert counts using Xata aggregation
  const eventExpertsAgg = await xata.db["event-subject-matter-experts"]
    .aggregate({
      eventCount: { count: "event" }
    }, 
    {
      groupBy: ["subject-matter-expert.id"],
    });
  
  // 2. Get topic expert counts
  const topicExpertsAgg = await xata.db["topic-subject-matter-experts"]
    .aggregate({
      topicCount: { count: "topic" }
    }, 
    {
      groupBy: ["subject-matter-expert.id"],
    });
  
  // 3. Get organization membership counts
  const orgMembersAgg = await xata.db["organization-members"]
    .aggregate({
      orgCount: { count: "organization" }
    }, 
    {
      groupBy: ["member.id"],
    });
  
  // 4. Get testimony counts
  const testimoniesAgg = await xata.db.testimonies
    .aggregate({
      testimonyCount: { count: "id" }
    }, 
    {
      groupBy: ["witness.id"],
    });
  
  // 5. Get document creation counts
  const documentsAgg = await xata.db.documents
    .aggregate({
      documentCount: { count: "id" }
    }, 
    {
      groupBy: ["author.id"],
    });
  
  // Process all aggregation results into a single map
  const processAggregationResults = (
    results: Record<string, unknown>[], 
    idField: string, 
    countField: string, 
    metricField: keyof PersonMetrics
  ) => {
    results.forEach(result => {
      if (result[idField]) {
        const personId = result[idField] as string;
        if (!metricsMap[personId]) {
          metricsMap[personId] = {
            eventParticipation: 0,
            topicExpertise: 0,
            organizationalAuthority: 0,
            documentedContributions: 0,
            testimonies: 0,
            quotes: 0
          };
        }
        metricsMap[personId][metricField] = result[countField] as number;
      }
    });
  };
  
  // Process all aggregation results
  processAggregationResults(eventExpertsAgg, "subject-matter-expert.id", "eventCount", "eventParticipation");
  processAggregationResults(topicExpertsAgg, "subject-matter-expert.id", "topicCount", "topicExpertise");
  processAggregationResults(orgMembersAgg, "member.id", "orgCount", "organizationalAuthority");
  processAggregationResults(testimoniesAgg, "witness.id", "testimonyCount", "testimonies");
  processAggregationResults(documentsAgg, "author.id", "documentCount", "documentedContributions");
  
  return metricsMap;
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

/**
 * Calculate the ranking score based on metrics and weights
 * 
 * @param metrics Connection metrics for a person
 * @param weights Weighting factors to apply
 * @returns Calculated score
 */
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