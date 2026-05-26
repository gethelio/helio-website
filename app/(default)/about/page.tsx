import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Helio - Open-Source AI Agent Governance",
  description:
    "Why we're building Helio: an open-source MCP governance layer for AI agents. Our principles, project status, and how to contribute.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  {
    title: "Plain text over magic",
    body: "Config is YAML you can read. Decisions are paths through rules you can trace. Nothing happens that you can't grep for.",
    // Document with lines
    iconPath:
      "M3 0v16h10V4l-4-4H3zm6 1.5L11.5 4H9V1.5zM5 7h6v1H5V7zm0 2h6v1H5V9zm0 2h4v1H5v-1z",
    viewBox: "0 0 16 16",
  },
  {
    title: "Boring is good",
    body: "Predictable beats clever. Rules apply in the order you wrote them. No ML in the hot path, no inference, no surprises during incidents.",
    // Shield with check (heroicons-mini)
    iconPath:
      "M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 00-.629.74v.387c-.001 1.314-.001 4.066 1.057 6.51.94 2.176 2.671 4.115 5.673 4.964a.75.75 0 00.54 0c3.002-.849 4.733-2.788 5.673-4.964 1.058-2.444 1.058-5.196 1.057-6.51v-.387a.75.75 0 00-.629-.74A33.197 33.197 0 0010 1zm3.34 6.74a.75.75 0 00-1.18-.93L9 11.158l-1.16-1.45a.75.75 0 10-1.18.93l1.75 2.187a.75.75 0 001.18 0l4.75-5.937z",
    viewBox: "0 0 20 20",
  },
  {
    title: "Local-first",
    body: "You run Helio on your own infrastructure. Tool calls don't leave your network unless you choose to send them. We don't ingest your traffic.",
    // House
    iconPath: "M8 0L0 7h2v8h4v-5h4v5h4V7h2L8 0z",
    viewBox: "0 0 16 16",
  },
  {
    title: "Refuse, but explain",
    body: "When Helio blocks an action it tells the agent what failed and what would unblock it. Errors should teach, not stonewall.",
    // Chat bubble
    iconPath:
      "M14 2H2C1 2 0 3 0 4v7c0 1 1 2 2 2h2v3l3-3h7c1 0 2-1 2-2V4c0-1-1-2-2-2z",
    viewBox: "0 0 16 16",
  },
  {
    title: "Compatibility over reinvention",
    body: "MCP exists. We didn't invent a new protocol. The agents and the tools you already wired up should just work the day you drop Helio in.",
    // Link (heroicons-mini)
    iconPath:
      "M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3zM11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z",
    viewBox: "0 0 20 20",
  },
  {
    title: "One license, no tiers",
    body: "Apache 2.0 covers everything: the proxy, the dashboard, the policy engine. No open-core upsell. No features held hostage for an enterprise contract.",
    // Check-circle (heroicons-mini)
    iconPath:
      "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
    viewBox: "0 0 20 20",
  },
] as const;

export default function About() {
  return (
    <>
      {/* The bet */}
      <section className="relative pt-24 md:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] md:py-20 dark:[border-image:linear-gradient(to_right,transparent,--theme(--color-slate-600/.8),transparent)1]">
            <div className="mx-auto max-w-3xl">
              <h1 className="mb-6 text-3xl font-bold md:text-4xl">
                The bet we're making
              </h1>
              <div className="space-y-5 text-lg text-gray-700 dark:text-gray-300">
                <p>
                  Helio is a bet on where AI agents are headed. We think the
                  next few years will see agents move from chatbots into
                  operators. The interesting question stops being{" "}
                  <em>how smart is the model</em> and becomes{" "}
                  <em>who is allowed to do what</em>.
                </p>
                <p>
                  Model providers won't fully answer that question. Their job is
                  governing what their model says, not what your business does.
                  The platforms agents touch (Stripe, Salesforce, your database)
                  won't answer it either. They see one tool call at a time, with
                  no context for whether it should have happened.
                </p>
                <p>
                  Someone has to build the layer in between. That layer should
                  be open source, run on your own infrastructure, and treat
                  governance the way modern teams treat code: declarative,
                  versionable, reviewable. That's what we're building.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] md:py-20 dark:[border-image:linear-gradient(to_right,transparent,--theme(--color-slate-600/.8),transparent)1]">
            <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                How we build
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Six operating principles. They guide engineering decisions more
                than they guide marketing.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PRINCIPLES.map((p) => (
                <article
                  key={p.title}
                  className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <h3 className="mb-2 flex items-center gap-2 font-medium">
                    <svg
                      className="shrink-0 fill-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width={16}
                      height={16}
                      viewBox={p.viewBox}
                      aria-hidden="true"
                    >
                      <path d={p.iconPath} />
                    </svg>
                    <span>{p.title}</span>
                  </h3>
                  <p className="text-[15px] text-gray-700 dark:text-gray-300">
                    {p.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Project status */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] md:py-20 dark:[border-image:linear-gradient(to_right,transparent,--theme(--color-slate-600/.8),transparent)1]">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                Where the project is today
              </h2>
              <p className="mb-8 text-lg text-gray-700 dark:text-gray-300">
                Helio is in beta. The proxy runs. The dashboard ships with it.
                A starter ruleset covers the common dangers (drops, refunds,
                deletes, deploys). We&apos;re adding integrations, sharpening
                defaults, and writing down lessons from teams already putting
                agents in production. If you find a bug, file an issue. If you
                want a rule we don&apos;t have, send a PR.
              </p>
              <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center sm:gap-3">
                <a
                  className="btn group mb-4 w-full bg-gray-900 text-gray-100 shadow-sm hover:bg-gray-800 sm:mb-0 sm:w-auto dark:bg-gray-700 dark:hover:bg-gray-600"
                  href="https://github.com/gethelio/helio"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    className="mr-2 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.074.547-.174.547-.387 0-.19-.007-.693-.01-1.36-2.226.484-2.696-1.073-2.696-1.073-.364-.924-.89-1.17-.89-1.17-.726-.497.056-.487.056-.487.803.057 1.225.825 1.225.825.714 1.223 1.873.87 2.33.665.072-.517.279-.87.508-1.07-1.777-.2-3.644-.888-3.644-3.953 0-.873.31-1.587.823-2.147-.083-.202-.357-1.015.077-2.117 0 0 .672-.215 2.2.82a7.633 7.633 0 0 1 2.003-.27c.68.003 1.364.092 2.003.27 1.527-1.035 2.198-.82 2.198-.82.435 1.102.162 1.915.08 2.117.513.56.823 1.274.823 2.147 0 3.073-1.87 3.75-3.653 3.947.287.246.543.733.543 1.477 0 1.067-.01 1.927-.01 2.19 0 .214.146.464.55.385A8.001 8.001 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                  </svg>
                  Star on GitHub
                </a>
                <a
                  className="btn group mb-4 w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
                  href="https://github.com/gethelio/helio/blob/main/docs/getting-started.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="relative inline-flex items-center">
                    Read the docs
                    <span className="ml-1 tracking-normal text-blue-300 transition-transform group-hover:translate-x-0.5">
                      -&gt;
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
