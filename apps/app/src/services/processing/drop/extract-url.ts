/**
 * Drop-to-Canvas — turn a dropped URL into embeddable text.
 *
 * Unfurl only. This is not Lane A ingestion:
 *   - no youtube.py / transcript fetch
 *   - no processResource (that path writes)
 *   - no INSERT
 *
 * YouTube uses oEmbed (title + author) plus the existing Firecrawl scrape
 * when it returns page text. A generic URL uses scrape, then a capped HTML
 * title/description fetch if scrape is empty. The node must disclose that
 * matching ran against page text, not a transcript or the live page graph.
 */
import {scrapeWithFireCrawl} from '@/lib/firecrawl'
import {ExtractFailedError} from './extract'
import {hostnameLabel, youtubeVideoId} from './parse-url'
import type {DropDerivedVia, DropKind} from './types'

const MIN_TEXT_CHARS = 20
const HTML_CAP_CHARS = 64_000
const FETCH_MS = 15_000

export interface UrlExtractionResult {
  text: string
  title: string
  kind: Extract<DropKind, 'url' | 'youtube'>
  derivedVia: Extract<DropDerivedVia, 'url-scrape' | 'youtube-unfurl'>
  sourceUrl: string
}

function joinParts(parts: Array<string | undefined | null>): string {
  return parts
    .map((part) => (part ?? '').trim())
    .filter(Boolean)
    .join('\n\n')
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}

function stringField(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

/** Firecrawl SDK versions have returned both a flat body and `{ data }`. */
function textFromScrape(result: unknown): {title: string; text: string} {
  const root = asRecord(result)
  const data = asRecord(root.data ?? root)
  const metadata = asRecord(data.metadata ?? root.metadata)
  const extract = asRecord(data.extract ?? root.extract)
  const markdown = stringField(data, 'markdown') || stringField(root, 'markdown')
  const title =
    stringField(metadata, 'title', 'ogTitle') ||
    stringField(extract, 'title', 'pageTitle')
  const description =
    stringField(metadata, 'description', 'ogDescription') ||
    stringField(extract, 'description', 'summary', 'content')
  return {title, text: joinParts([title, description, markdown])}
}

async function youtubeOEmbed(url: string): Promise<{title: string; author: string} | null> {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
  try {
    const res = await fetch(endpoint, {
      headers: {Accept: 'application/json'},
      signal: AbortSignal.timeout(FETCH_MS),
    })
    if (!res.ok) return null
    const json = asRecord(await res.json())
    const title = stringField(json, 'title')
    const author = stringField(json, 'author_name')
    if (!title && !author) return null
    return {title, author}
  } catch (error) {
    console.error('[drop] youtube oEmbed failed:', error)
    return null
  }
}

async function scrapePage(url: string): Promise<{title: string; text: string}> {
  try {
    const result = await scrapeWithFireCrawl({
      url,
      formats: ['markdown', 'extract'],
      extract: {
        prompt:
          'Extract the page title, a short description, and the main readable text. Ignore navigation, ads, and comments.',
      },
    })
    return textFromScrape(result)
  } catch (error) {
    console.error('[drop] url scrape failed:', error)
    return {title: '', text: ''}
  }
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

async function unfurlHtml(url: string): Promise<{title: string; text: string}> {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {Accept: 'text/html,application/xhtml+xml,text/plain'},
      signal: AbortSignal.timeout(FETCH_MS),
    })
    if (!res.ok) return {title: '', text: ''}

    const contentType = (res.headers.get('content-type') ?? '').toLowerCase()
    if (
      contentType &&
      !contentType.includes('text/html') &&
      !contentType.includes('application/xhtml') &&
      !contentType.includes('text/plain')
    ) {
      return {title: '', text: ''}
    }

    const html = (await res.text()).slice(0, HTML_CAP_CHARS)
    const title = decodeEntities(/<title[^>]*>([^<]+)<\/title>/i.exec(html)?.[1]?.trim() ?? '')
    const og =
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i.exec(html)?.[1] ??
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i.exec(html)?.[1]
    const meta = /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i.exec(html)?.[1]
    const description = decodeEntities((og || meta || '').trim())
    return {title, text: joinParts([title, description])}
  } catch (error) {
    console.error('[drop] html unfurl failed:', error)
    return {title: '', text: ''}
  }
}

export async function extractDropUrl(url: string): Promise<UrlExtractionResult> {
  const videoId = youtubeVideoId(url)

  if (videoId) {
    const [oembed, scraped] = await Promise.all([youtubeOEmbed(url), scrapePage(url)])
    const title = oembed?.title || scraped.title || `YouTube ${videoId}`
    const text = joinParts([
      title,
      oembed?.author ? `Channel: ${oembed.author}` : '',
      `YouTube video ${videoId}`,
      scraped.text,
    ])
    if (text.length < MIN_TEXT_CHARS) {
      throw new ExtractFailedError('The YouTube page yielded no usable text. A private or unavailable video behaves this way.')
    }
    return {
      text,
      title,
      kind: 'youtube',
      derivedVia: 'youtube-unfurl',
      sourceUrl: url,
    }
  }

  const scraped = await scrapePage(url)
  const fallback = scraped.text.length >= MIN_TEXT_CHARS ? scraped : await unfurlHtml(url)
  const title = fallback.title || hostnameLabel(url)
  const text = fallback.text
  if (text.length < MIN_TEXT_CHARS) {
    throw new ExtractFailedError('The page was reached but yielded no usable text.')
  }
  return {
    text,
    title,
    kind: 'url',
    derivedVia: 'url-scrape',
    sourceUrl: url,
  }
}
