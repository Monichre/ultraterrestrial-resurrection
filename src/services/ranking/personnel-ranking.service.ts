import { xata } from "@/db/xata/client";

/**
 * RankingMetrics interface defines the data structure for collecting the connection
 * metrics for each key figure across the database.
 */
interface RankingMetrics {
  eventParticipation: number;
  topicExpertise: number;
  organizationalAuthority: number;
  documentedContributions: number;
  testimonies: number;
  quotes: number;
}

/**
 * WeightingFactors interface defines the configurable weights used in the
 * ranking calculation formula.
 */
interface WeightingFactors {
  EVENT_PARTICIPATION: number;
  TOPIC_EXPERTISE: number;
  ORGANIZATIONAL_ROLE: number;
  DOCUMENTED_EVIDENCE: number;
  TESTIMONY_COUNT: number;
  QUOTE_COUNT: number;
}

/**
 * ExecutionLog interface defines the structure for logging ranking calculation executions.
 */
interface ExecutionLog {
  startTime: Date;
  endTime?: Date;
  recordsProcessed: number;
  maxScore: number;
  minScore: number;
  avgScore: number;
  status: 'processing' | 'completed' | 'failed';
  error?: string;
  executionTimeMs?: number;
  weightsUsed?: WeightingFactors;
}

/**
 * Default weighting factors based on the ranking system design documentation.
 * Direct connections: 1.0
 * Enhanced connections (quotes): 1.5
 * Secondary connections: 0.5 (not currently used)
 */
const DEFAULT_WEIGHTS: WeightingFactors = {
  EVENT_PARTICIPATION: 1.0,
  TOPIC_EXPERTISE: 1.0,
  ORGANIZATIONAL_ROLE: 1.0,
  DOCUMENTED_EVIDENCE: 1.0,
  TESTIMONY_COUNT: 1.0,
  QUOTE_COUNT: 1.5,
};

/**
 * Calculate ranking scores for all personnel and update the database.
 * Uses Xata's aggregation methods for efficient calculations.
 * 
 * @param weights Optional custom weighting factors
 * @returns Execution log with statistics and status
 */
export async function calculatePersonnelRanking(weights = DEFAULT_WEIGHTS): Promise<ExecutionLog & { success: boolean }> {
  const rankingLog: ExecutionLog = {
    startTime: new Date(),
    recordsProcessed: 0,
    maxScore: 0,
    minScore: Infinity,
    avgScore: 0,
    status: "processing",
    weightsUsed: weights,
  };

  try {
    // 1. Get all personnel records
    const personnel = await xata.db.personnel.getAll();
    rankingLog.recordsProcessed = personnel.length;
    
    // 2. Pre-compute metrics for all personnel using aggregation queries
    const metrics = await gatherAllMetrics();
    
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
      return { person, score };
    });
    
    // 4. Calculate statistics for normalization
    let totalScore = 0;
    personnelWithScores.forEach(({ score }) => {
      rankingLog.maxScore = Math.max(rankingLog.maxScore, score);
      rankingLog.minScore = Math.min(rankingLog.minScore, score);
      totalScore += score;
    });
    rankingLog.avgScore = totalScore / personnelWithScores.length;
    
    // 5. Sort by score to calculate percentiles
    const sortedScores = personnelWithScores.sort((a, b) => b.score - a.score);
    
    // 6. Update database with ranks and percentiles
    await Promise.all(
      sortedScores.map(async ({ person, score }, index) => {
        const percentile = Math.floor(((sortedScores.length - index) / sortedScores.length) * 100);
        
        return xata.db.personnel.update(person.id, {
          rank: Math.round(score),
          authority: percentile,
        });
      })
    );
    
    // 7. Complete execution log
    rankingLog.status = "completed";
    rankingLog.endTime = new Date();
    rankingLog.executionTimeMs = rankingLog.endTime.getTime() - rankingLog.startTime.getTime();
    
    // 8. Log execution metrics
    await logRankingExecution(rankingLog);
    
    return {
      success: true,
      ...rankingLog
    };
    
  } catch (error) {
    // Handle errors and log failures
    rankingLog.status = "failed";
    rankingLog.error = error instanceof Error ? error.message : String(error);
    rankingLog.endTime = new Date();
    rankingLog.executionTimeMs = rankingLog.endTime.getTime() - rankingLog.startTime.getTime();
    
    console.error("Error calculating rankings:", error);
    await logRankingExecution(rankingLog);
    
    return {
      success: false,
      ...rankingLog
    };
  }
}

/**
 * Gather metrics for all personnel by using Xata's aggregation functions
 * This is significantly more efficient than querying each person individually
 * 
 * @returns Object mapping personnel IDs to their metrics
 */
async function gatherAllMetrics(): Promise<Record<string, RankingMetrics>> {
  // Create a map to store metrics for each person
  const metricsMap: Record<string, RankingMetrics> = {};

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
  
  // 6. Process event expert aggregation results
  eventExpertsAgg.forEach(result => {
    if (result["subject-matter-expert.id"]) {
      const personId = result["subject-matter-expert.id"] as string;
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
      metricsMap[personId].eventParticipation = result.eventCount as number;
    }
  });
  
  // 7. Process topic expert aggregation results
  topicExpertsAgg.forEach(result => {
    if (result["subject-matter-expert.id"]) {
      const personId = result["subject-matter-expert.id"] as string;
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
      metricsMap[personId].topicExpertise = result.topicCount as number;
    }
  });
  
  // 8. Process organization member aggregation results
  orgMembersAgg.forEach(result => {
    if (result["member.id"]) {
      const personId = result["member.id"] as string;
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
      metricsMap[personId].organizationalAuthority = result.orgCount as number;
    }
  });
  
  // 9. Process testimony aggregation results
  testimoniesAgg.forEach(result => {
    if (result["witness.id"]) {
      const personId = result["witness.id"] as string;
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
      metricsMap[personId].testimonies = result.testimonyCount as number;
    }
  });
  
  // 10. Process document aggregation results
  documentsAgg.forEach(result => {
    if (result["author.id"]) {
      const personId = result["author.id"] as string;
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
      metricsMap[personId].documentedContributions = result.documentCount as number;
    }
  });
  
  return metricsMap;
}

/**
 * Calculate the ranking score based on metrics and weights
 * 
 * @param metrics Connection metrics for a person
 * @param weights Weighting factors to apply
 * @returns Calculated score
 */
function calculateScore(metrics: RankingMetrics, weights: WeightingFactors): number {
  return (
    metrics.eventParticipation * weights.EVENT_PARTICIPATION +
    metrics.topicExpertise * weights.TOPIC_EXPERTISE +
    metrics.organizationalAuthority * weights.ORGANIZATIONAL_ROLE +
    metrics.documentedContributions * weights.DOCUMENTED_EVIDENCE +
    metrics.testimonies * weights.TESTIMONY_COUNT +
    metrics.quotes * weights.QUOTE_COUNT
  );
}

/**
 * Log the execution of a ranking calculation run to console and to local storage
 * for debugging purposes.
 * 
 * In production, this should be replaced with a proper logging solution:
 * - Either create a ranking-logs table in Xata
 * - Or use a monitoring service like Datadog, New Relic, etc.
 * 
 * @param log Execution log to store
 */
async function logRankingExecution(log: ExecutionLog): Promise<void> {
  console.log("Ranking calculation complete", log);
  
  // Store the execution log in localStorage for debugging (client-side only)
  // This is a temporary solution until we have a proper logging table
  if (typeof window !== 'undefined') {
    try {
      const existingLogs = JSON.parse(localStorage.getItem('rankingLogs') || '[]');
      existingLogs.push(log);
      localStorage.setItem('rankingLogs', JSON.stringify(existingLogs));
    } catch (error) {
      console.error("Error storing ranking log in localStorage:", error);
    }
  }
  
  // In the future, we could create a ranking-logs table in Xata
  // To properly implement this, we would need to:
  // 1. Add the table to the xata.ts schema
  // 2. Run a schema migration
  // 3. Then uncomment and use this code
  
  // await xata.db["ranking-logs"].create({
  //   execution_time: log.startTime,
  //   records_processed: log.recordsProcessed,
  //   max_score: log.maxScore,
  //   min_score: log.minScore,
  //   avg_score: log.avgScore,
  //   status: log.status,
  //   error: log.error,
  //   execution_time_ms: log.executionTimeMs,
  //   weights_used: JSON.stringify(log.weightsUsed),
  // });
}