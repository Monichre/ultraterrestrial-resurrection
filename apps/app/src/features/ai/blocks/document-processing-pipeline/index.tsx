/**
 * Document Processing Pipeline - Component library for document processing interfaces
 *
 * This module exports a collection of components for building consistent
 * and interactive document processing and analysis interfaces.
 */

// Main components
export {DocumentSearch} from './document-search'
export {UploadZone} from './upload-zone'
export {DocumentsList} from './documents-list'
export {Document} from './document'

// Card components
export {DocumentCard} from './document-card'

// Status components
export {DocumentStatus} from './document-status'

// Analysis components
export {AIInsights} from './ai-insights'

// Types
export type {DocumentFilters} from './document-search'
export type {DocumentCardProps} from './document-card'
export type {DocumentProps, DocumentInsight} from './document'
