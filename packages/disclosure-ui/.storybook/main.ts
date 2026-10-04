import type { StorybookConfig } from '@storybook/react-vite'
import { resolve } from 'path'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-themes', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: [
    { from: '../assets', to: '/disclosure-ui' },
  ],
  docs: {},
  // Tailwind 4 via @tailwindcss/postcss. Vite resolves PostCSS config from
  // its project root (the package root), not from .storybook/, so we point
  // Vite at the .storybook/postcss.config.js explicitly. The config loads
  // @tailwindcss/postcss; the actual @import "tailwindcss" + @source live in
  // .storybook/preview.css and styles/tokens.css.
  viteFinal: async (userConfig) => {
    userConfig.css = userConfig.css ?? {}
    userConfig.css.postcss = resolve(__dirname, 'postcss.config.js')
    return userConfig
  },
}

export default config
