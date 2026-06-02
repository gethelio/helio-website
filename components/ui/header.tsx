import Image from "next/image";
import Link from "next/link";
import Logo from "./logo";
import MobileMenu from "./mobile-menu";

export default function Header() {
  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-xs before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(var(--color-gray-100),var(--color-gray-200))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] dark:bg-gray-900/90 dark:shadow-black/[0.2] dark:before:[background:linear-gradient(var(--color-gray-800),var(--color-gray-700))_border-box]">
          {/* Site branding */}
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            {/* Desktop menu links */}
            <ul className="flex grow flex-wrap items-center justify-center gap-4 text-sm lg:gap-8">
              <li className="px-3 py-1">
                <Link
                  href="/about"
                  className="flex items-center text-gray-700 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  About
                </Link>
              </li>
              <li className="px-3 py-1">
                <Link
                  href="/blog"
                  className="flex items-center text-gray-700 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  Blog
                </Link>
              </li>
              <li className="px-3 py-1">
                <Link
                  href="https://github.com/gethelio/helio/blob/main/docs/getting-started.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 transition hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  Docs
                </Link>
              </li>
            </ul>
          </nav>

          {/* Desktop github links */}
          <ul className="flex flex-1 items-center justify-end gap-3">
            <li>
              <Link
                href="https://github.com/gethelio/helio"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-sm bg-gray-800 text-gray-200 shadow-sm hover:bg-gray-900 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
              >
                <Image
                  className="mr-2"
                  src="/images/logo-02-light.svg"
                  alt="GitHub"
                  width={16}
                  height={16}
                />
                GitHub
              </Link>
            </li>
          </ul>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
