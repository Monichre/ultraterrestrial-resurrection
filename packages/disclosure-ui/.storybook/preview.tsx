import type { Preview } from '@storybook/react'
import { create } from '@storybook/theming'
import './preview.css'

const ultraterrestrialTheme = create({
  base: 'dark',
  brandTitle: 'disclosure-ui',
  brandUrl: 'https://ultraterrestrial.app',
  colorPrimary: '#27F1FF',
  colorSecondary: '#78efff',
  appBg: '#0a0a0a',
  appContentBg: '#0f181c',
  appBorderColor: '#1f2937',
  appBorderRadius: 6,
  fontBase: 'Inter, system-ui, ui-sans-serif, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  fontCode: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
  textColor: '#e2dbc7',
  barBg: '#0f172a',
  barTextColor: '#e2dbc7',
  barSelectedColor: '#27F1FF',
})

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'desk',
      values: [
        { name: 'desk', value: '#0f181c' },
        { name: 'leather', value: '#1a1410' },
        { name: 'hud', value: '#0a0a0a' },
        { name: 'paper', value: '#e2dbc7' },
        { name: 'white', value: '#ffffff' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      sort: 'requiredFirst',
    },
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
    docs: {
      toc: true,
      source: { state: 'open' },
      theme: ultraterrestrialTheme,
    },
    theme: ultraterrestrialTheme,
    chromatic: { viewports: [1200] },
  },
  tags: ['autodocs'],
  globalTypes: {
    register: {
      name: 'Design Register',
      description: 'Toggle between archival-material and techno-analytical registers',
      defaultValue: 'techno-analytical',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'techno-analytical', title: 'Techno-Analytical (desk)' },
          { value: 'archival-material', title: 'Archival-Material (reading room)' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const register = context.globals.register ?? 'techno-analytical'
      return (
        <div
          data-register={register}
          data-theme="dark"
          className="min-h-screen w-full p-6"
        >
          <Story />
        </div>
      )
    },
  ],
}

export default preview
