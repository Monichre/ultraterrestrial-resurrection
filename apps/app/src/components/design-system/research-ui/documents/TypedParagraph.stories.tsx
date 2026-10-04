import type {Meta, StoryObj} from '@storybook/react'
import TypedParagraph from './TypedParagraph'

const meta: Meta<typeof TypedParagraph> = {
  title: 'Documents/TypedParagraph',
  component: TypedParagraph,
  parameters: {
    layout: 'centered',
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
          'Typewriter-style paragraph component with authentic monospace font styling. Features Courier New typography with custom letter spacing for realistic typed document appearance.',
      },
    },
  },
  argTypes: {
    children: {
      control: 'text',
      description: 'The text content to display in typewriter style',
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

export const Default: Story = {
  args: {
    children:
      'ATIC logs recorded fast-moving lights reportedly skirting the Capitol dome before vanishing at 1 am.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Default typed paragraph with standard government report text styling.',
      },
    },
  },
}

export const ShortText: Story = {
  args: {
    children: 'Classification: CONFIDENTIAL',
  },
  parameters: {
    docs: {
      description: {
        story: 'Short typed text, suitable for headers, labels, or brief statements.',
      },
    },
  },
}

export const LongReport: Story = {
  args: {
    children: `Examples note: repeated returns near the Washington National Airport paced and intervened with interceptor formation for 20 miles, grouped southward in a V formation. At 2 am, radar signatures resumed, entailing 40 minute intercepts involving unidentified flights at 11,000 feet, erratic courses over Andrews AFB and the White House. Blips merged into another V heading over the river mouth.`,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Longer typed report demonstrating how the component handles multi-sentence paragraphs typical of government documents.',
      },
    },
  },
}

export const MultipleReports: Story = {
  render: (args) => (
    <div className='space-y-6 max-w-2xl'>
      <TypedParagraph {...args}>
        INCIDENT REPORT #1: UFO sightings over Washington D.C. airspace documented by multiple radar
        operators and visual witnesses.
      </TypedParagraph>
      <TypedParagraph {...args}>
        WITNESS STATEMENT: Air traffic controller reports "bright objects moving in formation at
        impossible speeds" during night shift operations.
      </TypedParagraph>
      <TypedParagraph {...args}>
        CLASSIFICATION: This report contains information affecting the national defense of the
        United States within the meaning of the Espionage Laws.
      </TypedParagraph>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Multiple typed paragraphs showing how they work together to form a complete document structure.',
      },
    },
  },
}

export const WithCustomStyling: Story = {
  render: (args) => (
    <div className='space-y-4'>
      <TypedParagraph {...args} className='text-red-800 dark:text-red-400'>
        URGENT: Immediate attention required for classified material handling procedures.
      </TypedParagraph>
      <TypedParagraph {...args} className='text-blue-800 dark:text-blue-400'>
        REFERENCE: Cross-reference with Project Blue Book files for correlation analysis.
      </TypedParagraph>
      <TypedParagraph {...args} className='text-green-800 dark:text-green-400'>
        APPROVED: Documentation review completed and authorized for restricted distribution.
      </TypedParagraph>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Typed paragraphs with custom color styling for different priority levels or document sections.',
      },
    },
  },
}

export const InteractivePlayground: Story = {
  args: {
    children: 'Type your own government report text here...',
    className: '',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground for testing different text content and styling. Use the controls to experiment with various report texts.',
      },
    },
  },
}
