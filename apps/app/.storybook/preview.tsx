import type {Preview} from '@storybook/react'
import React from 'react'
import '../src/app/globals.css'
import '@xyflow/react/dist/style.css'
import {ThemeProvider} from '../src/contexts/theme-provider'

// Mock window.location for Storybook environment
if (typeof window !== 'undefined' && !window.location) {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: {
      href: 'http://localhost:6006',
      origin: 'http://localhost:6006',
      protocol: 'http:',
      host: 'localhost:6006',
      hostname: 'localhost',
      port: '6006',
      pathname: '/',
      search: '',
      hash: ''
    }
  })
}
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
        <ThemeProvider
          attribute='class'
          forcedTheme='dark'
          defaultTheme='dark'
          enableSystem={false}
          // enableSystem
          // disableTransitionOnChange
        >
          <div className='w-[100vw] h-[100vh] bg-black p-4 flex flex-col justify-center items-center'>
            <Story />
          </div>
        </ThemeProvider>
      )
    },
  ],

  tags: ['autodocs'],
}

export default preview
