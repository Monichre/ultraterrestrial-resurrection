import type {Meta, StoryObj} from '@storybook/react'
import {SplitBuildTools} from './SplitBuildTools'

const meta = {
  title: 'Marketing/Split Build Tools',
  component: SplitBuildTools,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {default: 'dark', values: [{name: 'dark', value: '#0B0C0F'}]},
  },
} satisfies Meta<typeof SplitBuildTools>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    productName: 'Ray-1',
    docsUrl: '#',
  },
}
