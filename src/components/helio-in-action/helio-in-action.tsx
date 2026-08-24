'use client'

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { AUTOPLAY_MS, AUTOPLAY_RESUME_MS, THEATER_ORDER, THEATER_SCENES } from './theater-data'
import { TheaterStage } from './theater-stage'
import type { TheaterMode } from './types'

// const ADD_HREF = 'https://github.com/gethelio/helio'

export function HelioInAction() {
  const reduceMotion = useReducedMotion()
  const [mode, setMode] = useState<TheaterMode>('policy')
  const autoplay = useRef(!reduceMotion)
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const goTo = useCallback((next: TheaterMode, fromUser = false) => {
    setMode(next)
    if (!fromUser) return

    autoplay.current = false
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => {
      autoplay.current = true
    }, AUTOPLAY_RESUME_MS)
  }, [])

  useEffect(() => {
    if (reduceMotion) return

    const id = setInterval(() => {
      if (!autoplay.current) return
      setMode((current) => {
        const i = THEATER_ORDER.indexOf(current)
        return THEATER_ORDER[(i + 1) % THEATER_ORDER.length]
      })
    }, AUTOPLAY_MS)

    return () => {
      clearInterval(id)
      if (resumeTimer.current) clearTimeout(resumeTimer.current)
    }
  }, [reduceMotion])

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const i = THEATER_ORDER.indexOf(mode)
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      goTo(THEATER_ORDER[(i + 1) % THEATER_ORDER.length], true)
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      goTo(THEATER_ORDER[(i - 1 + THEATER_ORDER.length) % THEATER_ORDER.length], true)
    } else if (event.key === 'Home') {
      event.preventDefault()
      goTo(THEATER_ORDER[0], true)
    } else if (event.key === 'End') {
      event.preventDefault()
      goTo(THEATER_ORDER[THEATER_ORDER.length - 1], true)
    }
  }

  const scene = THEATER_SCENES[mode]

  return (
    <div className="border-t bg-white px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="flex flex-wrap items-center gap-2.5 text-[22px] font-semibold tracking-tight text-gray-900">
            Helio in action
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-widest text-main-500">
              <motion.span
                aria-hidden="true"
                className="inline-block size-1.5 rounded-full bg-main-500"
                animate={reduceMotion ? undefined : { boxShadow: ['0 0 0 0 rgba(255,77,0,0.45)', '0 0 0 8px rgba(255,77,0,0)'] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
              />
              Interactive example
            </span>
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Step through one MCP tool call and see what Helio checks before it reaches the server.
          </p>
        </div>
        {/* <a
          href={ADD_HREF}
          className="inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-gray-800"
        >
          Add to my agent
        </a> */}
      </div>

      <div
        role="tablist"
        aria-label="Helio locks"
        className="mb-4 flex flex-wrap gap-2"
        onKeyDown={onTabKeyDown}
      >
        {THEATER_ORDER.map((id) => {
          const selected = id === mode
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`helio-tab-${id}`}
              aria-selected={selected}
              aria-controls="helio-theater-panel"
              tabIndex={selected ? 0 : -1}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                selected
                  ? 'border-gray-900 bg-white text-gray-900'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700'
              )}
              onClick={() => goTo(id, true)}
            >
              {THEATER_SCENES[id].label}
            </button>
          )
        })}
      </div>

      <div
        role="tabpanel"
        id="helio-theater-panel"
        aria-labelledby={`helio-tab-${mode}`}
      >
        <TheaterStage scene={scene} />
      </div>
    </div>
  )
}
