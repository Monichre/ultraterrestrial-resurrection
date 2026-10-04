import type {Meta, StoryObj} from '@storybook/react'
import CaseFileFolder from './CaseFileFolder'
import type {CaseFileFolderProps} from './CaseFileFolder'
import {userEvent, within, expect} from '@storybook/test'

const meta: Meta<typeof CaseFileFolder> = {
  title: 'Documents/CaseFileFolder',
  component: CaseFileFolder,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'vintage',
      values: [
        {name: 'vintage', value: '#2c1810'},
        {name: 'slate', value: '#1e293b'},
        {name: 'dark', value: '#0f172a'},
      ],
    },
    docs: {
      description: {
        component:
          'Interactive case file folder component with authentic government styling. Features tabbed navigation, evidence galleries, field notes, and classification stamps. Opens as a modal overlay with detailed case information.',
      },
    },
  },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls whether the case file folder is open or closed',
    },
    onClose: {
      action: 'closed',
      description: 'Callback function called when the folder is closed',
    },
    caseData: {
      control: 'object',
      description: 'Complete case file data structure with evidence and notes',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

// Sample case data for stories
const ufoIncidentCase = {
  caseNumber: 'XF-73291',
  title: 'UNEXPLAINED PHENOMENA INVESTIGATION',
  date: '04/17/1978',
  classification: 'TOP SECRET',
  subject: 'Lunar Surface Anomalies',
  summary:
    'Multiple credible reports of unusual light patterns observed on lunar surface. Possible connection to similar terrestrial phenomena under investigation.',
  notes: [
    'Apollo mission crew testimonies indicate consistent pattern of anomalous events.',
    'Spectral analysis suggests possible gas emissions from Aristarchus crater region.',
    'Similar light patterns documented at terrestrial locations with high electromagnetic readings.',
    'Recommend continued surveillance and correlation with Project BLUE BOOK findings.',
  ],
  evidence: [
    {
      id: 'E-001',
      type: 'PHOTOGRAPH',
      description: 'Lunar surface anomaly, Aristarchus crater, 03/14/1978',
    },
    {
      id: 'E-002',
      type: 'TESTIMONY',
      description: 'Apollo 15 mission specialist report, classified annex',
    },
    {
      id: 'E-003',
      type: 'SPECTRAL DATA',
      description: 'Emission analysis from Mt. Palomar observation',
    },
    {
      id: 'E-004',
      type: 'PHOTOGRAPH',
      description: 'Redwood National Forest aerial phenomenon, 04/20/1978',
    },
  ],
}

const roswellCase = {
  caseNumber: 'XF-19470',
  title: 'ROSWELL INCIDENT DOCUMENTATION',
  date: '07/08/1947',
  classification: 'TOP SECRET',
  subject: 'Crashed Aircraft Recovery',
  summary:
    'Recovery operation of unknown aircraft wreckage near Roswell, New Mexico. Initial assessment suggests advanced propulsion technology not consistent with known aircraft designs.',
  notes: [
    'Major Marcel confirms unusual metallic debris with unknown material properties.',
    'Witness reports describe craft of unconventional design and construction.',
    'Material samples forwarded to Wright-Patterson AFB for detailed analysis.',
    'Public information campaign emphasizes weather balloon explanation per directive.',
  ],
  evidence: [
    {
      id: 'E-047A',
      type: 'DEBRIS SAMPLE',
      description: 'Metallic fragment with unknown alloy composition',
    },
    {
      id: 'E-047B',
      type: 'PHOTOGRAPH',
      description: 'Crash site documentation, Foster Ranch location',
    },
    {
      id: 'E-047C',
      type: 'WITNESS STATEMENT',
      description: 'Rancher William Brazel sworn testimony',
    },
    {
      id: 'E-047D',
      type: 'MILITARY REPORT',
      description: 'Initial recovery team assessment and inventory',
    },
  ],
}

const minimalCase = {
  caseNumber: 'XF-12345',
  title: 'ROUTINE OBSERVATION',
  date: '01/15/1960',
  classification: 'CONFIDENTIAL',
  subject: 'Unidentified Light Source',
  summary: 'Single witness report of unusual light patterns. Investigation pending.',
  notes: ['Initial report filed.', 'Awaiting additional witness interviews.'],
  evidence: [
    {
      id: 'E-001',
      type: 'WITNESS STATEMENT',
      description: 'Primary observer testimony',
    },
  ],
}

export const Closed: Story = {
  args: {
    isOpen: false,
    caseData: ufoIncidentCase,
  },
  parameters: {
    docs: {
      description: {
        story: 'Case file folder in closed state. Click the folder or use controls to open.',
      },
    },
  },
}

export const OpenWithDefaultCase: Story = {
  args: {
    isOpen: true,
    caseData: ufoIncidentCase,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Case file folder opened showing the default UFO investigation case with all tabs and evidence.',
      },
    },
  },
}

export const RoswellCase: Story = {
  args: {
    isOpen: true,
    caseData: roswellCase,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Historic Roswell incident case file with military documentation and witness statements.',
      },
    },
  },
}

export const MinimalCase: Story = {
  args: {
    isOpen: true,
    caseData: minimalCase,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Simple case file with minimal evidence and notes, showing how the component handles sparse data.',
      },
    },
  },
}

export const NoCustomData: Story = {
  args: {
    isOpen: true,
    // Uses default case data from component
  },
  parameters: {
    docs: {
      description: {
        story: 'Case file using default internal data when no custom caseData is provided.',
      },
    },
  },
}

export const InteractiveTabs: Story = {
  args: {
    isOpen: true,
    caseData: ufoIncidentCase,
  },
  play: async ({canvasElement}) => {
    const canvas = within(canvasElement)

    // Wait for the folder to be visible
    await expect(canvas.getByText('CASE FILE: XF-73291')).toBeVisible()

    // Test clicking different tabs
    const notesTab = canvas.getByText('FIELD NOTES')
    await userEvent.click(notesTab)

    // Verify notes content is visible
    await expect(canvas.getByText('Apollo mission crew testimonies')).toBeVisible()

    // Click evidence tab
    const evidenceTab = canvas.getByText('EVIDENCE')
    await userEvent.click(evidenceTab)

    // Verify evidence content is visible
    await expect(canvas.getByText('Evidence Log')).toBeVisible()
    await expect(canvas.getByText('E-001')).toBeVisible()

    // Return to summary tab
    const summaryTab = canvas.getByText('SUMMARY')
    await userEvent.click(summaryTab)

    // Verify summary content is visible
    await expect(canvas.getByText('Multiple credible reports')).toBeVisible()
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demonstration of tab navigation within the case file folder. The test automatically clicks through different tabs.',
      },
    },
  },
}

export const CloseInteraction: Story = {
  args: {
    isOpen: true,
    caseData: ufoIncidentCase,
  },
  play: async ({canvasElement, args}) => {
    const canvas = within(canvasElement)

    // Wait for the folder to be visible
    await expect(canvas.getByText('CASE FILE: XF-73291')).toBeVisible()

    // Find and click the close button (X icon)
    const closeButton = canvas.getByRole('button', {name: /close/i})
    await userEvent.click(closeButton)

    // The onClose callback should have been called
    await expect(args.onClose).toHaveBeenCalled()
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the close functionality of the case file folder. Tests clicking the close button.',
      },
    },
  },
}

export const ResponsiveLayout: Story = {
  args: {
    isOpen: true,
    caseData: ufoIncidentCase,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Case file folder on mobile viewport, showing responsive layout adaptations.',
      },
    },
  },
}

export const InteractivePlayground: Story = {
  args: {
    isOpen: true,
    caseData: ufoIncidentCase,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground for testing the case file folder component. Use the controls to modify the case data and test different states.',
      },
    },
  },
}
