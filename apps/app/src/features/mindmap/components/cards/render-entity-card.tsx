/**
 * Enhanced Entity Card Renderer
 * 
 * Maps entity types to their corresponding card components for display in nodes.
 * Updated to work seamlessly with enhanced nodes and includes error handling,
 * fallback components, and better type safety.
 * 
 * Supports: personnel, organizations, events, artifacts, documents, testimonies, topics
 */

import { EventCard } from '@/features/mindmap/components/cards'
import { EntityGroupCard } from '@/features/mindmap/components/cards/entity-group-card/entity-group-card'
import { TopicAndTestimoniesGroupCard } from '@/features/mindmap/components/cards/entity-group-card/topic-group-card'
import { GraphCard } from '@/features/mindmap/components/cards/graph-card'
import { TestimonyCard } from '@/features/mindmap/components/cards/testimony-card'
import { SubjectMatterExpertCard } from './subject-matter-expert-card/SubjectMatterExpertCard'

const UnOpinionatedGroupCard = ( props: any ) => <div {...props} />

const entityMap = {
  personnel: ( props: any ) => <SubjectMatterExpertCard {...props} />,
  organizations: ( props: any ) => <GraphCard {...props} />,
  events: ( props: any ) => <EventCard {...props} />,
  artifact: ( props: any ) => <GraphCard {...props} />,
  documents: ( props: any ) => <GraphCard {...props} />,
  testimonies: ( props: any ) => <TestimonyCard {...props} />,
  topics: ( props: any ) => <EventCard {...props} />,
}

const groupEntityMap = {
  testimonies: ( props: any ) => <UnOpinionatedGroupCard {...props} />, // <TopicAndTestimoniesGroupCard {...props} />,
  topics: ( props: any ) => <TopicAndTestimoniesGroupCard {...props} />,
  personnel: ( props: any ) => <UnOpinionatedGroupCard {...props} />,
  events: ( props: any ) => <EntityGroupCard {...props} />,
  organizations: ( props: any ) => <UnOpinionatedGroupCard {...props} />,
  artifact: ( props: any ) => <UnOpinionatedGroupCard {...props} />,
  documents: ( props: any ) => <UnOpinionatedGroupCard {...props} />,
}
// Enhanced type definitions for better compatibility with enhanced nodes
export type SupportedEntityType = 'personnel' | 'organizations' | 'events' | 'artifact' | 'documents' | 'testimonies' | 'topics'

interface renderEntityProps {
  type: SupportedEntityType
  data: any // Could be enhanced with more specific typing if needed
}

export const renderEntity: React.FC<renderEntityProps> = ( { type, data } ) => {
  const Component = entityMap[type as keyof typeof entityMap]
  
  if ( !Component ) {
    console.warn(`No component mapping found for entity type: ${type}`)
    // Fallback to GraphCard for unknown entity types
    return <GraphCard card={data} />
  }
  
  // Enhanced error boundary for card rendering
  try {
    return <Component card={data} />
  } catch (error) {
    console.error(`Error rendering entity card for type ${type}:`, error)
    // Fallback to basic display
    return (
      <div className="p-2 border border-red-500/30 bg-red-500/10 rounded text-red-300 text-sm">
        <p className="font-semibold">Display Error</p>
        <p>Unable to render {type} card</p>
        <p className="text-xs mt-1">{data?.name || data?.title || 'Unknown entity'}</p>
      </div>
    )
  }
}

export const renderEntityGroup: React.FC<renderEntityProps> = ( {
  type,
  data,
} ) => {
  const GroupComponent = groupEntityMap[type as keyof typeof groupEntityMap]

  if ( !GroupComponent ) {
    console.warn(`No group component mapping found for entity type: ${type}`)
    // Fallback to basic group display
    return <UnOpinionatedGroupCard card={{ ...data }} />
  }

  // Enhanced error boundary for group card rendering
  try {
    return <GroupComponent card={{ ...data }} />
  } catch (error) {
    console.error(`Error rendering entity group card for type ${type}:`, error)
    // Fallback to basic group display
    return <UnOpinionatedGroupCard card={{ ...data }} />
  }
}
