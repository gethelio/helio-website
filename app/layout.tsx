import "./css/style.css";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

const SITE_TITLE = "Helio - Open-Source MCP Governance for AI Agents";
const SITE_DESCRIPTION =
  "Open-source MCP proxy that adds policies, approvals, audit trails, and spend limits to Claude, ChatGPT, Cursor, LangChain, CrewAI, and any MCP-compatible agent.";
const SOCIAL_DESCRIPTION =
  "The open-source governance layer for AI agents. Policies, approvals, audit trails, and spend limits for Claude, ChatGPT, Cursor, LangChain, CrewAI - no agent code changes.";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  metadataBase: new URL("https://helio.so"),
  openGraph: {
    title: SITE_TITLE,
    description: SOCIAL_DESCRIPTION,
    url: "https://helio.so",
    siteName: "Helio",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SOCIAL_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  keywords: [
    "MCP governance",
    "MCP proxy",
    "AI agent governance",
    "AI agent guardrails",
    "agent approval workflow",
    "AI audit trail",
    "agent transaction controls",
    "Claude governance",
    "LangChain governance",
    "open source AI safety",
  ],
};

// Static inline script to prevent flash of wrong theme on load.
// This is a hardcoded string with no user input — safe to inline.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})()`;

const organizationJsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Helio",
  url: "https://helio.so",
  logo: "https://helio.so/favicon.png",
  description:
    "Open-source MCP governance proxy for AI agents. Policies, approvals, audit trails, and spend limits without touching your agent code.",
  sameAs: [
    "https://github.com/gethelio/helio",
    "https://x.com/get_helio",
    "https://www.linkedin.com/company/get-helio/",
  ],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          {...{ dangerouslySetInnerHTML: { __html: organizationJsonLd } }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} bg-gray-50 font-inter tracking-tight text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100`}
      >
        <ThemeProvider>
          <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
            {children}
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
