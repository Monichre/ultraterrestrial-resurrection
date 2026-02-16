import type {Meta, StoryObj} from '@storybook/react'
import {Agent} from './agent'
import {Toaster} from 'sonner'

const meta = {
  title: 'Pages/Prometheus/Agent',
  component: Agent,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {default: 'dark', values: [{name: 'dark', value: '#0A0A0B'}]},
    chromatic: {
      delay: 500,
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#0A0A0B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}>
        <Toaster />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Agent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
