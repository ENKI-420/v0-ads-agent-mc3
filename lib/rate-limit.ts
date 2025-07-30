import { LRUCache } from "lru-cache"
import { logger } from "./logger"

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

const rateLimitCache = new LRUCache<string, { count: number; lastReset: number }>({
  max: 500, // Max number of IP addresses to store
  ttl: 60 * 1000, // 1 minute
})

const MAX_REQUESTS_PER_MINUTE = 10

export function rateLimit(ip: string): RateLimitResult {
  const now = Date.now()
  let ipData = rateLimitCache.get(ip)

  if (!ipData || now - ipData.lastReset > 60 * 1000) {
    // Reset if data doesn't exist or 1 minute has passed
    ipData = { count: 0, lastReset: now }
    rateLimitCache.set(ip, ipData)
  }

  ipData.count++

  const remaining = MAX_REQUESTS_PER_MINUTE - ipData.count
  const reset = Math.ceil((ipData.lastReset + 60 * 1000 - now) / 1000)

  const success = remaining >= 0

  if (!success) {
    logger.warn(`Rate limit exceeded for IP: ${ip}. Requests: ${ipData.count}/${MAX_REQUESTS_PER_MINUTE}`)
  } else {
    logger.debug(`Rate limit check for IP: ${ip}. Remaining: ${remaining}`)
  }

  return {
    success,
    limit: MAX_REQUESTS_PER_MINUTE,
    remaining,
    reset,
  }
}
