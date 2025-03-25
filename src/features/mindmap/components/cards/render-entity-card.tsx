import { EventCard } from '@/features/mindmap/components/cards'
import { EntityGroupCard } from '@/features/mindmap/components/cards/entity-group-card/entity-group-card'
import { TopicAndTestimoniesGroupCard } from '@/features/mindmap/components/cards/entity-group-card/topic-group-card'
import { GraphCard } from '@/features/mindmap/components/cards/graph-card'
import { TestimonyCard } from '@/features/mindmap/components/cards/testimony-card'
import { SubjectMatterExpertCard } from './subject-matter-expert-card'

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
interface renderEntityProps {
  type: keyof typeof entityMap
  data: any
}

export const renderEntity: React.FC<renderEntityProps> = ( { type, data } ) => {
  const Component = entityMap[type]
  console.log( Component )
  if ( !Component ) {
    return null
  }
  return <Component card={data} />
}

export const renderEntityGroup: React.FC<renderEntityProps> = ( {
  type,
  data,
} ) => {
  const GroupComponent = groupEntityMap[type]
  console.log( GroupComponent )

  if ( !GroupComponent ) {
    return null
  }

  return <GroupComponent card={{ ...data }} />
}
