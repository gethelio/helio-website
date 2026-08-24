import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { RichLine } from './rich-line'
import type { StampTone, TheaterScene } from './types'

const stampClass: Record<StampTone, string> = {
  deny: 'text-red-700 border-red-700',
  hold: 'text-orange-700 border-orange-700',
  info: 'text-blue-700 border-blue-700',
  ok: 'text-emerald-700 border-emerald-700',
}

export function TheaterCenter({ scene }: { scene: TheaterScene }) {
  return (
    <div
      data-theater-node="center"
      className="relative z-[4] flex min-h-[430px] flex-col rounded-[18px] border border-gray-200 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,#FFF4ED,transparent_70%)] bg-white p-[18px]"
    >
      <div className="mb-[18px] flex items-center justify-center gap-2 text-[11px] text-gray-500">
        <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1">{scene.client}</span>
        <span className="text-gray-300">→</span>
        <span className="rounded-full border border-gray-900 bg-gray-900 px-2.5 py-1 text-white">Helio</span>
        <span className="text-gray-300">→</span>
        <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1">{scene.upstream}</span>
      </div>

      <div className="mb-3.5 flex items-start justify-between gap-3">
        <div>
          <div className="text-[15px] font-semibold tracking-tight">payments agent</div>
          <div className="font-mono text-[11px] text-gray-500">
            sess_9x2k · MCP via Helio · no agent code change
          </div>
        </div>
        <motion.span
          key={`${scene.id}-${scene.stamp}`}
          initial={{ scale: 0.86, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.38, ease: [0.2, 0.8, 0.2, 1] }}
          className={cn(
            'inline-block whitespace-nowrap rounded-full border px-2 py-1 font-mono text-[10px] uppercase tracking-wider',
            stampClass[scene.stampTone]
          )}
        >
          {scene.stamp}
        </motion.span>
      </div>

      <motion.div
        key={scene.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex-1 rounded-[14px] border border-gray-200 bg-white p-4"
      >
        <div className="mb-2.5 font-mono text-sm font-medium">{scene.tool}</div>
        <div className="space-y-0.5 text-[13px] text-gray-600">
          {scene.args.map((line, i) => (
            <div key={i}>
              <RichLine parts={line} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
