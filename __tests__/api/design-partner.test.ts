import { describe, it, expect, vi, beforeEach } from 'vitest'

const { sendMock, checkKeyedRateLimit, appendDesignPartnerRow, isSheetsConfigured } = vi.hoisted(() => ({
  sendMock: vi.fn(),
  checkKeyedRateLimit: vi.fn(),
  appendDesignPartnerRow: vi.fn(),
  isSheetsConfigured: vi.fn(),
}))

vi.mock('resend', () => ({
  Resend: class {
    emails = { send: sendMock }
  },
}))

vi.mock('@/lib/cache/rate-limiter.js', () => ({
  checkKeyedRateLimit,
}))

vi.mock('@/lib/design-partner/sheets.js', () => ({
  appendDesignPartnerRow,
  isSheetsConfigured,
}))

import { handleDesignPartnerPost } from '@/lib/design-partner/handle-post'
import { MIN_SUBMIT_MS } from '@/lib/design-partner/schema'
import { DESIGN_PARTNER_BOOKING_URL } from '@/lib/design-partner/constants'

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    email: 'founder@example.com',
    agentDoes: 'Refunds Stripe charges when a Zendesk ticket is tagged refund',
    tools: 'Stripe, Zendesk, Slack',
    humanApproval: 'some',
    website: '',
    openedAt: Date.now() - MIN_SUBMIT_MS - 500,
    referrer: 'https://www.linkedin.com/',
    utmSource: 'linkedin',
    utmMedium: 'social',
    utmCampaign: 'outbound',
    ...overrides,
  }
}

describe('handleDesignPartnerPost', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.RESEND_API_KEY = 're_test'
    process.env.DESIGN_PARTNER_NOTIFY_EMAIL = 'oli@helio.so'
    process.env.DESIGN_PARTNER_FROM_EMAIL = 'Helio <hello@helio.so>'
    isSheetsConfigured.mockReturnValue(true)
    appendDesignPartnerRow.mockResolvedValue(undefined)
    checkKeyedRateLimit.mockResolvedValue({ allowed: true, remaining: 4, resetInMinutes: 60 })
    sendMock.mockResolvedValue({ data: { id: 'email_1' }, error: null })
  })

  it('rejects invalid email', async () => {
    const result = await handleDesignPartnerPost(validBody({ email: 'not-an-email' }), '1.1.1.1')
    expect(result.status).toBe(400)
    expect(result.body.error).toMatch(/email/i)
    expect(appendDesignPartnerRow).not.toHaveBeenCalled()
  })

  it('rejects missing required fields', async () => {
    const result = await handleDesignPartnerPost(validBody({ agentDoes: '  ' }), '1.1.1.1')
    expect(result.status).toBe(400)
    expect(appendDesignPartnerRow).not.toHaveBeenCalled()
  })

  it('returns success without persisting when the honeypot is filled', async () => {
    const result = await handleDesignPartnerPost(validBody({ website: 'https://spam.test' }), '1.1.1.1')
    expect(result).toEqual({ status: 200, body: { success: true } })
    expect(appendDesignPartnerRow).not.toHaveBeenCalled()
    expect(sendMock).not.toHaveBeenCalled()
    expect(checkKeyedRateLimit).not.toHaveBeenCalled()
  })

  it('rejects submissions faster than three seconds', async () => {
    const result = await handleDesignPartnerPost(validBody({ openedAt: Date.now() }), '1.1.1.1')
    expect(result.status).toBe(400)
    expect(result.body.error).toBe('Something went wrong. Please try again.')
    expect(appendDesignPartnerRow).not.toHaveBeenCalled()
  })

  it('rate limits by IP at five per hour', async () => {
    checkKeyedRateLimit.mockResolvedValueOnce({ allowed: false, remaining: 0, resetInMinutes: 40 })
    const result = await handleDesignPartnerPost(validBody(), '9.9.9.9')
    expect(result.status).toBe(429)
    expect(result.body.error).toBe('Please try again later')
    expect(appendDesignPartnerRow).not.toHaveBeenCalled()
  })

  it('persists, notifies, and auto-replies on success', async () => {
    const body = validBody()
    const result = await handleDesignPartnerPost(body, '8.8.8.8')

    expect(result).toEqual({ status: 200, body: { success: true } })
    expect(appendDesignPartnerRow).toHaveBeenCalledTimes(1)
    const row = appendDesignPartnerRow.mock.calls[0][0]
    expect(row.submission.email).toBe(body.email)
    expect(row.submission.agentDoes).toBe(body.agentDoes)
    expect(row.submission.tools).toBe(body.tools)
    expect(row.submission.humanApproval).toBe('some')
    expect(row.submission.referrer).toBe(body.referrer)
    expect(row.submission.utmSource).toBe('linkedin')

    expect(sendMock).toHaveBeenCalledTimes(2)
    const [notify, autoReply] = sendMock.mock.calls.map((call) => call[0])
    expect(notify.to).toBe('oli@helio.so')
    expect(notify.replyTo).toBe(body.email)
    expect(notify.from).toBe('Helio <hello@helio.so>')
    expect(notify.text).toContain(body.agentDoes)
    expect(notify.text).toContain(DESIGN_PARTNER_BOOKING_URL)

    expect(autoReply.to).toBe(body.email)
    expect(autoReply.from).toBe('Helio <hello@helio.so>')
    expect(autoReply.html).toBeUndefined()
    expect(autoReply.text).toContain('two working days')
    expect(autoReply.text).toContain(DESIGN_PARTNER_BOOKING_URL)
    expect(autoReply.text).toContain('personal note')
  })

  it('returns success when persistence fails', async () => {
    appendDesignPartnerRow.mockRejectedValueOnce(new Error('Sheets down'))
    const result = await handleDesignPartnerPost(validBody(), '1.1.1.1')
    expect(result).toEqual({ status: 200, body: { success: true } })
    expect(sendMock).toHaveBeenCalled()
  })

  it('returns success when the sheet is not configured', async () => {
    isSheetsConfigured.mockReturnValue(false)
    const result = await handleDesignPartnerPost(validBody(), '1.1.1.1')
    expect(result).toEqual({ status: 200, body: { success: true } })
    expect(appendDesignPartnerRow).not.toHaveBeenCalled()
    expect(sendMock).toHaveBeenCalled()
  })

  it('returns success when notify email fails', async () => {
    sendMock.mockResolvedValueOnce({ data: null, error: { message: 'bounce' } })
    sendMock.mockResolvedValueOnce({ data: { id: 'email_2' }, error: null })
    const result = await handleDesignPartnerPost(validBody(), '1.1.1.1')
    expect(result).toEqual({ status: 200, body: { success: true } })
  })

  it('does not put the email address in the JSON response', async () => {
    const result = await handleDesignPartnerPost(validBody(), '1.1.1.1')
    expect(JSON.stringify(result.body)).not.toContain('founder@example.com')
  })
})
