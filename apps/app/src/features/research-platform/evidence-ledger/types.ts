/* Ultraterrestrial Research Platform — Evidence Ledger
 * Data model types for the evidence ledger view.
 */

export type Lane = 'support' | 'challenge'

export interface IndexCategory {
  id: string
  icon: string
  label: string
  count: string
  active?: boolean
}

export interface ClaimData {
  id: string
  headline: string
  status: string
  statusDotColor?: string
  confidence: string
  supportingCount: number
  challengingCount: number
  question: string
  interpretation: string
}

export interface SourceData {
  id: string
  title: string
  description: string
  sourceType: string
  scoreLabel: string
  accentColor: string
  lane: Lane
}

export type ComparisonSentiment = 'good' | 'bad' | 'neutral'

export interface ComparisonRow {
  label: string
  primaryValue: string
  reconstructionValue: string
  primarySentiment?: ComparisonSentiment
  reconstructionSentiment?: ComparisonSentiment
}

export interface ProvenanceStep {
  number: number
  title: string
  subtitle: string
}

export interface MetricData {
  label: string
  width: string
}
