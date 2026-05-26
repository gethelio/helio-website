export default function WhyHelio() {
  return (
    <section className="relative">
      <div
        className="absolute left-1/2 top-0 -z-10 -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div className="h-80 w-80 rounded-full bg-linear-to-tr from-blue-500 to-gray-900 opacity-40 blur-[160px] will-change-[filter]" />
      </div>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-16 text-center md:pb-20">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Why AI agents need governance
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Things can go wrong the moment an agent gets real tools.
            </p>
          </div>

          {/* Grid */}
          <div className="grid overflow-hidden [border-image:linear-gradient(to_right,transparent,var(--color-slate-200),transparent)1] dark:[border-image:linear-gradient(to_right,transparent,var(--color-slate-700),transparent)1] lg:grid-cols-3 *:relative *:p-6 *:before:absolute *:before:bg-linear-to-b *:before:from-transparent *:before:via-gray-200 dark:*:before:via-gray-700 *:before:[block-size:100%] *:before:[inline-size:1px] *:before:[inset-block-start:0] *:before:[inset-inline-start:-1px] md:*:px-10 md:*:py-12">
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium">
                <svg
                  className="shrink-0 fill-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 1L1 14h14L8 1zM7.25 5.5h1.5v4h-1.5V5.5zM8 12.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                  />
                </svg>
                <span>It called an API you didn&apos;t expect</span>
              </h3>
              <p className="text-[15px] text-gray-700 dark:text-gray-300">
                Your agent reaches a production database, a payment API, an
                admin endpoint. One hallucinated tool call is the difference
                between a demo and an incident.
              </p>
            </article>
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium">
                <svg
                  className="shrink-0 fill-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                >
                  <path d="M9 0H7L3 7h4L4 16l9-10H8l1-7z" />
                </svg>
                <span>It spent money you didn&apos;t authorize</span>
              </h3>
              <p className="text-[15px] text-gray-700 dark:text-gray-300">
                Agentic loops burn through API credits, spin up resources, and
                trigger billable transactions in seconds. Without spend caps,
                you find out from the invoice.
              </p>
            </article>
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium">
                <svg
                  className="shrink-0 fill-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4C4.5 4 1.5 7 0 8c1.5 1 4.5 4 8 4s6.5-3 8-4c-1.5-1-4.5-4-8-4zm0 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                  />
                  <path d="M13.7.3l1 1L1.3 14.7l-1-1z" />
                </svg>
                <span>It modified data you can&apos;t undo</span>
              </h3>
              <p className="text-[15px] text-gray-700 dark:text-gray-300">
                When something goes wrong, you need a complete record: what the
                agent did, what reasoning led there, what policy matched, who
                approved. Without an audit trail, you&apos;re guessing.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
