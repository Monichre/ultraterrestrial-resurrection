import type {Meta, StoryObj} from '@storybook/nextjs'
import {TechnicalBrandGeometry} from './TechnicalBrandGeometry'

const meta = {
  title: 'Design System/Lab Prototypes/TechnicalBrandGeometry',
  component: TechnicalBrandGeometry,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TechnicalBrandGeometry>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
