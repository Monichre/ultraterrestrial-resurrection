import {
  EntityGroupNode,
  EntityGroupNodeChild,
  EntityNode,
  TestimonyNode,
} from '@/features/mindmap/nodes'
import {AnnotationNode} from '@/features/mindmap/nodes/AnnotationNode'
import {DocumentNode} from '@/features/mindmap/nodes/document-node'
import {GroupResultsNode} from '@/features/mindmap/nodes/group-results-node'

import {PersonnelGroupNode} from '@/features/mindmap/nodes/personnel-group-node'
import {PersonnelGroupNodeChild} from '@/features/mindmap/nodes/personnel-group-node-child'
import {UserInputNode} from '@/features/mindmap/nodes/user-input-node/user-input-node'
import {AIAnnotationNode} from '@/features/mindmap/nodes/ai-annotation-node'

// One archival card for every corpus record on the canvas, whatever key the
// add path used. The older EntityNode / EnhancedEntityNode cards remain for stories.
import {RecordDossierNode} from '@/features/mindmap/nodes/record-dossier-node/record-dossier-node'

// Drop-to-Canvas (T-060) — the user's own dropped file, not a corpus record
import {DroppedArtifactNode} from '@/features/mindmap/nodes/dropped-artifact-node'

// Evidence-graph tour waypoint (T-050 s3) — narrative marker, not a record
import {WaypointNode} from '@/features/guided-tours/shared/nodes/WaypointNode'
import {TOUR_WAYPOINT_NODE_TYPE} from '@/features/guided-tours/shared/types/flow-model'

export const nodeTypes: any = {
  // Utilities Nodes
  annotationNode: AnnotationNode,
  // Dropped artifact (T-060). Key is `ut`-namespaced so it cannot collide
  // with the existing entity/group/document keys below.
  utDroppedArtifactNode: DroppedArtifactNode,
  // Guided-tour waypoint (T-050). Projected onto this canvas by
  // `use-tour-graph-projection.ts`; never persisted with the graph.
  [TOUR_WAYPOINT_NODE_TYPE]: WaypointNode,
  // Corpus records — every legacy key renders the same dossier card
  enhancedEntityNodePOC: RecordDossierNode,
  enhancedEntityNode: RecordDossierNode,
  entityNode: RecordDossierNode,
  eventsNode: RecordDossierNode,
  testimoniesNode: TestimonyNode,
  userInputNode: UserInputNode,
  personnelNode: RecordDossierNode,
  topicsNode: RecordDossierNode,
  organizationsNode: RecordDossierNode,
  documentNode: DocumentNode,
  // AI Generated Nodes
  aiAnnotationNode: AIAnnotationNode,
  // Group Results Node
  groupResultsNode: GroupResultsNode,
  groupResultsNodeChildEvents: EntityGroupNodeChild,
  groupResultsNodeChildPersonnel: PersonnelGroupNodeChild,
  groupResultsNodeChildTopics: EntityNode,
  groupResultsNodeChildTestimonies: TestimonyNode,
  groupResultsNodeChildOrganizations: EntityGroupNodeChild,
  groupResultsNodeChildDocuments: DocumentNode,

  // Entity Group Node
  entityGroupNode: EntityGroupNode,
  personnelGroupNode: PersonnelGroupNode,
  entityGroupNodeChildEvents: EntityGroupNodeChild,
  entityGroupNodeChildTopics: EntityNode,
  entityGroupNodeChildTestimonies: TestimonyNode,
  entityGroupNodeChildOrganizations: EntityGroupNodeChild,
  entityGroupNodeChildDocuments: DocumentNode,
  entityGroupNodeChildPersonnel: PersonnelGroupNodeChild,
}
