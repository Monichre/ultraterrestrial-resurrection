import type { CorpusAnchor, ResolvedAnchor } from '../types/tour-definition';

/**
 * Turns a definition-time {@link CorpusAnchor} into a {@link ResolvedAnchor},
 * given whatever the corpus lookup returned.
 *
 * Pure on purpose: subtask 4 owns the actual Neon round-trip, this owns the
 * one rule that must not drift — a `none` anchor stays narrative-only, and a
 * query that found nothing reports `unresolved` with the query it tried,
 * instead of collapsing into the same empty state as "no record exists".
 */
export function resolveAnchor(
  anchor: CorpusAnchor,
  record: Record<string, unknown> | null,
): ResolvedAnchor {
  if (anchor.kind === 'none') {
    return { state: 'narrative-only', reason: anchor.reason };
  }

  const recordId = record?.id != null ? String(record.id) : null;

  if (record && recordId) {
    return { state: 'resolved', table: anchor.table, recordId, record };
  }

  return {
    state: 'unresolved',
    table: anchor.table,
    searchQuery: anchor.kind === 'query' ? anchor.searchQuery : anchor.recordId,
  };
}
