export type EvidentiaryState =
  | 'CORROBORATED'
  | 'DOCUMENTED'
  | 'CONTESTED'
  | 'UNVERIFIED'
  | 'DISCONFIRMED'
  | 'AI-INFERRED'

export interface RecordLink {
  ref: string
  label: string
  state: EvidentiaryState
}

export interface EventLayerData {
  kind: 'event'
  facts: Array<{ term: string; detail: string }>
}

export interface PersonnelLayerData {
  kind: 'personnel'
  witnesses: Array<{
    name: string
    role: string
    testimony: EvidentiaryState
  }>
}

export interface EvidenceLayerData {
  kind: 'evidence'
  items: Array<{
    name: string
    provenance: string
    state: EvidentiaryState
  }>
}

export interface AnalysisLayerData {
  kind: 'analysis'
  hypotheses: Array<{ label: string; state: EvidentiaryState }>
  anomalyIndex: string
  falsifiability: string
}

export type LayerBody =
  | EventLayerData
  | PersonnelLayerData
  | EvidenceLayerData
  | AnalysisLayerData

export interface StackLayer {
  id: string
  /** uppercase mono label shown in the layer heading band */
  label: string
  state: EvidentiaryState
  /** one-line summary shown in the inspector rail */
  summary: string
  /** records in the wider web this layer connects to */
  links: RecordLink[]
  body: LayerBody
}

export interface CaseStackData {
  fileRef: string
  classification: string
  title: string
  subtitle: string
  /** ordered outermost (case shell) -> innermost (analysis) */
  layers: StackLayer[]
}
