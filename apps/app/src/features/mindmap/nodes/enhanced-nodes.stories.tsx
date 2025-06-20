import type { Meta, StoryObj } from '@storybook/react'
import { ReactFlowProvider } from '@xyflow/react'
import { EnhancedEntityNode } from './enhanced-entity-node'
import { EnhancedUserInputNode } from './enhanced-user-input-node'

const meta: Meta = {
  title: 'MindMap/Enhanced Nodes',
  decorators: [
    (Story) => (
      <ReactFlowProvider>
        <div className="p-8 bg-neutral-950 min-h-screen">
          <Story />
        </div>
      </ReactFlowProvider>
    ),
  ],
}

export default meta

// Enhanced Entity Node Stories
export const RoswellIncident: StoryObj = {
  render: () => (
    <EnhancedEntityNode
      id="roswell-1947"
      selected={false}
      data={{
        type: 'events',
        title: 'Roswell UFO Incident',
        name: 'Roswell UFO Incident',
        description: 'A purported UFO crash and subsequent cover-up by the United States military in 1947. The incident became a cornerstone of UFO conspiracy theories and sparked decades of speculation about extraterrestrial life.',
        date: '1947-07-08',
        location: 'Roswell, New Mexico',
        latitude: 33.3943,
        longitude: -104.5230,
        photos: [{ url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400' }],
        credibility: 8,
        isContextual: false,
      }}
    />
  ),
}

export const MajorJesseMarcel: StoryObj = {
  render: () => (
    <EnhancedEntityNode
      id="jesse-marcel"
      selected={false}
      data={{
        type: 'personnel',
        title: 'Major Jesse Marcel',
        name: 'Major Jesse Marcel',
        description: 'Intelligence officer who was involved in the initial recovery of debris from the Roswell incident. His later statements about the incident contradicted the official weather balloon explanation.',
        role: 'Intelligence Officer',
        organization: { name: '509th Bomb Group' },
        photos: [{ url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' }],
        credibility: 9,
        authority: 8,
        isContextual: true,
        contextInfo: 'Connected to Roswell incident network',
      }}
    />
  ),
}

export const ProjectBlueBook: StoryObj = {
  render: () => (
    <EnhancedEntityNode
      id="project-blue-book"
      selected={false}
      data={{
        type: 'organizations',
        title: 'Project Blue Book',
        name: 'Project Blue Book',
        description: 'Official U.S. Air Force investigation of UFOs from 1952 to 1969. The project investigated over 12,000 UFO reports and concluded that most sightings could be explained by natural phenomena.',
        specialization: 'UFO Investigation',
        photos: [{ url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400' }],
        isContextual: true,
        contextInfo: 'Part of government disclosure timeline',
      }}
    />
  ),
}

export const TestimonyNode: StoryObj = {
  render: () => (
    <EnhancedEntityNode
      id="testimony-1"
      selected={false}
      data={{
        type: 'testimonies',
        title: 'Witness Testimony - Ranch Foreman',
        name: 'Witness Testimony - Ranch Foreman',
        description: 'Mac Brazel, a ranch foreman, reported finding strange debris on his property. He described materials unlike anything he had seen before - lightweight metal that could not be dented or burned.',
        witness: { name: 'Mac Brazel' },
        date: '1947-07-07',
        organization: { name: 'Foster Ranch' },
        credibility: 7,
        isContextual: true,
        contextInfo: 'Primary witness in Roswell incident',
      }}
    />
  ),
}

export const ClassifiedDocument: StoryObj = {
  render: () => (
    <EnhancedEntityNode
      id="classified-doc-1"
      selected={false}
      data={{
        type: 'documents',
        title: 'Classified Memo - General Ramey',
        name: 'Classified Memo - General Ramey',
        description: 'Official military memorandum regarding the recovery of debris. The document has been partially declassified but contains significant redactions.',
        author: 'General Roger Ramey',
        date: '1947-07-08',
        organization: { name: '8th Air Force' },
        isContextual: true,
        contextInfo: 'Official documentation of incident',
      }}
    />
  ),
}

export const ResearchTopic: StoryObj = {
  render: () => (
    <EnhancedEntityNode
      id="topic-crash-retrieval"
      selected={false}
      data={{
        type: 'topics',
        title: 'Crash Retrieval Operations',
        name: 'Crash Retrieval Operations',
        description: 'The study of alleged military operations to recover crashed extraterrestrial vehicles. Researchers examine patterns in witness testimonies and government responses.',
        isContextual: true,
        contextInfo: 'Core research area in ufology',
      }}
    />
  ),
}

// User Input Node Stories
export const OpenExplorationQuery: StoryObj = {
  render: () => (
    <EnhancedUserInputNode
      id="user-query-1"
      selected={false}
      data={{
        input: 'Tell me about the most credible UFO sightings in the 1940s',
        label: 'Your Query',
        isContextual: false,
        isLoading: false,
        answer: 'The 1940s marked the beginning of the modern UFO era, with several highly credible sightings. The most notable include the Kenneth Arnold sighting in 1947, which coined the term "flying saucer," and the Roswell incident later that year. These events involved credible witnesses including pilots, military personnel, and civilians.',
      }}
    />
  ),
}

export const ContextualQuery: StoryObj = {
  render: () => (
    <EnhancedUserInputNode
      id="user-query-2"
      selected={false}
      data={{
        input: 'Who were the key military officials involved in the Roswell investigation?',
        label: 'Contextual Search',
        isContextual: true,
        contextInfo: 'Building on 4 entity types, 3 key figures',
        isLoading: false,
        answer: 'Based on the connected records in your graph, the key military officials included Major Jesse Marcel (Intelligence Officer, 509th Bomb Group), General Roger Ramey (Commander, 8th Air Force), and Colonel William Blanchard (Commander, 509th Bomb Group). Each played crucial roles in the initial response and subsequent explanations.',
      }}
    />
  ),
}

export const LoadingQuery: StoryObj = {
  render: () => (
    <EnhancedUserInputNode
      id="user-query-3"
      selected={false}
      data={{
        input: 'Find documents related to Project Blue Book',
        label: 'Contextual Search',
        isContextual: true,
        isLoading: true,
        contextInfo: 'Searching connected records...',
      }}
    />
  ),
}

export const ErrorQuery: StoryObj = {
  render: () => (
    <EnhancedUserInputNode
      id="user-query-4"
      selected={false}
      data={{
        input: 'Search for classified alien technology',
        label: 'Your Query',
        isContextual: false,
        error: 'Access denied: Insufficient clearance level for requested information',
      }}
    />
  ),
}

// Showcase multiple nodes together
export const DisclosureNetwork: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      <RoswellIncident.render />
      <MajorJesseMarcel.render />
      <TestimonyNode.render />
      <ContextualQuery.render />
    </div>
  ),
}

export const SelectedNode: StoryObj = {
  render: () => (
    <EnhancedEntityNode
      id="selected-node"
      selected={true}
      data={{
        type: 'events',
        title: 'Phoenix Lights',
        name: 'Phoenix Lights',
        description: 'Mass UFO sighting over Phoenix, Arizona, witnessed by thousands of people including the governor. Two distinct events occurred: a V-shaped formation of lights and stationary lights over the city.',
        date: '1997-03-13',
        location: 'Phoenix, Arizona',
        latitude: 33.4484,
        longitude: -112.0740,
        photos: [{ url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400' }],
        credibility: 9,
        isContextual: true,
        contextInfo: 'Part of modern UFO phenomena research',
      }}
    />
  ),
}