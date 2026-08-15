import type {Meta, StoryObj} from '@storybook/react'
import {DocumentEditorCanvas} from './document-editor-canvas'

const meta = {
  title: 'Components/DocumentPanel/DocumentEditorCanvas',
  component: DocumentEditorCanvas,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='flex w-full justify-center p-6'>
        <div style={{width: '684px', maxWidth: '100%'}}>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof DocumentEditorCanvas>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onAddTag: () => {},
    onEdit: () => {},
  },
}
