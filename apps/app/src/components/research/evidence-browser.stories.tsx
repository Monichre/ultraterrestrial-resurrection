import type { Meta, StoryObj } from '@storybook/react'
import { EvidenceBrowser } from './evidence-browser'
import { useState } from 'react'

const meta: Meta<typeof EvidenceBrowser> = {
  title: 'Research/EvidenceBrowser',
  component: EvidenceBrowser,
  parameters: {
    layout: 'padded',
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

// Mock research records
const mockRecords = [
  {
    id: 'evt-001',
    type: 'events' as const,
    title: 'Phoenix Lights Mass Sighting',
    description: 'Large triangular craft observed by over 1,000 witnesses across Arizona. Multiple video recordings and pilot testimonies documented.',
    metadata: {
      date: '1997-03-13',
      witnesses: 1000,
      duration: '2 hours',
      classification: 'UNIDENTIFIED'
    }
  },
  {
    id: 'per-001',
    type: 'personnel' as const,
    title: 'Dr. Elena Vasquez',
    description: 'Chief Research Director for Advanced Phenomena Research Division. Former NASA engineer with Top Secret clearance.',
    metadata: {
      role: 'Chief Research Director',
      clearance: 'COSMIC',
      department: 'Advanced Phenomena Research',
      yearsActive: 15
    }
  },
  {
    id: 'doc-001',
    type: 'documents' as const,
    title: 'Project Blue Book Case File #10073',
    description: 'Classified investigation report on recurring UAP encounters over military installations. Contains radar data and pilot testimonies.',
    metadata: {
      classification: 'TOP SECRET',
      pages: 247,
      releaseDate: '2023-01-15',
      originalDate: '1969-12-17'
    }
  },
  {
    id: 'loc-001',
    type: 'locations' as const,
    title: 'Malmstrom Air Force Base',
    description: 'Nuclear weapons storage facility where multiple UAP incidents resulted in temporary shutdown of missile systems.',
    metadata: {
      state: 'Montana',
      established: '1942',
      classification: 'RESTRICTED',
      incidents: 12
    }
  },
  {
    id: 'org-001',
    type: 'organizations' as const,
    title: 'Advanced Aerospace Threat Identification Program',
    description: 'Pentagon program investigating unidentified aerial phenomena and potential national security implications.',
    metadata: {
      acronym: 'AATIP',
      founded: '2007',
      budget: '$22M',
      status: 'ACTIVE'
    }
  },
  {
    id: 'test-001',
    type: 'testimonies' as const,
    title: 'Commander David Fravor - Tic Tac Encounter',
    description: 'F/A-18 Super Hornet pilot testimony of close encounter with unidentified craft exhibiting impossible flight characteristics.',
    metadata: {
      date: '2004-11-14',
      location: 'Pacific Ocean',
      credibility: 'HIGH',
      duration: '10 minutes'
    }
  },
  {
    id: 'sight-001',
    type: 'sightings' as const,
    title: 'USS Nimitz Strike Group Encounters',
    description: 'Multiple radar and visual confirmations of unidentified objects exhibiting trans-medium capabilities.',
    metadata: {
      date: '2004-11-10 to 2004-11-16',
      vessels: 4,
      aircraft: 8,
      recordings: 'FLIR, Radar'
    }
  }
]

const mockAdjacentRecords = [
  {
    id: 'adj-001',
    type: 'documents' as const,
    title: 'Related Incident Report #2847',
    description: 'Supporting documentation for the primary event'
  },
  {
    id: 'adj-002', 
    type: 'personnel' as const,
    title: 'Lt. Colonel Sarah Mitchell',
    description: 'Secondary witness and investigating officer'
  },
  {
    id: 'adj-003',
    type: 'locations' as const,
    title: 'Nearby Radar Installation',
    description: 'Auxiliary monitoring station that recorded anomalous signals'
  }
]

export const Default: Story = {
  args: {
    records: mockRecords.slice(0, 3),
    selectedRecord: null,
    adjacentRecords: [],
    onRecordSelect: (record) => console.log('Selected:', record)
  }
}

export const AllRecordTypes: Story = {
  args: {
    records: mockRecords,
    selectedRecord: null,
    adjacentRecords: [],
    onRecordSelect: (record) => console.log('Selected:', record)
  }
}

export const WithSelection: Story = {
  args: {
    records: mockRecords,
    selectedRecord: mockRecords[0],
    adjacentRecords: mockAdjacentRecords,
    onRecordSelect: (record) => console.log('Selected:', record)
  }
}

export const EmptyState: Story = {
  args: {
    records: [],
    selectedRecord: null,
    adjacentRecords: [],
    onRecordSelect: (record) => console.log('Selected:', record)
  }
}

export const PersonnelFocused: Story = {
  args: {
    records: mockRecords.filter(r => r.type === 'personnel'),
    selectedRecord: null,
    adjacentRecords: [],
    onRecordSelect: (record) => console.log('Selected:', record)
  }
}

export const DocumentsFocused: Story = {
  args: {
    records: mockRecords.filter(r => r.type === 'documents'),
    selectedRecord: null,
    adjacentRecords: [],
    onRecordSelect: (record) => console.log('Selected:', record)
  }
}

// Interactive story with state
export const Interactive: Story = {
  render: (args) => {
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [adjacentRecords, setAdjacentRecords] = useState([])
    
    const handleRecordSelect = (record) => {
      setSelectedRecord(record)
      // Simulate loading adjacent records
      if (record.id === 'evt-001') {
        setAdjacentRecords(mockAdjacentRecords)
      } else {
        setAdjacentRecords(mockAdjacentRecords.slice(0, 1))
      }
    }
    
    return (
      <div className="h-[600px] bg-slate-900 p-4">
        <EvidenceBrowser
          {...args}
          records={mockRecords}
          selectedRecord={selectedRecord}
          adjacentRecords={adjacentRecords}
          onRecordSelect={handleRecordSelect}
        />
      </div>
    )
  }
}

// Compact layout story
export const CompactLayout: Story = {
  args: {
    records: mockRecords,
    selectedRecord: mockRecords[1],
    adjacentRecords: mockAdjacentRecords,
    onRecordSelect: (record) => console.log('Selected:', record),
    className: 'max-h-96 overflow-y-auto'
  },
  decorators: [
    (Story) => (
      <div className="max-w-md bg-slate-900 p-4">
        <Story />
      </div>
    )
  ]
}