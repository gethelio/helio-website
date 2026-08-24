import { kv } from '@vercel/kv'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetInMinutes: number
}

export interface KeyedRateLimitConfig {
  keyPrefix: string
  maxRequests: number
  windowSeconds: number
}

export async function checkKeyedRateLimit(
  ipHash: string,
  config: KeyedRateLimitConfig
): Promise<RateLimitResult> {
  const key = `${config.keyPrefix}${ipHash}`
  const resetInMinutes = Math.ceil(config.windowSeconds / 60)

  try {
    const current = await kv.get<number>(key)

    if (current === null) {
      await kv.set(key, 1, { ex: config.windowSeconds })
      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetInMinutes,
      }
    }

    if (current >= config.maxRequests) {
      const ttl = await kv.ttl(key)
      return {
        allowed: false,
        remaining: 0,
        resetInMinutes: Math.ceil(ttl / 60),
      }
    }

    await kv.incr(key)
    return {
      allowed: true,
      remaining: config.maxRequests - current - 1,
      resetInMinutes,
    }
  } catch (error) {
    console.error('Rate limit check error:', error)
    return {
      allowed: true,
      remaining: 1,
      resetInMinutes,
    }
  }
}
