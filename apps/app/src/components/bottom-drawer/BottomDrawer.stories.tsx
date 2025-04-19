import type {Meta, StoryObj} from '@storybook/react'
import {BottomDrawer} from './BottomDrawer'

const meta = {
  title: 'Components/BottomDrawer',
  component: BottomDrawer,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof BottomDrawer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const InContainer: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Story />
      </div>
    ),
  ],
}

export const CustomSize: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
        }}>
        <div style={{maxWidth: '400px', width: '100%'}}>
          <Story />
        </div>
      </div>
    ),
  ],
}
