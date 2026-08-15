// Re-export types that are commonly used
export type {
  TopicsRecord,
  EventsRecord,
  PersonnelRecord,
  TestimoniesRecord,
  OrganizationsRecord,
  DocumentsRecord,
  ArtifactsRecord,
  EventTopicSubjectMatterExpertsRecord,
  EventSubjectMatterExpertsRecord,
  TopicsTestimoniesRecord,
  OrganizationMembersRecord,
} from "@db/postgres";

/** Shape returned by loadEntityGraph / getEntityNetworkGraphData */
export type NetworkGraphPayload = Awaited<ReturnType<typeof import('@db/postgres').loadEntityGraph>>

// Export additional types that are commonly used in the mindmap context
export interface MindMapNode {
  id: string;
  data: {
    label: string;
    [key: string]: unknown;
  };
  type: string;
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

export interface ConnectionResults<T> {
  records: T[];
  pagination: { hasNextPage: boolean; total?: number };
} 