import {describe, expect, it} from 'vitest'

import type {AgentToolEvent} from '@/features/mindmap/hooks/use-mindmap-agent'
import {
  collapseToolEvents,
  countResults,
  extractQuery,
  humanizeToolName,
  summarizeOutcome,
} from '../tool-event-summary'

describe('humanizeToolName', () => {
  it('uses the curated label for known tools', () => {
    expect(humanizeToolName('searchDatabase')).toBe('Corpus search')
    expect(humanizeToolName('addGraphEdges')).toBe('Draw connections')
  })

  it('humanizes unknown camelCase / snake_case tools', () => {
    expect(humanizeToolName('researchExternalTopic')).toBe('Research external topic')
    expect(humanizeToolName('file_search')).toBe('File search')
  })
})

describe('extractQuery', () => {
  it('joins search_terms and falls back to query', () => {
    expect(extractQuery({search_terms: ['Roswell', '1947']})).toBe('Roswell · 1947')
    expect(extractQuery({query: '  Trinity test  '})).toBe('Trinity test')
    expect(extractQuery({limit: 5})).toBeUndefined()
  })
})

describe('countResults', () => {
  it('tolerates every live result shape', () => {
    expect(countResults([1, 2, 3])).toBe(3)
    expect(countResults({results: [1]})).toBe(1)
    expect(countResults({records: []})).toBe(0)
    expect(countResults({nodes: [{}, {}]})).toBe(2)
    expect(countResults({added: 4})).toBe(4)
    expect(countResults('text')).toBeUndefined()
    expect(countResults(undefined)).toBeUndefined()
  })
})

describe('summarizeOutcome', () => {
  it('never renders zero matches as an error', () => {
    const event: AgentToolEvent = {tool: 'searchDatabase', status: 'complete', result: {results: []}}
    expect(summarizeOutcome(event)).toEqual({summary: '0 matches', count: 0})
  })

  it('pluralizes with the tool noun', () => {
    expect(
      summarizeOutcome({tool: 'searchDatabase', status: 'complete', result: {results: [{}]}}).summary,
    ).toBe('1 record')
    expect(
      summarizeOutcome({tool: 'addGraphNodes', status: 'complete', result: {nodes: [{}, {}]}}).summary,
    ).toBe('2 records placed')
  })

  it('surfaces the error message', () => {
    expect(
      summarizeOutcome({tool: 'searchExternalResources', status: 'error', message: 'Exa 429'}).summary,
    ).toBe('Exa 429')
  })
})

describe('collapseToolEvents', () => {
  const stream: AgentToolEvent[] = [
    {tool: 'searchDatabase', status: 'processing', parameters: {search_terms: ['Roswell'], table: 'events'}},
    {tool: 'searchDatabase', status: 'complete', result: {results: [{}, {}, {}]}},
    {tool: 'searchExternalResources', status: 'processing', parameters: {query: 'Roswell debris'}},
    {tool: 'searchExternalResources', status: 'error', message: 'external_search_failed'},
    {tool: 'addGraphNodes', status: 'processing', parameters: {requested: 3}},
    {tool: 'addGraphNodes', status: 'complete', result: {nodes: [{}, {}, {}]}},
  ]

  it('merges processing → terminal pairs into one card and keeps the query', () => {
    const cards = collapseToolEvents(stream)
    expect(cards).toHaveLength(3)
    expect(cards[0]).toMatchObject({
      label: 'Corpus search',
      status: 'complete',
      query: 'Roswell',
      summary: '3 records',
    })
    expect(cards[0].params).toEqual([['table', 'events']])
    expect(cards[1]).toMatchObject({status: 'error', query: 'Roswell debris', error: 'external_search_failed'})
    expect(cards[2]).toMatchObject({label: 'Place records', summary: '3 records placed'})
  })

  it('keeps a lone processing card open', () => {
    const cards = collapseToolEvents(stream.slice(0, 1))
    expect(cards).toHaveLength(1)
    expect(cards[0].status).toBe('processing')
    expect(cards[0].summary).toBe('Working…')
  })

  it('does not merge a terminal event into a card for a different tool', () => {
    const cards = collapseToolEvents([
      {tool: 'searchDatabase', status: 'processing'},
      {tool: 'searchExternalResources', status: 'complete', result: []},
    ])
    expect(cards).toHaveLength(2)
    expect(cards[0].status).toBe('processing')
    expect(cards[1].status).toBe('complete')
  })

  it('produces stable keys derived from stream order', () => {
    const keys = collapseToolEvents(stream).map((c) => c.key)
    expect(keys).toEqual(['0:searchDatabase', '2:searchExternalResources', '4:addGraphNodes'])
  })
})
