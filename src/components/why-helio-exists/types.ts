export type WhyStampTone = 'ok' | 'mute' | 'deny'

export type WhyPathTone = 'default' | 'gate' | 'miss'

export type WhyArgPart = {
  text: string
  strong?: string
}

export type WhyPathHop = {
  label: string
  tone?: WhyPathTone
}

export interface WhyPanel {
  id: string
  eyebrow: string
  title: string
  body: string
  helio?: boolean
  path: WhyPathHop[]
  agent: string
  context: string
  stamp: string
  stampTone: WhyStampTone
  tool: string
  args: WhyArgPart[]
  detail?: string
  audit: string
}
