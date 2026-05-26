const HELIO_CAPABILITIES = [
  "Policy engine",
  "Evidence grounding",
  "Approval workflows",
  "Rate & spend limits",
  "Audit trail",
  "Self-repair feedback",
] as const;

function HelioLogoMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="16" fill="#111929" />
      <g opacity="0.86" clipPath="url(#hiw-helio-clip)" fill="white">
        <path d="M19.1639 4.2114L16.7167 3.55566L14.6544 11.2523L12.7926 4.30373L10.3453 4.95946L12.3569 12.4669L7.34639 7.45637L5.55489 9.24787L11.0508 14.7438L4.20652 12.9099L3.55078 15.3571L11.029 17.3609C10.9434 16.9916 10.8981 16.6068 10.8981 16.2115C10.8981 13.413 13.1668 11.1443 15.9653 11.1443C18.7638 11.1443 21.0324 13.413 21.0324 16.2115C21.0324 16.6043 20.9877 16.9867 20.9031 17.3538L27.6995 19.1749L28.3552 16.7277L20.8472 14.7159L27.6919 12.8818L27.0362 10.4346L19.5285 12.4463L24.539 7.4358L22.7475 5.6443L17.3278 11.064L19.1639 4.2114Z" />
        <path d="M20.896 17.3823C20.6861 18.2694 20.2432 19.0662 19.6354 19.7047L24.5591 24.6284L26.3506 22.8369L20.896 17.3823Z" />
        <path d="M19.5857 19.7562C18.9706 20.3844 18.1932 20.8533 17.3215 21.0949L19.1131 27.7813L21.5603 27.1255L19.5857 19.7562Z" />
        <path d="M17.2301 21.1194C16.8256 21.2233 16.4017 21.2786 15.9648 21.2786C15.4968 21.2786 15.0436 21.2151 14.6133 21.0963L12.8201 27.7889L15.2673 28.4446L17.2301 21.1194Z" />
        <path d="M14.5268 21.0717C13.6684 20.8181 12.9048 20.3432 12.3023 19.7132L7.3665 24.649L9.158 26.4405L14.5268 21.0717Z" />
        <path d="M12.2616 19.6695C11.6694 19.0355 11.238 18.2493 11.0326 17.3759L4.2141 19.2029L4.86983 21.6501L12.2616 19.6695Z" />
      </g>
      <defs>
        <clipPath id="hiw-helio-clip">
          <rect
            width="24.8889"
            height="29.8667"
            fill="white"
            transform="translate(3.55469 1.06641)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

function HelioPanel() {
  return (
    <div className="rounded-xl border-2 border-orange-400 bg-white p-4 shadow-sm dark:bg-gray-800 sm:p-5">
      <div className="flex items-center gap-2.5">
        <HelioLogoMark />
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
            Helio
          </p>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 sm:text-[11px]">
            Governance proxy
          </p>
        </div>
      </div>
      <div className="my-3 h-px w-full bg-gray-100 dark:bg-gray-700" />
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-gray-600 dark:text-gray-300 sm:gap-y-2 sm:text-[13px]">
        {HELIO_CAPABILITIES.map((cap) => (
          <li key={cap} className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400 dark:bg-gray-500" />
            <span className="font-medium">{cap}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section header */}
        <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Five minutes from{" "}
            <code className="font-mono text-[0.9em]">npx</code> to governed
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            A YAML file. A proxy. No agent code changes.
          </p>
        </div>

        {/* Architecture diagram */}
        <div className="relative mx-auto mb-4 max-w-4xl border-y py-8 sm:py-10 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] dark:[border-image:linear-gradient(to_right,transparent,--theme(--color-slate-600/.8),transparent)1] md:mb-6">
          {/* ── Mobile layout (vertical stack, < md) ── */}
          <div className="flex flex-col items-stretch gap-3 md:hidden">
            {/* MCP Client */}
            <div className="mx-auto w-full max-w-xs rounded-xl bg-gray-900 px-3 py-3 text-center shadow-sm dark:bg-gray-700">
              <p className="text-sm font-semibold text-white">MCP Client</p>
              <p className="mt-0.5 text-[11px] text-gray-400">Agent</p>
            </div>

            {/* Vertical connector: Client ⇄ Helio */}
            <div className="mx-auto flex h-10 w-20 items-stretch justify-center gap-3">
              {/* Down arrow (request, animated) */}
              <div className="flex flex-col items-center">
                <div className="relative w-[1.5px] flex-1">
                  <div className="absolute inset-0 bg-gray-400 dark:bg-gray-500" />
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="absolute left-1/2 h-8 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-orange-500 to-transparent"
                      style={{
                        top: "-2rem",
                        animation: "flow-line-v 2s linear infinite",
                      }}
                    />
                  </div>
                </div>
                <div className="h-0 w-0 border-x-[4px] border-t-[7px] border-x-transparent border-t-gray-500 dark:border-t-gray-400" />
              </div>
              {/* Up arrow (response, dashed) */}
              <div className="flex flex-col items-center">
                <div className="h-0 w-0 border-x-[4px] border-b-[7px] border-x-transparent border-b-gray-300 dark:border-b-gray-600" />
                <div className="w-[1.5px] flex-1 bg-[length:1.5px_6px] bg-repeat-y [background-image:linear-gradient(to_bottom,var(--color-gray-300)_50%,transparent_50%)] dark:[background-image:linear-gradient(to_bottom,var(--color-gray-600)_50%,transparent_50%)]" />
              </div>
            </div>

            {/* Helio */}
            <div className="mx-auto w-full max-w-xs">
              <HelioPanel />
            </div>

            {/* Vertical connector: Helio ⇄ Server */}
            <div className="mx-auto flex h-10 w-20 items-stretch justify-center gap-3">
              <div className="flex flex-col items-center">
                <div className="relative w-[1.5px] flex-1">
                  <div className="absolute inset-0 bg-gray-400 dark:bg-gray-500" />
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="absolute left-1/2 h-8 w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-transparent via-orange-500 to-transparent"
                      style={{
                        top: "-2rem",
                        animation: "flow-line-v 2s linear infinite 1s",
                      }}
                    />
                  </div>
                </div>
                <div className="h-0 w-0 border-x-[4px] border-t-[7px] border-x-transparent border-t-gray-500 dark:border-t-gray-400" />
              </div>
              <div className="flex flex-col items-center">
                <div className="h-0 w-0 border-x-[4px] border-b-[7px] border-x-transparent border-b-gray-300 dark:border-b-gray-600" />
                <div className="w-[1.5px] flex-1 bg-[length:1.5px_6px] bg-repeat-y [background-image:linear-gradient(to_bottom,var(--color-gray-300)_50%,transparent_50%)] dark:[background-image:linear-gradient(to_bottom,var(--color-gray-600)_50%,transparent_50%)]" />
              </div>
            </div>

            {/* MCP Server */}
            <div className="mx-auto w-full max-w-xs rounded-xl bg-gray-900 px-3 py-3 text-center shadow-sm dark:bg-gray-700">
              <p className="text-sm font-semibold text-white">MCP Server</p>
              <p className="mt-0.5 text-[11px] text-gray-400">Tools</p>
            </div>
          </div>

          {/* ── Desktop layout (grid, ≥ md) ── */}
          <div
            className="hidden items-stretch gap-y-5 md:grid"
            style={{
              gridTemplateColumns:
                "auto minmax(40px,1fr) auto minmax(40px,1fr) auto",
            }}
          >
            {/* MCP Client */}
            <div className="col-start-1 row-start-1 flex w-40 flex-col justify-center rounded-xl bg-gray-900 px-3 py-4 text-center shadow-sm dark:bg-gray-700">
              <p className="text-sm font-semibold text-white">MCP Client</p>
              <p className="mt-0.5 text-[11px] text-gray-400">Agent</p>
            </div>

            {/* Connector: Agent ⇄ Helio */}
            <div className="col-start-2 row-start-1 flex flex-col justify-center gap-2">
              {/* Request line: solid → */}
              <div className="flex items-center">
                <div className="relative h-[1.5px] flex-1">
                  <div className="absolute inset-0 bg-gray-400 dark:bg-gray-500" />
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="absolute top-1/2 h-[3px] w-10 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-orange-500 to-transparent"
                      style={{
                        left: "-2.5rem",
                        animation: "flow-line 2s linear infinite",
                      }}
                    />
                  </div>
                </div>
                <div className="h-0 w-0 border-y-[4px] border-l-[7px] border-y-transparent border-l-gray-500 dark:border-l-gray-400" />
              </div>
              {/* Response line: dashed ← */}
              <div className="flex items-center">
                <div className="h-0 w-0 border-y-[4px] border-r-[7px] border-y-transparent border-r-gray-300 dark:border-r-gray-600" />
                <div className="h-[1.5px] flex-1 bg-[length:6px_1.5px] bg-repeat-x [background-image:linear-gradient(to_right,var(--color-gray-300)_50%,transparent_50%)] dark:[background-image:linear-gradient(to_right,var(--color-gray-600)_50%,transparent_50%)]" />
              </div>
            </div>

            {/* Helio (spans both rows) */}
            <div className="col-start-3 row-span-2 row-start-1">
              <HelioPanel />
            </div>

            {/* Connector: Helio ⇄ Server */}
            <div className="col-start-4 row-start-1 flex flex-col justify-center gap-2">
              <div className="flex items-center">
                <div className="relative h-[1.5px] flex-1">
                  <div className="absolute inset-0 bg-gray-400 dark:bg-gray-500" />
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="absolute top-1/2 h-[3px] w-10 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-orange-500 to-transparent"
                      style={{
                        left: "-2.5rem",
                        animation: "flow-line 2s linear infinite 1s",
                      }}
                    />
                  </div>
                </div>
                <div className="h-0 w-0 border-y-[4px] border-l-[7px] border-y-transparent border-l-gray-500 dark:border-l-gray-400" />
              </div>
              <div className="flex items-center">
                <div className="h-0 w-0 border-y-[4px] border-r-[7px] border-y-transparent border-r-gray-300 dark:border-r-gray-600" />
                <div className="h-[1.5px] flex-1 bg-[length:6px_1.5px] bg-repeat-x [background-image:linear-gradient(to_right,var(--color-gray-300)_50%,transparent_50%)] dark:[background-image:linear-gradient(to_right,var(--color-gray-600)_50%,transparent_50%)]" />
              </div>
            </div>

            {/* MCP Server */}
            <div className="col-start-5 row-start-1 flex w-40 flex-col justify-center rounded-xl bg-gray-900 px-3 py-4 text-center shadow-sm dark:bg-gray-700">
              <p className="text-sm font-semibold text-white">MCP Server</p>
              <p className="mt-0.5 text-[11px] text-gray-400">Tools</p>
            </div>

            {/* Python SDK */}
            <div className="col-start-1 row-start-2 w-40 rounded-xl border border-dashed border-gray-300 bg-white px-3 py-3.5 text-center dark:border-gray-600 dark:bg-gray-800">
              <p className="text-[10px] font-semibold tracking-[0.12em] text-gray-400 uppercase dark:text-gray-500">
                Optional
              </p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-100">
                Python SDK
              </p>
              <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500">
                thin · annotates calls
              </p>
            </div>

            {/* Sideband connector (single arrow) */}
            <div className="col-start-2 row-start-2 flex flex-col items-stretch justify-center gap-1">
              <span className="text-center text-[10px] tracking-[0.12em] text-gray-400 uppercase dark:text-gray-500">
                sideband
              </span>
              <div className="flex items-center">
                <div className="h-[1.5px] flex-1 bg-gray-400 dark:bg-gray-500" />
                <div className="h-0 w-0 border-y-[4px] border-l-[7px] border-y-transparent border-l-gray-500 dark:border-l-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <p className="mx-auto mb-12 max-w-2xl text-center text-sm text-gray-500 md:mb-16 dark:text-gray-400">
          Helio sits between your agent and your tools as a transparent MCP
          proxy. Every call passes through.
        </p>

        {/* Three steps */}
        <div className="grid overflow-hidden [border-image:linear-gradient(to_right,transparent,var(--color-slate-200),transparent)1] dark:[border-image:linear-gradient(to_right,transparent,var(--color-slate-700),transparent)1] lg:grid-cols-3 *:relative *:flex *:flex-col *:p-6 *:before:absolute *:before:bg-linear-to-b *:before:from-transparent *:before:via-gray-200 dark:*:before:via-gray-700 *:before:[block-size:100%] *:before:[inline-size:1px] *:before:[inset-block-start:0] *:before:[inset-inline-start:-1px] md:*:px-10 md:*:py-8">
          {/* Step 1: Install */}
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                1
              </span>
              <h3 className="font-medium">Install</h3>
            </div>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Scaffold <code className="font-mono text-[13px]">helio.yaml</code>{" "}
              and a starter ruleset that blocks common dangers.
            </p>
            <div className="flex flex-1 items-start rounded-lg bg-gray-900 p-4">
              <code className="font-mono text-sm text-gray-300">
                <span className="text-gray-500">$</span> npx @gethelio/proxy
                init
              </code>
            </div>
          </div>

          {/* Step 2: Configure */}
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                2
              </span>
              <h3 className="font-medium">Configure</h3>
            </div>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Write rules in YAML - what to block, what needs approval, what
              to rate-limit.
            </p>
            <div className="flex-1 overflow-x-auto rounded-lg bg-gray-900 p-4">
              <pre className="font-mono text-sm leading-relaxed text-gray-300">
                <span className="text-gray-500"># helio.yaml</span>
                {"\n"}
                <span className="text-gray-200">rules</span>:{"\n"}
                {"  "}- <span className="text-gray-200">match</span>:{" "}
                <span className="text-blue-400">
                  &quot;tools/payments/*&quot;
                </span>
                {"\n"}
                {"    "}
                <span className="text-gray-200">action</span>:{" "}
                <span className="text-blue-400">require_approval</span>
                {"\n"}
                {"  "}- <span className="text-gray-200">match</span>:{" "}
                <span className="text-blue-400">
                  &quot;tools/db/write&quot;
                </span>
                {"\n"}
                {"    "}
                <span className="text-gray-200">action</span>:{" "}
                <span className="text-blue-400">deny</span>
              </pre>
            </div>
          </div>

          {/* Step 3: Run */}
          <div>
            <div className="mb-2 flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                3
              </span>
              <h3 className="font-medium">Run</h3>
            </div>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Start the proxy. Your dashboard ships with it - no separate
              install.
            </p>
            <div className="flex-1 overflow-x-auto rounded-lg bg-gray-900 p-4">
              <pre className="font-mono text-sm leading-relaxed text-gray-300">
                <span className="text-gray-500">$</span>{" "}
                <span className="text-gray-200">npx @gethelio/proxy start</span>
                {"\n\n"}
                <span className="text-emerald-400">&#10003;</span> Proxy live on
                :3100{"\n"}
                <span className="text-emerald-400">&#10003;</span> Dashboard at{" "}
                <span className="text-blue-400">localhost:3100</span>
              </pre>
            </div>
          </div>
        </div>

        {/* Full config block */}
        <div className="mx-auto mt-12 max-w-3xl md:mt-16">
          <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-400">
            What a working{" "}
            <code className="font-mono text-[13px]">helio.yaml</code> looks
            like:
          </p>
          <div className="relative rounded-2xl bg-gray-900 shadow-xl before:pointer-events-none before:absolute before:-inset-5 before:border-y before:[border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] after:absolute after:-inset-5 after:-z-10 after:border-x after:[border-image:linear-gradient(to_bottom,transparent,--theme(--color-slate-300/.8),transparent)1] dark:before:[border-image:linear-gradient(to_right,transparent,--theme(--color-slate-600/.8),transparent)1] dark:after:[border-image:linear-gradient(to_bottom,transparent,--theme(--color-slate-600/.8),transparent)1]">
            {/* Terminal header */}
            <div className="flex items-center justify-between border-b border-gray-800 px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-700" />
                </div>
                <span className="ml-2 text-[13px] font-medium text-gray-400">
                  helio.yaml
                </span>
              </div>
            </div>
            {/* Code content */}
            <div className="max-h-[28rem] overflow-y-auto p-5">
              <pre className="font-mono text-sm leading-relaxed text-gray-400">
                <span className="text-gray-200">version</span>:{" "}
                <span className="text-blue-400">&apos;1&apos;</span>
                {"\n\n"}
                <span className="text-gray-200">upstream</span>:{"\n"}
                {"  "}
                <span className="text-gray-200">url</span>:{" "}
                <span className="text-blue-400">
                  &apos;http://localhost:3001/mcp&apos;
                </span>{" "}
                <span className="text-gray-600">
                  # Your existing MCP server
                </span>
                {"\n\n"}
                <span className="text-gray-200">listen</span>:{"\n"}
                {"  "}
                <span className="text-gray-200">port</span>:{" "}
                <span className="text-blue-400">3000</span>{" "}
                <span className="text-gray-600"># Helio listens here</span>
                {"\n\n"}
                <span className="text-gray-200">policies</span>:{"\n"}
                {"  "}
                <span className="text-gray-200">default</span>:{" "}
                <span className="text-blue-400">allow</span>
                {"\n\n"}
                {"  "}
                <span className="text-gray-200">rules</span>:{"\n"}
                {"    "}
                <span className="text-gray-600">
                  # Block destructive operations
                </span>
                {"\n"}
                {"    "}- <span className="text-gray-200">match</span>:{"\n"}
                {"        "}
                <span className="text-gray-200">tool</span>:{" "}
                <span className="text-blue-400">&apos;delete_*&apos;</span>
                {"\n"}
                {"      "}
                <span className="text-gray-200">action</span>:{" "}
                <span className="text-blue-400">deny</span>
                {"\n"}
                {"      "}
                <span className="text-gray-200">feedback</span>:{"\n"}
                {"        "}
                <span className="text-gray-200">message</span>:{" "}
                <span className="text-blue-400">
                  &apos;Destructive operations are disabled&apos;
                </span>
                {"\n\n"}
                {"    "}
                <span className="text-gray-600">
                  # Rate limit expensive API calls
                </span>
                {"\n"}
                {"    "}- <span className="text-gray-200">match</span>:{"\n"}
                {"        "}
                <span className="text-gray-200">tool</span>:{" "}
                <span className="text-blue-400">&apos;search_*&apos;</span>
                {"\n"}
                {"      "}
                <span className="text-gray-200">action</span>:{" "}
                <span className="text-blue-400">rate_limit</span>
                {"\n"}
                {"      "}
                <span className="text-gray-200">limits</span>:{"\n"}
                {"        "}
                <span className="text-gray-200">max_calls</span>:{" "}
                <span className="text-blue-400">100</span>
                {"\n"}
                {"        "}
                <span className="text-gray-200">window</span>:{" "}
                <span className="text-blue-400">1h</span>
                {"\n"}
                {"        "}
                <span className="text-gray-200">key</span>:{" "}
                <span className="text-blue-400">tool</span>
                {"\n\n"}
                {"    "}
                <span className="text-gray-600">
                  # Spend limit on payment tools
                </span>
                {"\n"}
                {"    "}- <span className="text-gray-200">match</span>:{"\n"}
                {"        "}
                <span className="text-gray-200">tool</span>:{" "}
                <span className="text-blue-400">
                  &apos;create_payment&apos;
                </span>
                {"\n"}
                {"      "}
                <span className="text-gray-200">action</span>:{" "}
                <span className="text-blue-400">spend_limit</span>
                {"\n"}
                {"      "}
                <span className="text-gray-200">limits</span>:{"\n"}
                {"        "}
                <span className="text-gray-200">max_spend</span>:{"\n"}
                {"          "}
                <span className="text-gray-200">field</span>:{" "}
                <span className="text-blue-400">&apos;$.amount&apos;</span>
                {"\n"}
                {"          "}
                <span className="text-gray-200">limit</span>:{" "}
                <span className="text-blue-400">5000</span>
                {"\n"}
                {"          "}
                <span className="text-gray-200">currency</span>:{" "}
                <span className="text-blue-400">&apos;GBP&apos;</span>
                {"\n"}
                {"          "}
                <span className="text-gray-200">window</span>:{" "}
                <span className="text-blue-400">24h</span>
                {"\n\n"}
                <span className="text-gray-200">audit</span>:{"\n"}
                {"  "}
                <span className="text-gray-200">storage</span>:{" "}
                <span className="text-blue-400">sqlite</span>
                {"\n"}
                {"  "}
                <span className="text-gray-200">retention</span>:{" "}
                <span className="text-blue-400">90d</span>
                {"\n"}
                {"  "}
                <span className="text-gray-200">include_responses</span>:{" "}
                <span className="text-blue-400">true</span>
                {"\n\n"}
                <span className="text-gray-200">dashboard</span>:{"\n"}
                {"  "}
                <span className="text-gray-200">enabled</span>:{" "}
                <span className="text-blue-400">true</span>
                {"\n"}
                {"  "}
                <span className="text-gray-200">port</span>:{" "}
                <span className="text-blue-400">3100</span>
                {"\n"}
                {"  "}
                <span className="text-gray-200">api_secret</span>:{" "}
                <span className="text-blue-400">
                  &apos;${"{HELIO_DASHBOARD_SECRET}"}&apos;
                </span>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
