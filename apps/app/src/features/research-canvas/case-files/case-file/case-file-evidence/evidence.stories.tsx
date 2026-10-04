import type { Meta, StoryObj } from '@storybook/react'
import { EvidenceCard } from './evidence-card'
import { EvidenceBrowser } from './evidence-browser'
import EvidenceDetailSidebar from './evidence-detail-sidebar'

const meta = {
  title: 'Features/Case Files/Evidence',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#000000',
        },
      ],
    },
  },
} satisfies Meta

export default meta

// Evidence Card Stories
export const SingleEvidenceCard: StoryObj<typeof EvidenceCard> = {
  render: () => (
    <div className="p-8 bg-black/90">
      <div className="max-w-md">
        <EvidenceCard
          caseNumber="X-37B"
          classification="top-secret"
          timestamp="2077-03-15T21:27:18"
          title="Quantum Encryption Breach"
          description="Unauthorized access detected in quantum mainframe sector 7. Temporal anomalies reported."
          credibilityScore={0.87}
          sourceVerified={true}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Single evidence card showing a classified document with verification status.',
      },
    },
  },
}

// Evidence Card Variants
export const EvidenceCardVariants: StoryObj<typeof EvidenceCard> = {
  render: () => (
    <div className="p-8 space-y-6 bg-black/90">
      <div className="max-w-md">
        <EvidenceCard
          caseNumber="X-37B"
          classification="top-secret"
          timestamp="2077-03-15T21:27:18"
          title="Quantum Encryption Breach"
          description="Unauthorized access detected in quantum mainframe sector 7."
          credibilityScore={0.87}
          sourceVerified={true}
        />
      </div>
      <div className="max-w-md">
        <EvidenceCard
          caseNumber="X-38C"
          classification="classified"
          timestamp="2077-03-16T14:22:31"
          title="Temporal Anomaly Detection"
          description="Multiple timeline divergences observed in sector 9."
          sourceVerified={false}
        />
      </div>
      <div className="max-w-md">
        <EvidenceCard
          caseNumber="X-39D"
          classification="confidential"
          timestamp="2077-03-17T09:15:45"
          title="Surveillance Report"
          description="Standard monitoring data from orbital platforms."
          credibilityScore={0.95}
          sourceVerified={true}
        />
      </div>
    </div>
  ),
}

// Evidence Browser Story
export const Browser: StoryObj<typeof EvidenceBrowser> = {
  render: () => (
    <div className="p-8 bg-black/90 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <EvidenceBrowser />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Evidence browser showing folders and files with search functionality.',
      },
    },
  },
}

// Evidence Detail Sidebar Story
const sampleEvidence = {
  id: "7A-X119",
  type: "qdt",
  status: "active" as const,
  date: "2077-03-15",
  details: "Evidence file: orbital-scan-sector7.qdt",
  metadata: {
    createdBy: "System",
    lastModified: "2077-03-15 21:27:18",
    fileSize: "1.2 GB",
    format: "QDT",
  },
}

export const DetailSidebar: StoryObj<typeof EvidenceDetailSidebar> = {
  render: () => (
    <div className="p-8 bg-black/90 min-h-screen">
      <EvidenceDetailSidebar 
        evidence={sampleEvidence}
        onClose={() => console.log('Close clicked')}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Detail sidebar showing evidence metadata and analysis.',
      },
    },
  },
}

// Full Evidence Interface Story
export const FullInterface: StoryObj = {
  render: () => (
    <div className="bg-black/90 min-h-screen">
      <div className="grid grid-cols-[1fr_auto] gap-4 p-8">
        <div className="space-y-6">
          <EvidenceBrowser />
          <div className="grid grid-cols-2 gap-4">
            <EvidenceCard
              caseNumber="X-37B"
              classification="top-secret"
              timestamp="2077-03-15T21:27:18"
              title="Quantum Encryption Breach"
              description="Unauthorized access detected in quantum mainframe sector 7."
              credibilityScore={0.87}
              sourceVerified={true}
            />
            <EvidenceCard
              caseNumber="X-38C"
              classification="classified"
              timestamp="2077-03-16T14:22:31"
              title="Temporal Anomaly Detection"
              description="Multiple timeline divergences observed in sector 9."
              sourceVerified={false}
            />
          </div>
        </div>
        <EvidenceDetailSidebar 
          evidence={sampleEvidence}
          onClose={() => console.log('Close clicked')}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete evidence interface showing browser, cards, and detail sidebar together.',
      },
    },
  },
}