import {describe, expect, test} from 'bun:test'
import {
  buildSession,
  classifyRecency,
  extractPromptTickets,
  formatAge,
  formatLongDate,
  latestSessionByTicket,
  parseAgentKind,
  parseSessionFilename,
} from './parse'

const NOW = Date.UTC(2026, 10, 6, 15, 0, 0) // November 6th, 2026 15:00Z

describe('parseSessionFilename', () => {
  test('reads timestamp and slug', () => {
    expect(parseSessionFilename('2026-10-01_14-42-10Z-pigtail-again.md')).toEqual({
      startedAt: '2026-10-01T14:42:10.000Z',
      title: 'pigtail again',
    })
  })
  test('slugless file is untitled', () => {
    expect(parseSessionFilename('2026-07-12_12-02-50Z.md').title).toBe('untitled session')
  })
  test('unexpected name falls back without a date', () => {
    expect(parseSessionFilename('notes.md')).toEqual({startedAt: null, title: 'notes'})
  })
})

describe('parseAgentKind', () => {
  test.each([
    ['<!-- Claude Code Session abc (2026) -->', 'Claude Code'],
    ['<!-- Codex CLI Session 01a0 -->', 'Codex CLI'],
    ['<!-- Cursor IDE Session x -->', 'Cursor IDE'],
    ['<!-- cursor Session x -->', 'Cursor IDE'],
    ['<!-- Factory Droid CLI Session x -->', 'Factory Droid'],
    ['<!-- Antigravity CLI Session x -->', 'Antigravity'],
    ['<!-- Pi Session x -->', 'Pi'],
    ['<!-- Mystery Tool Session x -->', 'Unknown'],
    ['no header at all', 'Unknown'],
  ])('%s → %s', (head, kind) => {
    expect(parseAgentKind(head)).toBe(kind as never)
  })
})

describe('extractPromptTickets', () => {
  test('only the first user prompt counts', () => {
    const head = [
      '<!-- Claude Code Session x -->',
      '_**User (2026-10-01)**_',
      'Build T-049 and check T-050, then T-049 again.',
      '---',
      '_**Agent**_',
      'Reading TODO.md: T-001 T-002 T-084',
    ].join('\n')
    expect(extractPromptTickets(head)).toEqual(['T-049', 'T-050'])
  })
  test('no user block, no tickets', () => {
    expect(extractPromptTickets('T-049 in a header')).toEqual([])
  })
})

describe('classifyRecency', () => {
  test('boundaries', () => {
    expect(classifyRecency(NOW - 14 * 60_000, NOW)).toBe('active')
    expect(classifyRecency(NOW - 16 * 60_000, NOW)).toBe('recent')
    expect(classifyRecency(NOW - 25 * 3_600_000, NOW)).toBe('dormant')
  })
})

describe('latestSessionByTicket', () => {
  test('newest session wins per ticket', () => {
    const head = (t: string) => `_**User**_\n${t}\n---`
    const newer = buildSession('2026-10-01_00-00-00Z-b.md', head('T-049'), NOW - 1000, NOW)
    const older = buildSession('2026-09-01_00-00-00Z-a.md', head('T-049 T-050'), NOW - 9e9, NOW)
    const map = latestSessionByTicket([newer, older])
    expect(map.get('T-049')?.id).toBe(newer.id)
    expect(map.get('T-050')?.id).toBe(older.id)
  })
})

describe('formatting', () => {
  test('long date uses repo format', () => {
    expect(formatLongDate('2026-10-01T12:00:00Z')).toBe('October 1st, 2026')
    expect(formatLongDate('2026-11-12T12:00:00Z')).toBe('November 12th, 2026')
    expect(formatLongDate('2026-11-22T12:00:00Z')).toBe('November 22nd, 2026')
  })
  test('age', () => {
    expect(formatAge(new Date(NOW - 30_000).toISOString(), NOW)).toBe('now')
    expect(formatAge(new Date(NOW - 5 * 60_000).toISOString(), NOW)).toBe('5m')
    expect(formatAge(new Date(NOW - 36 * 86_400_000).toISOString(), NOW)).toBe('36d')
  })
})
