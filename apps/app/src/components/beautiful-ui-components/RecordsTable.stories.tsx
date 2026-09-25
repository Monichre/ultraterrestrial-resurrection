import type { Meta, StoryObj } from '@storybook/nextjs'
import RecordsTable from './RecordsTable'
import { beautifulUiParameters, withBeautifulUiTheme } from './story-decorators'

const meta = {
  title: 'Design System/Beautiful UI/Records Table',
  component: RecordsTable,
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
} satisfies Meta<typeof RecordsTable>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Dark: Story = {
  parameters: {
    beautifulUiTheme: 'dark',
    backgrounds: { default: 'dark-canvas' },
  },
}
