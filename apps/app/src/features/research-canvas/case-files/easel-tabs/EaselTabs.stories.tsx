import type {Meta, StoryObj} from '@storybook/react'
import {EaselTabs, EaselTabsList, EaselTabsTrigger, EaselTabsContent} from './EaselTabs'

const meta = {
  title: 'Case Files/EaselTabs',
  component: EaselTabs,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  args: {},
} satisfies Meta<typeof EaselTabs>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className='w-[600px] p-6'>
      <EaselTabs defaultValue='tab1'>
        <EaselTabsList>
          <EaselTabsTrigger value='tab1'>Evidence</EaselTabsTrigger>
          <EaselTabsTrigger value='tab2'>Notes</EaselTabsTrigger>
          <EaselTabsTrigger value='tab3'>Timeline</EaselTabsTrigger>
        </EaselTabsList>
        <EaselTabsContent value='tab1'>
          <div className='p-4 rounded-lg bg-background/50'>
            <h3 className='text-lg font-medium mb-2'>Evidence Collection</h3>
            <p className='text-sm text-muted-foreground'>
              Case evidence is displayed here. Upload documents, photos, and other relevant files.
            </p>
          </div>
        </EaselTabsContent>
        <EaselTabsContent value='tab2'>
          <div className='p-4 rounded-lg bg-background/50'>
            <h3 className='text-lg font-medium mb-2'>Investigation Notes</h3>
            <p className='text-sm text-muted-foreground'>
              Keep track of important observations and details about the case.
            </p>
          </div>
        </EaselTabsContent>
        <EaselTabsContent value='tab3'>
          <div className='p-4 rounded-lg bg-background/50'>
            <h3 className='text-lg font-medium mb-2'>Case Timeline</h3>
            <p className='text-sm text-muted-foreground'>
              Chronological sequence of events related to the investigation.
            </p>
          </div>
        </EaselTabsContent>
      </EaselTabs>
    </div>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <div className='w-[600px] p-6'>
      <EaselTabs defaultValue='tab1'>
        <EaselTabsList>
          <EaselTabsTrigger value='tab1'>
            <svg
              className='w-4 h-4 mr-2'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'>
              <title>Evidence Icon</title>
              <path
                d='M9 3H5C3.89543 3 3 3.89543 3 5V9M9 3H15M9 3V9M15 3H19C20.1046 3 21 3.89543 21 5V9M15 3V9M3 9V15M3 15V19C3 20.1046 3.89543 21 5 21H9M3 15H9M9 21H15M9 21V15M15 21H19C20.1046 21 21 20.1046 21 19V15M15 21V15M21 15V9M21 15H15M9 9H15M9 15H15'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            Evidence
          </EaselTabsTrigger>
          <EaselTabsTrigger value='tab2'>
            <svg
              className='w-4 h-4 mr-2'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'>
              <title>Notes Icon</title>
              <path
                d='M11 4H4C3.44772 4 3 4.44772 3 5V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V8C21 7.44772 20.5523 7 20 7H13M11 4L13 7M11 4V7H13M8 12H16M8 16H16'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            Notes
          </EaselTabsTrigger>
          <EaselTabsTrigger value='tab3'>
            <svg
              className='w-4 h-4 mr-2'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              aria-hidden='true'>
              <title>Timeline Icon</title>
              <path
                d='M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            Timeline
          </EaselTabsTrigger>
        </EaselTabsList>
        <EaselTabsContent value='tab1'>
          <div className='p-4 rounded-lg bg-background/50'>Content for Evidence tab</div>
        </EaselTabsContent>
        <EaselTabsContent value='tab2'>
          <div className='p-4 rounded-lg bg-background/50'>Content for Notes tab</div>
        </EaselTabsContent>
        <EaselTabsContent value='tab3'>
          <div className='p-4 rounded-lg bg-background/50'>Content for Timeline tab</div>
        </EaselTabsContent>
      </EaselTabs>
    </div>
  ),
}
