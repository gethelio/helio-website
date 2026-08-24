import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TheaterLabel } from './theater-card'
import { THEATER_ORDER, THEATER_SCENES } from './theater-data'
import type { HighlightKey, TheaterScene } from './types'

const auditContentClassName = 'font-mono text-[11px] leading-relaxed text-gray-700'

export function TheaterAudit({ scene }: { scene: TheaterScene }) {
  const on = scene.highlight.some((key) => (['audit', 'repair'] as HighlightKey[]).includes(key))

  return (
    <div
      data-on={on}
      data-theater-node="audit"
      className={cn(
        'relative z-[4] mt-2.5 rounded-2xl border px-3.5 py-3 transition-[border-color,box-shadow,opacity,background-color] duration-200 lg:mt-8',
        on
          ? 'border-orange-300 bg-white shadow-[0_0_0_3px_#FFF4ED]'
          : 'border-gray-200 bg-gray-50 opacity-55'
      )}
    >
      <TheaterLabel>Audit trail</TheaterLabel>
      <div className="grid min-w-0">
        {THEATER_ORDER.map((id) => (
          <div
            key={`audit-sizer-${id}`}
            aria-hidden="true"
            className={cn(
              auditContentClassName,
              'invisible pointer-events-none select-none [grid-area:1/1]'
            )}
          >
            {THEATER_SCENES[id].audit.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        ))}
        <div key={scene.id} className={cn(auditContentClassName, '[grid-area:1/1]')}>
          {scene.audit.map((line, i) => (
            <motion.div
              key={`${scene.id}-${i}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
            >
              {line}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
