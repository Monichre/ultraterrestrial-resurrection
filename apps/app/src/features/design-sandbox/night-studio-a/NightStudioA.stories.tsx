import type { Meta, StoryObj } from '@storybook/react'
import NightStudioA from './NightStudioA'

const meta: Meta<typeof NightStudioA> = {
  title: 'Design Sandbox/Night Studio (A)',
  component: NightStudioA,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Downloaded design artifact (`~/Downloads/react-app.js`). "Night Studio — Stewarding Kingdom Voices": dark drafting-desk scene with hand-lettered marker headline, SVG drafting guides, and CSS desk tools. Interactive variant — click the headline or the Re-Draft button to replay the draft-in animation. Original BrowserRouter was stripped (single screen); injected CSS is scoped to a `.nsa` wrapper and removed on unmount.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Studio: Story = {}
