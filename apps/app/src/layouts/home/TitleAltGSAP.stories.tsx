import type {Meta, StoryObj} from '@storybook/react'
import {Suspense} from 'react'
import {TitleAltGSAP} from './TitleAltGSAP'

const meta = {
  title: 'Layouts/Home/TitleAltGSAP',
  component: TitleAltGSAP,
  parameters: {
    layout: 'fullscreen',
    canvas: {
      backgroundColor: '#000000',
    },
    viewport: {
      defaultViewport: 'desktop',
    },
    chromatic: {
      delay: 600,
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
} satisfies Meta<typeof TitleAltGSAP>

export default meta
type Story = StoryObj<typeof meta>

export const Base: Story = {}
