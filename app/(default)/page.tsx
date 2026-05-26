import type { Metadata } from "next";
import WhyHelio from "@/components/why-helio";
import Features from "@/components/features";
import Cta from "@/components/cta";
import ComparisonTable from "@/components/comparison-table";
import HowItWorks from "@/components/how-it-works";
import Hero from "@/components/hero";
import Integrations from "@/components/integrations";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Static JSON-LD structured data — no user input, safe to inline.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Helio",
  applicationCategory: "DeveloperApplication",
  description:
    "Open-source MCP proxy that adds policies, approvals, audit trails, and spend limits to Claude, ChatGPT, Cursor, LangChain, CrewAI, and any MCP-compatible agent.",
  url: "https://helio.so",
  operatingSystem: "Web",
  license: "https://www.apache.org/licenses/LICENSE-2.0",
  offers: {
    "@type": "Offer",
    availability: "https://schema.org/InStock",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Integrations />
      <WhyHelio />
      <HowItWorks />
      <Features />
      <ComparisonTable />
      <Cta />
    </>
  );
}
