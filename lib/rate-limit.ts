// Mock rate limiting for demo purposes
// In production, you would use a real rate limiting service like Upstash Redis

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: Date
}

class MockRateLimit {
  private requests: Map<string, { count: number; resetTime: number }> = new Map()
  private limit = 10
  private windowMs = 10000 // 10 seconds

  async limit(identifier: string): Promise<RateLimitResult> {
    const now = Date.now()
    const key = identifier
    const current = this.requests.get(key)

    if (!current || now > current.resetTime) {
      // Reset window
      this.requests.set(key, { count: 1, resetTime: now + this.windowMs })
      return {
        success: true,
        limit: this.limit,
        remaining: this.limit - 1,
        reset: new Date(now + this.windowMs),
      }
    }

    if (current.count >= this.limit) {
      return {
        success: false,
        limit: this.limit,
        remaining: 0,
        reset: new Date(current.resetTime),
      }
    }

    current.count++
    this.requests.set(key, current)

    return {
      success: true,
      limit: this.limit,
      remaining: this.limit - current.count,
      reset: new Date(current.resetTime),
    }
  }
}

export const ratelimit = new MockRateLimit()
