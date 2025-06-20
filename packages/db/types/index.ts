/**
 * Comprehensive type definitions for @db package exports
 * 
 * This file defines all the types that can be imported from the database package
 * across different entry points in the monorepo.
 */

// =============================================================================
// GENERATED XATA TYPES (from xata/xata.ts)
// =============================================================================

export type {
  // Schema Tables
  SchemaTables,
  InferredTypes,
  
  // Base Types
  Topics,
  Personnel,
  Events,
  Organizations,
  Sightings,
  EventSubjectMatterExperts,
  TopicSubjectMatterExperts,
  OrganizationMembers,
  Testimonies,
  TopicsTestimonies,
  Documents,
  Locations,
  EventTopicSubjectMatterExperts,
  Users,
  UserSavedEvents,
  UserSavedTopics,
  UserSavedKeyFigure,
  UserSavedTestimonies,
  UserSavedDocuments,
  UserNotes,
  UserSavedOrganizations,
  UserSavedSightings,
  Tags,
  Theories,
  Mindmaps,
  Artifacts,
  KeyFigures,
  SummaryFiles,
  
  // Record Types (with XataRecord)
  TopicsRecord,
  PersonnelRecord,
  EventsRecord,
  OrganizationsRecord,
  SightingsRecord,
  EventSubjectMatterExpertsRecord,
  TopicSubjectMatterExpertsRecord,
  OrganizationMembersRecord,
  TestimoniesRecord,
  TopicsTestimoniesRecord,
  DocumentsRecord,
  LocationsRecord,
  EventTopicSubjectMatterExpertsRecord,
  UsersRecord,
  UserSavedEventsRecord,
  UserSavedTopicsRecord,
  UserSavedKeyFigureRecord,
  UserSavedTestimoniesRecord,
  UserSavedDocumentsRecord,
  UserNotesRecord,
  UserSavedOrganizationsRecord,
  UserSavedSightingsRecord,
  TagsRecord,
  TheoriesRecord,
  MindmapsRecord,
  ArtifactsRecord,
  KeyFiguresRecord,
  SummaryFilesRecord,
  
  // Database Schema
  DatabaseSchema,
} from '../xata/xata';

// =============================================================================
// XATA CLIENT TYPES
// =============================================================================

export type { XataClient } from '../xata/xata';
export type XataClientInstance = ReturnType<typeof import('../xata/xata').getXataClient>;

// =============================================================================
// MODEL INPUT/UPDATE TYPES
// =============================================================================

// Personnel Types
export type {
  PersonnelInput,
  PersonnelUpdateInput,
} from '../xata/models/personnel';

// Organization Types
export type {
  OrganizationInput,
  OrganizationUpdateInput,
} from '../xata/models/organizations';

// Event Types
export type EventInput = Omit<Events, 'id' | 'xata'>;
export type EventUpdateInput = Partial<EventInput> & { id: string };

// Topic Types  
export type TopicInput = Omit<Topics, 'id' | 'xata'>;
export type TopicUpdateInput = Partial<TopicInput> & { id: string };

// Testimony Types
export type TestimonyInput = Omit<Testimonies, 'id' | 'xata'>;
export type TestimonyUpdateInput = Partial<TestimonyInput> & { id: string };

// Sighting Types
export type {
  SightingInput,
  SightingUpdateInput,
} from '../xata/models/sightings';

// Document Types
export type {
  DocumentInput,
  DocumentUpdateInput,
} from '../xata/models/documents';

// Location Types
export type {
  LocationInput,
  LocationUpdateInput,
} from '../xata/models/locations';

// Artifact Types
export type {
  ArtifactInput,
  ArtifactUpdateInput,
} from '../xata/models/artifacts';

// Mindmap Types
export type {
  MindmapInput,
  MindmapUpdateInput,
} from '../xata/models/mindmaps';

// Summary File Types
export type {
  SummaryFileInput,
  SummaryFileUpdateInput,
} from '../xata/models/summary-files';

// User Types
export type {
  UserInput,
  UserUpdateInput,
} from '../xata/models/users';

// User Saved Items Types
export type {
  UserSavedEventInput,
  UserSavedEventUpdateInput,
  UserSavedTopicInput,
  UserSavedTopicUpdateInput,
  UserSavedKeyFigureInput,
  UserSavedKeyFigureUpdateInput,
  UserSavedTestimonyInput,
  UserSavedTestimonyUpdateInput,
  UserSavedDocumentInput,
  UserSavedDocumentUpdateInput,
  UserSavedOrganizationInput,
  UserSavedOrganizationUpdateInput,
  UserSavedSightingInput,
  UserSavedSightingUpdateInput,
} from '../xata/models/user-saved-items';

// Join Table Types
export type {
  EventSmeInput,
  EventSmeUpdateInput,
} from '../xata/models/event-subject-matter-experts';

export type {
  TopicSmeInput,
  TopicSmeUpdateInput,
} from '../xata/models/topic-subject-matter-experts';

export type {
  EventTopicSmeInput,
  EventTopicSmeUpdateInput,
} from '../xata/models/event-topic-subject-matter-experts';

export type {
  OrganizationMemberInput,
  OrganizationMemberUpdateInput,
} from '../xata/models/organization-members';

export type {
  TopicTestimonyInput,
  TopicTestimonyUpdateInput,
} from '../xata/models/topics-testimonies';

export type {
  TagInput,
  TagUpdateInput,
} from '../xata/models/tags';

export type {
  TheoryInput,
  TheoryUpdateInput,
} from '../xata/models/theories';

// =============================================================================
// API FUNCTION TYPES
// =============================================================================

// Search Types
export type SearchParams = {
  query: string;
  id?: string | null;
  table?: string | null;
};

// Ask API Types
export type AskParams = {
  question: string;
  rules?: string | string[];
  table?: string;
};

export type AskResponse = {
  answer: string;
  sessionId: string;
  records: any[];
};

export type AskStreamChunk = {
  answer?: string;
  sessionId?: string;
  records?: any[];
  done?: boolean;
};

// XY Flow Integration Types
export type {
  ReactFlowNode,
  ReactFlowEdge,
  XataToXYFlowResult,
  XataToXYFlowParams,
  XataToXYFlowResponse,
} from '../xata/api/xata-to-xyflow';

export type {
  MindMapNode,
  FetchNextMindmapRecordsResult,
  ConnectionResults,
  JoinTablesData,
} from '../xata/api/helpers';

export type {
  GraphNode,
  GraphEdge,
  NetworkGraphPayload,
} from '../xata/api/xyflow-integration';

// =============================================================================
// PROVIDER REGISTRY TYPES
// =============================================================================

export type {
  ProviderRegistry,
  ProviderKey,
} from '../registry';

export type ProvidersType = {
  xata: {
    client: XataClientInstance;
    [key: string]: any;
  };
};

// =============================================================================
// PAGINATION & QUERY TYPES
// =============================================================================

export type PaginationOptions = {
  page?: number;
  size?: number;
  hasNextPage?: boolean;
  total?: number;
};

export type QueryOptions<T = any> = {
  filter?: Record<string, any>;
  sort?: { column: string; direction: 'asc' | 'desc' }[];
  pagination?: { size?: number; offset?: number };
  columns?: string[];
  consistency?: 'strong' | 'eventual';
};

export type PaginatedResponse<T> = {
  records: T[];
  pagination: PaginationOptions;
};

export type SearchOptions = {
  fuzziness?: number;
  prefix?: 'phrase' | 'disabled';
  pagination?: { size?: number; offset?: number };
  filter?: Record<string, any>;
  limit?: number;
};

export type VectorSearchOptions = {
  maxResults?: number;
  filter?: Record<string, any>;
};

// =============================================================================
// ERROR TYPES
// =============================================================================

export type DatabaseOperationError = {
  code: string;
  operation: string;
  message: string;
  details?: unknown;
};

// =============================================================================
// UTILITY TYPES
// =============================================================================

export type RecordWithoutMeta<T> = Omit<T, 'id' | 'xata'>;
export type RecordUpdate<T> = Partial<RecordWithoutMeta<T>> & { id: string };
export type CreateInput<T> = RecordWithoutMeta<T>;

// =============================================================================
// MAIN EXPORT PATHS TYPE MAPPING
// =============================================================================

/**
 * Type mapping for all possible import paths from @db package
 */
export interface DbPackageExports {
  // Root exports (from @db)
  '@db': {
    PROVIDERS: ProvidersType;
    ProviderRegistry: ProviderRegistry;
    ProviderKey: ProviderKey;
  };
  
  // Registry exports (from @db/registry)
  '@db/registry': {
    PROVIDERS: ProvidersType;
    ProviderRegistry: ProviderRegistry;
    ProviderKey: ProviderKey;
  };
  
  // Xata exports (from @db/xata)
  '@db/xata': {
    // All generated types and client
    XataClient: typeof XataClient;
    getXataClient: () => XataClientInstance;
    xata: XataClientInstance;
    tables: typeof import('../xata/xata').tables;
    
    // All record types
    TopicsRecord: TopicsRecord;
    PersonnelRecord: PersonnelRecord;
    EventsRecord: EventsRecord;
    // ... all other record types
    
    // All model functions
    // ... all CRUD functions from models
    
    // All API functions  
    // ... all API functions
  };
  
  // Client exports (from @db/xata/client)
  '@db/xata/client': {
    xata: XataClientInstance;
  };
  
  // Models exports (from @db/xata/models)
  '@db/xata/models': {
    // All model CRUD functions and types
    [key: string]: Function | Type;
  };
  
  // API exports (from @db/xata/api)  
  '@db/xata/api': {
    // All API functions and types
    askXataWithAi: Function;
    askXata: Function;
    searchXata: Function;
    fetchRecords: Function;
    xataToXYFlow: Function;
    // ... all other API functions
  };
}

// Re-export commonly used types for convenience
export type { Events, Topics, Personnel, Organizations, Testimonies }; 