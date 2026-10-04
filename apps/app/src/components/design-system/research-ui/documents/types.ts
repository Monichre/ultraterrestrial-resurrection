// Types for vintage document components
export type ClassificationLevel =
  | "unclassified"
  | "confidential"
  | "secret"
  | "top-secret"

export interface DocumentAttachment {
  id: string
  url: string
  caption: string
  type: "photo" | "document" | "blueprint"
}

export interface BaseDocumentData {
  id: string
  title: string
  classification: ClassificationLevel
  date: string
  location?: string
  attachments?: DocumentAttachment[]
}

export interface IncidentReport extends BaseDocumentData {
  type: "incident"
  witnessReports: Array<{
    id: string
    description: string
    witness?: string
  }>
  incidentDescription: string
}

export interface PersonnelFile extends BaseDocumentData {
  type: "personnel"
  name: string
  rank?: string
  serviceNumber?: string
  organization?: string
  profilePhoto?: DocumentAttachment
  securityClearance?: string
  notes?: string
}

export type VintageDocument = IncidentReport | PersonnelFile

export interface VintageDocumentCardProps {
  document: VintageDocument
  className?: string
}