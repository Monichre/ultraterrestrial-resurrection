/* Hypothesis Lab — shared data types */

export type EvidenceVariant = 'support' | 'challenge'

export interface EvidenceMiniCardData {
  id: string
  title: string
  content: string
  variant: EvidenceVariant
}

export interface HypothesisData {
  id: string
  label: string
  title: string
  fitScore: string
  description: string
  glowColor: string
  evidence: EvidenceMiniCardData[]
  prediction: string
}

export interface RankingItem {
  rank: number
  title: string
  score: string
}

export interface MatrixBlob {
  width: number
  height: number
  left: number
  top: number
  color: string
}

export interface MatrixAxisLabel {
  text: string
  /** CSS position — use left/right/top/bottom as needed */
  style: React.CSSProperties
}

export interface Question {
  id: string
  text: string
}

export interface DecisionAction {
  id: string
  label: string
  variant?: 'default' | 'primary'
}

export interface DecisionData {
  smallcaps: string
  title: string
  conclusion: string
  questions: Question[]
  actions: DecisionAction[]
}
