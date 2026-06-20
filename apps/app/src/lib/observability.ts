/**
 * Observability seam (T-026)
 * ---------------------------------------------------------------------------
 * A dependency-free, env-gated indirection layer for error/event reporting.
 *
 * Status: BLOCKED on (1) `@sentry/nextjs` dependency approval + install and
 * (2) a `SENTRY_DSN` credential. Until both exist this module is a safe no-op
 * that falls back to `console`, so call sites can adopt `captureException` /
 * `captureMessage` NOW without pulling in an unapproved dependency or throwing
 * when the DSN is absent.
 *
 * When Sentry is approved:
 *   1. `bun add @sentry/nextjs` in apps/app
 *   2. add `SENTRY_DSN` (server) / `NEXT_PUBLIC_SENTRY_DSN` (client) to env
 *   3. create `instrumentation.ts` + `sentry.client.config.ts` per the Next.js
 *      SDK wizard, and replace the `report()` body below with `Sentry.*` calls.
 * No call-site changes are required at that point — the interface is stable.
 *
 * See docs/observability/monitoring-plan.md for the full rollout plan.
 */

type Severity = 'fatal' | 'error' | 'warning' | 'info' | 'debug'

export type CaptureContext = {
  /** Logical area, e.g. 'api:prometheus', 'mindmap:agent', 'db:search'. */
  scope?: string
  /** Arbitrary structured metadata attached to the event. */
  extra?: Record<string, unknown>
  /** Stable tags for grouping/filtering once a backend is wired. */
  tags?: Record<string, string>
}

/** True only when a DSN is configured. Lets call sites short-circuit work. */
export const isObservabilityEnabled = (): boolean =>
  Boolean(process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN)

function report(severity: Severity, payload: unknown, context?: CaptureContext): void {
  // --- SENTRY SEAM ---------------------------------------------------------
  // When the dependency + DSN land, forward to Sentry here, e.g.:
  //   if (isObservabilityEnabled()) {
  //     Sentry.captureException(payload, { level, tags, extra })
  //     return
  //   }
  // -------------------------------------------------------------------------
  const prefix = context?.scope ? `[obs:${context.scope}]` : '[obs]'
  const detail = context?.extra ? {extra: context.extra, tags: context.tags} : undefined

  if (severity === 'fatal' || severity === 'error') {
    console.error(prefix, payload, detail ?? '')
  } else if (severity === 'warning') {
    console.warn(prefix, payload, detail ?? '')
  } else {
    console.info(prefix, payload, detail ?? '')
  }
}

/** Report a caught error. Safe to call unconditionally. */
export function captureException(error: unknown, context?: CaptureContext): void {
  report('error', error, context)
}

/** Report a non-error event/message at a chosen severity. */
export function captureMessage(
  message: string,
  context?: CaptureContext & {level?: Exclude<Severity, 'fatal'>},
): void {
  report(context?.level ?? 'info', message, context)
}
