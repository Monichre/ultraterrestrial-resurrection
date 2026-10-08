/**
 * Drop-to-Canvas — public-URL preflight for the url/YouTube path.
 *
 * Isomorphic on purpose: the canvas rejects a localhost drag before POST,
 * and the route re-validates the same rules. A second writer is not created
 * here — this only decides whether a string is a fetchable public http(s) URL.
 */

const BLOCKED_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1'])

const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
  'www.youtu.be',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
])

const YOUTUBE_PATH_KINDS = new Set(['embed', 'shorts', 'live', 'v'])

export function isYoutubeVideoId(id: string | undefined | null): boolean {
  return Boolean(id && /^[\w-]{11}$/.test(id))
}

function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (BLOCKED_HOSTS.has(host)) return true
  if (host.endsWith('.localhost') || host.endsWith('.local')) return true
  if (/^127\./.test(host)) return true
  if (/^10\./.test(host)) return true
  if (/^192\.168\./.test(host)) return true
  if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(host)) return true
  if (/^169\.254\./.test(host)) return true
  if (host.includes(':') && (host === '::1' || host.startsWith('fe80:') || host.startsWith('fc') || host.startsWith('fd'))) {
    return true
  }
  return false
}

/** Returns a canonical http(s) URL, or null when the string is not a public page. */
export function normalizePublicHttpUrl(raw: string): string | null {
  let value = raw.trim()
  if (!value) return null
  if (value.startsWith('<') && value.endsWith('>')) value = value.slice(1, -1).trim()

  let parsed: URL
  try {
    parsed = new URL(value)
  } catch {
    return null
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
  if (parsed.username || parsed.password) return null
  if (isBlockedHost(parsed.hostname)) return null
  return parsed.toString()
}

/**
 * First usable URL in a `text/uri-list` or a one-line `text/plain` drop.
 * A paragraph of research notes is not a URL drop.
 */
export function parseStandaloneUrl(raw: string): string | null {
  const trimmed = raw.trim()
  if (!trimmed) return null

  const firstLine = trimmed
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('#'))
  if (!firstLine) return null

  // A dragged URL is one token. Anything with interior whitespace is notes.
  if (/\s/.test(firstLine)) return null
  return normalizePublicHttpUrl(firstLine)
}

export function youtubeVideoId(urlString: string): string | null {
  let parsed: URL
  try {
    parsed = new URL(urlString)
  } catch {
    return null
  }

  const host = parsed.hostname.toLowerCase()
  if (!YOUTUBE_HOSTS.has(host)) return null

  if (host === 'youtu.be' || host === 'www.youtu.be') {
    const id = parsed.pathname.split('/').filter(Boolean)[0]
    return isYoutubeVideoId(id) ? id : null
  }

  const fromQuery = parsed.searchParams.get('v')
  if (isYoutubeVideoId(fromQuery)) return fromQuery

  const parts = parsed.pathname.split('/').filter(Boolean)
  if (parts.length >= 2 && YOUTUBE_PATH_KINDS.has(parts[0])) {
    return isYoutubeVideoId(parts[1]) ? parts[1] : null
  }

  return null
}

export function hostnameLabel(urlString: string): string {
  try {
    return new URL(urlString).hostname.replace(/^www\./, '')
  } catch {
    return urlString
  }
}
