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
    
    // 2. Calculate raw scores for each person
    const personnelWithScores = await Promise.all(
      personnel.map(async (person) => {
        const metrics = await gatherMetricsForPerson(person.id);
        const score = calculateScore(metrics, weights);
        return { person, score, metrics };
      })
    );
    
    // 3. Calculate statistics for normalization
    let totalScore = 0;
    personnelWithScores.forEach(({ score }) => {
      rankingLog.maxScore = Math.max(rankingLog.maxScore, score);
      rankingLog.minScore = Math.min(rankingLog.minScore, score);
      totalScore += score;
    });
    rankingLog.avgScore = totalScore / personnelWithScores.length;
    
    // 4. Sort by score to calculate percentiles
    const sortedScores = personnelWithScores.sort((a, b) => b.score - a.score);
    
    // 5. Update database with ranks and percentiles
    await Promise.all(
      sortedScores.map(async ({ person, score }, index) => {
        const percentile = Math.floor(((sortedScores.length - index) / sortedScores.length) * 100);
        
        return xata.db.personnel.update(person.id, {
          rank: Math.round(score),
          authority: percentile,
        });
      })
    );
    
    // 6. Complete execution log
    rankingLog.status = "completed";
    rankingLog.endTime = new Date();
    rankingLog.executionTimeMs = rankingLog.endTime.getTime() - rankingLog.startTime.getTime();
    
    // 7. Log execution metrics
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
 * Gather all relevant metrics for a specific person by querying their connections
 * across various tables in the database.
 * 
 * @param personId The person's unique ID
 * @returns RankingMetrics object with counts of all connections
 */
async function gatherMetricsForPerson(personId: string): Promise<RankingMetrics> {
  // Run these queries in parallel for better performance
  const [
    eventExperts,
    topicExperts,
    orgMembers,
    testimonies,
    documents,
    // Add quotes when that table is implemented
  ] = await Promise.all([
    xata.db["event-subject-matter-experts"].filter("subject-matter-expert.id", personId).getAll(),
    xata.db["topic-subject-matter-experts"].filter("subject-matter-expert.id", personId).getAll(),
    xata.db["organization-members"].filter("member.id", personId).getAll(),
    xata.db.testimonies.filter("witness.id", personId).getAll(),
    xata.db.documents.filter("author.id", personId).getAll(),
    // xata.db.quotes.filter("person.id", personId).getAll(),
  ]);
  
  return {
    eventParticipation: eventExperts.length,
    topicExpertise: topicExperts.length,
    organizationalAuthority: orgMembers.length,
    documentedContributions: documents.length,
    testimonies: testimonies.length,
    quotes: 0, // Add when quotes table is implemented
  };
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