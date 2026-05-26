const INTEGRATIONS = [
  "Claude",
  "ChatGPT",
  "Cursor",
  "LangChain",
  "LangGraph",
  "CrewAI",
  "AutoGen",
  "Any MCP-compatible agent",
] as const;

export default function Integrations() {
  return (
    <section id="integrations" className="py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-y py-8 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] md:py-10 dark:[border-image:linear-gradient(to_right,transparent,--theme(--color-slate-600/.8),transparent)1]">
          <p className="mb-5 text-center text-xs font-semibold tracking-[0.12em] text-gray-500 uppercase dark:text-gray-400">
            Works with the agents you already use
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {INTEGRATIONS.map((name) => (
              <li
                key={name}
                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
