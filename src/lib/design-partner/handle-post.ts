import { Resend } from 'resend'
import { RATE_LIMITS } from '../../config/rate-limits.js'
import { checkKeyedRateLimit } from '../cache/rate-limiter.js'
import { hashString } from '../utils/hash.js'
import {
  designPartnerAutoReplyText,
  designPartnerNotifySubject,
  designPartnerNotifyText,
  generateDesignPartnerNotifyEmail,
} from '../email/design-partner-templates.js'
import { DesignPartnerSchema, MIN_SUBMIT_MS } from './schema.js'
import { appendDesignPartnerRow, isSheetsConfigured } from './sheets.js'

export interface DesignPartnerHandlerResult {
  status: number
  body: { success?: boolean; error?: string }
}

const SUCCESS: DesignPartnerHandlerResult = {
  status: 200,
  body: { success: true },
}

const GENERIC_ERROR = 'Something went wrong. Please try again.'

function maskEmail(email: string): string {
  return email.substring(0, 3) + '***'
}

function getFromAddress(): string {
  return process.env.DESIGN_PARTNER_FROM_EMAIL || 'Helio <hello@helio.so>'
}

function getNotifyAddress(): string {
  return process.env.DESIGN_PARTNER_NOTIFY_EMAIL || 'hello@helio.so'
}

export function extractClientIp(headers: Record<string, string | string[] | undefined>, fallback = '0.0.0.0'): string {
  const forwarded = headers['x-forwarded-for']
  if (Array.isArray(forwarded) && forwarded[0]) return forwarded[0].split(',')[0].trim()
  if (typeof forwarded === 'string' && forwarded) return forwarded.split(',')[0].trim()
  const realIp = headers['x-real-ip']
  if (typeof realIp === 'string' && realIp) return realIp
  return fallback
}

export async function handleDesignPartnerPost(
  rawBody: unknown,
  ip: string
): Promise<DesignPartnerHandlerResult> {
  const validation = DesignPartnerSchema.safeParse(rawBody)
  if (!validation.success) {
    return {
      status: 400,
      body: { error: validation.error.errors[0]?.message || 'Invalid request' },
    }
  }

  const submission = validation.data

  // Honeypot: pretend success so bots do not retry.
  if (submission.website.trim()) {
    console.warn('Design partner honeypot tripped')
    return SUCCESS
  }

  const elapsed = Date.now() - submission.openedAt
  if (elapsed < MIN_SUBMIT_MS) {
    return {
      status: 400,
      body: { error: GENERIC_ERROR },
    }
  }

  const rateLimit = await checkKeyedRateLimit(hashString(ip), RATE_LIMITS.designPartner)
  if (!rateLimit.allowed) {
    return {
      status: 429,
      body: { error: 'Please try again later' },
    }
  }

  const timestamp = new Date().toISOString()
  let persistFailed = false
  let notifyFailed = false

  try {
    if (!isSheetsConfigured()) {
      console.error('Design partner sheet is not configured; skipping persist')
      persistFailed = true
    } else {
      await appendDesignPartnerRow({ timestamp, submission })
    }
  } catch (error) {
    persistFailed = true
    console.error('Design partner persist error:', error)
  }

  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) {
    console.error('RESEND_API_KEY is not set; skipping design partner emails')
    notifyFailed = true
  } else {
    const resend = new Resend(resendApiKey)
    const from = getFromAddress()

    try {
      const { error } = await resend.emails.send({
        from,
        to: getNotifyAddress(),
        replyTo: submission.email,
        subject: designPartnerNotifySubject(submission.email),
        text: designPartnerNotifyText(submission, timestamp),
        html: generateDesignPartnerNotifyEmail(submission, timestamp),
      })
      if (error) {
        notifyFailed = true
        console.error('Design partner notify email error:', error)
      }
    } catch (error) {
      notifyFailed = true
      console.error('Design partner notify email error:', error)
    }

    try {
      const { error } = await resend.emails.send({
        from,
        to: submission.email,
        subject: 'Got your Helio design partner request',
        text: designPartnerAutoReplyText(),
      })
      if (error) {
        console.error('Design partner auto-reply error:', error)
      }
    } catch (error) {
      console.error('Design partner auto-reply error:', error)
    }
  }

  if (persistFailed && notifyFailed) {
    console.error('Design partner submission missed sheet and notify email', {
      email: maskEmail(submission.email),
      timestamp,
      agentDoes: submission.agentDoes.slice(0, 200),
      tools: submission.tools.slice(0, 200),
      humanApproval: submission.humanApproval,
      referrer: submission.referrer,
    })
  } else {
    console.log('Design partner submission', {
      email: maskEmail(submission.email),
      persistFailed,
      notifyFailed,
      timestamp,
    })
  }

  return SUCCESS
}
