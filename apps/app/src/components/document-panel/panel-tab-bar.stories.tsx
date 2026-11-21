import type {Meta, StoryObj} from '@storybook/react'
import {PanelTabBar} from './panel-tab-bar'
import {PANEL_TABS} from './lib/document-panel-data'

const meta = {
  title: 'Components/DocumentPanel/PanelTabBar',
  component: PanelTabBar,
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
} satisfies Meta<typeof PanelTabBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tabs: PANEL_TABS,
    activeTabId: 'notes',
    onSelect: () => {},
    onClose: () => {},
  },
}

export const InspectorTab: Story = {
  args: {
    tabs: PANEL_TABS,
    activeTabId: 'inspector',
    onSelect: () => {},
    onClose: () => {},
  },
}

export const ProvenanceTab: Story = {
  args: {
    tabs: PANEL_TABS,
    activeTabId: 'provenance',
    onSelect: () => {},
    onClose: () => {},
  },
}
