export type TheaterMode =
  | 'policy'
  | 'budgets'
  | 'evidence'
  | 'approvals'
  | 'drift'
  | 'audit'
  | 'repair'

export type HighlightKey =
  | 'policy'
  | 'budgets'
  | 'evidence'
  | 'approvals'
  | 'drift'
  | 'audit'
  | 'repair'

export type StampTone = 'deny' | 'hold' | 'info' | 'ok'

export type RichPart = string | { strong: string }

export interface TheaterScene {
  id: TheaterMode
  label: string
  stamp: string
  stampTone: StampTone
  client: string
  upstream: string
  tool: string
  args: RichPart[][]
  policy: string
  evidence: string
  drift: string
  approval: string
  approvalTone: StampTone
  highlight: HighlightKey[]
  audit: string[]
}
