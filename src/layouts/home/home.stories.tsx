import type { Meta, StoryObj } from '@storybook/react'
import { Suspense } from 'react'
import { Home } from './home'

const meta = {
  title: 'Layouts/Home',
  component: Home,
  parameters: {
    layout: 'fullscreen',
    canvas: {
      backgroundColor: '#000000',
    },
    viewport: {
      defaultViewport: 'desktop',
    },
    chromatic: {
      delay: 500, // Allow time for 3D components to initialize
      pauseAnimationAtEnd: true,
    },
  },
  decorators: [
    ( Story ) => (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: '#000000',
        overflow: 'hidden'
      }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Story />
        </Suspense>
      </div>
    )
  ],
} satisfies Meta<typeof Home>

export default meta
type Story = StoryObj<typeof meta>

export const Base: Story = {
  parameters: {
    chromatic: {
      delay: 1000 // Extra delay for initial load
    }
  }
}
