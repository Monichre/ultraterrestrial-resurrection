'use client'

import {useEffect} from 'react'

const REVISIONS_FONT_ID = 'brand-revisions-board-fonts'
const REVISIONS_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Nanum+Pen+Script&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Reenie+Beanie&family=Permanent+Marker&display=swap'

const UT_DRAFT_FONT_ID = 'ut-drafting-board-fonts'
const UT_DRAFT_FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap'

function injectFontLink(id: string, href: string) {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const linkEl = document.createElement('link')
  linkEl.id = id
  linkEl.rel = 'stylesheet'
  linkEl.href = href
  document.head.appendChild(linkEl)
}

/** Handwritten + mono faces for the brand revisions critique board. */
export function useBrandRevisionsFonts() {
  useEffect(() => {
    injectFontLink(REVISIONS_FONT_ID, REVISIONS_FONT_HREF)
  }, [])
}

/** Serif + mono faces for the Ultraterrestrial drafting composition. */
export function useUltraTerrestrialDraftingFonts() {
  useEffect(() => {
    injectFontLink(UT_DRAFT_FONT_ID, UT_DRAFT_FONT_HREF)
  }, [])
}
