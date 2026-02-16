import type {Meta, StoryObj} from '@storybook/react'
import PaperDocument from './PaperDocument'

const meta: Meta<typeof PaperDocument> = {
  title: 'Documents/PaperDocument',
  component: PaperDocument,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
      values: [
        {name: 'light', value: '#F5F7F9'},
        {name: 'white', value: '#FFFFFF'},
        {name: 'dark', value: '#1a1a1a'},
      ],
    },
    docs: {
      description: {
        component:
          'A paper document component with a stacked paper effect. Features a title, paragraphs with optional emphasized phrases, and a signature block. Perfect for letters, announcements, and formal communications.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The document title displayed at the top',
    },
    paragraphs: {
      control: 'object',
      description: 'Array of paragraph strings for the document content',
    },
    emphasizedPhrases: {
      control: 'object',
      description: 'Array of phrases to emphasize with their paragraph positions',
    },
    signatureName: {
      control: 'text',
      description: 'Name displayed in the signature block',
    },
    signatureTitle: {
      control: 'text',
      description: 'Title/role displayed below the name',
    },
    signatureImageUrl: {
      control: 'text',
      description: 'URL for the signature image',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Default paper document with sample content demonstrating the stacked paper effect and signature block.',
      },
    },
  },
}

export const UfoDisclosure: Story = {
  args: {
    title: 'Regarding Recent Disclosures',
    paragraphs: [
      'After careful consideration of all evidence presented to this committee, we must acknowledge that the phenomena observed cannot be explained by conventional means.',
      'The testimonies provided by military personnel, corroborated by radar data and sensor recordings, establish a pattern of encounters that defies our current understanding of aerospace technology.',
      'We have a responsibility to the American people to investigate these matters with the seriousness they deserve. The stigma surrounding this topic has hindered scientific inquiry for too long.',
      'This is not about belief. This is about evidence.',
      'Moving forward, we recommend the establishment of a dedicated office with proper security clearances and funding to pursue these investigations without prejudice.',
      'The truth, whatever it may be, belongs to the people. Our duty is to seek it without fear or favor.',
    ],
    emphasizedPhrases: [
      {text: 'cannot be explained by conventional means', position: 0},
      {text: 'This is not about belief. This is about evidence.', position: 3},
    ],
    signatureName: 'Sen. John M.',
    signatureTitle: 'Chair, Senate Intelligence Committee',
    signatureImageUrl: '/placeholder.svg',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A UFO disclosure-themed document demonstrating customization for government communications.',
      },
    },
  },
}

export const ResearchNote: Story = {
  args: {
    title: 'Field Research Notes - Phoenix, AZ',
    paragraphs: [
      'The events of March 13, 1997 remain one of the most witnessed and documented mass sightings in modern history.',
      'Thousands of residents reported observing a V-shaped formation of lights traversing the night sky. The lights maintained perfect formation throughout their trajectory.',
      'What distinguishes this event from others is the sheer volume of credible witnesses, including pilots, police officers, and military personnel.',
      'The official explanation of military flares dropped during exercises fails to account for the initial sighting, which occurred over an hour earlier and displayed entirely different characteristics.',
      'Further investigation is warranted.',
    ],
    emphasizedPhrases: [
      {text: 'most witnessed and documented mass sightings', position: 0},
      {text: 'Further investigation is warranted.', position: 4},
    ],
    signatureName: 'Dr. Sarah Chen',
    signatureTitle: 'Lead Researcher, Atmospheric Phenomena Division',
    signatureImageUrl: '/placeholder.svg',
  },
  parameters: {
    docs: {
      description: {
        story: 'A research note demonstrating use for scientific documentation and field reports.',
      },
    },
  },
}

export const MinimalContent: Story = {
  args: {
    title: 'Brief Memo',
    paragraphs: [
      'Meeting scheduled for 0800 hours.',
      'All personnel with appropriate clearance are required to attend.',
      'Topics to be discussed are classified.',
    ],
    emphasizedPhrases: [],
    signatureName: 'Col. Davis',
    signatureTitle: 'Operations Director',
    signatureImageUrl: '/placeholder.svg',
  },
  parameters: {
    docs: {
      description: {
        story:
          'A minimal paper document with brief content, demonstrating the component with less text.',
      },
    },
  },
}

export const InteractivePlayground: Story = {
  args: {
    title: 'Your Document Title',
    paragraphs: [
      'First paragraph of your document content.',
      'Second paragraph with more details.',
      'Third paragraph to emphasize.',
      'Final thoughts and conclusions.',
    ],
    emphasizedPhrases: [{text: 'Third paragraph to emphasize.', position: 2}],
    signatureName: 'Your Name',
    signatureTitle: 'Your Title',
    signatureImageUrl: '/placeholder.svg',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive playground for testing different content and configurations. Use the controls to customize the document.',
      },
    },
  },
}
