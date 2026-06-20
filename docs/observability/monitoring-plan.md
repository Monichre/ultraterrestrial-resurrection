# Monitoring & Error Reporting Plan (T-026)

**Status:** 🟠 BLOCKED — seam landed, backend not wired.
**Date:** 2026-06-20
**Blocked on:**
1. Approval to add the `@sentry/nextjs` dependency to `apps/app`.
2. A `SENTRY_DSN` (and `NEXT_PUBLIC_SENTRY_DSN`) credential.

## What landed now (unblocked)

`apps/app/src/lib/observability.ts` — a dependency-free, env-gated seam exposing
`captureException()`, `captureMessage()`, and `isObservabilityEnabled()`. Until
a DSN is configured it is a `console` no-op, so call sites can adopt the API
today without importing an unapproved dependency or risking a throw when the DSN
is absent. The interface is stable: wiring Sentry later requires **no call-site
changes**.

## Why Sentry

- First-class Next.js 15 App Router support (`@sentry/nextjs`) covering server
  components, route handlers, and client — matches this app's surface.
- Captures the two live AI paths (`/api/disclosure/mindmap`,
  `/api/prometheus/chat`) where unhandled provider/stream errors currently
  surface only in server logs.
- Source-map upload + release tracking integrates with the existing Vercel
  deploy pipeline.

## Rollout (once unblocked)

1. **Install**: `bun add @sentry/nextjs` in `apps/app`.
2. **Env**: add to Vercel + `.env` (never commit):
   - `SENTRY_DSN` — server
   - `NEXT_PUBLIC_SENTRY_DSN` — client
   - `SENTRY_AUTH_TOKEN` — CI-only, for source-map upload
   - `SENTRY_ORG`, `SENTRY_PROJECT`
3. **Instrument**: run the SDK wizard or hand-create:
   - `instrumentation.ts` (server + edge `register()`)
   - `sentry.client.config.ts`
   - wrap `next.config` with `withSentryConfig` for source maps.
4. **Wire the seam**: replace the `report()` body in `observability.ts` with
   `Sentry.captureException` / `Sentry.captureMessage`, gated on
   `isObservabilityEnabled()`.
5. **Adopt at call sites** (priority order):
   - `src/app/api/prometheus/chat/route.ts` — wrap the `streamText` path
   - `src/app/api/disclosure/mindmap/route.ts` — wrap the Assistants/SSE bridge
   - top-level `error.tsx` / `global-error.tsx` boundaries
6. **Tune**: set `tracesSampleRate` low (e.g. 0.1) initially; enable
   `replaysOnErrorSampleRate` only after PII review of the research canvas.

## Privacy / cost guardrails

- Research canvas may render sensitive UAP source material — scrub `extra`
  payloads and disable session replay until reviewed.
- Keep trace sampling conservative; AI routes are token-expensive and
  high-cardinality.

## Acceptance criteria

- [ ] Dependency approved + installed
- [ ] DSN provisioned in all environments
- [ ] Both AI routes report unhandled errors to Sentry
- [ ] Source maps upload on production deploys
- [ ] `observability.ts` seam forwards to Sentry, no call-site churn
