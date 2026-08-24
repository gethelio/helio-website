import { useState, useEffect, useRef, useCallback } from "react"
import { cn } from "@/lib/utils"
import { SITE_GITHUB } from "@/const"

const Logo = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#navbar-logo-round)">
      <circle cx="16" cy="16" r="16" fill="#111929" />
      <g opacity="0.84" clipPath="url(#navbar-logo-clip)">
        <path d="M19.1639 4.2114L16.7167 3.55566L14.6544 11.2523L12.7926 4.30373L10.3453 4.95946L12.3569 12.4669L7.34639 7.45637L5.55489 9.24787L11.0508 14.7438L4.20652 12.9099L3.55078 15.3571L11.029 17.3609C10.9434 16.9916 10.8981 16.6068 10.8981 16.2115C10.8981 13.413 13.1668 11.1443 15.9653 11.1443C18.7638 11.1443 21.0324 13.413 21.0324 16.2115C21.0324 16.6043 20.9877 16.9867 20.9031 17.3538L27.6995 19.1749L28.3552 16.7277L20.8472 14.7159L27.6919 12.8818L27.0362 10.4346L19.5285 12.4463L24.539 7.4358L22.7475 5.6443L17.3278 11.064L19.1639 4.2114Z" fill="white" />
        <path d="M20.896 17.3823C20.6861 18.2694 20.2432 19.0662 19.6354 19.7047L24.5591 24.6284L26.3506 22.8369L20.896 17.3823Z" fill="white" />
        <path d="M19.5857 19.7562C18.9706 20.3844 18.1932 20.8533 17.3215 21.0949L19.1131 27.7813L21.5603 27.1255L19.5857 19.7562Z" fill="white" />
        <path d="M17.2301 21.1194C16.8256 21.2233 16.4017 21.2786 15.9648 21.2786C15.4968 21.2786 15.0436 21.2151 14.6133 21.0963L12.8201 27.7889L15.2673 28.4446L17.2301 21.1194Z" fill="white" />
        <path d="M14.5268 21.0717C13.6684 20.8181 12.9048 20.3432 12.3023 19.7132L7.3665 24.649L9.158 26.4405L14.5268 21.0717Z" fill="white" />
        <path d="M12.2616 19.6695C11.6694 19.0355 11.238 18.2493 11.0326 17.3759L4.2141 19.2029L4.86983 21.6501L12.2616 19.6695Z" fill="white" />
      </g>
    </g>
    <defs>
      <clipPath id="navbar-logo-round">
        <circle cx="16" cy="16" r="16" />
      </clipPath>
      <clipPath id="navbar-logo-clip">
        <rect width="24.8889" height="29.8667" fill="white" transform="translate(3.55469 1.06641)" />
      </clipPath>
    </defs>
  </svg>
)

const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 4.5L6 7.5L9 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const MenuIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
)

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.157-1.11-1.465-1.11-1.465-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

const HELIO_GITHUB_URL = SITE_GITHUB
const INCIDENT_LOG_URL = "https://github.com/gethelio/agent-incident-log"
const HELIO_DOCS_URL = `${SITE_GITHUB}/tree/main/docs`

const resourcesItems = [
  {
    label: "Blog",
    href: "/blog/",
    description: "News, research, and practical guides from Helio",
    external: false,
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 6.75h-15A2.25 2.25 0 0 0 2.25 9v9a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 10.5h4.5V15H6v-4.5ZM13.5 10.5H18M13.5 15H18M6 3.75h12" />
      </svg>
    ),
  },
  {
    label: "Incident log",
    href: INCIDENT_LOG_URL,
    description: "Real incidents involving AI agents and tool use",
    external: true,
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H4.645c-1.73 0-2.813-1.874-1.948-3.374L10.052 3.38c.865-1.5 3.03-1.5 3.896 0l7.355 12.746Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5h.008v.008H12V16.5Z" />
      </svg>
    ),
  },
  {
    label: "Docs",
    href: HELIO_DOCS_URL,
    description: "Install, configure, and run the Helio proxy",
    external: true,
    icon: (
      <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25A8.966 8.966 0 0 1 18 3.75c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
]

const navLinks = [
  { label: "About", href: "/about/" },
  { label: "Pricing", href: "/#pricing" },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false)
  const resourcesDropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const resourcesDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const closeMobileMenu = useCallback(() => {
    setMobileOpen(false)
    setMobileResourcesOpen(false)
  }, [])

  const openResourcesDropdown = () => {
    if (resourcesDropdownTimeout.current) {
      clearTimeout(resourcesDropdownTimeout.current)
      resourcesDropdownTimeout.current = null
    }
    setResourcesOpen(true)
  }

  const closeResourcesDropdown = () => {
    resourcesDropdownTimeout.current = setTimeout(() => {
      setResourcesOpen(false)
    }, 150)
  }

  const handleNavClick = () => {
    closeMobileMenu()
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex flex-col items-center px-4 pt-4 sm:px-6",
      )}
    >
      <nav
        className={cn(
          "flex w-full max-w-3xl items-center justify-between rounded-full border p-1.5 transition-all duration-300",
          scrolled
            ? "border-gray-200 bg-white/95 shadow-xl shadow-gray-900/10 ring-1 ring-gray-900/5 backdrop-blur-xl"
            : "border-transparent bg-white/60 backdrop-blur-sm"
        )}
      >
        {/* Left: Logo */}
        <a href="/" className="flex items-center gap-2 rounded-full pr-4 transition-colors">
          <Logo />
          <span
            className="text-lg font-semibold text-gray-900"
            style={{ fontFamily: "'Bricolage Grotesque', system-ui, sans-serif" }}
          >
            Helio
          </span>
        </a>

        {/* Center: Desktop nav links */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              {link.label}
            </a>
          ))}

          {/* Resources Dropdown */}
          <div
            ref={resourcesDropdownRef}
            className="relative"
            onMouseEnter={openResourcesDropdown}
            onMouseLeave={closeResourcesDropdown}
          >
            <button
              className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              onClick={() => setResourcesOpen(!resourcesOpen)}
            >
              Resources
              <ChevronDown
                className={cn(
                  "transition-transform duration-200",
                  resourcesOpen && "rotate-180"
                )}
              />
            </button>

            {/* Dropdown Panel */}
            <div
              className={cn(
                "absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 transition-all duration-200",
                resourcesOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible translate-y-2 opacity-0"
              )}
            >
              <div className="w-64 rounded-xl border border-gray-200 bg-white p-2 shadow-xl shadow-gray-950/5">
                {resourcesItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="group/item flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-main-50 text-main-600">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.label}
                      </div>
                      <div className="mt-0.5 text-xs text-gray-500">
                        {item.description}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          <a
            href={HELIO_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-9 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Helio on GitHub"
          >
            <GithubIcon />
          </a>
          <a
            href={`${SITE_GITHUB}/blob/main/docs/getting-started.md`}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white transition-all duration-300 hover:bg-gray-800"
            aria-label="Read the Helio quickstart"
          >
            Quickstart
          </a>

          {/* Mobile hamburger */}
          <button
            className="flex size-9 items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => mobileOpen ? closeMobileMenu() : setMobileOpen(true)}
          >
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* Mobile menu backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-[-1] bg-black/40 transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile menu panel - drops down from below the navbar */}
      <div
        className={cn(
          "w-full max-w-3xl overflow-hidden rounded-2xl border bg-white shadow-xl shadow-gray-950/5 transition-all duration-300 ease-out lg:hidden",
          mobileOpen
            ? "mt-2 max-h-[calc(85vh-4rem)] opacity-100"
            : "pointer-events-none mt-0 max-h-0 border-transparent opacity-0"
        )}
      >
        <div className="max-h-[calc(85vh-4rem)] overflow-y-auto">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
                onClick={handleNavClick}
              >
                {link.label}
              </a>
            ))}

            {/* Resources accordion */}
            <button
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
              onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
            >
              Resources
              <ChevronDown
                className={cn(
                  "text-gray-400 transition-transform duration-200",
                  mobileResourcesOpen && "rotate-180"
                )}
              />
            </button>
            <div
              className={cn(
                "grid transition-all duration-200",
                mobileResourcesOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <div className="space-y-1 pb-2 pl-3">
                  {resourcesItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50"
                      onClick={handleNavClick}
                    >
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-main-50 text-main-600">
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          {item.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.description}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <hr className="my-3 border-gray-100" />

            <a
              href={HELIO_GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
              onClick={handleNavClick}
              aria-label="Helio on GitHub"
            >
              <GithubIcon />
              GitHub
            </a>
            <div className="px-3 pt-2">
              <a
                href={`${SITE_GITHUB}/blob/main/docs/getting-started.md`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Read the Helio quickstart"
                className="flex w-full items-center justify-center rounded-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
              >
                Quickstart
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
