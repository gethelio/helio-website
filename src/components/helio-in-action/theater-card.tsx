import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { HighlightKey } from './types'

export function TheaterCard({
  node,
  highlightKeys,
  active,
  children,
}: {
  node?: string
  highlightKeys: HighlightKey[]
  active: HighlightKey[]
  children: ReactNode
}) {
  const on = highlightKeys.some((key) => active.includes(key))

  return (
    <div
      data-theater-node={node}
      data-on={on}
      className={cn(
        'relative z-[4] min-w-0 rounded-2xl border bg-white px-3.5 py-3 transition-[border-color,box-shadow,opacity] duration-200',
        on ? 'border-orange-300 shadow-[0_0_0_3px_#FFF4ED]' : 'border-gray-200 opacity-55'
      )}
    >
      {children}
    </div>
  )
}

export function TheaterLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-400">
      {children}
    </div>
  )
}

export function TheaterRow({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: ReactNode
  valueClassName?: string
}) {
  return (
    <div className="flex justify-between gap-2 border-b border-gray-100 py-1.5 text-xs text-gray-700 last:border-0">
      <span>{label}</span>
      <span className={cn('font-mono', valueClassName)}>{value}</span>
    </div>
  )
}
