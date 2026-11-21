import type {Meta, StoryObj} from '@storybook/react'
import {ClassifiedDocument} from './ClassifiedDocument'
import {PhotoCaption} from './PhotoCaption'

const meta: Meta<typeof ClassifiedDocument> = {
  title: 'Documents/ClassifiedDocument',
  component: ClassifiedDocument,
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'archive',
      values: [
        {name: 'archive', value: '#2c1810'},
        {name: 'slate', value: '#1e293b'},
        {name: 'paper', value: '#e8e5de'},
      ],
    },
    docs: {
      description: {
        component:
          'Aged classified dossier composition — UCASEWEIL case file + Gordon Cooper Mercury 9 debrief with taped polaroids and PhotoCaption footers. Ported from Dropover classified-document prototype.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

/** Full two-document stack. */
export const Default: Story = {}

/** Isolated polaroid caption anatomy. */
export const CaptionOnly: StoryObj<typeof PhotoCaption> = {
  render: () => (
    <div className='w-48 bg-white p-3 pb-6 shadow-xl'>
      <div className='h-28 w-full bg-gradient-to-br from-gray-700 to-black' />
      <PhotoCaption labelTop='AERIAL RECON' captionNote='Unidentified object - 14:30 hrs' />
    </div>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Standalone PhotoCaption under a mock polaroid plate.',
      },
    },
  },
}
