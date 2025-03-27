import type {Preview} from '@storybook/react'
import React from 'react'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
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
        <div className='w-full h-screen flex items-center justify-center'>
          <Story />
        </div>
      )
    },
  ],
}

export default preview
