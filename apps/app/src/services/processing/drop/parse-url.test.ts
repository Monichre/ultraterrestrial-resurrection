import {describe, expect, it} from 'bun:test'

import {
  hostnameLabel,
  normalizePublicHttpUrl,
  parseStandaloneUrl,
  youtubeVideoId,
} from './parse-url'

describe('normalizePublicHttpUrl', () => {
  it('accepts a public https URL', () => {
    expect(normalizePublicHttpUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    )
  })

  it('rejects localhost, private, and non-http schemes', () => {
    expect(normalizePublicHttpUrl('http://localhost:3000/research-canvas')).toBeNull()
    expect(normalizePublicHttpUrl('http://127.0.0.1/secret')).toBeNull()
    expect(normalizePublicHttpUrl('http://192.168.1.9/admin')).toBeNull()
    expect(normalizePublicHttpUrl('http://169.254.169.254/latest/meta-data')).toBeNull()
    expect(normalizePublicHttpUrl('file:///etc/passwd')).toBeNull()
    expect(normalizePublicHttpUrl('https://user:pass@example.com/')).toBeNull()
  })
})

describe('parseStandaloneUrl', () => {
  it('reads the first non-comment uri-list line', () => {
    expect(parseStandaloneUrl('# comment\nhttps://example.com/report\nhttps://other.test')).toBe(
      'https://example.com/report'
    )
  })

  it('rejects a paragraph of notes', () => {
    expect(parseStandaloneUrl('What does this Roswell memo connect to?')).toBeNull()
    expect(parseStandaloneUrl('https://example.com is interesting')).toBeNull()
  })
})

describe('youtubeVideoId', () => {
  it('reads watch, short, embed, and youtu.be forms', () => {
    expect(youtubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(youtubeVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(youtubeVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(youtubeVideoId('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ')
    expect(youtubeVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=12s')).toBe('dQw4w9WgXcQ')
  })

  it('does not treat a playlist or channel as a video', () => {
    expect(youtubeVideoId('https://www.youtube.com/playlist?list=PLxxxx')).toBeNull()
    expect(youtubeVideoId('https://www.youtube.com/@AmericanAlchemy')).toBeNull()
    expect(youtubeVideoId('https://example.com/watch?v=dQw4w9WgXcQ')).toBeNull()
  })
})

describe('hostnameLabel', () => {
  it('strips www', () => {
    expect(hostnameLabel('https://www.nytimes.com/2024/01/01/us/ufo.html')).toBe('nytimes.com')
  })
})
