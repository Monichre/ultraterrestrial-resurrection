import type { Decorator } from '@storybook/react'
import './beautiful-ui-theme.css'

export const withBeautifulUiTheme: Decorator = (Story, context) => {
  const isDark = context.globals?.theme === 'dark' || context.parameters?.beautifulUiTheme === 'dark'

  return (
    <div className={`beautiful-ui-root ${isDark ? 'dark' : ''} p-8`}>
      <Story />
    </div>
  )
}

export const beautifulUiParameters = {
  layout: 'centered' as const,
  backgrounds: {
    default: 'canvas',
    values: [
      { name: 'canvas', value: '#f1f2f3' },
      { name: 'dark-canvas', value: '#1c1d1f' },
    ],
  },
}
