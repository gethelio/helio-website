import { WhyPanel } from './why-panel'
import { WHY_PANELS } from './why-data'
import './why-stack.css'

export function WhyHelioExists() {
    return (
        <div className="px-4 py-16 sm:px-8 sm:py-20 md:px-12 md:pb-28 md:pt-24">
            <div className="grid items-start gap-10 lg:grid-cols-[minmax(240px,0.9fr)_1.4fr] lg:gap-12">
                <div className="why-stack-pin lg:sticky lg:top-24">
                    <p className="mb-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-main-500">Why Helio exists</p>
                    <h2 className="mb-3.5 text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl">Rules that live outside the model's context.</h2>
                    <p className="max-w-[36ch] text-[15px] leading-relaxed text-gray-600">Agents spend money, change records, and touch production. A prompt cannot enforce the next tool call by itself. Helio governs what agents do to the rest of the world.</p>
                </div>

                <div>
                    {WHY_PANELS.map((panel, index) => (
                        <WhyPanel key={panel.id} panel={panel} index={index} />
                    ))}
                </div>
            </div>
        </div>
    )
}
