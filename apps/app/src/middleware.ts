import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isAdminRoute = createRouteMatcher(['/admin(.*)'])
const isProtectedApiRoute = createRouteMatcher([
  '/api/processing(.*)',
  '/api/prometheus/chat',
  '/api/disclosure(.*)',
])
const isPublicApiRoute = createRouteMatcher([
  '/api/webhooks(.*)',
  '/api/cron(.*)',
])

export default clerkMiddleware((auth, req) => {
  // Skip auth for webhooks and cron endpoints (they use secret verification)
  if (isPublicApiRoute(req)) {
    return
  }

  // Protect admin routes - require authentication
  if (isAdminRoute(req)) {
    auth().protect()
    return
  }

  // Protect API routes - require authentication
  if (isProtectedApiRoute(req)) {
    auth().protect()
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
