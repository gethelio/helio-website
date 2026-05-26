export default function Features() {
  return (
    <section
      id="features"
      className="relative before:absolute before:inset-0 before:-z-20 before:bg-gray-900"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-24 text-center md:pb-28">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl text-gray-200">
              Production-grade governance for AI agents
            </h2>
            <p className="text-lg text-gray-400">
              Declarative policies, human-in-the-loop approvals, evidence
              grounding, and a complete audit trail without changing your agent
              code or MCP servers.
            </p>
          </div>

          {/* Grid */}
          <div className="grid overflow-hidden sm:grid-cols-2 lg:grid-cols-3 *:relative *:p-6 *:before:absolute *:before:bg-gray-800 *:before:[block-size:100vh] *:before:[inline-size:1px] *:before:[inset-block-start:0] *:before:[inset-inline-start:-1px] *:after:absolute *:after:bg-gray-800 *:after:[block-size:1px] *:after:[inline-size:100vw] *:after:[inset-block-start:-1px] *:after:[inset-inline-start:0] md:*:p-10">
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
                <svg
                  className="shrink-0 fill-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0L1 3.5v4c0 4.5 3 8.5 7 9.5 4-1 7-5 7-9.5v-4L8 0zM7 11.2L4.3 8.5l1.4-1.4L7 8.4l3.3-3.3 1.4 1.4L7 11.2z" />
                </svg>
                <span>Policy Engine</span>
              </h3>
              <p className="text-[15px] text-gray-400">
                Declarative YAML rules that control which tools agents can call.
                Match by path, method, or custom attributes.
              </p>
            </article>
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
                <svg
                  className="shrink-0 fill-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                >
                  <path d="M8 1a4 4 0 0 0-4 4c0 1.2.5 2.3 1.4 3H3a2 2 0 0 0-2 2v2a1 1 0 0 0 2 0v-2h3v2a1 1 0 0 0 2 0v-2h3v2a1 1 0 0 0 2 0v-2a2 2 0 0 0-2-2H8.6A4 4 0 0 0 8 1zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm5.7 1.3a1 1 0 0 1 0 1.4l-2 2a1 1 0 0 1-1.4-1.4l2-2a1 1 0 0 1 1.4 0z" />
                </svg>
                <span>Approval Workflow</span>
              </h3>
              <p className="text-[15px] text-gray-400">
                Route sensitive actions to humans via Slack, email, or
                dashboard. Configurable timeouts and escalation paths.
              </p>
            </article>
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
                <svg
                  className="shrink-0 fill-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2zm3 2h6v1.5H5V4zm0 3.5h6V9H5V7.5zM5 11h4v1.5H5V11z"
                  />
                </svg>
                <span>Audit Trail</span>
              </h3>
              <p className="text-[15px] text-gray-400">
                Every tool call logged with full context - who requested it,
                what policy matched, whether it was approved, and the result.
              </p>
            </article>
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
                <svg
                  className="shrink-0 fill-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 2a2 2 0 0 0-1.73 1H1a1 1 0 0 0 0 2h2.27A2 2 0 0 0 5 6a2 2 0 0 0 1.73-1H15a1 1 0 1 0 0-2H6.73A2 2 0 0 0 5 2zm6 8a2 2 0 0 0-1.73 1H1a1 1 0 1 0 0 2h8.27A2 2 0 0 0 11 14a2 2 0 0 0 1.73-1H15a1 1 0 1 0 0-2h-2.27A2 2 0 0 0 11 10z"
                  />
                </svg>
                <span>Transaction Controls</span>
              </h3>
              <p className="text-[15px] text-gray-400">
                Rate limits, spend caps, and budget alerts. Prevent runaway
                agents from burning through API credits.
              </p>
            </article>
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
                <svg
                  className="shrink-0 fill-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM0 6a6 6 0 1 1 10.89 3.48l4.81 4.81a1 1 0 0 1-1.41 1.42l-4.82-4.82A6 6 0 0 1 0 6z"
                  />
                </svg>
                <span>Evidence Grounding</span>
              </h3>
              <p className="text-[15px] text-gray-400">
                Capture the reasoning context that led to each tool call. Audit
                not just what happened, but why.
              </p>
            </article>
            <article>
              <h3 className="mb-2 flex items-center space-x-2 font-medium text-gray-200">
                <svg
                  className="shrink-0 fill-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                >
                  <path d="M0 8l4-3v2h3v2H4v2L0 8zm16 0l-4-3v2H9v2h3v2l4-3zM7 1a1 1 0 0 1 2 0v3a1 1 0 0 1-2 0V1zm0 11a1 1 0 0 1 2 0v3a1 1 0 0 1-2 0v-3z" />
                </svg>
                <span>Protocol Native</span>
              </h3>
              <p className="text-[15px] text-gray-400">
                Sits between any MCP client and server as a transparent proxy.
                No agent code changes required.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
