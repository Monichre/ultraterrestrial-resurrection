'use client'

import {ThemeProvider as NextThemesProvider} from 'next-themes'
import {type ThemeProviderProps} from 'next-themes/dist/types'

const DATA_THEME_ATTRIBUTE = 'data-theme'
const CLASS_ATTRIBUTE = 'class'

function mergeThemeAttributes(attribute: ThemeProviderProps['attribute']) {
  const list = !attribute ? [CLASS_ATTRIBUTE] : Array.isArray(attribute) ? [...attribute] : [attribute]

  if (!list.includes(DATA_THEME_ATTRIBUTE)) {
    list.push(DATA_THEME_ATTRIBUTE)
  }

  return list
}

export function ThemeProvider({children, attribute, ...props}: ThemeProviderProps) {
  const resolvedAttribute = mergeThemeAttributes(attribute)

  return (
    <NextThemesProvider attribute={resolvedAttribute} {...props}>
      {children}
    </NextThemesProvider>
  )
}
