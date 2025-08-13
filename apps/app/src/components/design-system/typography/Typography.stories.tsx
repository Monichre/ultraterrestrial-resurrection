import type { Meta, StoryObj } from '@storybook/react'
import { Typography, Heading, SubHeading, DataLabel, DataValue, HandwrittenNote, Code } from './Typography'

const meta: Meta<typeof Typography> = {
  title: 'Design System/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A comprehensive typography system with dystopian UFO document styling, special effects, and data visualization elements.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'heading-main',
        'heading-distorted',
        'heading-classified',
        'subheading',
        'subheading-glitch',
        'data-label',
        'data-value',
        'coordinates',
        'timestamp',
        'handwritten',
        'annotation',
        'body',
        'body-small',
        'body-large',
        'button',
        'caption',
        'code',
        'blurred',
        'faded',
        'redacted',
      ],
      description: 'Typography variant with preset styling',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'],
      description: 'Text size override',
    },
    weight: {
      control: 'select',
      options: ['light', 'normal', 'medium', 'semibold', 'bold', 'black'],
      description: 'Font weight override',
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right', 'justify'],
      description: 'Text alignment',
    },
    transform: {
      control: 'select',
      options: ['none', 'uppercase', 'lowercase', 'capitalize'],
      description: 'Text transformation',
    },
    as: {
      control: 'text',
      description: 'HTML element to render as',
    },
    glitch: {
      control: 'boolean',
      description: 'Enable glitch effect animation',
    },
    rotation: {
      control: { type: 'range', min: -45, max: 45, step: 1 },
      description: 'Rotation angle in degrees',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Typography>

// Basic Typography Stories
export const Default: Story = {
  args: {
    children: 'The truth is out there, hidden in classified documents.',
  },
}

export const HeadingMain: Story = {
  args: {
    variant: 'heading-main',
    children: 'UFO DISCLOSURE',
    as: 'h1',
  },
  parameters: {
    docs: {
      description: {
        story: 'Main heading with large, bold styling perfect for document titles.',
      },
    },
  },
}

export const HeadingDistorted: Story = {
  args: {
    variant: 'heading-distorted',
    children: 'CLASSIFIED',
    as: 'h1',
  },
  parameters: {
    docs: {
      description: {
        story: 'Distorted heading with skewed transform effect for dramatic emphasis.',
      },
    },
  },
}

export const HeadingClassified: Story = {
  args: {
    variant: 'heading-classified',
    children: 'TOP SECRET',
    as: 'h1',
  },
  parameters: {
    docs: {
      description: {
        story: 'Classified document heading in warning red.',
      },
    },
  },
}

export const SubheadingWithGlitch: Story = {
  args: {
    variant: 'subheading-glitch',
    children: 'PROJECT BLUE BOOK',
    glitch: true,
    as: 'h2',
  },
  parameters: {
    docs: {
      description: {
        story: 'Subheading with optional glitch effect for corrupted data aesthetic.',
      },
    },
  },
}

export const DataElements: Story = {
  render: () => (
    <div className="space-y-4 p-6 bg-amber-50 border border-amber-200">
      <div className="flex justify-between">
        <DataLabel>CASE FILE NO.</DataLabel>
        <DataValue>UFO-1947-07-08-001</DataValue>
      </div>
      <div className="flex justify-between">
        <DataLabel>COORDINATES</DataLabel>
        <Typography variant="coordinates">33°23'45"N 106°28'35"W</Typography>
      </div>
      <div className="flex justify-between">
        <DataLabel>TIMESTAMP</DataLabel>
        <Typography variant="timestamp">1947-07-08 15:30:00 UTC</Typography>
      </div>
      <div className="flex justify-between">
        <DataLabel>CLASSIFICATION</DataLabel>
        <Typography variant="redacted">████████████</Typography>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Data elements for displaying structured information in documents.',
      },
    },
  },
}

export const HandwrittenNotes: Story = {
  render: () => (
    <div className="space-y-4 p-6 bg-white border-2 border-gray-300 shadow-lg">
      <Typography variant="body">
        Witness reported seeing unusual craft approximately 2300 hours.
      </Typography>
      <HandwrittenNote rotation={-2}>
        "Definitely not conventional aircraft" - Agent Smith
      </HandwrittenNote>
      <HandwrittenNote rotation={1}>
        Follow up required - investigate debris field
      </HandwrittenNote>
      <Typography variant="annotation" rotation={-1}>
        Note: Files classified under Project Blue Book
      </Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Handwritten annotations and notes with rotation for authentic document feel.',
      },
    },
  },
}

export const SpecialEffects: Story = {
  render: () => (
    <div className="space-y-8 p-6">
      <div>
        <h3 className="mb-2 font-semibold">Glitch Effect</h3>
        <Typography variant="heading-main" glitch>
          SIGNAL CORRUPTED
        </Typography>
      </div>
      
      <div>
        <h3 className="mb-2 font-semibold">Blurred Text</h3>
        <Typography variant="blurred">
          This text appears slightly out of focus, as if photographed poorly.
        </Typography>
      </div>
      
      <div>
        <h3 className="mb-2 font-semibold">Faded Text</h3>
        <Typography variant="faded">
          This text looks aged and faded over time.
        </Typography>
      </div>
      
      <div>
        <h3 className="mb-2 font-semibold">Redacted Information</h3>
        <Typography variant="body">
          The witness stated that{' '}
          <Typography variant="redacted" as="span">
            classified information removed
          </Typography>{' '}
          and then proceeded to describe the craft.
        </Typography>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Special text effects for creating authentic document aesthetics.',
      },
    },
  },
}

export const RotatedText: Story = {
  render: () => (
    <div className="space-y-6 p-12">
      <Typography rotation={-15}>Rotated left 15°</Typography>
      <Typography rotation={0}>Normal orientation</Typography>
      <Typography rotation={15}>Rotated right 15°</Typography>
      <Typography variant="data-label" rotation={-5}>
        CASE STAMP: APPROVED
      </Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Text with custom rotation angles for document stamp effects.',
      },
    },
  },
}

export const CodeAndMonospace: Story = {
  render: () => (
    <div className="space-y-4">
      <Code>const classified = "PROJECT_BLUE_BOOK";</Code>
      <Typography variant="data-value">
        ID: UFO-19470708-001
      </Typography>
      <Typography variant="coordinates">
        GPS: 33.396389, -106.475833
      </Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Code snippets and monospaced text for technical documentation.',
      },
    },
  },
}

// Convenience Component Stories
export const HeadingComponent: Story = {
  render: () => (
    <Heading>ROSWELL INCIDENT</Heading>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Convenience Heading component with preset styling.',
      },
    },
  },
}

export const SubHeadingComponent: Story = {
  render: () => (
    <SubHeading>Investigation Summary</SubHeading>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Convenience SubHeading component with preset styling.',
      },
    },
  },
}

// Typography Scale Demo
export const TypographyScale: Story = {
  render: () => (
    <div className="space-y-4">
      <Typography size="6xl" weight="black">6XL Heading</Typography>
      <Typography size="5xl" weight="bold">5XL Heading</Typography>
      <Typography size="4xl" weight="bold">4XL Heading</Typography>
      <Typography size="3xl" weight="bold">3XL Heading</Typography>
      <Typography size="2xl" weight="semibold">2XL Heading</Typography>
      <Typography size="xl" weight="semibold">XL Heading</Typography>
      <Typography size="lg">Large Body Text</Typography>
      <Typography size="base">Base Body Text</Typography>
      <Typography size="sm">Small Text</Typography>
      <Typography size="xs">Extra Small Text</Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete typography scale showing all available sizes.',
      },
    },
  },
}

// Document Layout Example
export const DocumentLayout: Story = {
  render: () => (
    <div className="max-w-2xl p-8 bg-amber-50 border border-amber-200 shadow-xl">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-red-600 pb-4">
        <Typography variant="heading-classified" as="h1" className="mb-2">
          CLASSIFIED DOCUMENT
        </Typography>
        <DataLabel>CASE FILE: UFO-1947-001</DataLabel>
      </div>
      
      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 border border-gray-300 bg-white/50">
        <div>
          <DataLabel>DATE</DataLabel>
          <DataValue>July 8, 1947</DataValue>
        </div>
        <div>
          <DataLabel>LOCATION</DataLabel>
          <Typography variant="coordinates">Roswell, NM</Typography>
        </div>
        <div>
          <DataLabel>REPORTING AGENT</DataLabel>
          <DataValue>Agent M. Scully</DataValue>
        </div>
        <div>
          <DataLabel>CLEARANCE LEVEL</DataLabel>
          <Typography variant="redacted">████████</Typography>
        </div>
      </div>
      
      {/* Content */}
      <SubHeading className="mb-4">Incident Summary</SubHeading>
      
      <Typography variant="body" className="mb-4">
        At approximately 1530 hours, multiple witnesses reported observing an unidentified flying object 
        in the vicinity of Roswell Army Air Field. The craft exhibited flight characteristics 
        inconsistent with known aircraft.
      </Typography>
      
      <HandwrittenNote rotation={-1} className="mb-4">
        "Unlike anything I've seen before" - Major J. Marcel
      </HandwrittenNote>
      
      <Typography variant="body" className="mb-6">
        Investigation teams were dispatched to the crash site. Recovery operations commenced at{' '}
        <Typography variant="redacted" as="span">████████████</Typography>{' '}
        hours under the direction of{' '}
        <Typography variant="redacted" as="span">████████████</Typography>.
      </Typography>
      
      {/* Footer */}
      <div className="border-t pt-4 mt-8">
        <Typography variant="timestamp" className="float-right">
          Document processed: 2024-01-15 14:30:00 UTC
        </Typography>
        <Typography variant="data-label">
          AUTHORIZATION: ████████████
        </Typography>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete document layout example using various typography components.',
      },
    },
  },
}