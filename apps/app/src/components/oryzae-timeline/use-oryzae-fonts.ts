'use client'

import { useEffect } from 'react'

const FONT_LINK_ID = 'oryzae-fonts'
const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Noto+Serif+JP:wght@300;400;500&display=swap'

/** Injects Inter + Noto Serif JP once for the Oryzae timeline surface. */
export function useOryzaeFonts() {
  useEffect( () => {
    if ( typeof document === 'undefined' ) return
    if ( document.getElementById( FONT_LINK_ID ) ) return
    const linkEl = document.createElement( 'link' )
    linkEl.id = FONT_LINK_ID
    linkEl.rel = 'stylesheet'
    linkEl.href = FONT_HREF
    document.head.appendChild( linkEl )
  }, [] )
}
