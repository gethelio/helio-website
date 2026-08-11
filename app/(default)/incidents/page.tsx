import type { Metadata } from "next";
import { Suspense } from "react";

import {
  getDistribution,
  getFacets,
  getIncidents,
  toIncidentSummary,
} from "@/lib/incidents";
import {
  incidentDatasetJsonLd,
  serializeJsonLd,
} from "@/lib/incident-jsonld";
import DistributionCounter from "@/components/incidents/distribution-counter";
import IncidentList from "@/components/incidents/incident-list";
import IncidentResults from "@/components/incidents/incident-results";
import PageIllustration from "@/components/page-illustration";

// Literal on purpose — Next rejects an imported binding here. See
// INCIDENT_REVALIDATE_SECONDS in lib/incidents.ts.
export const revalidate = 604800;

const DESCRIPTION =
  "Real incidents involving AI agents with tool access - what happened, what the agent could reach, and whether action governance would have stopped it.";

export const metadata: Metadata = {
  title: "Agent Incident Log - Real AI agent failures, sourced and dated",
  description: DESCRIPTION,
  alternates: { canonical: "/incidents" },
  openGraph: {
    title: "Agent Incident Log",
    description: DESCRIPTION,
    type: "website",
    url: "/incidents",
    // Next merges metadata shallowly, so naming openGraph at all drops the root
    // layout's card. Restate it rather than ship a blank preview.
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Agent Incident Log",
    description: DESCRIPTION,
    images: ["/og-image.jpg"],
  },
};

export default async function IncidentsIndex() {
  const [incidents, distribution, facets] = await Promise.all([
    getIncidents(),
    getDistribution(),
    getFacets(),
  ]);
  const summaries = incidents.map(toIncidentSummary);

  return (
    <section className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            incidentDatasetJsonLd({
              incidents: summaries,
              distribution,
              description: DESCRIPTION,
            }),
          ),
        }}
      />
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl pb-12 pt-32 md:pb-20 md:pt-40">
          <div className="pb-10">
            <h1 className="mb-4 text-5xl font-bold">Agent Incident Log</h1>
            <p className="text-lg text-gray-700">
              Real incidents involving AI agents with access to tools: what
              happened, what the agent could reach, and whether an action-layer
              control would have stopped it. Every entry is sourced, dated and
              re-checked.
            </p>
          </div>

          {/* Top of the page, per Phase 6.3 — the breakdown is the first thing
              a reader sees, including the entries action governance would not
              have prevented. Burying it below the entries would make the log an
              argument rather than a record. */}
          <div className="mb-10 rounded-lg border border-gray-200 bg-white p-6">
            <DistributionCounter distribution={distribution} />
          </div>

          {/* IncidentList reads the query string, which opts its subtree out of
              static prerendering. The fallback is the full unfiltered list, so
              every entry still lands in the static HTML — for crawlers, and for
              anyone whose JavaScript has not arrived or will not run. */}
          <Suspense
            fallback={
              <IncidentResults
                incidents={summaries}
                total={summaries.length}
              />
            }
          >
            <IncidentList incidents={summaries} facets={facets} />
          </Suspense>

          {/* A reference work that can only be read as HTML is one nobody can
              compute over. Plain <a> for the dataset — it is a file, not a
              route, so next/link's prefetching would be wrong. */}
          <p className="mt-12 border-t border-gray-200 pt-6 text-sm text-gray-500">
            Every entry is published under{" "}
            <a
              className="font-medium text-blue-500 transition-colors hover:text-blue-600 hover:underline"
              href="https://creativecommons.org/licenses/by/4.0/"
            >
              CC BY 4.0
            </a>
            . The full dataset is available as{" "}
            <a
              className="font-medium text-blue-500 transition-colors hover:text-blue-600 hover:underline"
              href="/incidents.json"
            >
              JSON
            </a>
            , and the log is maintained in the open at{" "}
            <a
              className="font-medium text-blue-500 transition-colors hover:text-blue-600 hover:underline"
              href="https://github.com/gethelio/agent-incident-log"
            >
              gethelio/agent-incident-log
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
