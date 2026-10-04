import type {Meta, StoryObj} from '@storybook/react'
import {ChatResourceForm} from './chat-resource-form'

const meta = {
  title: 'Components/Forms/ChatResourceForm',
  component: ChatResourceForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className='w-[480px]'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChatResourceForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    onSubmit: (values, file) => {
      // eslint-disable-next-line no-console
      console.log('Form submitted:', {values, file})
    },
  },
}

export const Processing: Story = {
  args: {
    onSubmit: () => {},
    isProcessing: true,
  },
}
