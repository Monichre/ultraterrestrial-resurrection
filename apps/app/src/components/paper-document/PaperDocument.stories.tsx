import type { Meta, StoryObj } from '@storybook/react'
import { PaperDocument } from './PaperDocument'

const meta: Meta<typeof PaperDocument> = {
  title: 'Documents/PaperDocument',
  component: PaperDocument,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'void',
      values: [
        { name: 'void', value: '#0a0b0d' },
        { name: 'light', value: '#F5F7F9' },
        { name: 'white', value: '#FFFFFF' },
      ],
    },
    docs: {
      description: {
        component:
          'Archival paper document with warm stock, fiber tooth, stacked under-sheets, and optional field-note meta. Uses `/textures/paper/*` for material feel.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    paragraphs: { control: 'object' },
    emphasizedPhrases: { control: 'object' },
    signatureName: { control: 'text' },
    signatureTitle: { control: 'text' },
    signatureImageUrl: { control: 'text' },
    variant: {
      control: 'select',
      options: ['letter', 'research', 'memo'],
    },
    lightDesk: { control: 'boolean' },
    embedded: { control: 'boolean' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
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
      { text: 'cannot be explained by conventional means', position: 0 },
      { text: 'This is not about belief. This is about evidence.', position: 3 },
    ],
    signatureName: 'Sen. John M.',
    signatureTitle: 'Chair, Senate Intelligence Committee',
    meta: {
      date: '14 Jun 2024',
      classification: 'Unverified',
    },
  },
}

export const ResearchNote: Story = {
  args: {
    variant: 'research',
    title: 'Field Research Notes — Phoenix, AZ',
    paragraphs: [
      'The events of March 13, 1997 remain one of the most witnessed and documented mass sightings in modern history.',
      'Thousands of residents reported observing a V-shaped formation of lights traversing the night sky. The lights maintained perfect formation throughout their trajectory.',
      'What distinguishes this event from others is the sheer volume of credible witnesses, including pilots, police officers, and military personnel.',
      'The official explanation of military flares dropped during exercises fails to account for the initial sighting, which occurred over an hour earlier and displayed entirely different characteristics.',
      'Further investigation is warranted.',
    ],
    emphasizedPhrases: [
      { text: 'most witnessed and documented mass sightings', position: 0 },
      { text: 'Further investigation is warranted.', position: 4 },
    ],
    signatureName: 'Dr. Sarah Chen',
    signatureTitle: 'Lead Researcher, Atmospheric Phenomena Division',
    meta: {
      date: '13 Mar 1997',
      location: 'Phoenix metro · 33.4°N',
      classification: 'Corroborated',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Field research note on warm textured stock with meta band (date, locus, evidentiary state) and drafting-desk ground.',
      },
    },
  },
}

export const MinimalContent: Story = {
  args: {
    variant: 'memo',
    title: 'Brief Memo',
    paragraphs: [
      'Meeting scheduled for 0800 hours.',
      'All personnel with appropriate clearance are required to attend.',
      'Topics to be discussed are classified.',
    ],
    emphasizedPhrases: [],
    signatureName: 'Col. Davis',
    signatureTitle: 'Operations Director',
    meta: {
      date: 'Today',
      classification: 'Contested',
    },
  },
}

export const LightDesk: Story = {
  args: {
    variant: 'research',
    lightDesk: true,
    title: 'Field Research Notes — Phoenix, AZ',
    paragraphs: [
      'The events of March 13, 1997 remain one of the most witnessed and documented mass sightings in modern history.',
      'Further investigation is warranted.',
    ],
    emphasizedPhrases: [
      { text: 'most witnessed and documented mass sightings', position: 0 },
      { text: 'Further investigation is warranted.', position: 1 },
    ],
    signatureName: 'Dr. Sarah Chen',
    signatureTitle: 'Lead Researcher, Atmospheric Phenomena Division',
    meta: {
      date: '13 Mar 1997',
      location: 'Phoenix, AZ',
      classification: 'Corroborated',
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
    emphasizedPhrases: [{ text: 'Third paragraph to emphasize.', position: 2 }],
    signatureName: 'Your Name',
    signatureTitle: 'Your Title',
    variant: 'letter',
  },
}
