# Xata and Evidence-Ledger Binding

The demo definition embeds evidence metadata. Production should treat the definition as a narrative configuration that references canonical data rather than duplicating it.

## Recommended lookup flow

```text
TourWaypointDefinition.claims[].id
  -> claims table or claim projection
  -> claim_evidence relationships
  -> documents / testimonies / events / sightings / organizations
  -> evidence ledger record
  -> content hash, source URL, archive URL, page anchor, quotation span
```

## Current Ultraterrestrial entities

The runtime is designed to resolve records from the existing domain model:

- `topics`
- `personnel`
- `events`
- `organizations`
- `sightings`
- `testimonies`
- `documents`
- `locations`
- `artifacts`

## Suggested production types

```ts
interface ResolvedEvidenceRecord {
  evidenceId: string;
  sourceEntityType: 'document' | 'testimony' | 'event' | 'sighting' | 'artifact';
  sourceEntityId: string;
  title: string;
  sourceLabel: string;
  excerpt?: string;
  page?: number;
  anchor?: string;
  contentHash?: string;
  originalUrl?: string;
  archiveUrl?: string;
  sourceDate?: string;
  retrievedAt?: string;
  classification: string;
  credibilityScore?: number;
  corroboratingEntityIds: string[];
  contradictingEntityIds: string[];
}
```

## Repository boundary

Add a server repository such as:

```text
src/features/guided-tours/server/tour-evidence.repository.ts
```

It should expose:

```ts
getTourDefinition(slug: string): Promise<TourDefinition>
resolveEvidence(ids: EvidenceId[]): Promise<ResolvedEvidenceRecord[]>
getUserProgress(userId: string, tourId: TourId): Promise<PersistedTourProgress | null>
saveUserProgress(userId: string, progress: PersistedTourProgress): Promise<void>
```

## Guardrails

- Do not allow tour configuration to overwrite canonical source records.
- Preserve page anchors and exact quotation spans.
- Do not combine later testimony with contemporaneous documentation in one unlabeled item.
- Source updates should invalidate affected claim evaluations without silently rewriting user decisions.
- Tour progress and research data should remain separate storage concerns.
