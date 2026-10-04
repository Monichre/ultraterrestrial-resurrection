import { z } from 'zod';

const evidenceThreshold = z.enum([
  'broad-archive',
  'corroborated',
  'official-record',
  'multimodal-only',
]);

const narrativeEdgeKind = z.enum([
  'chronological',
  'evidentiary',
  'hypothesis',
  'institutional-inheritance',
  'contradiction',
]);

const gateRule = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('automatic') }),
  z.object({ kind: z.literal('open-any'), minimum: z.number().int().positive() }),
  z.object({ kind: z.literal('open-all-required') }),
  z.object({ kind: z.literal('open-specific'), evidenceIds: z.array(z.string()).min(1) }),
  z.object({ kind: z.literal('acknowledge') }),
]);

const evidenceReference = z.object({
  id: z.string().startsWith('evidence.'),
  title: z.string().min(1),
  summary: z.string().min(1),
  sourceLabel: z.string().min(1),
  sourceUrl: z.string().url().optional(),
  claimIds: z.array(z.string().startsWith('claim.')).min(1),
  type: z.enum([
    'primary-document',
    'official-history',
    'contemporaneous-report',
    'retrospective-testimony',
    'technical-record',
    'scholarly-analysis',
    'interpretation',
  ]),
  role: z.enum(['support', 'challenge', 'context', 'contradiction']),
  confidence: z.enum([
    'folkloric',
    'anecdotal',
    'multi-witness',
    'documentary',
    'correlated',
    'chain-of-custody',
  ]),
  sourceDate: z.string().optional(),
  requiredForThresholds: z.array(evidenceThreshold).min(1),
});

export const tourDefinitionSchema = z.object({
  id: z.string().startsWith('ut.tour.'),
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  version: z.string().min(1),
  entryWaypointId: z.string(),
  route: z.array(z.string()).min(1),
  defaultEvidenceThreshold: evidenceThreshold,
  viewport: z.object({
    minZoom: z.number().positive(),
    maxZoom: z.number().positive(),
    overviewPadding: z.number().nonnegative(),
  }),
  waypoints: z.array(
    z.object({
      id: z.string(),
      ordinal: z.number().int().positive(),
      title: z.string().min(1),
      subtitle: z.string().optional(),
      shortLabel: z.string().min(1),
      dateRange: z.object({
        start: z.string(),
        end: z.string().optional(),
        display: z.string(),
      }),
      narrative: z.object({
        entryClaim: z.string().min(1),
        question: z.string().min(1),
        handoffQuestion: z.string().min(1),
        completionStatement: z.string().optional(),
      }),
      layout: z.object({
        x: z.number(),
        y: z.number(),
        visualMode: z.enum(['archive', 'field', 'blacksite', 'myth-tech', 'public-release']),
        importance: z.enum(['primary', 'secondary']),
      }),
      camera: z.object({
        zoom: z.number().positive(),
        padding: z.number().nonnegative().optional(),
        arrivalDurationMs: z.number().int().nonnegative(),
        departureDurationMs: z.number().int().nonnegative(),
      }),
      claims: z.array(
        z.object({
          id: z.string().startsWith('claim.'),
          text: z.string().min(1),
          status: z.enum(['established', 'supported', 'contested', 'hypothesis']),
          confidence: z.enum(['low', 'medium', 'high']),
          evidenceIds: z.array(z.string().startsWith('evidence.')).min(1),
        }),
      ).min(1),
      gates: z.object({
        claim: gateRule,
        evidence: gateRule,
        challenge: gateRule,
        residue: gateRule,
      }),
      evidence: z.object({
        supporting: z.array(evidenceReference).min(1),
        counterpoints: z.array(evidenceReference).min(1),
        contextual: z.array(evidenceReference),
      }),
      epistemic: z.object({
        established: z.array(z.string()).min(1),
        notEstablished: z.array(z.string()).min(1),
        openQuestions: z.array(z.string()).min(1),
      }),
      transition: z.object({
        targetWaypointId: z.string(),
        edgeKind: narrativeEdgeKind,
        durationMs: z.number().int().nonnegative(),
      }).optional(),
    }),
  ).min(1),
  transitions: z.array(
    z.object({
      id: z.string().startsWith('transition.'),
      sourceWaypointId: z.string(),
      targetWaypointId: z.string(),
      kind: narrativeEdgeKind,
      durationMs: z.number().int().nonnegative(),
      label: z.string().optional(),
    }),
  ),
});
