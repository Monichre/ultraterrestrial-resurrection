/**
 * Kernel contracts + Ultraterrestrial overlay.
 * EntityType is the overlay. Resource/Chunk/Claim/Mention are kernel.
 */

export const KERNEL_NODE_LABELS = [
  "Resource",
  "Chunk",
  "Entity",
  "Claim",
  "Mention",
] as const

export const OPTIONAL_KERNEL_LABELS = ["Tag", "Category"] as const

/** Not kernel. Do not add Author or MediaAsset unless the overlay says so. */
export const ULTRATERRESTRIAL_ENTITY_TYPES = [
  "PERSON",
  "EVENT",
  "ORGANIZATION",
  "LOCATION",
  "TESTIMONY",
  "TOPIC",
  "DOCUMENT",
  "ARTIFACT",
  "SIGHTING",
] as const

export const ULTRATERRESTRIAL_WIRE_ALIASES = {
  PERSON: "PERSONNEL",
  PERSONNEL: "PERSON",
  KeyFigure: "PERSON",
} as const

export const ULTRATERRESTRIAL_PREDICATES = [
  "MEMBER_OF",
  "WITNESSED",
  "ABOUT_EVENT",
  "OCCURS_AT",
  "FOUND_AT",
  "REFERENCES",
  "AUTHORED_BY",
  "HAS_TESTIMONY",
  "HAS_EXPERT",
  "INVESTIGATED",
  "REPORTED",
  "CONTAINS",
] as const

export type EntityType = (typeof ULTRATERRESTRIAL_ENTITY_TYPES)[number]
export type Predicate = (typeof ULTRATERRESTRIAL_PREDICATES)[number]
export type AssertionType = "explicit" | "reported" | "inferred"

export type Provenance = {
  sourceId: string
  extractor: string
  model?: string
  confidence: number
  createdAt: string
}

export type Resource = {
  id: string
  canonicalRef: string
  contentHash: string
  title?: string
  status: string
}

export type Chunk = {
  id: string
  resourceId: string
  ordinal: number
  locator?: string
  text: string
  doNotEmbedReasons?: string[]
}

export type Entity = {
  id: string
  type: EntityType
  name: string
  aliases: string[]
}

export type Claim = {
  id: string
  subject: string
  predicate: Predicate | string
  object: string
  assertionType: AssertionType
  confidence: number
  evidenceChunkId: string
}

export type ExtractionResult = {
  entities: Array<{
    type: EntityType
    name: string
    surfaceForm: string
    confidence: number
    spanQuote: string
    assertionType: AssertionType
  }>
  relations: Array<{
    source: string
    type: Predicate
    target: string
    confidence: number
    spanQuote: string
    assertionType: AssertionType
  }>
}
