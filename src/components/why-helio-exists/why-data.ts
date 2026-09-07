import type { WhyPanel } from './types'

const refundArgs = [
  { text: 'order ', strong: '9182' },
  { text: ' · amount ', strong: '$2,400' },
]

export const WHY_PANELS: WhyPanel[] = [
  {
    id: 'prompt',
    eyebrow: 'The prompt',
    title: 'Ignored. Jailbroken. Forgotten.',
    body: 'You wrote “never refund over $1,000.” The model can ignore it, work around it, or lose it as the context fills up. A prompt is an instruction, not enforcement.',
    path: [{ label: 'Claude' }, { label: 'prompt' }, { label: 'shop' }],
    agent: 'payments agent',
    context: 'system: never refund over $1,000',
    stamp: 'allow',
    stampTone: 'ok',
    tool: 'process_refund',
    args: refundArgs,
    audit: '12:04:01  forwarded  true  prompt_said_dont',
  },
  {
    id: 'platform',
    eyebrow: 'The platform',
    title: 'One platform cannot govern the whole stack.',
    body: 'Your agents run across models, frameworks, and tools such as GitHub, Salesforce, and Stripe. Each platform sees its own piece. None sees every action or keeps one policy across all of them.',
    path: [
      { label: 'Claude' },
      { label: 'platform policy', tone: 'miss' },
      { label: 'stripe' },
    ],
    agent: 'payments agent',
    context: 'policy ends at the platform boundary',
    stamp: 'out of scope',
    stampTone: 'mute',
    tool: 'process_refund',
    args: refundArgs,
    audit: '12:04:01  forwarded  true  downstream_ungoverned',
  },
  {
    id: 'transcript',
    eyebrow: 'The transcript',
    title: 'A chat log is not an audit trail.',
    body: 'When something goes wrong, you need to know who called what, which rule matched, and whether the call was forwarded. Grepping a conversation will not tell you that.',
    path: [
      { label: 'Claude' },
      { label: 'chat history', tone: 'miss' },
      { label: 'shop' },
    ],
    agent: 'payments agent',
    context: 'user: did we refund 9182?',
    stamp: 'no record',
    stampTone: 'mute',
    tool: 'process_refund',
    args: refundArgs,
    audit: '—  not logged  —  grep the thread',
  },
  {
    id: 'path',
    eyebrow: 'The path',
    title: 'The call never left.',
    body: 'Helio evaluates each call before forwarding it. If policy says deny, a call routed through Helio never reaches the upstream. Put the policy file and the audit trail where the agent cannot write them and the rule cannot be weakened silently; on the default same-user install Helio records the change instead.',
    helio: true,
    path: [
      { label: 'Claude' },
      { label: 'Helio', tone: 'gate' },
      { label: 'shop' },
    ],
    agent: 'payments agent',
    context: 'sess_9x2k · MCP via Helio',
    stamp: 'deny',
    stampTone: 'deny',
    tool: 'process_refund',
    args: refundArgs,
    detail: 'matched rule: amount > 1000',
    audit: '12:04:01  would_forward  false  policy.amount_gt_1000',
  },
]

export const STICKY_TOP = [
  'lg:top-24',
  'lg:top-[7.125rem]',
  'lg:top-[8.25rem]',
  'lg:top-[9.375rem]',
] as const
