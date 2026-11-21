import { addons } from '@storybook/manager-api'
import ultraterrestrialTheme from './theme'

addons.setConfig( {
  theme: ultraterrestrialTheme,
  sidebar: { showRoots: true },
} )
