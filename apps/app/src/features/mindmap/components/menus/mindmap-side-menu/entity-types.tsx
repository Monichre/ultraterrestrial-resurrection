import {
  EventsIcon,
  TopicsIcon,
  KeyFiguresIcon,
  TestimoniesIcon,
  OrganizationsIcon,
  ArtifactsIcon,
} from '@/components/icons'

import {ICON_GREEN} from '@/utils'
import {FileSearch, UserCheck, Shield, Newspaper, AlertTriangle} from 'lucide-react'

export interface EntityType {
  type: string
  label: string
  displayName: string
  icon: (props?: React.SVGProps<SVGSVGElement>) => JSX.Element
  description: string
}
export const ENTITY_TYPES: EntityType[] = [
  {
    type: 'events',
    label: 'Events',
    displayName: 'Events',
    icon: (props?: React.SVGProps<SVGSVGElement>) => <EventsIcon {...props} stroke={ICON_GREEN} />,
    description: 'Add historical events to the mind map',
  },
  {
    type: 'topics',
    label: 'Topics',
    displayName: 'Topics',
    icon: (props?: React.SVGProps<SVGSVGElement>) => <TopicsIcon {...props} stroke={ICON_GREEN} />,
    description: 'Add topics to the mind map',
  },
  {
    type: 'personnel',
    label: 'personnel',
    displayName: 'Key Figures',
    icon: (props?: React.SVGProps<SVGSVGElement>) => (
      <KeyFiguresIcon {...props} stroke={ICON_GREEN} />
    ),
    description: 'Add key figures to the mind map',
  },
  {
    type: 'testimonies',
    label: 'testimonies',
    displayName: 'Testimonies',
    icon: (props?: React.SVGProps<SVGSVGElement>) => (
      <TestimoniesIcon {...props} stroke={ICON_GREEN} />
    ),
    description: 'Add testimonies to the mind map',
  },
  {
    type: 'organizations',
    label: 'organizations',
    displayName: 'Organizations',
    icon: (props?: React.SVGProps<SVGSVGElement>) => (
      <OrganizationsIcon {...props} stroke={ICON_GREEN} />
    ),
    description: 'Add organizations to the mind map',
  },
  {
    type: 'documents',
    label: 'documents',
    displayName: 'Documents',
    icon: (props?: React.SVGProps<SVGSVGElement>) => <FileSearch {...props} stroke={ICON_GREEN} />,
    description: 'Add case files to the mind map',
  },
  {
    type: 'case-files',
    label: 'case-files',
    displayName: 'Case Files',
    icon: (props?: React.SVGProps<SVGSVGElement>) => <FileSearch {...props} stroke={ICON_GREEN} />,
    description: 'Add case files to the mind map',
  },

  {
    type: 'artifacts',
    label: 'artifacts',
    displayName: 'Artifacts',
    icon: (props?: React.SVGProps<SVGSVGElement>) => (
      <ArtifactsIcon {...props} stroke={ICON_GREEN} />
    ),
    description: 'Add historical artifacts to the mind map',
  },
  {
    type: 'whistleblower',
    label: 'whistleblower',
    displayName: 'Whistleblower',
    icon: (props?: React.SVGProps<SVGSVGElement>) => <UserCheck {...props} stroke={ICON_GREEN} />,
    description: 'Add whistleblower testimonies and information',
  },
  {
    type: 'crash-retrieval',
    label: 'crash-retrieval',
    displayName: 'Crash Retrieval/Evidence',
    icon: (props?: React.SVGProps<SVGSVGElement>) => <Shield {...props} stroke={ICON_GREEN} />,
    description: 'Add crash retrieval cases and evidence',
  },
  {
    type: 'media-coverage',
    label: 'media-coverage',
    displayName: 'Media Coverage',
    icon: (props?: React.SVGProps<SVGSVGElement>) => <Newspaper {...props} stroke={ICON_GREEN} />,
    description: 'Add media coverage and documentary evidence',
  },
  {
    type: 'disclosure-milestone',
    label: 'disclosure-milestone',
    displayName: 'Disclosure Milestone',
    icon: (props?: React.SVGProps<SVGSVGElement>) => (
      <AlertTriangle {...props} stroke={ICON_GREEN} />
    ),
    description: 'Add key disclosure milestones and events',
  },
]
