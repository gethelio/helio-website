import { cn } from '@/lib/utils'
import { WhyCallCard } from './why-call-card'
import { STICKY_TOP } from './why-data'
import type { WhyPanel as WhyPanelData } from './types'

export function WhyPanel({
  panel,
  index,
}: {
  panel: WhyPanelData
  index: number
}) {
  return (
    <article
      id={`why-${panel.id}`}
      className={cn(
        'why-stack-pin lg:sticky',
        STICKY_TOP[index],
        index < 3 ? 'mb-4 lg:mb-7' : 'mb-0'
      )}
      style={{ zIndex: index + 1 }}
    >
      <div
        className={cn(
          'grid overflow-hidden rounded-3xl border bg-white shadow-[0_20px_40px_-24px_rgb(24_24_27_/_0.35)]',
          'lg:h-[min(34rem,calc(100vh-9rem))] lg:grid-cols-2',
          panel.helio ? 'border-orange-300 ring-[3px] ring-inset ring-[#FFF4ED]' : 'border-gray-200'
        )}
      >
        <div className="flex flex-col justify-center border-b border-gray-200 px-6 py-8 sm:px-7 lg:border-b-0 lg:border-r">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.12em] text-gray-400">{panel.eyebrow}</p>
          <h3 className="mb-2.5 text-[22px] font-semibold tracking-tight text-gray-900">{panel.title}</h3>
          <p className="text-[15px] leading-relaxed text-gray-600">{panel.body}</p>
        </div>
        <div
          className={cn(
            'flex items-center justify-center p-6',
            panel.helio
              ? 'bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,#FFF4ED,transparent_70%)] bg-white'
              : 'bg-[#FAFAFA]'
          )}
        >
          <WhyCallCard panel={panel} />
        </div>
      </div>
    </article>
  )
}
