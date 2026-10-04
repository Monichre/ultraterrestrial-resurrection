import { describe, expect, it } from 'vitest';
import { resolveAnchor } from '../graph/resolve-anchor';
import { isResolved, type CorpusAnchor } from '../types/tour-definition';

const query: CorpusAnchor = {
  kind: 'query',
  table: 'events',
  searchQuery: 'Trinity test Alamogordo',
};

const narrativeOnly: CorpusAnchor = {
  kind: 'none',
  reason: 'Special Access Programs are, by construction, unenumerated.',
};

describe('resolveAnchor', () => {
  it('resolves a query anchor that found a record', () => {
    const result = resolveAnchor(query, { id: 'evt-42', title: 'Trinity' });

    expect(result.state).toBe('resolved');
    expect(isResolved(result)).toBe(true);
    if (isResolved(result)) {
      expect(result.recordId).toBe('evt-42');
      expect(result.table).toBe('events');
    }
  });

  it('does NOT collapse a failed lookup into "no record exists"', () => {
    const failed = resolveAnchor(query, null);
    const absent = resolveAnchor(narrativeOnly, null);

    // Both produced no record — the whole point is that they stay distinguishable.
    expect(failed.state).toBe('unresolved');
    expect(absent.state).toBe('narrative-only');
    expect(failed.state).not.toBe(absent.state);
    expect(isResolved(failed)).toBe(false);
    expect(isResolved(absent)).toBe(false);
  });

  it('carries the attempted query so the UI can say what was searched for', () => {
    const failed = resolveAnchor(query, null);
    expect(failed).toMatchObject({
      state: 'unresolved',
      table: 'events',
      searchQuery: 'Trinity test Alamogordo',
    });
  });

  it('carries the stated reason through to the narrative-only result', () => {
    expect(resolveAnchor(narrativeOnly, null)).toMatchObject({
      state: 'narrative-only',
      reason: narrativeOnly.kind === 'none' ? narrativeOnly.reason : '',
    });
  });

  it('never resolves a narrative-only anchor, even if a record is handed to it', () => {
    const result = resolveAnchor(narrativeOnly, { id: 'evt-99' });
    expect(result.state, 'a stray record must not fabricate an anchor').toBe('narrative-only');
  });

  it('treats a record with no usable id as unresolved, not resolved', () => {
    expect(resolveAnchor(query, {}).state).toBe('unresolved');
    expect(resolveAnchor(query, { id: null }).state).toBe('unresolved');
  });

  it('resolves a record anchor and reports its id when the lookup fails', () => {
    const byId: CorpusAnchor = { kind: 'record', table: 'documents', recordId: 'doc-7' };

    expect(resolveAnchor(byId, { id: 'doc-7' })).toMatchObject({
      state: 'resolved',
      recordId: 'doc-7',
    });
    expect(resolveAnchor(byId, null)).toMatchObject({
      state: 'unresolved',
      table: 'documents',
      searchQuery: 'doc-7',
    });
  });
});
