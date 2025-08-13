import type {Meta, StoryObj} from '@storybook/react'
import {Suspense} from 'react'
import {HomeAnimated} from './home-animated'

const meta = {
  title: 'Layouts/Home/HomeAnimated',
  component: HomeAnimated,
  parameters: {
    layout: 'fullscreen',
    canvas: {
      backgroundColor: '#000000',
    },
    viewport: {
      defaultViewport: 'desktop',
    },
    chromatic: {
      delay: 1500,
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
        }}>
        <Suspense fallback={<div>Loading...</div>}>
          <Story />
        </Suspense>
      </div>
    ),
  ],
} satisfies Meta<typeof HomeAnimated>

export default meta
type Story = StoryObj<typeof meta>

export const Base: Story = {}
