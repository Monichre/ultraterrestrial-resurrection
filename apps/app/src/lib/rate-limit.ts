import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Lazy-initialised limiter — constructed only when Upstash env vars are present.
// Allows 30 requests per 60-second sliding window.
let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    // Upstash is not configured (e.g. local dev without env vars); degrade gracefully.
    return null;
  }

  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(30, "60 s"),
    analytics: true,
    prefix: "ultraterrestrial:ratelimit",
  });

  return ratelimit;
}

export async function checkRateLimit(identifier: string) {
  const limiter = getRatelimit();

  if (!limiter) {
    // No Upstash configuration — allow all requests in this environment.
    console.warn(
      "[rate-limit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set — rate limiting is disabled."
    );
    return {
      success: true,
      limit: 30,
      reset: Date.now() + 60_000,
      remaining: 30,
      headers: {
        "X-RateLimit-Limit": "30",
        "X-RateLimit-Remaining": "30",
        "X-RateLimit-Reset": (Date.now() + 60_000).toString(),
      },
    };
  }

  try {
    const { success, limit, reset, remaining } = await limiter.limit(identifier);

    return {
      success,
      limit,
      reset,
      remaining,
      headers: {
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      },
    };
  } catch (error) {
    // Upstash unreachable (e.g. DNS failure on a decommissioned instance).
    // Fail OPEN: rate limiting is a guardrail, not a hard dependency — it must
    // never take down the core API. Allow the request and move on.
    console.warn(
      "[rate-limit] limiter unavailable, failing open:",
      (error as Error)?.message
    );
    return {
      success: true,
      limit: 30,
      reset: Date.now() + 60_000,
      remaining: 30,
      headers: {
        "X-RateLimit-Limit": "30",
        "X-RateLimit-Remaining": "30",
        "X-RateLimit-Reset": (Date.now() + 60_000).toString(),
      },
    };
  }
}
