import Image from "next/image";
import Stripes from "@/public/images/stripes-dark.svg";
import CopyButton from "./copy-button";

const INSTALL_COMMAND = "npx @gethelio/proxy init";

export default function Cta() {
  return (
    <section id="cta" className="py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-2xl text-center shadow-xl before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gray-900"
          data-aos="zoom-y-out"
        >
          {/* Glow */}
          <div
            className="absolute bottom-0 left-1/2 -z-10 -translate-x-1/2 translate-y-1/2"
            aria-hidden="true"
          >
            <div className="h-56 w-[480px] rounded-full border-[20px] border-blue-500 blur-3xl will-change-[filter]" />
          </div>
          {/* Stripes illustration */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 transform"
            aria-hidden="true"
          >
            <Image className="max-w-none" src={Stripes} alt="" />
          </div>
          <div className="px-4 py-12 md:px-12 md:py-20">
            <h2 className="mb-2 border-y text-3xl font-bold text-gray-200 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-700/.7),transparent)1] md:mb-6 md:text-4xl">
              See what your AI agents are actually doing
            </h2>
            <p className="mb-8 text-gray-400">
              Open source, local-first, free. Scaffolds your config - one more
              command boots the proxy and dashboard.
            </p>
            {/* Terminal with copy-to-clipboard */}
            <div className="mx-auto max-w-md text-left">
              <div className="overflow-hidden rounded-xl bg-gray-950 shadow-xl ring-1 ring-gray-800">
                {/* Terminal header */}
                <div className="flex items-center gap-2 border-b border-gray-800 px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-700" />
                  </div>
                </div>
                {/* Command + copy button */}
                <div className="flex items-center justify-between gap-3 px-4 py-3 font-mono text-sm">
                  <code className="overflow-x-auto whitespace-nowrap text-gray-200">
                    <span className="text-gray-500">$</span> {INSTALL_COMMAND}
                  </code>
                  <CopyButton text={INSTALL_COMMAND} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
