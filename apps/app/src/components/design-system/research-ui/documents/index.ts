// Types
export type {
  ClassificationLevel,
  DocumentAttachment,
  BaseDocumentData,
  IncidentReport,
  PersonnelFile,
  VintageDocument,
  VintageDocumentCardProps
} from "./types"

// Base Component
export { VintageDocumentCard, ClassificationBadge } from "./VintageDocumentCard"
export type { VintageDocumentCardProps as BaseVintageDocumentCardProps } from "./VintageDocumentCard"

// Specialized Components
export { IncidentReportCard } from "./IncidentReportCard"
export type { IncidentReportCardProps } from "./IncidentReportCard"

export { PersonnelFileCard } from "./PersonnelFileCard"
export type { PersonnelFileCardProps } from "./PersonnelFileCard"

// Case File Component
export { default as CaseFileFolder } from "./case-files/case-file-folder/CaseFileFolder"
export type { CaseFileFolderProps } from "./case-files/case-file-folder/CaseFileFolder"