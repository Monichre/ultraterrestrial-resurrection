import type {Preview} from '@storybook/react'
import React from 'react'
import '../src/app/globals.css'
import '../src/app/research-ui.css'
import '@xyflow/react/dist/style.css'
import {ThemeProvider} from '../src/contexts/theme-provider'
import {
  FONT_LUKAS_SANS,
  FONT_MONUMENT_GROTESK,
  FONT_MONUMENT_GROTESK_MONO,
  FONT_NEUE_HAAS_GROTESK,
  FONT_JUST_ANOTHER_HAND,
  FONT_JET_BRAINS_MONO,
  FONT_MARTIAN_MONO,
  FONT_NOTO_SANS,
  FONT_SPECIAL_ELITE,
  FONT_ANTON,
  FONT_CAVEAT,
  FONT_SPACE_GROTESK,
  FONT_LEAGUE_SPARTAN,
} from '../src/app/fonts'
import {create} from '@storybook/theming'
import {withReferenceAssets} from './decorators/reference-assets'
import ultraterrestrialTheme from './theme'
import { withMindmapProviders } from './decorators/with-mindmap'

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
  globalTypes: {
    designSystem: {
      name: 'Design System',
      description: 'Toggle between App and Research UI design systems',
      defaultValue: 'app',
      toolbar: {
        icon: 'paintbrush',
        items: [
          {value: 'app', title: 'App'},
          {value: 'research', title: 'Research UI'},
        ],
        dynamicTitle: true,
      },
    },
  },
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
    chromatic: {viewports: [1200]}, // optional to force width
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
    // Docs & UI theming
    docs: {
      toc: true,
      source: {
        state: 'open',
      },
      theme: ultraterrestrialTheme,
    },
    designAssets: {
      // default panel tab order and asset categories
      // See: https://storybook.js.org/addons/@storybook/addon-design-assets
      defaultTab: 'Assets',
      // Optionally group assets by type
      types: {
        images: ['png', 'jpg', 'jpeg', 'svg', 'webp'],
        docs: ['pdf'],
      },
    },
    theme: ultraterrestrialTheme,
  },

  decorators: [
    withReferenceAssets,
    withMindmapProviders,
    // 👇 Defining the decorator in the preview file applies it to all stories
    ((Story: any, context: any) => {
      const isResearch = context.globals.designSystem === 'research'
      return (
        <ThemeProvider
          attribute='class'
          forcedTheme='dark'
          defaultTheme='dark'
          enableSystem={false}>
          <div
            data-design-system={context.globals.designSystem}
            className={`${isResearch ? 'research-ui' : ''} ${FONT_NEUE_HAAS_GROTESK.variable} ${FONT_MONUMENT_GROTESK.variable} ${FONT_MONUMENT_GROTESK_MONO.variable} ${FONT_LUKAS_SANS.variable} ${FONT_JUST_ANOTHER_HAND.variable} ${FONT_JET_BRAINS_MONO.variable} ${FONT_MARTIAN_MONO.variable} ${FONT_NOTO_SANS.variable} ${FONT_SPECIAL_ELITE.variable} ${FONT_ANTON.variable} ${FONT_CAVEAT.variable} ${FONT_SPACE_GROTESK.variable} ${FONT_LEAGUE_SPARTAN.variable} dark w-full min-h-screen bg-black`}>
            {/* Ensure font variables are available at root for all stories */}
            <div className='w-full h-full flex flex-col justify-center items-center p-6'>
              <Story />
            </div>
          </div>
        </ThemeProvider>
      )
    }) as any,
  ],

  tags: ['autodocs'],
}

export default preview
