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

// Enhanced UI components
import {EnhancedEntityNode} from '@/features/mindmap/nodes/enhanced-entity-node'
import {EnhancedUserInputNode} from '@/features/mindmap/nodes/enhanced-user-input-node'

export const nodeTypes: any = {
  // Utilities Nodes
  annotationNode: AnnotationNode,
  // Enhanced Entity Nodes (new beautiful UI)
  enhancedEntityNode: EnhancedEntityNode,
  enhancedUserInputNode: EnhancedUserInputNode,
  // Legacy Entity Nodes (keeping for compatibility)
  entityNode: EntityNode,
  eventsNode: EntityNode,
  testimoniesNode: TestimonyNode,
  userInputNode: UserInputNode,
  personnelNode: EntityNode,
  topicsNode: EntityNode,
  organizationsNode: EntityNode,
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
