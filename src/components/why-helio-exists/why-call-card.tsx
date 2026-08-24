import { cn } from '@/lib/utils'
import type { WhyPanel, WhyStampTone } from './types'

const stampClass: Record<WhyStampTone, string> = {
  ok: 'text-emerald-700 border-emerald-700',
  mute: 'text-gray-500 border-gray-200',
  deny: 'text-red-700 border-red-700',
}

const hopClass = {
  default: 'border-gray-200 bg-white text-gray-500',
  gate: 'border-gray-900 bg-gray-900 text-white',
  miss: 'border-dashed border-gray-200 bg-white text-zinc-400',
}

export function WhyCallCard({ panel }: { panel: WhyPanel }) {
  return (
    <div className="w-full max-w-[320px] rounded-2xl border border-gray-200 bg-white p-4">
      <div className="mb-3.5 flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-gray-500">
        {panel.path.map((hop, i) => (
          <span key={`${hop.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-gray-300">→</span>}
            <span
              className={cn(
                'rounded-full border px-2.5 py-0.5',
                hopClass[hop.tone ?? 'default']
              )}
            >
              {hop.label}
            </span>
          </span>
        ))}
      </div>

      <div className="mb-3 flex items-start justify-between gap-2.5">
        <div>
          <div className="text-[13px] font-semibold tracking-tight text-gray-900">{panel.agent}</div>
          <div className="mt-0.5 font-mono text-[10px] text-gray-500">{panel.context}</div>
        </div>
        <span
          className={cn(
            'inline-block whitespace-nowrap rounded-full border px-2 py-1 font-mono text-[10px] uppercase tracking-wider',
            stampClass[panel.stampTone]
          )}
        >
          {panel.stamp}
        </span>
      </div>

      <div className="mb-1.5 font-mono text-[13px] font-medium text-gray-900">{panel.tool}</div>
      <div className="text-xs leading-relaxed text-gray-600">
        {panel.args.map((part, i) => (
          <span key={i}>
            {part.text}
            {part.strong ? <span className="font-medium text-gray-900">{part.strong}</span> : null}
          </span>
        ))}
        {panel.detail ? (
          <>
            <br />
            {panel.detail}
          </>
        ) : null}
      </div>

      <div className="mt-3 border-t border-gray-100 pt-2.5 font-mono text-[10px] leading-relaxed text-gray-500">
        {panel.audit}
      </div>
    </div>
  )
}
