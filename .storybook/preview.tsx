import type {Preview} from '@storybook/react'
import React from 'react'
import '../src/app/globals.css'
import '@xyflow/react/dist/style.css'

const preview: Preview = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  decorators: [
    // 👇 Defining the decorator in the preview file applies it to all stories
    (Story, {parameters}) => {
      return (
        <div className='w-[100vw] h-[100vh] bg-black p-4 flex flex-col justify-center items-center'>
          <Story />
        </div>
      )
    },
  ],

  tags: ['autodocs'],
}

export default preview
