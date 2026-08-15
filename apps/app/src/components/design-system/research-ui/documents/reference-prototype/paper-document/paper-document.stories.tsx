import type {Meta, StoryObj} from '@storybook/react'
import {PaperDocument, paperDocuments, paperDocumentList} from './index'

const meta: Meta<typeof PaperDocument> = {
  title: 'Design Sources/Reference Prototype/Paper Document',
  component: PaperDocument,
  parameters: {
    layout: 'centered',
    backgrounds: {default: 'dark'},
  },
}

export default meta
type Story = StoryObj<typeof PaperDocument>

export const Ashfield: Story = {
  args: {
    variant: paperDocuments.ashfield,
  },
}

export const Undefeat: Story = {
  args: {
    variant: paperDocuments.undefeat,
  },
}

export const Ultrerial: Story = {
  args: {
    variant: paperDocuments.ultrerial,
  },
}

export const Ulteresal: Story = {
  args: {
    variant: paperDocuments.ulteresal,
  },
}

export const Undectel: Story = {
  args: {
    variant: paperDocuments.undectel,
  },
}

export const WithMotion: Story = {
  args: {
    variant: paperDocuments.ashfield,
    enableMotion: true,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className='grid max-w-6xl grid-cols-1 gap-8 p-8 md:grid-cols-2 lg:grid-cols-3'>
      {paperDocumentList.map((variant) => (
        <PaperDocument key={variant.id} variant={variant} className='w-full' />
      ))}
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}
