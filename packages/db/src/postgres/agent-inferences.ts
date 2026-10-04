/**
 * Agent Inferences — the analytical-layer overlay table (Vision Phase 1.2,
 * renamed per terminology ruling 2026-07-08).
 *
 * TERMINOLOGY CONTRACT: "claim" is a reserved canonical term in this system —
 * a discrete assertion extracted from SOURCE material (human testimony,
 * documents). What the AI agent produces is an INFERENCE: part of the agent's
 * intellectual apparatus, persisted so the analytical trail is auditable and
 * so it can later support a user's growing research theory. It is NOT
 * evidence and must NEVER feed retrieval, search, or suggestion paths — any
 * future consumer must treat `agent_inferences` as interpretive layer only.
 *
 * Every edge `reasoning` string the mindmap agent writes to the graph is
 * persisted here, so analysis built during a session is recoverable as
 * structure rather than living only in ephemeral SSE messages.
 */
import { getSql } from './client'

export type EvidentiaryState =
  | 'observed'
  | 'corroborated'
  | 'contested'
  | 'inferred'
  | 'speculative'
  | 'resonant'
  | 'unverified'
  | 'disconfirmed'

export interface AgentInferenceRecord {
  id: string
  inference_text: string
  evidentiary_state: EvidentiaryState
  source_record_id: string | null
  source_table: string | null
  target_record_id: string | null
  extracted_by: string
  created_at: string
}

export interface InsertAgentInferenceInput {
  inferenceText: string
  evidentiaryState?: EvidentiaryState
  sourceRecordId?: string | null
  sourceTable?: string | null
  targetRecordId?: string | null
  extractedBy?: string
}

export async function insertAgentInference(
  input: InsertAgentInferenceInput,
): Promise<AgentInferenceRecord> {
  const sql = getSql()
  const rows = (await sql.query(
    `INSERT INTO agent_inferences (
      inference_text, evidentiary_state, source_record_id, source_table,
      target_record_id, extracted_by
    ) VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      input.inferenceText,
      input.evidentiaryState ?? 'unverified',
      input.sourceRecordId ?? null,
      input.sourceTable ?? null,
      input.targetRecordId ?? null,
      input.extractedBy ?? 'mindmap-agent',
    ],
  )) as AgentInferenceRecord[]
  return rows[0]
}

/**
 * Inferences where the given record id appears as either source or target.
 * Analytical layer ONLY — never use as retrieval/suggestion input.
 */
export async function getInferencesForRecord(
  recordId: string,
  limit = 50,
): Promise<AgentInferenceRecord[]> {
  const sql = getSql()
  return (await sql.query(
    `SELECT * FROM agent_inferences
     WHERE source_record_id = $1 OR target_record_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [recordId, limit],
  )) as AgentInferenceRecord[]
}
