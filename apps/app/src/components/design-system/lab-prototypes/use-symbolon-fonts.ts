'use client'

import { useEffect } from 'react'

const FONT_LINK_ID = 'symbolon-lab-fonts'
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;700&display=swap'

/** Injects Cormorant Garamond + JetBrains Mono + Inter once for lab prototypes. */
export function useSymbolonFonts() {
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById(FONT_LINK_ID)) return
    const linkEl = document.createElement('link')
    linkEl.id = FONT_LINK_ID
    linkEl.rel = 'stylesheet'
    linkEl.href = FONT_HREF
    document.head.appendChild(linkEl)
  }, [])
}
