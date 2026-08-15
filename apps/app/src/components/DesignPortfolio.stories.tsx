import type {Meta, StoryObj} from '@storybook/react'
import {DesignPortfolio} from './DesignPortfolio'

const meta = {
  title: 'Components/Portfolio/DesignPortfolio',
  component: DesignPortfolio,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DesignPortfolio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
