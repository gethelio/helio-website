import { z } from 'zod'

export const MIN_SUBMIT_MS = 3000

export const HUMAN_APPROVAL_VALUES = ['yes', 'no', 'some'] as const
export type HumanApproval = (typeof HUMAN_APPROVAL_VALUES)[number]

export const DesignPartnerSchema = z.object({
  email: z.string().trim().email('Please provide a valid email address'),
  agentDoes: z
    .string()
    .trim()
    .min(1, 'Tell us what your agent does')
    .max(4000, 'Please keep this under 4000 characters'),
  tools: z
    .string()
    .trim()
    .min(1, 'Tell us which tools it reaches')
    .max(1000, 'Please keep this under 1000 characters'),
  humanApproval: z.enum(HUMAN_APPROVAL_VALUES, {
    errorMap: () => ({ message: 'Please choose yes, no, or some' }),
  }),
  // Honeypot — must be empty. Bots that fill it are dropped silently.
  website: z.string().max(200).optional().default(''),
  openedAt: z.number().int().positive(),
  referrer: z.string().max(2000).optional().default(''),
  utmSource: z.string().max(200).optional().default(''),
  utmMedium: z.string().max(200).optional().default(''),
  utmCampaign: z.string().max(200).optional().default(''),
  utmTerm: z.string().max(200).optional().default(''),
  utmContent: z.string().max(200).optional().default(''),
})

export type DesignPartnerInput = z.infer<typeof DesignPartnerSchema>

export const HUMAN_APPROVAL_LABELS: Record<HumanApproval, string> = {
  yes: 'Yes',
  no: 'No',
  some: 'Some',
}
