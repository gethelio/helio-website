/**
 * Structured data for the incident log.
 *
 * Schema.org has no incident type, so entries are published as `Report` (an
 * `Article` subtype of `CreativeWork`) with their sources as `citation`, and
 * the index as a `Dataset` whose `distribution` points at `/incidents.json`.
 * That second one is what makes the log legible to search and to AI answer
 * engines as a citable dataset rather than a blog category.
 */

import type { Distribution, Incident, IncidentSummary } from "@/lib/incidents";
import { humanizeValue, incidentExcerpt } from "@/lib/incident-format";

export { serializeJsonLd } from "@/lib/json-ld";

export const SITE_URL = "https://helio.so";
const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";
const DATASET_URL = `${SITE_URL}/incidents`;

const PUBLISHER = {
  "@type": "Organization",
  name: "Helio",
  url: SITE_URL,
};

/**
 * Google ignores `headline` past 110 characters, which costs the entry its
 * rich result entirely. Today's longest title is 93, so nothing truncates yet —
 * this exists so entry number forty with a long title degrades to a clipped
 * headline instead of silently dropping out. `name` below keeps the full title,
 * so nothing is lost to a consumer reading the data properly.
 */
const GOOGLE_HEADLINE_LIMIT = 110;

function headlineFor(title: string): string {
  if (title.length <= GOOGLE_HEADLINE_LIMIT) return title;
  const clipped = title.slice(0, GOOGLE_HEADLINE_LIMIT - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : clipped.length).trimEnd()}…`;
}

function keywordsFor(incident: IncidentSummary): string[] {
  return [
    incident.surface,
    ...incident.tools,
    ...incident.harm,
    ...incident.root_cause,
  ].map(humanizeValue);
}

/** One entry, as a `Report` with its sources attached as citations. */
export function incidentReportJsonLd(incident: Incident) {
  const url = `${SITE_URL}/incidents/${incident.id}`;

  return {
    "@context": "https://schema.org",
    "@type": "Report",
    "@id": url,
    url,
    mainEntityOfPage: url,
    headline: headlineFor(incident.title),
    name: incident.title,
    abstract: incident.scale,
    description: incidentExcerpt(incident.body),
    datePublished: incident.date,
    // The log re-checks entries rather than freezing them, so the verification
    // date is the honest modification date.
    dateModified: incident.last_verified,
    inLanguage: "en",
    license: LICENSE_URL,
    isAccessibleForFree: true,
    image: `${SITE_URL}/og-image.jpg`,
    author: PUBLISHER,
    publisher: PUBLISHER,
    keywords: keywordsFor(incident),
    /**
     * A bare node reference, not an inline Dataset.
     *
     * Google validates every `Dataset` node it finds, wherever it appears. An
     * inline stub here — `@type` plus name and url — was reported by the Rich
     * Results Test as `1 invalid item detected: missing field "description"`,
     * because it read the reference as a dataset defined on this page rather
     * than a pointer to one. Dropping `@type` leaves an ordinary IRI reference:
     * the Dataset stays defined once, canonically, on the index, and the entry
     * page tests clean.
     *
     * Filling in `description` here instead would also validate, but it would
     * assert that every entry page *is* a dataset, and restate the index's
     * description on all of them.
     */
    isPartOf: { "@id": DATASET_URL },
    citation: incident.sources.map((source) => ({
      "@type": "CreativeWork",
      name: source.title,
      url: source.url,
      datePublished: source.date,
      publisher: { "@type": "Organization", name: source.publisher },
    })),
  };
}

/**
 * The index, as a `Dataset`.
 *
 * The description carries the computed distribution so the honest counter is
 * machine-readable too — a consumer that only reads the structured data still
 * gets the entries action governance would *not* have prevented.
 */
export function incidentDatasetJsonLd({
  incidents,
  distribution,
  description,
}: {
  incidents: IncidentSummary[];
  distribution: Distribution;
  description: string;
}) {
  const dates = incidents.map((incident) => incident.date).sort();
  const verified = incidents.map((incident) => incident.last_verified).sort();

  const breakdown = distribution.byVerdict
    .map((entry) => `${entry.verdict.replace(/_/g, " ")} ${entry.count}`)
    .join(", ");

  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": DATASET_URL,
    url: DATASET_URL,
    name: "Agent Incident Log",
    description:
      `${description} Of ${distribution.total} ` +
      `${distribution.total === 1 ? "entry" : "entries"}: ${breakdown}.`,
    license: LICENSE_URL,
    isAccessibleForFree: true,
    inLanguage: "en",
    creator: PUBLISHER,
    publisher: PUBLISHER,
    keywords: [
      "AI agent incidents",
      "agent governance",
      "MCP security",
      "AI safety incidents",
    ],
    ...(dates.length > 0 && {
      temporalCoverage: `${dates[0]}/${dates[dates.length - 1]}`,
      dateModified: verified[verified.length - 1],
    }),
    distribution: [
      {
        "@type": "DataDownload",
        name: "Agent Incident Log (JSON)",
        encodingFormat: "application/json",
        contentUrl: `${SITE_URL}/incidents.json`,
      },
    ],
  };
}
