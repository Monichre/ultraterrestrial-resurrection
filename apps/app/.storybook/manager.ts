import { addons } from '@storybook/manager-api'
import { create } from '@storybook/theming'

const ultraterrestrialTheme = create( {
  base: 'dark',
  brandTitle: 'Ultraterrestrial',
  brandUrl: 'https://ultraterrestrial.app',
  brandImage: '/ultraterrestrial-logo.svg',
} )

addons.setConfig( {
  theme: ultraterrestrialTheme,
} )
