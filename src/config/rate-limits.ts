// Rate Limiting Configuration

export const RATE_LIMITS = {
  designPartner: {
    maxRequests: 5,
    windowSeconds: 3600, // 1 hour
    keyPrefix: 'rate:design-partner:',
  },
}

export type RateLimitType = keyof typeof RATE_LIMITS
