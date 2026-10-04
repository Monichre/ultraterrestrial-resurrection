import type {Meta, StoryObj} from '@storybook/react'
import TopSecretBanner from './TopSecretBanner'

const meta: Meta<typeof TopSecretBanner> = {
  title: 'Documents/TopSecretBanner',
  component: TopSecretBanner,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'vintage',
      values: [
        {name: 'vintage', value: '#2c1810'},
        {name: 'slate', value: '#1e293b'},
        {name: 'dark', value: '#0f172a'},
      ],
    },
    docs: {
      description: {
        component:
          'Top Secret classification banner component with authentic government styling. Features bold typography, distinctive border, and hover effects for use in classified document headers and stamps.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default TOP SECRET banner with standard styling and hover scale effect.',
      },
    },
  },
}

export const DocumentHeader: Story = {
  render: () => (
    <div className='w-full max-w-2xl mx-auto'>
      <div className='flex justify-between items-start mb-6'>
        <TopSecretBanner />
        <div className='text-right'>
          <div className='text-sm font-mono text-gray-700 dark:text-gray-300'>
            Classification: TOP SECRET
          </div>
          <div className='text-xs font-mono text-gray-500 dark:text-gray-400'>
            Authorized Personnel Only
          </div>
        </div>
      </div>
      <div className='border-t-2 border-gray-800 dark:border-gray-300 pt-4'>
        <h1 className='text-xl font-bold text-gray-900 dark:text-gray-100 mb-2'>
          CLASSIFIED DOCUMENT HEADER
        </h1>
        <p className='text-gray-700 dark:text-gray-300'>
          This demonstrates how the TOP SECRET banner appears in a document header context.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'TOP SECRET banner used in a document header layout, showing typical placement and context.',
      },
    },
  },
}

export const MultipleBanners: Story = {
  render: () => (
    <div className='space-y-6 p-4'>
      <div className='text-center'>
        <TopSecretBanner />
      </div>
      <div className='flex justify-center'>
        <div className='transform rotate-2'>
          <TopSecretBanner />
        </div>
      </div>
      <div className='flex justify-center'>
        <div className='transform -rotate-1'>
          <TopSecretBanner />
        </div>
      </div>
      <div className='text-center'>
        <TopSecretBanner />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Multiple TOP SECRET banners with various rotations, simulating stamps and headers throughout a classified document.',
      },
    },
  },
}

export const WithContent: Story = {
  render: () => (
    <div className='max-w-md mx-auto p-6 bg-amber-50 dark:bg-gray-800 border border-amber-200 dark:border-gray-700 shadow-lg'>
      <div className='text-center mb-4'>
        <TopSecretBanner />
      </div>
      <div className='space-y-3 text-sm'>
        <div className='font-mono text-gray-900 dark:text-gray-100'>
          <strong>MEMO:</strong> Unidentified Aerial Phenomena
        </div>
        <div className='text-gray-700 dark:text-gray-300'>
          Multiple witnesses reported unusual aircraft behavior over restricted airspace.
          Investigation ongoing under Project [REDACTED].
        </div>
        <div className='text-xs text-gray-500 dark:text-gray-400 font-mono'>
          Classification Level: TOP SECRET//NOFORN
        </div>
      </div>
      <div className='text-center mt-4'>
        <TopSecretBanner />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'TOP SECRET banner integrated with document content, showing how it frames classified information.',
      },
    },
  },
}
