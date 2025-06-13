/**
 * Comprehensive Database Package Types
 * 
 * This file defines all types, interfaces, and function signatures that can be
 * imported from the @db package across all its modules and export paths.
 */

// =============================================================================
// CORE XATA TYPES
// =============================================================================

export type {
  // Generated Schema Types
  SchemaTables,
  InferredTypes,
  DatabaseSchema,
  XataClient,
  
  // Base Entity Types
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
  
  // Record Types (with XataRecord metadata)
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
} from '../xata/xata';

// =============================================================================
// MODEL FUNCTION SIGNATURES
// =============================================================================

// Common CRUD operation types
export interface CrudOperations<TRecord, TInput, TUpdateInput> {
  // Read operations
  getById: (id: string) => Promise<TRecord | null>;
  getAll: (options?: QueryOptions<TRecord>) => Promise<PaginatedResponse<TRecord>>;
  
  // Write operations
  create: (data: TInput) => Promise<TRecord>;
  update: (data: TUpdateInput) => Promise<TRecord | null>;
  delete: (id: string) => Promise<void>;
  
  // Search operations
  search: (query: string, limit?: number) => Promise<TRecord[]>;
}

// Personnel Model Functions
export interface PersonnelModel extends CrudOperations<PersonnelRecord, PersonnelInput, PersonnelUpdateInput> {
  getPersonnelById: (id: string) => Promise<PersonnelRecord | null>;
  getAllPersonnel: (options?: QueryOptions<PersonnelRecord>) => Promise<PaginatedResponse<PersonnelRecord>>;
  createPersonnel: (data: PersonnelInput) => Promise<PersonnelRecord>;
  updatePersonnel: (data: PersonnelUpdateInput) => Promise<PersonnelRecord | null>;
  deletePersonnel: (id: string) => Promise<void>;
  searchPersonnel: (query: string, limit?: number) => Promise<PersonnelRecord[]>;
}

// Organizations Model Functions
export interface OrganizationsModel extends CrudOperations<OrganizationsRecord, OrganizationInput, OrganizationUpdateInput> {
  getOrganizationById: (id: string) => Promise<OrganizationsRecord | null>;
  getAllOrganizations: (options?: QueryOptions<OrganizationsRecord>) => Promise<PaginatedResponse<OrganizationsRecord>>;
  createOrganization: (data: OrganizationInput) => Promise<OrganizationsRecord>;
  updateOrganization: (data: OrganizationUpdateInput) => Promise<OrganizationsRecord | null>;
  deleteOrganization: (id: string) => Promise<void>;
  searchOrganizations: (query: string, limit?: number) => Promise<OrganizationsRecord[]>;
}

// Events Model Functions
export interface EventsModel {
  // CRUD operations
  getEventById: (id: string, columns?: string[]) => Promise<EventsRecord | null>;
  getAllEvents: (options?: EventQueryOptions) => Promise<EventsRecord[]>;
  getEventsWithPagination: (page?: number, size?: number, filter?: Record<string, any>, columns?: string[]) => Promise<PaginatedEventsResponse>;
  createEvent: (data: EventInput) => Promise<EventsRecord>;
  createManyEvents: (data: EventInput[]) => Promise<EventsRecord[]>;
  updateEvent: (id: string, data: Partial<EventInput>) => Promise<EventsRecord | null>;
  updateManyEvents: (filter: Record<string, any>, data: Partial<EventInput>) => Promise<{ numberOfRecordsUpdated: number }>;
  deleteEvent: (id: string) => Promise<boolean>;
  deleteManyEvents: (filter: Record<string, any>) => Promise<{ numberOfRecordsDeleted: number }>;
  
  // Search operations
  searchEvents: (query: string, options?: EventSearchOptions) => Promise<EventsRecord[]>;
  semanticSearchEvents: (embedding: number[], options?: VectorSearchOptions) => Promise<EventsRecord[]>;
  getEventsByLocation: (latitude: number, longitude: number, radiusKm: number) => Promise<EventsRecord[]>;
}

// Topics Model Functions
export interface TopicsModel {
  // CRUD operations
  getTopicById: (id: string, columns?: string[]) => Promise<TopicsRecord | null>;
  getTopicByTitle: (title: string, columns?: string[]) => Promise<TopicsRecord | null>;
  getAllTopics: (options?: TopicQueryOptions) => Promise<TopicsRecord[]>;
  getTopicsWithPagination: (page?: number, size?: number, filter?: Record<string, any>, columns?: string[]) => Promise<PaginatedTopicsResponse>;
  createTopic: (data: TopicInput) => Promise<TopicsRecord>;
  createManyTopics: (data: TopicInput[]) => Promise<TopicsRecord[]>;
  updateTopic: (id: string, data: Partial<TopicInput>) => Promise<TopicsRecord | null>;
  updateManyTopics: (filter: Record<string, any>, data: Partial<TopicInput>) => Promise<{ numberOfRecordsUpdated: number }>;
  deleteTopic: (id: string) => Promise<boolean>;
  deleteManyTopics: (filter: Record<string, any>) => Promise<{ numberOfRecordsDeleted: number }>;
  
  // Search operations
  searchTopics: (query: string, options?: TopicSearchOptions) => Promise<TopicsRecord[]>;
  semanticSearchTopics: (embedding: number[], options?: VectorSearchOptions) => Promise<TopicsRecord[]>;
  getTopicsByTestimony: (testimonyId: string) => Promise<TopicsRecord[]>;
}

// Testimonies Model Functions
export interface TestimoniesModel {
  // CRUD operations
  getTestimonyById: (id: string, columns?: string[]) => Promise<TestimoniesRecord | null>;
  getAllTestimonies: (options?: TestimonyQueryOptions) => Promise<TestimoniesRecord[]>;
  getTestimoniesWithPagination: (page?: number, size?: number, filter?: Record<string, any>, columns?: string[]) => Promise<PaginatedTestimoniesResponse>;
  createTestimony: (data: TestimonyInput) => Promise<TestimoniesRecord>;
  createManyTestimonies: (data: TestimonyInput[]) => Promise<TestimoniesRecord[]>;
  updateTestimony: (id: string, data: Partial<TestimonyInput>) => Promise<TestimoniesRecord | null>;
  updateManyTestimonies: (filter: Record<string, any>, data: Partial<TestimonyInput>) => Promise<{ numberOfRecordsUpdated: number }>;
  deleteTestimony: (id: string) => Promise<boolean>;
  deleteManyTestimonies: (filter: Record<string, any>) => Promise<{ numberOfRecordsDeleted: number }>;
  
  // Search operations
  searchTestimonies: (query: string, options?: TestimonySearchOptions) => Promise<TestimoniesRecord[]>;
  semanticSearchTestimonies: (embedding: number[], options?: VectorSearchOptions) => Promise<TestimoniesRecord[]>;
  getTestimoniesByEvent: (eventId: string) => Promise<TestimoniesRecord[]>;
  getTestimoniesByWitness: (witnessId: string) => Promise<TestimoniesRecord[]>;
  getTestimoniesByOrganization: (organizationId: string) => Promise<TestimoniesRecord[]>;
}

// =============================================================================
// API FUNCTION SIGNATURES
// =============================================================================

export interface XataApiService {
  // Ask/Query Functions
  askXataWithAi: (params: { table: string; question: string }) => Promise<{ answer: string; records: any[]; sessionId: string }>;
  askXata: (table: string, question: string, options?: AskOptions) => Promise<AskResponse>;
  
  // Search Functions
  searchXata: (params: SearchParams) => Promise<{ success: boolean; searchResults?: any[]; error?: string }>;
  
  // Data Fetching
  fetchRecords: (recordIds: string[], table: string) => Promise<any[]>;
  
  // XY Flow Integration
  xataToXYFlow: (params: XataToXYFlowParams) => Promise<XataToXYFlowResponse>;
  initiateStreamingQuery: (params: { question: string; table: string; rules?: string }) => Promise<{ success: boolean; streamUrl?: string; error?: string }>;
  transformStreamResponse: (streamingText: string, records: Record<string, unknown>[], sessionId: string, sourceNode: ReactFlowNode, existingNodes: ReactFlowNode[], table: string) => Promise<XataToXYFlowResponse>;
}

export interface XataHelperService {
  // Mind Map Functions
  fetchNextMindmapRecords: (params: FetchNextMindmapRecordsParams) => Promise<FetchNextMindmapRecordsResult>;
  getAllJoinTables: () => Promise<JoinTablesData>;
  
  // Network Graph Functions
  getEntityNetworkGraphData: () => Promise<NetworkGraphPayload>;
  
  // Utility Functions
  convertDatabaseRecordToMindMapNode: (record: any) => MindMapNode;
  convertDatabaseRecordToGraphNode: (params: { record: any; type: string }) => GraphNode;
  formatGraphNode: (params: { record: any; type: string }) => GraphNode;
  formatGraphEdge: (params: { targetNode: any; sourceNode: any }) => GraphEdge;
}

// =============================================================================
// INPUT/UPDATE TYPE DEFINITIONS
// =============================================================================

// Personnel Types
export interface PersonnelInput {
  bio?: string;
  role?: string;
  photo?: string[];
  rank?: number;
  credibility?: number;
  popularity?: number;
  name: string;
  authority?: number;
  embedding?: number[];
}

export interface PersonnelUpdateInput extends Partial<PersonnelInput> {
  id: string;
}

// Organization Types
export interface OrganizationInput {
  name: string;
  specialization?: string;
  description?: string;
  photo?: string;
  image?: string;
  title: string;
  embedding?: number[];
}

export interface OrganizationUpdateInput extends Partial<OrganizationInput> {
  id: string;
}

// Event Types
export type EventInput = Omit<Events, 'id' | 'xata'>;
export interface EventUpdateInput extends Partial<EventInput> {
  id: string;
}

// Topic Types
export type TopicInput = Omit<Topics, 'id' | 'xata'>;
export interface TopicUpdateInput extends Partial<TopicInput> {
  id: string;
}

// Testimony Types
export type TestimonyInput = Omit<Testimonies, 'id' | 'xata'>;
export interface TestimonyUpdateInput extends Partial<TestimonyInput> {
  id: string;
}

// =============================================================================
// QUERY & PAGINATION TYPES
// =============================================================================

export interface QueryOptions<T = any> {
  filter?: Record<string, any>;
  sort?: Record<string, 'asc' | 'desc'>;
  pagination?: { size?: number; offset?: number };
  columns?: string[];
  consistency?: 'strong' | 'eventual';
}

export interface PaginatedResponse<T> {
  records: T[];
  pagination: {
    page: number;
    size: number;
    total?: number;
    hasNextPage: boolean;
  };
}

export interface SearchOptions {
  fuzziness?: number;
  prefix?: 'phrase' | 'disabled';
  pagination?: { size?: number; offset?: number };
  filter?: Record<string, any>;
  limit?: number;
}

export interface VectorSearchOptions {
  maxResults?: number;
  filter?: Record<string, any>;
}

// Specific query options for each model
export type EventQueryOptions = QueryOptions<EventsRecord>;
export type TopicQueryOptions = QueryOptions<TopicsRecord>;
export type TestimonyQueryOptions = QueryOptions<TestimoniesRecord>;

export type EventSearchOptions = SearchOptions & { filter?: Record<string, any> };
export type TopicSearchOptions = SearchOptions & { filter?: Record<string, any> };
export type TestimonySearchOptions = SearchOptions & { filter?: Record<string, any> };

export interface PaginatedEventsResponse extends PaginatedResponse<EventsRecord> {}
export interface PaginatedTopicsResponse extends PaginatedResponse<TopicsRecord> {}
export interface PaginatedTestimoniesResponse extends PaginatedResponse<TestimoniesRecord> {}

// =============================================================================
// API SPECIFIC TYPES
// =============================================================================

export interface AskOptions {
  rules?: string[];
  searchType?: string;
  search?: any;
  vectorSearch?: any;
  sessionId?: string;
}

export interface AskResponse {
  answer: string;
  sessionId: string;
  records: any[];
}

export interface SearchParams {
  query: string;
  id?: string | null;
  table?: string | null;
}

// XY Flow Types
export interface ReactFlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, any>;
  parentId?: string;
}

export interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  label?: string;
  style?: Record<string, any>;
}

export interface XataToXYFlowParams {
  question: string;
  table: string;
  rules: string;
  context: string;
  existingNodes: ReactFlowNode[];
  sourceNode: ReactFlowNode;
  sessionId?: string;
  layoutType?: 'horizontal' | 'vertical' | 'radial' | 'grid';
}

export interface XataToXYFlowResponse {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
  xataResponse?: {
    answer: string;
    records: any[];
    sessionId: string;
    isStreaming?: boolean;
    streamingText?: string;
  };
  startStreaming?: () => Promise<{ eventSource: EventSource; close: () => void }>;
}

// Helper Types
export interface MindMapNode {
  id: string;
  data: {
    label: string;
    [key: string]: unknown;
  };
  type: string;
}

export interface FetchNextMindmapRecordsParams {
  table: string;
  size: number;
  offset: number;
  cursor?: string;
}

export interface FetchNextMindmapRecordsResult {
  nodes: MindMapNode[];
  meta: {
    cursor?: string;
    more?: boolean;
  };
}

export interface ConnectionResults<T> {
  records: T[];
  pagination: { hasNextPage: boolean; total?: number };
}

export interface JoinTablesData {
  topicsExpertsConnections: EventTopicSubjectMatterExpertsRecord[];
  eventsExpertsConnections: EventSubjectMatterExpertsRecord[];
  eventsTopicsExpertsConnections: EventTopicSubjectMatterExpertsRecord[];
  topicsTestimoniesConnections: TopicsTestimoniesRecord[];
  organizationsPersonnelConnections: OrganizationMembersRecord[];
}

export interface GraphNode {
  id: string;
  label: string;
  data: {
    name: string;
    label: string;
    type: string;
    [key: string]: unknown;
  };
}

export interface GraphEdge {
  source: string;
  target: string;
  id: string;
}

export interface NetworkGraphPayload {
  records: {
    topics: TopicsRecord[];
    events: EventsRecord[];
    personnel: PersonnelRecord[];
    testimonies: TestimoniesRecord[];
    organizations: OrganizationsRecord[];
    documents: DocumentsRecord[];
    artifacts: ArtifactsRecord[];
  };
  connections: {
    topicsExpertsConnections: ConnectionResults<EventTopicSubjectMatterExpertsRecord>;
    eventsExpertsConnections: ConnectionResults<EventSubjectMatterExpertsRecord>;
    eventsTopicsExpertsConnections: ConnectionResults<EventTopicSubjectMatterExpertsRecord>;
    topicsTestimoniesConnections: ConnectionResults<TopicsTestimoniesRecord>;
    organizationsPersonnelConnections: ConnectionResults<OrganizationMembersRecord>;
  };
  graphData: {
    nodes: GraphNode[];
    links: GraphEdge[];
  };
}

// =============================================================================
// PROVIDER REGISTRY TYPES
// =============================================================================

export interface ProviderRegistry {
  readonly xata: {
    client: ReturnType<typeof import('../xata/xata').getXataClient>;
    [key: string]: any;
  };
}

export type ProviderKey = keyof ProviderRegistry;

// =============================================================================
// COMPLETE PACKAGE EXPORT INTERFACE
// =============================================================================

/**
 * Complete interface defining all possible exports from @db package
 * This serves as documentation for what can be imported from each export path
 */
export interface CompleteDbPackageExports {
  // Root package exports (@db)
  main: {
    PROVIDERS: ProviderRegistry;
    ProviderRegistry: typeof ProviderRegistry;
    ProviderKey: ProviderKey;
  };
  
  // Registry exports (@db/registry)
  registry: {
    PROVIDERS: ProviderRegistry;
    ProviderRegistry: typeof ProviderRegistry;
    ProviderKey: ProviderKey;
  };
  
  // Xata module exports (@db/xata)
  xata: {
    // Client exports
    XataClient: typeof XataClient;
    getXataClient: () => ReturnType<typeof import('../xata/xata').getXataClient>;
    xata: ReturnType<typeof import('../xata/xata').getXataClient>;
    tables: typeof import('../xata/xata').tables;
  };
  
  // Client-only exports (@db/xata/client)
  client: {
    xata: ReturnType<typeof import('../xata/xata').getXataClient>;
  };
  
  // Models-only exports (@db/xata/models)
  models: PersonnelModel & OrganizationsModel & EventsModel & TopicsModel & TestimoniesModel;
  
  // API-only exports (@db/xata/api)
  api: XataApiService & XataHelperService;
  
  // Types-only exports (@db/types)
  types: Record<string, any>;
}

// =============================================================================
// UTILITY TYPES FOR CONSUMERS
// =============================================================================

// Helper type for extracting record types
export type RecordTypes = {
  [K in keyof DatabaseSchema]: DatabaseSchema[K];
};

// Helper type for extracting input types
export type InputTypes = {
  Personnel: PersonnelInput;
  Organization: OrganizationInput;
  Event: EventInput;
  Topic: TopicInput;
  Testimony: TestimonyInput;
  // Add other input types as needed
};

// Helper type for extracting update types
export type UpdateTypes = {
  Personnel: PersonnelUpdateInput;
  Organization: OrganizationUpdateInput;
  Event: EventUpdateInput;
  Topic: TopicUpdateInput;
  Testimony: TestimonyUpdateInput;
  // Add other update types as needed
};

// Generic type for any database record
export type AnyRecord = DatabaseSchema[keyof DatabaseSchema];

// Generic type for any input type
export type AnyInput = InputTypes[keyof InputTypes];

// Generic type for any update type
export type AnyUpdate = UpdateTypes[keyof UpdateTypes]; 