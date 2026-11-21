/**
 * Drop-to-Canvas — read a URL out of a DataTransfer.
 *
 * Browser address-bar and link drags do not set `Files`. They set
 * `text/uri-list`, then `text/plain`, then sometimes a one-anchor `text/html`.
 * The drop handler used to return immediately unless `Files` was present;
 * that is why a YouTube or page URL never reached the route.
 */
import {normalizePublicHttpUrl, parseStandaloneUrl} from '@/services/processing/drop/parse-url'

export function dragHasUrlType(types: readonly string[]): boolean {
  return types.includes('text/uri-list') || types.includes('text/plain') || types.includes('text/html')
}

export function dragHasFileType(types: readonly string[]): boolean {
  return types.includes('Files')
}

export function dragCarriesDroppable(types: readonly string[]): boolean {
  return dragHasFileType(types) || dragHasUrlType(types)
}

function hrefFromHtml(html: string): string | null {
  if (typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const hrefs = Array.from(doc.querySelectorAll('a[href]'))
        .map((el) => el.getAttribute('href'))
        .filter((href): href is string => Boolean(href))
      if (hrefs.length === 1) return hrefs[0]
    } catch {
      // Fall through to the regex. Malformed HTML is common in drag payloads.
    }
  }

  const match = /href=["'](https?:\/\/[^"']+)["']/i.exec(html)
  return match?.[1] ?? null
}

/** Best URL in a drop. `text/uri-list` wins; a paragraph of plain text loses. */
export function parseDroppedUrl(data: DataTransfer): string | null {
  const uriList = data.getData('text/uri-list')
  if (uriList) {
    const fromList = parseStandaloneUrl(uriList)
    if (fromList) return fromList
  }

  const plain = data.getData('text/plain')
  if (plain) {
    const fromPlain = parseStandaloneUrl(plain)
    if (fromPlain) return fromPlain
  }

  const html = data.getData('text/html')
  if (html) {
    const href = hrefFromHtml(html)
    if (href) return normalizePublicHttpUrl(href)
  }

  return null
}
