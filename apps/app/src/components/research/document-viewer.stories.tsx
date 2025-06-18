import type { Meta, StoryObj } from '@storybook/react'
import { DocumentViewer } from './document-viewer'
import { useState } from 'react'

const meta: Meta<typeof DocumentViewer> = {
  title: 'Research/DocumentViewer',
  component: DocumentViewer,
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

// Mock documents with more realistic UFO/UAP content
const mockDocuments = [
  {
    id: 'doc-001',
    title: 'Project Blue Book Final Report - Case #10073',
    type: 'investigation-report',
    content: `CLASSIFICATION: DECLASSIFIED
DATE: 17 December 1969
SUBJECT: Unidentified Flying Object Report - Case #10073

SUMMARY:
On 13 March 1997, multiple witnesses reported observing a large, triangular-shaped craft moving silently across the Arizona sky. The object was estimated to be 1-2 miles in length and displayed a distinctive pattern of lights along its edges.

WITNESS TESTIMONIES:
- Commercial pilot Captain Mike Henderson reported the object on radar at 8,000 feet
- Air Traffic Control at Phoenix Sky Harbor confirmed radar contact
- Over 1,000 civilian witnesses provided consistent descriptions

ANALYSIS:
The object's flight characteristics, size, and lack of conventional propulsion signatures remain unexplained. All conventional aircraft and military exercises have been ruled out for the time period in question.

CONCLUSION:
Case remains UNIDENTIFIED. No conventional explanation can account for the reported phenomena.

INVESTIGATING OFFICER: Lt. Colonel James Mitchell
CLASSIFICATION REVIEW: APPROVED FOR RELEASE`,
    createdAt: '1969-12-17T14:30:00Z',
    classification: 'declassified',
    pages: 247,
    originalClassification: 'top-secret'
  },
  {
    id: 'doc-002',
    title: 'USS Nimitz Strike Group - Radar Analysis Report',
    type: 'technical-analysis',
    content: `CLASSIFICATION: TOP SECRET//NOFORN
DATE: 24 November 2004
SUBJECT: Anomalous Radar Signatures - USS Nimitz Strike Group

EXECUTIVE SUMMARY:
During the period 10-16 November 2004, the USS Nimitz Strike Group detected multiple radar signatures exhibiting flight characteristics beyond known aircraft capabilities.

RADAR DATA ANALYSIS:
- Objects demonstrated instantaneous acceleration from 0 to estimated Mach 60+
- Altitude changes from 80,000 feet to sea level in less than 2 seconds
- No heat signatures detected despite extreme acceleration
- Radar cross-section inconsistent with known aircraft

PILOT ENCOUNTERS:
F/A-18F crews from VFA-41 reported visual contact with "white, oblong objects approximately 40 feet in length" exhibiting:
- Hovering capability with no visible propulsion
- Instantaneous direction changes
- Trans-medium travel (air to water)

TECHNICAL ASSESSMENT:
The observed flight characteristics require propulsion technology beyond current human capabilities. Energy requirements for documented maneuvers exceed known power sources by orders of magnitude.

RECOMMENDATION:
Continue monitoring and data collection. Recommend elevation to appropriate intelligence channels for further analysis.

PREPARED BY: Dr. Elena Vasquez, Senior Radar Analyst
CLASSIFICATION: TOP SECRET//NOFORN`,
    createdAt: '2004-11-24T09:15:00Z',
    classification: 'top-secret',
    pages: 89,
    technicalSpecs: true
  },
  {
    id: 'doc-003',
    title: 'AATIP Preliminary Assessment - Unidentified Aerial Phenomena',
    type: 'intelligence-assessment',
    content: `CLASSIFICATION: SECRET//NOFORN
DATE: 25 June 2021
SUBJECT: Preliminary Assessment of Unidentified Aerial Phenomena

SCOPE:
This preliminary assessment provides an overview of the Unidentified Aerial Phenomena (UAP) data collected by the U.S. Government between 2004 and 2021.

KEY FINDINGS:
1. UAP represent a clear safety of flight issue and may pose a challenge to U.S. national security
2. UAP demonstrate unusual flight characteristics and performance
3. Limited data leaves most UAP unexplained

FLIGHT CHARACTERISTICS:
- Unusual flight patterns or performance characteristics
- Lack of obvious propulsion methods
- Ability to remain stationary in high winds
- Sudden acceleration and directional changes

ANALYSIS CHALLENGES:
- Inconsistent reporting and data collection
- Limited sensor data for comprehensive analysis
- Stigma affecting pilot willingness to report

RECOMMENDATIONS:
1. Standardize UAP reporting procedures
2. Increase data collection and analysis capabilities
3. Improve interagency coordination
4. Reduce stigma to encourage reporting

This assessment represents the views of the Director of National Intelligence in coordination with the Secretary of Defense and other relevant agencies.

CLASSIFICATION: SECRET//NOFORN`,
    createdAt: '2021-06-25T16:45:00Z',
    classification: 'secret',
    pages: 15,
    governmentAssessment: true
  },
  {
    id: 'doc-004',
    title: 'Malmstrom AFB Incident Report - Nuclear Weapons Systems Interference',
    type: 'incident-report',
    content: `CLASSIFICATION: CONFIDENTIAL
DATE: 24 March 1967
SUBJECT: Unexplained Interference with Nuclear Weapons Systems

INCIDENT SUMMARY:
At approximately 0300 hours on 16 March 1967, multiple Minuteman I nuclear missiles at Malmstrom Air Force Base experienced simultaneous system failures following reports of unidentified objects in the vicinity.

WITNESS ACCOUNTS:
- Security personnel reported glowing, disc-shaped objects hovering over missile silos
- Objects estimated 30-50 feet in diameter
- Bright lights observed for approximately 45 minutes
- No sound or exhaust signatures detected

TECHNICAL IMPACT:
- 10 Minuteman I missiles went offline simultaneously
- Guidance systems showed "NO-GO" status
- Launch Facility control systems unresponsive
- All affected systems returned to normal operation after 24 hours

INVESTIGATION FINDINGS:
- No evidence of foreign interference or sabotage
- Electromagnetic interference patterns inconsistent with known sources
- Security camera footage corrupted during incident window
- Maintenance crews found no physical damage to systems

SECURITY IMPLICATIONS:
The ability of unidentified objects to interfere with nuclear weapons systems represents a significant security concern requiring immediate investigation and countermeasures.

INVESTIGATING OFFICER: Major Robert Salas
CLASSIFICATION: CONFIDENTIAL`,
    createdAt: '1967-03-24T08:20:00Z',
    classification: 'confidential',
    pages: 34,
    nuclearSecurity: true
  }
]

const mockAdjacentRecords = [
  {
    id: 'evt-001',
    type: 'events',
    title: 'Phoenix Lights Mass Sighting',
    description: 'Large triangular craft observed by over 1,000 witnesses',
    metadata: { date: '1997-03-13', witnesses: 1000 }
  },
  {
    id: 'per-001',
    type: 'personnel',
    title: 'Commander David Fravor',
    description: 'F/A-18 pilot who encountered Tic Tac UAP',
    metadata: { branch: 'Navy', clearance: 'Top Secret' }
  },
  {
    id: 'loc-001',
    type: 'locations',
    title: 'USS Nimitz',
    description: 'Nimitz-class aircraft carrier',
    metadata: { coordinates: '32.7°N 117.2°W' }
  }
]

export const Default: Story = {
  args: {
    selectedDocument: null,
    adjacentRecords: [],
    onDocumentSelect: (doc) => console.log('Selected document:', doc)
  }
}

export const WithSelectedDocument: Story = {
  args: {
    selectedDocument: mockDocuments[0],
    adjacentRecords: mockAdjacentRecords,
    onDocumentSelect: (doc) => console.log('Selected document:', doc)
  }
}

export const TopSecretDocument: Story = {
  args: {
    selectedDocument: mockDocuments[1],
    adjacentRecords: mockAdjacentRecords.slice(0, 2),
    onDocumentSelect: (doc) => console.log('Selected document:', doc)
  }
}

export const GovernmentAssessment: Story = {
  args: {
    selectedDocument: mockDocuments[2],
    adjacentRecords: mockAdjacentRecords,
    onDocumentSelect: (doc) => console.log('Selected document:', doc)
  }
}

export const IncidentReport: Story = {
  args: {
    selectedDocument: mockDocuments[3],
    adjacentRecords: mockAdjacentRecords.slice(1),
    onDocumentSelect: (doc) => console.log('Selected document:', doc)
  }
}

// Interactive story with full functionality
export const Interactive: Story = {
  render: (args) => {
    const [selectedDocument, setSelectedDocument] = useState(mockDocuments[0])
    const [adjacentRecords, setAdjacentRecords] = useState(mockAdjacentRecords)
    
    const handleDocumentSelect = (doc) => {
      setSelectedDocument(doc)
      
      // Simulate loading different adjacent records based on document type
      if (doc.type === 'technical-analysis') {
        setAdjacentRecords(mockAdjacentRecords.filter(r => r.type !== 'locations'))
      } else if (doc.type === 'incident-report') {
        setAdjacentRecords(mockAdjacentRecords.filter(r => r.type === 'locations' || r.type === 'personnel'))
      } else {
        setAdjacentRecords(mockAdjacentRecords)
      }
    }
    
    return (
      <div className="h-[700px] bg-slate-900">
        <DocumentViewer
          {...args}
          selectedDocument={selectedDocument}
          adjacentRecords={adjacentRecords}
          onDocumentSelect={handleDocumentSelect}
        />
      </div>
    )
  }
}

// Compact sidebar layout
export const SidebarLayout: Story = {
  args: {
    selectedDocument: mockDocuments[1],
    adjacentRecords: mockAdjacentRecords,
    onDocumentSelect: (doc) => console.log('Selected document:', doc),
    className: 'max-w-sm'
  },
  decorators: [
    (Story) => (
      <div className="flex h-[600px] bg-slate-900">
        <div className="w-80 border-r border-green-400/20">
          <Story />
        </div>
        <div className="flex-1 p-4 text-white">
          <h3 className="text-lg font-semibold mb-2">Main Content Area</h3>
          <p className="text-gray-400">Document viewer integrated as sidebar</p>
        </div>
      </div>
    )
  ]
}

// Multiple documents view
export const MultipleDocuments: Story = {
  render: (args) => {
    const [selectedDocument, setSelectedDocument] = useState(null)
    
    return (
      <div className="h-[700px] bg-slate-900">
        <DocumentViewer
          {...args}
          selectedDocument={selectedDocument}
          adjacentRecords={mockAdjacentRecords}
          onDocumentSelect={setSelectedDocument}
        />
      </div>
    )
  }
}

// Document with no content (loading state)
export const LoadingState: Story = {
  args: {
    selectedDocument: {
      id: 'doc-loading',
      title: 'Loading Document...',
      type: 'loading',
      content: '',
      classification: 'unknown',
      createdAt: new Date().toISOString()
    },
    adjacentRecords: [],
    onDocumentSelect: (doc) => console.log('Selected document:', doc)
  }
}