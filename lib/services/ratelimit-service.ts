import { redis } from "@/lib/redis"
import { Ratelimit } from "@upstash/ratelimit"

class UpstashRateLimit {
  private static instance: UpstashRateLimit
  private static globalRateLimiter: Ratelimit | null = null

  constructor() {}

  static getInstance() {
    if (!UpstashRateLimit.instance) {
      UpstashRateLimit.instance = new UpstashRateLimit()
    }
    return UpstashRateLimit.instance
  }

  globalRateLimit() {
    if (!UpstashRateLimit.globalRateLimiter) {
      UpstashRateLimit.globalRateLimiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, "30 m"),
      })
    }
    return UpstashRateLimit.globalRateLimiter
  }
}

export const upstashRateLimit = UpstashRateLimit.getInstance()
