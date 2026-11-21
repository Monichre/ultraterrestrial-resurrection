import type {Meta, StoryObj} from '@storybook/react'
import {VintageDocumentCard, ClassificationBadge} from './VintageDocumentCard'
import type {ClassificationLevel} from './types'

const meta: Meta<typeof VintageDocumentCard> = {
  title: 'Documents/VintageDocumentCard',
  component: VintageDocumentCard,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'void',
      values: [
        {name: 'void', value: '#1a1916'},
        {name: 'slate', value: '#1e293b'},
        {name: 'dark', value: '#0f172a'},
      ],
    },
    docs: {
      description: {
        component:
          'Archival dossier card: warm manila stock with real paper textures, clipped corner, bracketed classification stamp, and file-reference micro-header (Microfilm Dark).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className='vd-blotter min-h-[480px] w-full min-w-[360px] p-8'>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    classification: {
      control: {type: 'select'},
      options: ['unclassified', 'confidential', 'secret', 'top-secret'],
      description: 'Security classification level with color-coded styling',
    },
    title: {
      control: 'text',
      description: 'Document title displayed prominently at the top',
    },
    date: {
      control: 'text',
      description: 'Document date shown in header',
    },
    location: {
      control: 'text',
      description: 'Optional location information',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes for customization',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Unclassified: Story = {
  args: {
    classification: 'unclassified',
    title: 'INCIDENT REPORT',
    date: 'JULY 1947',
    location: 'Roswell, New Mexico',
    children: (
      <div className='space-y-4'>
        <p className='text-gray-800 leading-relaxed'>
          Initial report of unusual aerial phenomena observed in the southwestern United States.
          Multiple civilian witnesses reported strange lights and objects in the sky.
        </p>
        <div className='grid grid-cols-2 gap-4 mt-4'>
          <div>
            <span className='font-bold text-black'>WITNESSES:</span>
            <ul className='mt-2 text-sm text-gray-700'>
              <li>• William Brazel (Rancher)</li>
              <li>• Major Jesse Marcel</li>
              <li>• Glenn Dennis (Mortician)</li>
            </ul>
          </div>
          <div>
            <span className='font-bold text-black'>STATUS:</span>
            <p className='mt-2 text-sm text-gray-700'>Under Investigation</p>
          </div>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Unclassified document with standard green styling. Used for information that can be released to the public.',
      },
    },
  },
}

export const Confidential: Story = {
  args: {
    classification: 'confidential',
    title: 'PERSONNEL EVALUATION',
    date: 'MARCH 1963',
    location: 'Edwards Air Force Base',
    children: (
      <div className='space-y-4'>
        <p className='text-gray-800 leading-relaxed'>
          Quarterly evaluation of test pilot performance and security clearance review. Contains
          sensitive information regarding experimental aircraft programs.
        </p>
        <div className='border-l-4 border-blue-400 pl-4 bg-blue-50 p-3 rounded'>
          <p className='text-sm text-blue-800 font-semibold'>
            CONFIDENTIAL INFORMATION - RESTRICTED ACCESS
          </p>
          <p className='text-xs text-blue-700 mt-1'>
            Not authorized for release to foreign nationals
          </p>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Confidential document with blue styling. Contains information that could damage national security if disclosed.',
      },
    },
  },
}

export const Secret: Story = {
  args: {
    classification: 'secret',
    title: 'OPERATION BLUE BOOK',
    date: 'NOVEMBER 1952',
    location: 'Wright-Patterson AFB',
    children: (
      <div className='space-y-4'>
        <p className='text-gray-800 leading-relaxed'>
          Classified analysis of unidentified flying object reports. This document contains
          methodologies and findings that are restricted to authorized personnel only.
        </p>
        <div className='border-l-4 border-orange-500 pl-4 bg-orange-50 p-3 rounded'>
          <p className='text-sm text-orange-800 font-semibold'>
            SECRET CLASSIFICATION - NEED TO KNOW BASIS
          </p>
          <p className='text-xs text-orange-700 mt-1'>
            Unauthorized disclosure subject to criminal penalties
          </p>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Secret document with orange styling. Contains information that could cause serious damage to national security.',
      },
    },
  },
}

export const TopSecret: Story = {
  args: {
    classification: 'top-secret',
    title: 'PROJECT SIGN ANALYSIS',
    date: 'DECEMBER 1947',
    location: 'Pentagon - Classified',
    children: (
      <div className='space-y-4'>
        <p className='text-gray-800 leading-relaxed'>
          Highest classification analysis of extraordinary aerial phenomena. Contains technical data
          and strategic assessments of potential national security implications.
        </p>
        <div className='border-l-4 border-red-600 pl-4 bg-red-50 p-3 rounded'>
          <p className='text-sm text-red-800 font-semibold'>
            TOP SECRET - COMPARTMENTALIZED ACCESS
          </p>
          <p className='text-xs text-red-700 mt-1'>
            Extremely sensitive - unauthorized access prohibited
          </p>
        </div>
        <div className='mt-4 p-3 bg-gray-100 rounded border-2 border-dashed border-gray-400'>
          <p className='text-xs text-gray-600 text-center'>[REDACTED TECHNICAL SPECIFICATIONS]</p>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Top Secret document with red styling. Contains information that could cause exceptionally grave damage to national security.',
      },
    },
  },
}

export const WithoutLocation: Story = {
  args: {
    classification: 'secret',
    title: 'MEMORANDUM FOR RECORD',
    date: 'AUGUST 1950',
    children: (
      <div className='space-y-4'>
        <p className='text-gray-800 leading-relaxed'>
          Internal memorandum documenting discussion points from classified briefing. No specific
          location disclosed for operational security.
        </p>
        <div className='text-sm text-gray-700'>
          <strong>SUBJECT:</strong> Anomalous radar contacts - southwestern sector
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Document without location specified. Shows how the component handles optional location prop.',
      },
    },
  },
}

export const ClassificationBadgeShowcase: Story = {
  render: () => (
    <div className='space-y-6 p-6'>
      <h3 className='text-lg font-bold text-gray-200 mb-4'>Classification Badge Variants</h3>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <ClassificationBadge level='unclassified' />
            <span className='text-gray-300 text-sm'>Unclassified</span>
          </div>
          <div className='flex items-center space-x-4'>
            <ClassificationBadge level='confidential' />
            <span className='text-gray-300 text-sm'>Confidential</span>
          </div>
        </div>
        <div className='space-y-4'>
          <div className='flex items-center space-x-4'>
            <ClassificationBadge level='secret' />
            <span className='text-gray-300 text-sm'>Secret</span>
          </div>
          <div className='flex items-center space-x-4'>
            <ClassificationBadge level='top-secret' />
            <span className='text-gray-300 text-sm'>Top Secret</span>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Showcase of all classification badge variants available. Each badge has distinct colors and styling based on security level.',
      },
    },
  },
}

export const InteractivePlayground: Story = {
  args: {
    classification: 'confidential',
    title: 'INTERACTIVE DOCUMENT',
    date: 'CURRENT DATE',
    location: 'Your Location',
    children: (
      <div className='space-y-4'>
        <p className='text-gray-800 leading-relaxed'>
          Use the controls below to experiment with different document configurations. Try changing
          the classification level, title, date, and location to see how the component adapts to
          different scenarios.
        </p>
        <div className='p-4 bg-blue-50 border border-blue-200 rounded'>
          <p className='text-sm text-blue-800'>
            <strong>Tip:</strong> This interactive story demonstrates the flexibility of the
            VintageDocumentCard component for various government document types.
          </p>
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground story that allows testing all props using Storybook controls. Experiment with different values to see real-time changes.',
      },
    },
  },
}
