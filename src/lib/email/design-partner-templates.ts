import { DESIGN_PARTNER_BOOKING_URL } from '../design-partner/constants.js'
import type { DesignPartnerInput } from '../design-partner/schema.js'
import { HUMAN_APPROVAL_LABELS } from '../design-partner/schema.js'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function designPartnerAutoReplyText(): string {
  return [
    'Got it — thanks for applying as a Helio design partner.',
    '',
    "I'll write back within two working days. If it's easier to pick a time now, book a 30-minute call here:",
    DESIGN_PARTNER_BOOKING_URL,
    '',
    'A personal note will follow this message.',
    '',
    '— Oli',
    'Helio',
  ].join('\n')
}

export function designPartnerNotifySubject(email: string): string {
  return `[Design partner] ${email}`
}

export function designPartnerNotifyText(submission: DesignPartnerInput, timestamp: string): string {
  const utm = [
    submission.utmSource && `source=${submission.utmSource}`,
    submission.utmMedium && `medium=${submission.utmMedium}`,
    submission.utmCampaign && `campaign=${submission.utmCampaign}`,
    submission.utmTerm && `term=${submission.utmTerm}`,
    submission.utmContent && `content=${submission.utmContent}`,
  ]
    .filter(Boolean)
    .join(' | ')

  return [
    'New design partner submission.',
    '',
    'Reply personally with one line reacting to what they wrote, then the booking link again:',
    DESIGN_PARTNER_BOOKING_URL,
    '',
    `When: ${timestamp}`,
    `Email: ${submission.email}`,
    '',
    'What does your agent do that you would want to control?',
    submission.agentDoes,
    '',
    'Which tools does it reach?',
    submission.tools,
    '',
    `Does a human approve each consequential action today? ${HUMAN_APPROVAL_LABELS[submission.humanApproval]}`,
    '',
    `Referrer: ${submission.referrer || '(none)'}`,
    `UTM: ${utm || '(none)'}`,
  ].join('\n')
}

export function generateDesignPartnerNotifyEmail(
  submission: DesignPartnerInput,
  timestamp: string
): string {
  const row = (label: string, value: string) => `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                    <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 500; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">
                      ${escapeHtml(label)}
                    </p>
                    <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #111827; white-space: pre-wrap;">
                      ${escapeHtml(value)}
                    </p>
                  </td>
                </tr>`

  const utm = [
    submission.utmSource && `source=${submission.utmSource}`,
    submission.utmMedium && `medium=${submission.utmMedium}`,
    submission.utmCampaign && `campaign=${submission.utmCampaign}`,
    submission.utmTerm && `term=${submission.utmTerm}`,
    submission.utmContent && `content=${submission.utmContent}`,
  ]
    .filter(Boolean)
    .join(' · ')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New design partner submission</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 32px 40px 24px 40px; border-bottom: 1px solid #e5e7eb;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 600; color: #111827;">New design partner submission</h1>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #6b7280;">
                Reply with one line reacting to what they wrote, then the booking link again.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                ${row('When', timestamp)}
                ${row('Email', submission.email)}
                ${row('What the agent does', submission.agentDoes)}
                ${row('Tools', submission.tools)}
                ${row('Human approval', HUMAN_APPROVAL_LABELS[submission.humanApproval])}
                ${row('Referrer', submission.referrer || '(none)')}
                ${row('UTM', utm || '(none)')}
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <a href="mailto:${escapeHtml(submission.email)}" style="display: inline-block; padding: 12px 24px; background-color: #111827; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 500; border-radius: 8px;">
                Reply
              </a>
              <a href="${DESIGN_PARTNER_BOOKING_URL}" style="display: inline-block; margin-left: 12px; padding: 12px 24px; color: #111827; text-decoration: none; font-size: 14px; font-weight: 500;">
                Booking link
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`.trim()
}
