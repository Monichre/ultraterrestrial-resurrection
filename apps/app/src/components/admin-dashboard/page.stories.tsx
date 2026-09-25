import type {Meta, StoryObj} from '@storybook/nextjs'
import Page from './page'

const meta = {
  title: 'Components/AdminDashboard/Page',
  component: Page,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Page>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
