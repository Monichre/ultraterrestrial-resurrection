import type { Meta, StoryObj } from '@storybook/react'
import { PinnedCardsCanvas } from './pinned-cards-canvas'
import { type PinnedCard } from '@/contexts/research/research-context'
import { type ReactFlowNode } from '@/features/mindmap/actions/xata-to-xyflow'

const meta: Meta<typeof PinnedCardsCanvas> = {
  title: 'Research/PinnedCardsCanvas',
  component: PinnedCardsCanvas,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f172a' },
        { name: 'slate', value: '#1e293b' }
      ]
    }
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Mock data for personnel with photos
const mockPersonnelCards: PinnedCard[] = [
  {
    id: 'personnel-1',
    type: 'personnel',
    position: { x: 100, y: 100 },
    data: {
      name: 'Dr. Elena Vasquez',
      role: 'Chief Research Director',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b9e6b914?w=400&h=400&fit=crop&crop=face',
      rank: 1,
      clearanceLevel: 'COSMIC',
      department: 'Advanced Phenomena Research'
    },
    pinnedAt: new Date('2024-03-15'),
    notes: 'Leading researcher on Project Blue Book revival',
    connectedRecords: ['event-1', 'doc-1', 'location-1'],
    aiAnalysis: {
      summary: 'Key figure in disclosure efforts with extensive military contacts',
      confidence: 0.94,
      connections: 12
    }
  },
  {
    id: 'personnel-2', 
    type: 'personnel',
    position: { x: 400, y: 200 },
    data: {
      name: 'Commander Jake Morrison',
      role: 'Navy Intelligence Officer',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      rank: 3,
      clearanceLevel: 'TOP SECRET',
      department: 'Office of Naval Intelligence'
    },
    pinnedAt: new Date('2024-03-14'),
    notes: 'Witness to USS Nimitz incident',
    connectedRecords: ['event-2', 'testimony-1'],
    aiAnalysis: {
      summary: 'Military witness with credible UAP encounters',
      confidence: 0.87,
      connections: 8
    }
  },
  {
    id: 'personnel-3',
    type: 'personnel', 
    position: { x: 200, y: 350 },
    data: {
      name: 'Dr. Sarah Chen',
      role: 'Quantum Physicist',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
      rank: 5,
      clearanceLevel: 'SECRET',
      department: 'Stanford Research Institute'
    },
    pinnedAt: new Date('2024-03-13'),
    notes: 'Expert in quantum consciousness theories',
    connectedRecords: ['doc-2', 'theory-1'],
    aiAnalysis: {
      summary: 'Academic researcher bridging quantum physics and consciousness',
      confidence: 0.91,
      connections: 15
    }
  }
]

// Mock data for mixed entity types
const mockMixedCards: PinnedCard[] = [
  ...mockPersonnelCards,
  {
    id: 'event-1',
    type: 'events',
    position: { x: 600, y: 100 },
    data: {
      name: 'Phoenix Lights Incident',
      date: '1997-03-13',
      location: 'Phoenix, Arizona',
      witnesses: 1000,
      classification: 'UNIDENTIFIED'
    },
    pinnedAt: new Date('2024-03-15'),
    notes: 'Mass sighting with multiple credible witnesses',
    connectedRecords: ['personnel-1', 'testimony-1', 'doc-3'],
    aiAnalysis: {
      summary: 'Significant mass UFO sighting with government involvement',
      confidence: 0.96,
      connections: 20
    }
  },
  {
    id: 'doc-1',
    type: 'documents',
    position: { x: 150, y: 500 },
    data: {
      name: 'Project Blue Book Final Report',
      classification: 'DECLASSIFIED',
      pages: 247,
      releaseDate: '1969-12-17'
    },
    pinnedAt: new Date('2024-03-14'),
    notes: 'Official conclusion of Air Force UFO investigation',
    connectedRecords: ['personnel-1', 'event-1'],
    aiAnalysis: {
      summary: 'Historical document revealing government UFO investigation methods',
      confidence: 0.99,
      connections: 35
    }
  },
  {
    id: 'org-1',
    type: 'organizations',
    position: { x: 450, y: 400 },
    data: {
      name: 'Advanced Aerospace Threat Identification Program',
      acronym: 'AATIP',
      founded: '2007',
      status: 'ACTIVE',
      budget: '$22M'
    },
    pinnedAt: new Date('2024-03-13'),
    notes: 'Pentagon UFO investigation program',
    connectedRecords: ['personnel-2', 'doc-1'],
    aiAnalysis: {
      summary: 'Official government program investigating unidentified aerial phenomena',
      confidence: 0.93,
      connections: 18
    }
  }
]

// Mock node for drag and drop
const mockNode: ReactFlowNode = {
  id: 'new-node-1',
  type: 'entityNode',
  position: { x: 0, y: 0 },
  data: {
    name: 'Roswell Incident',
    type: 'events',
    date: '1947-07-08',
    location: 'Roswell, New Mexico'
  }
}

export const Empty: Story = {
  args: {
    pinnedCards: [],
    onUnpinCard: (cardId: string) => console.log('Unpin card:', cardId),
    onCardAnalyze: (card: PinnedCard) => console.log('Analyze card:', card),
    onCardConnect: (source: PinnedCard, target: PinnedCard) => 
      console.log('Connect cards:', source.id, '→', target.id),
    onCardMove: (cardId: string, position: { x: number, y: number }) =>
      console.log('Move card:', cardId, 'to', position),
    onNodeDrop: (node: ReactFlowNode, position: { x: number, y: number }) =>
      console.log('Drop node:', node.id, 'at', position)
  }
}

export const PersonnelOnly: Story = {
  args: {
    pinnedCards: mockPersonnelCards,
    onUnpinCard: (cardId: string) => console.log('Unpin card:', cardId),
    onCardAnalyze: (card: PinnedCard) => console.log('Analyze card:', card),
    onCardConnect: (source: PinnedCard, target: PinnedCard) => 
      console.log('Connect cards:', source.id, '→', target.id),
    onCardMove: (cardId: string, position: { x: number, y: number }) =>
      console.log('Move card:', cardId, 'to', position),
    onNodeDrop: (node: ReactFlowNode, position: { x: number, y: number }) =>
      console.log('Drop node:', node.id, 'at', position)
  }
}

export const MixedEntities: Story = {
  args: {
    pinnedCards: mockMixedCards,
    onUnpinCard: (cardId: string) => console.log('Unpin card:', cardId),
    onCardAnalyze: (card: PinnedCard) => console.log('Analyze card:', card),
    onCardConnect: (source: PinnedCard, target: PinnedCard) => 
      console.log('Connect cards:', source.id, '→', target.id),
    onCardMove: (cardId: string, position: { x: number, y: number }) =>
      console.log('Move card:', cardId, 'to', position),
    onNodeDrop: (node: ReactFlowNode, position: { x: number, y: number }) =>
      console.log('Drop node:', node.id, 'at', position)
  }
}

export const DenseLayout: Story = {
  args: {
    pinnedCards: [
      ...mockMixedCards,
      {
        id: 'location-1',
        type: 'locations',
        position: { x: 50, y: 250 },
        data: {
          name: 'Area 51',
          coordinates: '37.2431° N, 115.7930° W',
          classification: 'RESTRICTED',
          established: '1955'
        },
        pinnedAt: new Date('2024-03-12'),
        notes: 'Highly classified military installation',
        connectedRecords: ['personnel-1', 'event-1'],
        aiAnalysis: {
          summary: 'Secretive military base linked to UFO research',
          confidence: 0.88,
          connections: 25
        }
      },
      {
        id: 'testimony-1',
        type: 'testimonies',
        position: { x: 350, y: 50 },
        data: {
          name: 'Cmdr. David Fravor Testimony',
          date: '2004-11-14',
          credibility: 'HIGH',
          classification: 'UNCLASSIFIED'
        },
        pinnedAt: new Date('2024-03-11'),
        notes: 'Tic-tac UAP encounter testimony',
        connectedRecords: ['personnel-2', 'event-1'],
        aiAnalysis: {
          summary: 'Highly credible military pilot UAP encounter',
          confidence: 0.95,
          connections: 12
        }
      }
    ],
    onUnpinCard: (cardId: string) => console.log('Unpin card:', cardId),
    onCardAnalyze: (card: PinnedCard) => console.log('Analyze card:', card),
    onCardConnect: (source: PinnedCard, target: PinnedCard) => 
      console.log('Connect cards:', source.id, '→', target.id),
    onCardMove: (cardId: string, position: { x: number, y: number }) =>
      console.log('Move card:', cardId, 'to', position),
    onNodeDrop: (node: ReactFlowNode, position: { x: number, y: number }) =>
      console.log('Drop node:', node.id, 'at', position)
  }
}

// Interactive story with state management
export const Interactive: Story = {
  render: (args) => {
    const [cards, setCards] = React.useState<PinnedCard[]>(mockMixedCards)
    
    const handleUnpin = (cardId: string) => {
      setCards(prev => prev.filter(card => card.id !== cardId))
    }
    
    const handleMove = (cardId: string, position: { x: number, y: number }) => {
      setCards(prev => prev.map(card => 
        card.id === cardId ? { ...card, position } : card
      ))
    }
    
    const handleNodeDrop = (node: ReactFlowNode, position: { x: number, y: number }) => {
      const newCard: PinnedCard = {
        id: `dropped-${Date.now()}`,
        type: node.data.type || 'events',
        position,
        data: node.data,
        pinnedAt: new Date(),
        notes: 'Dropped from mindmap',
        connectedRecords: [],
        aiAnalysis: {
          summary: 'New entity added for analysis',
          confidence: 0.8,
          connections: 0
        }
      }
      setCards(prev => [...prev, newCard])
    }
    
    return (
      <div className="h-screen">
        <PinnedCardsCanvas
          {...args}
          pinnedCards={cards}
          onUnpinCard={handleUnpin}
          onCardMove={handleMove}
          onNodeDrop={handleNodeDrop}
        />
      </div>
    )
  }
}