import type { Meta, StoryObj } from '@storybook/react'
import NightStudioB from './NightStudioB'

const meta: Meta<typeof NightStudioB> = {
  title: 'Design Sandbox/Night Studio (B)',
  component: NightStudioB,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Downloaded design artifact (`~/Downloads/react-app (1).js`). Second variant of the Night Studio "Stewarding Kingdom Voices" scene — static composition, no Re-Draft interaction or drafting animation. Original BrowserRouter was stripped (single screen); injected CSS is scoped to a `.nsb` wrapper and removed on unmount.',
      },
    },
  },
}

export default meta

type Story = StoryObj<typeof meta>

export const Studio: Story = {}
