import type {Meta, StoryObj} from '@storybook/react'
import {Suspense} from 'react'
import {LovecraftQuote} from './LovecraftQuote'

const meta = {
  title: 'Layouts/Home/LovecraftQuote',
  component: LovecraftQuote,
  parameters: {
    layout: 'fullscreen',
    canvas: {
      backgroundColor: '#000000',
    },
    viewport: {
      defaultViewport: 'desktop',
    },
    chromatic: {
      delay: 500,
      pauseAnimationAtEnd: true,
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
          background: '#000000',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Story />
        </Suspense>
      </div>
    ),
  ],
} satisfies Meta<typeof LovecraftQuote>

export default meta
type Story = StoryObj<typeof meta>

export const Base: Story = {
  args: {trigger: true},
}
