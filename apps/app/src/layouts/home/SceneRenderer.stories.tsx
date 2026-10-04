import type {Meta, StoryObj} from '@storybook/react'
import {Suspense} from 'react'
import {SceneRenderer} from './SceneRenderer'

const meta = {
  title: 'Layouts/Home/SceneRenderer',
  component: SceneRenderer,
  parameters: {
    layout: 'fullscreen',
    canvas: {
      backgroundColor: '#000000',
    },
    viewport: {
      defaultViewport: 'desktop',
    },
    chromatic: {
      delay: 1200,
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
} satisfies Meta<typeof SceneRenderer>

export default meta
type Story = StoryObj<typeof meta>

export const Base: Story = {
  args: {mousePosition: {x: 0, y: 0}},
}
