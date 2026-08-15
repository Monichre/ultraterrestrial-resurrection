import type {Meta, StoryObj} from '@storybook/react'
import {MarketingShowcase} from './MarketingShowcase'

const meta = {
  title: 'Marketing/Showcase',
  component: MarketingShowcase,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {default: 'dark', values: [{name: 'dark', value: '#0B0C0F'}]},
  },
} satisfies Meta<typeof MarketingShowcase>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
