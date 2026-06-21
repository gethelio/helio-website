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
              Guardrails that hold when you're not watching
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Prompt-based rules drift, reset, and get talked past. Helio
              enforces from outside the agent - so the lines you set stay set,
              every call.
            </p>
          </div>

          {/* Grid */}
          <div className="grid overflow-hidden [border-image:linear-gradient(to_right,transparent,var(--color-slate-200),transparent)1] dark:[border-image:linear-gradient(to_right,transparent,var(--color-slate-700),transparent)1] lg:grid-cols-3 *:relative *:p-6 *:before:absolute *:before:bg-linear-to-b *:before:from-transparent *:before:via-gray-200 dark:*:before:via-gray-700 *:before:[block-size:100%] *:before:[inline-size:1px] *:before:[inset-block-start:0] *:before:[inset-inline-start:-1px] md:*:px-10 md:*:py-12">
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium">
                <svg
                  className="shrink-0 stroke-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12h20" />
                  <path d="M18 8l4 4-4 4" />
                  <path d="M10 3v6" />
                  <path d="M10 15v6" />
                </svg>
                <span>It sits in the path, not the prompt</span>
              </h3>
              <p className="text-[15px] text-gray-700 dark:text-gray-300">
                A rule inside the agent's context can be crowded out under load
                or argued away by a malicious tool. Helio enforces from outside,
                in the path every call travels so it can't be bypassed because
                it was never in the agent to begin with.
              </p>
            </article>
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium">
                <svg
                  className="shrink-0 stroke-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span>It remembers</span>
              </h3>
              <p className="text-[15px] text-gray-700 dark:text-gray-300">
                A spend cap that resets on every call isn't a cap. Helio carries
                a running total across a window, demands evidence from a prior
                result before allowing an action, and enforces that prerequisite
                steps actually ran. None of which a stateless checker can do.
              </p>
            </article>
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium">
                <svg
                  className="shrink-0 stroke-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
                  <path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2" />
                  <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
                  <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                  <path d="M8.65 22c.21-.66.45-1.32.57-2" />
                  <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                  <path d="M2 16h.01" />
                  <path d="M21.8 16c.2-2 .131-5.354 0-6" />
                  <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
                </svg>
                <span>It catches tools that change</span>
              </h3>
              <p className="text-[15px] text-gray-700 dark:text-gray-300">
                A tool can pass review on install, then quietly redefine itself
                a week later to do something you never approved. Helio captures
                each tool's definition and diffs it on every load, blocking
                anything that drifted until you've reviewed the change.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
