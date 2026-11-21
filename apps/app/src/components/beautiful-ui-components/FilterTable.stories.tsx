import type { Meta, StoryObj } from '@storybook/nextjs'
import FilterTable from './FilterTable'
import { beautifulUiParameters, withBeautifulUiTheme } from './story-decorators'

const meta = {
  title: 'Design System/Beautiful UI/Filter Table',
  component: FilterTable,
  decorators: [
    withBeautifulUiTheme,
    (Story) => (
      <div className='max-w-[640px]'>
        <Story />
      </div>
    ),
  ],
  parameters: beautifulUiParameters,
  tags: ['autodocs'],
} satisfies Meta<typeof FilterTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Dark: Story = {
  parameters: {
    beautifulUiTheme: 'dark',
    backgrounds: { default: 'dark-canvas' },
  },
}
