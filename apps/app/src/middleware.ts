import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
// Only gate genuinely sensitive mutation/ingest endpoints. The read-only AI
// query routes (/api/disclosure/*, /api/prometheus/chat) power the public
// research canvas and must stay reachable without a Clerk session — there is
// no sign-in flow wired into that UI yet (see CLAUDE.md: "all routes publicly
// accessible"). Add them back here once auth is surfaced in the canvas.
const isProtectedApiRoute = createRouteMatcher([
  '/api/processing(.*)',
])
const isPublicApiRoute = createRouteMatcher([
  '/api/webhooks(.*)',
  '/api/cron(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  // Skip auth for webhooks and cron endpoints (they use secret verification)
  if (isPublicApiRoute(req)) {
    return
  }

  // Protect admin routes - require authentication
  if (isAdminRoute(req)) {
    await auth.protect()
    return
  }

  // Protect API routes - require authentication
  if (isProtectedApiRoute(req)) {
    await auth.protect()
    return
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
