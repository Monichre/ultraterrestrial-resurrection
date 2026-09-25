import type {Meta, StoryObj} from '@storybook/react'
import {
  CoreNodeContainer,
  CoreNodeTop,
  CoreNodeContent,
  CoreNodeBottom,
  CoreNodePill,
  OracleMode,
} from './core-node-ui'

const meta: Meta<typeof CoreNodeContainer> = {
  title: 'Mindmap/Nodes/CoreNodeUI',
  component: CoreNodeContainer,
  tags: ['autodocs'],
  parameters: {layout: 'centered'},
}

export default meta
type Story = StoryObj<typeof CoreNodeContainer>

export const Basic: Story = {
  render: () => (
    <CoreNodeContainer id='demo' className='w-96'>
      <CoreNodeTop>
        <CoreNodePill label='Entity' />
      </CoreNodeTop>
      <CoreNodeContent>
        <div className='text-neutral-200 text-sm'>Core content area</div>
      </CoreNodeContent>
      <CoreNodeBottom>
        <span className='text-neutral-400 text-xs'>Footer actions</span>
      </CoreNodeBottom>
      <OracleMode image={{url: '/placeholder.svg'}} />
    </CoreNodeContainer>
  ),
}
