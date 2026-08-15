import type {Meta, StoryObj} from '@storybook/react'
import {DocumentPanelHeader, type SaveState} from './document-panel-header'

const meta = {
  title: 'Components/DocumentPanel/DocumentPanelHeader',
  component: DocumentPanelHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='dp-shell dp-grain w-full max-w-2xl p-4'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DocumentPanelHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Research Notebook',
    saveState: 'idle' as SaveState,
    onToggleTitleMenu: () => {},
    onAdd: () => {},
    onOverflow: () => {},
  },
}

export const Saving: Story = {
  args: {
    title: 'Research Notebook',
    saveState: 'saving' as SaveState,
    onToggleTitleMenu: () => {},
    onAdd: () => {},
    onOverflow: () => {},
  },
}

export const Saved: Story = {
  args: {
    title: 'Research Notebook',
    saveState: 'saved' as SaveState,
    onToggleTitleMenu: () => {},
    onAdd: () => {},
    onOverflow: () => {},
  },
}
