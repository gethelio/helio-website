import { useCallback, useLayoutEffect, useState, type RefObject } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { HighlightKey, TheaterScene } from './types'

type NodeId = 'policy' | 'limits' | 'evidence' | 'center' | 'budgets' | 'approvals' | 'drift' | 'audit'

type Side = 'left' | 'right' | 'bottom'

const NODE_SIDE: Record<Exclude<NodeId, 'center'>, Side> = {
  policy: 'left',
  limits: 'left',
  evidence: 'left',
  budgets: 'right',
  approvals: 'right',
  drift: 'right',
  audit: 'bottom',
}

interface Pt {
  x: number
  y: number
}

interface WirePath {
  id: Exclude<NodeId, 'center'>
  d: string
  from: Pt
  to: Pt
}

function nodesForHighlight(active: HighlightKey[]): Exclude<NodeId, 'center'>[] {
  const nodes: Exclude<NodeId, 'center'>[] = []
  if (active.includes('policy')) nodes.push('policy')
  if (active.includes('evidence')) nodes.push('evidence')
  if (active.includes('budgets')) nodes.push('budgets')
  if (active.includes('approvals')) nodes.push('approvals')
  if (active.includes('drift')) nodes.push('drift')
  if (active.includes('audit') || active.includes('repair')) nodes.push('audit')
  return nodes
}

function box(el: Element, root: DOMRect) {
  const r = el.getBoundingClientRect()
  return {
    left: r.left - root.left,
    right: r.right - root.left,
    top: r.top - root.top,
    bottom: r.bottom - root.top,
    cx: r.left - root.left + r.width / 2,
    cy: r.top - root.top + r.height / 2,
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function round(n: number) {
  return Math.round(n * 10) / 10
}

function connector(
  hub: ReturnType<typeof box>,
  sat: ReturnType<typeof box>,
  side: Side
): { d: string; from: Pt; to: Pt } {
  const gutter = 5

  if (side === 'bottom') {
    const from = { x: round(hub.cx), y: round(hub.bottom + gutter) }
    const to = { x: from.x, y: round(sat.top - gutter) }
    return { d: `M ${from.x} ${from.y} L ${to.x} ${to.y}`, from, to }
  }

  const satX = side === 'left' ? sat.right + gutter : sat.left - gutter
  const hubX = side === 'left' ? hub.left - gutter : hub.right + gutter
  const satY = sat.cy
  const hubY = clamp(satY, hub.top + 14, hub.bottom - 14)
  const from = { x: round(hubX), y: round(hubY) }
  const to = { x: round(satX), y: round(Math.abs(satY - hubY) < 1.5 ? hubY : satY) }

  if (Math.abs(satY - hubY) < 1.5) {
    return { d: `M ${from.x} ${from.y} L ${to.x} ${to.y}`, from, to }
  }

  const midX = round(hubX + (satX - hubX) * 0.55)
  return {
    d: `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`,
    from,
    to,
  }
}

function Wire({
  d,
  from,
  to,
  delay,
  reduceMotion,
}: {
  d: string
  from: Pt
  to: Pt
  delay: number
  reduceMotion: boolean
}) {
  const transition = {
    duration: reduceMotion ? 0 : 0.55,
    delay: reduceMotion ? 0 : delay,
    ease: [0.22, 1, 0.36, 1] as const,
  }

  return (
    <g>
      <motion.path
        d={d}
        pathLength={1}
        fill="none"
        stroke="#FF4D00"
        strokeWidth={10}
        strokeLinecap="round"
        strokeOpacity={0.22}
        strokeDasharray="1 1"
        initial={reduceMotion ? false : { strokeDashoffset: 1 }}
        animate={{ strokeDashoffset: 0 }}
        transition={transition}
      />
      <motion.path
        d={d}
        pathLength={1}
        fill="none"
        stroke="#FF4D00"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="1 1"
        initial={reduceMotion ? false : { strokeDashoffset: 1 }}
        animate={{ strokeDashoffset: 0 }}
        transition={transition}
      />
      {!reduceMotion && (
        <motion.path
          d={d}
          pathLength={1}
          fill="none"
          stroke="#FFB087"
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeDasharray="0.18 0.82"
          initial={{ strokeDashoffset: 1, opacity: 0 }}
          animate={{ strokeDashoffset: [0, -1], opacity: 1 }}
          transition={{
            strokeDashoffset: {
              duration: 1.45,
              delay: delay + 0.45,
              repeat: Infinity,
              ease: 'linear',
            },
            opacity: { duration: 0.2, delay: delay + 0.45 },
          }}
        />
      )}
      <motion.circle
        cx={from.x}
        cy={from.y}
        r={4}
        fill="#FF4D00"
        initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={transition}
      />
      <motion.circle
        cx={to.x}
        cy={to.y}
        r={4}
        fill="#FF4D00"
        initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={transition}
      />
    </g>
  )
}

export function TheaterWires({
  rootRef,
  scene,
}: {
  rootRef: RefObject<HTMLDivElement | null>
  scene: TheaterScene
}) {
  const reduceMotion = useReducedMotion()
  const [wide, setWide] = useState(false)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const [wires, setWires] = useState<WirePath[]>([])
  const targetKey = nodesForHighlight(scene.highlight).join(',')

  const measure = useCallback(() => {
    const root = rootRef.current
    if (!root) return

    const rootRect = root.getBoundingClientRect()
    const hubEl = root.querySelector('[data-theater-node="center"]')
    if (!hubEl || rootRect.width < 10) return

    const hub = box(hubEl, rootRect)
    const next: WirePath[] = []

    for (const id of nodesForHighlight(scene.highlight)) {
      const el = root.querySelector(`[data-theater-node="${id}"]`)
      if (!el) continue
      next.push({
        id,
        ...connector(hub, box(el, rootRect), NODE_SIDE[id]),
      })
    }

    setSize((prev) =>
      prev.width === rootRect.width && prev.height === rootRect.height
        ? prev
        : { width: rootRect.width, height: rootRect.height }
    )
    setWires((prev) => {
      if (
        prev.length === next.length &&
        prev.every((wire, i) => wire.id === next[i].id && wire.d === next[i].d)
      ) {
        return prev
      }
      return next
    })
  }, [rootRef, scene.highlight])

  useLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const sync = () => setWide(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useLayoutEffect(() => {
    if (!wide) return

    const root = rootRef.current
    if (!root) return

    const run = () => measure()
    run()
    const raf = requestAnimationFrame(run)
    const ro = new ResizeObserver(run)
    ro.observe(root)
    window.addEventListener('resize', run)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', run)
    }
  }, [wide, measure, scene.id, targetKey, rootRef])

  if (!wide || size.width === 0) return null

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[3] h-full w-full overflow-visible"
      fill="none"
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
    >
      {wires.map((wire, i) => (
        <Wire
          key={`${scene.id}-${wire.id}`}
          d={wire.d}
          from={wire.from}
          to={wire.to}
          delay={i * 0.08}
          reduceMotion={!!reduceMotion}
        />
      ))}
    </svg>
  )
}
