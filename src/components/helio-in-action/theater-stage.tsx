import { useRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TheaterAudit } from './theater-audit'
import { TheaterCard, TheaterLabel, TheaterRow } from './theater-card'
import { TheaterCenter } from './theater-center'
import { THEATER_ORDER, THEATER_SCENES } from './theater-data'
import { TheaterWires } from './theater-wires'
import type { TheaterScene } from './types'

const toneClass = {
  deny: 'text-red-700',
  hold: 'text-orange-700',
  info: 'text-blue-700',
  ok: 'text-emerald-700',
}

type StablePreField = 'policy' | 'evidence' | 'drift'

function StableScenePre({
  scene,
  field,
  className,
  animate = false,
}: {
  scene: TheaterScene
  field: StablePreField
  className: string
  animate?: boolean
}) {
  const contentClassName = cn('min-w-0 [grid-area:1/1]', className)

  return (
    <div className="grid min-w-0">
      {THEATER_ORDER.map((id) => (
        <pre
          key={`${field}-sizer-${id}`}
          aria-hidden="true"
          className={cn(contentClassName, 'invisible pointer-events-none select-none')}
        >
          {THEATER_SCENES[id][field]}
        </pre>
      ))}
      {animate ? (
        <motion.pre
          key={`${field}-${scene.id}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={contentClassName}
        >
          {scene[field]}
        </motion.pre>
      ) : (
        <pre className={contentClassName}>{scene[field]}</pre>
      )}
    </div>
  )
}

export function TheaterStage({ scene }: { scene: TheaterScene }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const active = scene.highlight
  const fillMeter = scene.id === 'budgets'

  return (
    <div
      ref={rootRef}
      className="relative overflow-visible rounded-3xl border border-gray-200 bg-white p-3 shadow-xl shadow-gray-200/50"
    >
      <TheaterWires rootRef={rootRef} scene={scene} />
      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-[236px_1fr_236px] lg:gap-x-14">
        <div className="flex flex-col gap-2.5">
          <TheaterCard node="policy" highlightKeys={['policy']} active={active}>
            <TheaterLabel>helio_policies</TheaterLabel>
            <StableScenePre
              scene={scene}
              field="policy"
              animate
              className="overflow-x-auto whitespace-pre-wrap rounded-[10px] border border-gray-200 bg-gray-50 p-2.5 font-mono text-xs leading-relaxed text-gray-700"
            />
          </TheaterCard>
          <TheaterCard node="limits" highlightKeys={['policy']} active={active}>
            <TheaterLabel>Rate & spend limits</TheaterLabel>
            <TheaterRow label="process_refund" value="12 / min" />
            <TheaterRow label="stripe.*" value="$50 / day" />
            <TheaterRow label="Hot-reload" value="live" valueClassName="text-emerald-700" />
          </TheaterCard>
          <TheaterCard node="evidence" highlightKeys={['evidence']} active={active}>
            <TheaterLabel>Evidence & chains</TheaterLabel>
            <StableScenePre
              scene={scene}
              field="evidence"
              className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-700"
            />
          </TheaterCard>
        </div>

        <TheaterCenter scene={scene} />

        <div className="flex flex-col gap-2.5">
          <TheaterCard node="budgets" highlightKeys={['budgets']} active={active}>
            <TheaterLabel>agent-payments</TheaterLabel>
            <div className="font-mono text-xs">$47.12 / $50.00 · durable</div>
            <div className="my-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
              <motion.span
                key={fillMeter ? scene.id : 'meter-static'}
                className="block h-full rounded-full bg-main-500"
                initial={{ width: fillMeter ? '12%' : '94%' }}
                animate={{ width: '94%' }}
                transition={{ duration: fillMeter ? 1.1 : 0 }}
              />
            </div>
            <TheaterRow label="stripe.create_payment" value="$31.40" />
            <TheaterRow label="paypal.capture" value="$15.72" />
            <TheaterRow label="Break-glass" value="Slack #finance" valueClassName="text-orange-700" />
          </TheaterCard>
          <TheaterCard node="approvals" highlightKeys={['approvals']} active={active}>
            <TheaterLabel>Approvals</TheaterLabel>
            <TheaterRow label="Channel" value="Slack · webhook" />
            <TheaterRow label="Dashboard" value="bundled" valueClassName="text-emerald-700" />
            <TheaterRow
              label="Status"
              value={scene.approval}
              valueClassName={cn(toneClass[scene.approvalTone], 'font-mono')}
            />
          </TheaterCard>
          <TheaterCard node="drift" highlightKeys={['drift']} active={active}>
            <TheaterLabel>Tool definition</TheaterLabel>
            <StableScenePre
              scene={scene}
              field="drift"
              className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-gray-700"
            />
          </TheaterCard>
        </div>
      </div>

      <TheaterAudit scene={scene} />
    </div>
  )
}
