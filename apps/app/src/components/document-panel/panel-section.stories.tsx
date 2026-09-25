import type {Meta, StoryObj} from '@storybook/react'
import {PanelSection} from './panel-section'

const meta = {
  title: 'Components/DocumentPanel/PanelSection',
  component: PanelSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='dp-shell dp-grain w-full max-w-md p-4'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PanelSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    id: 'dp-example',
    label: 'Linked Records',
    calloutNumber: 1,
    open: true,
    onToggle: () => {},
    children: (
      <div className='dp-record-grid'>
        <div className='dp-record'>
          <span className='dp-record-title'>Sample Record</span>
          <span className='dp-record-meta'>Document &middot; 1947</span>
        </div>
      </div>
    ),
  },
}

export const Collapsed: Story = {
  args: {
    id: 'dp-example-collapsed',
    label: 'Quick Notes',
    calloutNumber: 2,
    open: false,
    onToggle: () => {},
    children: <p>Hidden content</p>,
  },
}

export const WithAction: Story = {
  args: {
    id: 'dp-example-action',
    label: 'Related Notes',
    calloutNumber: 3,
    open: true,
    onToggle: () => {},
    action: (
      <button type='button' className='dp-section-action'>
        + Add
      </button>
    ),
    children: (
      <div className='dp-related-list'>
        <div className='dp-related-row'>Sample related note</div>
      </div>
    ),
  },
}
