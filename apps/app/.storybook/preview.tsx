import type {Preview} from '@storybook/react'
import React from 'react'
import '../src/app/globals.css'
// import '@xyflow/react/dist/style.css'
import {ThemeProvider} from '../src/contexts/theme-provider'
import {lukasSans, monumentGrotesk, monumentGroteskMono, neueHaasGrotesk} from '../src/app/fonts'
import {Just_Another_Hand} from 'next/font/google'

const justAnotherHand = Just_Another_Hand({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-just-another-hand',
})

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
      hash: '',
    },
  })
}

const preview: Preview = {
  parameters: {
    // Enhanced viewport configuration

    viewport: {
      defaultViewport: 'desktop',
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1200px',
            height: '800px',
          },
        },
        wide: {
          name: 'Wide',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
      },
    },
    layout: 'fullscreen',
    // Enhanced controls configuration
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      sort: 'requiredFirst',
    },
    // Enhanced actions configuration
    actions: {
      argTypesRegex: '^on[A-Z].*',
      handles: ['click', 'submit', 'change', 'focus', 'blur'],
    },
    // Enhanced backgrounds
    backgrounds: {
      default: 'dark',
      values: [
        {name: 'dark', value: '#0f172a'},
        {name: 'slate', value: '#1e293b'},
        {name: 'light', value: '#ffffff'},
        {name: 'black', value: '#000000'},
      ],
    },
    // Enhanced docs configuration
    docs: {
      toc: true,
      source: {
        state: 'open',
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
          <div
            className={`${neueHaasGrotesk.variable} ${monumentGrotesk.variable} ${monumentGroteskMono.variable} ${lukasSans.variable} ${justAnotherHand.variable} dark w-[100vw] h-[100vh] bg-black p-4 flex flex-col justify-center items-center`}>
            <Story />
          </div>
        </ThemeProvider>
      )
    },
  ],

  tags: ['autodocs'],
}

export default preview
