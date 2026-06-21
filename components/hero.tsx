import Image from "next/image";
import PageIllustration from "@/components/page-illustration";

export default function Hero() {
  return (
    <section id="hero" className="relative">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-16">
            <div className="sm:mb-8 mb-4 sm:flex sm:justify-center">
              <a
                href="https://github.com/gethelio/helio"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-600 dark:hover:ring-gray-500"
              >
                <Image
                  className="dark:invert"
                  src="/images/logo-02.svg"
                  alt="GitHub"
                  width={16}
                  height={16}
                />
                Star on GitHub
              </a>
            </div>

            <h1
              className="mb-6 border-y text-5xl font-bold [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] dark:[border-image:linear-gradient(to_right,transparent,--theme(--color-slate-600/.8),transparent)1] md:text-6xl"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              Let your AI agents run <br className="max-lg:hidden" />
              unsupervised
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-lg text-gray-700 dark:text-gray-300"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                Helio enforces the limits your agent can't bypass — what it can
                spend, what needs your sign-off and what it can never touch. It
                runs as a proxy in front of your tools, so there's nothing to
                skip and no code to change.{" "}
                <strong>
                  Open-source, self-hosted and works with any MCP agent.
                </strong>
              </p>
              <div className="relative before:absolute before:inset-0 before:border-y before:[border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1]">
                <div
                  className="relative mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay={450}
                >
                  <a
                    className="btn group mb-4 w-full bg-linear-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-sm hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
                    href="https://github.com/gethelio/helio/blob/main/docs/getting-started.md"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="relative inline-flex items-center">
                      Get Started{" "}
                      <span className="ml-1 tracking-normal text-blue-300 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </a>
                  <a
                    className="btn w-full bg-gray-800 text-gray-200 shadow-sm hover:bg-gray-900 sm:ml-4 sm:w-auto dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
                    href="https://github.com/gethelio/helio"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      className="mr-2"
                      src="/images/logo-02-light.svg"
                      alt="GitHub"
                      width={16}
                      height={16}
                    />
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Hero image */}
          <div
            className="mx-auto max-w-3xl"
            data-aos="zoom-y-out"
            data-aos-delay={600}
          >
            <div className="relative rounded-2xl bg-gray-900 shadow-xl before:pointer-events-none before:absolute before:-inset-5 before:border-y before:[border-image:linear-gradient(to_right,transparent,--theme(--color-slate-300/.8),transparent)1] after:absolute after:-inset-5 after:-z-10 after:border-x after:[border-image:linear-gradient(to_bottom,transparent,--theme(--color-slate-300/.8),transparent)1] dark:before:[border-image:linear-gradient(to_right,transparent,--theme(--color-slate-600/.8),transparent)1] dark:after:[border-image:linear-gradient(to_bottom,transparent,--theme(--color-slate-600/.8),transparent)1]">
              {/* Terminal header */}
              <div className="flex items-center gap-2 border-b border-gray-800 px-5 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-700" />
                </div>
                <span className="ml-2 text-[13px] font-medium text-gray-400">
                  Terminal
                </span>
              </div>
              {/* Animated terminal content */}
              <div className="px-5 py-5 font-mono text-sm leading-relaxed text-gray-500 [&_span]:opacity-0">
                <span className="animate-[code-1_10s_infinite] text-gray-200">
                  $ npx @gethelio/proxy init
                </span>
                <br />
                <span className="animate-[code-2_10s_infinite] text-gray-400">
                  &#9656; Scaffolding project in ./helio
                </span>
                <br />
                <span className="animate-[code-2_10s_infinite] text-gray-500">
                  {"  "}Created helio.yaml
                </span>
                <br />
                <span className="animate-[code-2_10s_infinite] text-gray-500">
                  {"  "}Created policies/default.yaml
                </span>
                <br />
                <span className="animate-[code-2_10s_infinite] text-emerald-400">
                  &#10003; Done. Run{" "}
                  <span className="animate-[code-2_10s_infinite] text-white">
                    npx @gethelio/proxy start
                  </span>{" "}
                  to launch the proxy.
                </span>
                <br />
                <br />
                <span className="animate-[code-3_10s_infinite] text-gray-200">
                  $ npx @gethelio/proxy start
                </span>
                <br />
                <span className="animate-[code-4_10s_infinite] text-gray-500">
                  Loading config from helio.yaml...
                </span>
                <br />
                <span className="animate-[code-4_10s_infinite] text-gray-500">
                  Registered 2 policy rules
                </span>
                <br />
                <span className="animate-[code-5_10s_infinite] text-emerald-400">
                  &#10003; Proxy listening on :3100
                </span>
                <br />
                <span className="animate-[code-6_10s_infinite] text-emerald-400">
                  &#10003; Dashboard at{" "}
                  <span className="animate-[code-6_10s_infinite] text-blue-400">
                    http://localhost:3100
                  </span>
                </span>
                <br />
                <span className="animate-[code-6_10s_infinite] text-gray-600">
                  Waiting for connections...
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
