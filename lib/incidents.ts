/**
 * Agent Incident Log — build-time loader, types and derived views.
 *
 * Data comes from the public data repo `gethelio/agent-incident-log`, fetched
 * once at build time from its generated `dist/incidents.json`. There is no
 * submodule and no runtime dependency on GitHub: with `revalidate` set, the
 * payload is baked into the static output and refreshed at most weekly.
 *
 * SOURCE OF TRUTH for every shape below is `schema/incident.schema.json` in
 * that repo. The types here are hand-written mirrors and they *will* drift —
 * the log gained two controlled-vocabulary values (`saas_app`,
 * `unsafe_code_execution`) in a single day during drafting. So:
 *
 *   1. Every controlled vocabulary is an `OpenEnum`: the known values are
 *      listed for editor autocomplete, but an unknown string still type-checks.
 *      A new value upstream must never break this build.
 *   2. Filter facets are derived from the data (`getFacets`), never hardcoded,
 *      so new values appear in the UI automatically.
 *
 * Server-only. Client components must import from here with `import type`.
 */

import { cache } from "react";

/**
 * One week, in seconds.
 *
 * This is the self-heal guard: if the data repo's deploy hook silently fails,
 * ISR still rebuilds these routes within a week rather than leaving the site
 * stale indefinitely. Routes that render incidents re-export this as their
 * `revalidate`. Deliberately *not* `cache: "no-store"`, which would force
 * dynamic rendering and give up static generation for no benefit.
 *
 * Note: routes cannot `export const revalidate = INCIDENT_REVALIDATE_SECONDS`.
 * Next requires that segment config be a statically analyzable literal and
 * fails the build on an imported binding, so each route inlines `604800` and
 * refers back here in a comment. This constant governs the fetch itself.
 */
export const INCIDENT_REVALIDATE_SECONDS = 604_800;

/**
 * Cache tag for every fetch of the dataset, so the data repo can purge it on
 * merge via `/api/revalidate-incidents` instead of waiting out the week.
 *
 * This is what actually makes new entries appear promptly. A Vercel deploy hook
 * on its own does not: Next's Data Cache persists across deployments and Vercel
 * restores `.next/cache` between builds, so a rebuild triggered by a merge
 * re-serves the payload cached earlier and ships without the new entry — with
 * the build green and nothing to indicate it. Verified locally: two builds
 * sharing a cache, upstream changed between them, second build still rendered
 * the old seven entries.
 *
 * Purging this tag invalidates both the cached payload and every route that
 * rendered from it, including the sitemap and /incidents.json.
 */
export const INCIDENT_CACHE_TAG = "incidents";

const DEFAULT_INCIDENT_DATA_URL =
  "https://raw.githubusercontent.com/gethelio/agent-incident-log/main/dist/incidents.json";

/**
 * Overridable so local development can point at a checkout (`file:///…`) or a
 * branch without hitting GitHub on every `next dev` boot.
 */
function incidentDataUrl(): string {
  const configured = process.env.INCIDENT_DATA_URL?.trim();
  return configured ? configured : DEFAULT_INCIDENT_DATA_URL;
}

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * A union that keeps the known values discoverable without closing the set.
 * `string & {}` is the standard trick: it stops TypeScript collapsing the whole
 * union to `string` and losing autocomplete, while still accepting any string.
 */
type OpenEnum<Known extends string> = Known | (string & {});

export type Surface = OpenEnum<
  "coding_agent" | "browser_agent" | "chat_agent" | "pipeline" | "infrastructure"
>;

export type Tool = OpenEnum<
  | "database"
  | "repo"
  | "payments"
  | "comms"
  | "filesystem"
  | "browser"
  | "package_install"
  | "saas_app"
>;

export type Harm = OpenEnum<
  | "data_destruction"
  | "data_exfiltration"
  | "data_exposure"
  | "credential_exposure"
  | "unauthorized_state_change"
  | "unauthorized_system_access"
  | "financial_loss"
  | "service_disruption"
  | "malicious_code_distribution"
>;

export type HarmBearer = OpenEnum<
  "first_party" | "third_party" | "both" | "unclear"
>;

export type RootCause = OpenEnum<
  | "instruction_not_binding"
  | "missing_approval_gate"
  | "overscoped_credential"
  | "no_environment_matcher"
  | "no_third_party_identity_check"
  | "no_spend_limit"
  | "untrusted_content_as_instruction"
  | "malicious_tool_supply_chain"
  | "no_install_governance"
  | "tenant_isolation_failure"
  | "transport_design_flaw"
  | "hosting_platform_vulnerability"
  | "unsafe_code_execution"
  | "context_loss"
>;

export type PreventionVerdict = OpenEnum<
  "likely" | "partially" | "no" | "unclear"
>;

/**
 * Canonical display order for the distribution counter. Any verdict the log
 * adds later is appended after these rather than dropped — see
 * `getDistribution`.
 */
export const KNOWN_PREVENTION_VERDICTS = [
  "likely",
  "partially",
  "no",
  "unclear",
] as const;

export interface AgentStack {
  framework?: string;
  /** Absent more often than present: 2 of 3 populated stacks name no model. */
  model?: string;
}

export interface IncidentSource {
  url: string;
  title: string;
  publisher: string;
  /** ISO `YYYY-MM-DD`. */
  date: string;
  primary: boolean;
  /**
   * Backfilled by the log's monthly link checker when a source dies. Nothing
   * in the current data exercises this path — it will first appear in
   * production, without warning.
   */
  archive_url?: string;
}

export interface Incident {
  id: string;
  /** ISO `YYYY-MM-DD`. Sorting relies on this format. */
  date: string;
  title: string;
  /** May be the literal string `not disclosed` — a real value, not an empty state. */
  organization: string;
  scale: string;
  surface: Surface;
  agent_stack?: AgentStack;
  tools: Tool[];
  harm: Harm[];
  harm_bearer: HarmBearer;
  reversible: boolean;
  root_cause: RootCause[];
  prevented_by_action_governance: PreventionVerdict;
  /**
   * Only schema-required when the verdict is `likely` or `partially`. All seven
   * current entries carry one because the author chose to, but 7/7 is not a
   * contract — a future `no` or `unclear` entry may omit it.
   */
  control?: string;
  sources: IncidentSource[];
  /** AIID cross-reference; null until the data repo runs that pass. */
  aiid_incident?: number | null;
  /** Link to a matching Helio control pack; null until one genuinely fits. */
  helio_pack?: string | null;
  /** ISO `YYYY-MM-DD`. The anti-folklore mechanism — must stay visible to readers. */
  last_verified: string;
  /**
   * Markdown prose. Added by the data repo's dist build, so it is not in
   * `incident.schema.json` — do not go looking for it there.
   *
   * NEVER render this through `CustomMDX`. The log accepts community pull
   * requests and MDX executes JSX, which would make a merge in a public repo an
   * execution path into this site's build. Plain Markdown + `rehype-sanitize`
   * only.
   */
  body: string;
}

/**
 * What the index passes across the client boundary.
 *
 * Everything the filters and cards need, minus the three large fields they do
 * not: `body` and `control` are prose, and `sources` is only read on the entry
 * page. Dropping them keeps roughly 15 KB of Markdown out of the client bundle
 * at today's entry count, and that gap widens as the log grows.
 */
export type IncidentSummary = Omit<Incident, "body" | "control" | "sources">;

export function toIncidentSummary(incident: Incident): IncidentSummary {
  const { body, control, sources, ...summary } = incident;
  return summary;
}

export interface IncidentDataset {
  version: number;
  license: string;
  attribution: string;
  generated_at: string;
  count: number;
  /** Sorted newest first. */
  incidents: Incident[];
}

/* -------------------------------------------------------------------------- */
/* Validation                                                                 */
/* -------------------------------------------------------------------------- */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Keep build logs readable when a payload is badly wrong. */
const MAX_REPORTED_PROBLEMS = 20;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function describe(value: unknown): string {
  if (value === undefined) return "missing";
  if (value === null) return "null";
  if (Array.isArray(value)) return "an array";
  return `a ${typeof value}`;
}

function requireString(
  source: Record<string, unknown>,
  key: string,
  label: string,
  problems: string[],
): void {
  const value = source[key];
  if (typeof value !== "string" || value.trim() === "") {
    problems.push(`${label}.${key} is ${describe(value)}, expected a non-empty string`);
  }
}

/**
 * URLs in the data become `href` attributes, and `rehype-sanitize` never sees
 * them — it only guards prose. A contributor-supplied `javascript:` URL would
 * otherwise reach the DOM, because React renders those with a console warning
 * rather than blocking them. The schema's `format: "uri"` is no help either:
 * `javascript:alert(1)` is a perfectly valid URI.
 */
function isHttpUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

function requireHttpUrl(
  source: Record<string, unknown>,
  key: string,
  label: string,
  problems: string[],
): void {
  const value = source[key];
  if (isHttpUrl(value)) return;
  // Name the offending value: "is a string" is useless when the string is the
  // problem, and whoever sees this is debugging a broken deploy.
  const shown =
    typeof value === "string"
      ? JSON.stringify(value.length > 60 ? `${value.slice(0, 60)}…` : value)
      : describe(value);
  problems.push(`${label}.${key} is ${shown}, expected an http(s) URL`);
}

function requireIsoDate(
  source: Record<string, unknown>,
  key: string,
  label: string,
  problems: string[],
): void {
  const value = source[key];
  if (typeof value !== "string" || !ISO_DATE.test(value)) {
    problems.push(
      `${label}.${key} is ${describe(value)}, expected an ISO date (YYYY-MM-DD)`,
    );
  }
}

function requireStringArray(
  source: Record<string, unknown>,
  key: string,
  label: string,
  problems: string[],
): void {
  const value = source[key];
  if (!Array.isArray(value)) {
    problems.push(`${label}.${key} is ${describe(value)}, expected an array`);
    return;
  }
  if (value.length === 0) {
    problems.push(`${label}.${key} is empty, expected at least one value`);
    return;
  }
  value.forEach((item, index) => {
    if (typeof item !== "string" || item.trim() === "") {
      problems.push(
        `${label}.${key}[${index}] is ${describe(item)}, expected a non-empty string`,
      );
    }
  });
}

function validateSources(
  source: Record<string, unknown>,
  label: string,
  problems: string[],
): void {
  const value = source.sources;
  if (!Array.isArray(value)) {
    problems.push(`${label}.sources is ${describe(value)}, expected an array`);
    return;
  }
  // The schema floor is 2, but that is an editorial standard the log's own CI
  // enforces before merge. Duplicating it here would couple the site build to a
  // rule that protects the log, not the render. One source is enough to render.
  if (value.length === 0) {
    problems.push(`${label}.sources is empty, expected at least one source`);
    return;
  }
  value.forEach((entry, index) => {
    const entryLabel = `${label}.sources[${index}]`;
    if (!isRecord(entry)) {
      problems.push(`${entryLabel} is ${describe(entry)}, expected an object`);
      return;
    }
    requireHttpUrl(entry, "url", entryLabel, problems);
    requireString(entry, "title", entryLabel, problems);
    requireString(entry, "publisher", entryLabel, problems);
    requireIsoDate(entry, "date", entryLabel, problems);
    if (typeof entry.primary !== "boolean") {
      problems.push(
        `${entryLabel}.primary is ${describe(entry.primary)}, expected a boolean`,
      );
    }
    if (entry.archive_url !== undefined && entry.archive_url !== null) {
      requireHttpUrl(entry, "archive_url", entryLabel, problems);
    }
  });
}

function validateAgentStack(
  source: Record<string, unknown>,
  label: string,
  problems: string[],
): void {
  const value = source.agent_stack;
  // Absent for 4 of 7 entries. Treat null the same as absent.
  if (value === undefined || value === null) return;
  if (!isRecord(value)) {
    problems.push(`${label}.agent_stack is ${describe(value)}, expected an object`);
    return;
  }
  (["framework", "model"] as const).forEach((key) => {
    if (value[key] !== undefined && value[key] !== null) {
      requireString(value, key, `${label}.agent_stack`, problems);
    }
  });
}

function validateIncident(
  entry: unknown,
  index: number,
  seenIds: Set<string>,
  problems: string[],
): void {
  const label =
    isRecord(entry) && typeof entry.id === "string" && entry.id.trim() !== ""
      ? `incidents[${index}] (${entry.id})`
      : `incidents[${index}]`;

  if (!isRecord(entry)) {
    problems.push(`${label} is ${describe(entry)}, expected an object`);
    return;
  }

  requireString(entry, "id", label, problems);
  if (typeof entry.id === "string" && entry.id.trim() !== "") {
    // Duplicate ids would collide in generateStaticParams and silently drop a page.
    if (seenIds.has(entry.id)) {
      problems.push(`${label}.id is a duplicate of an earlier entry`);
    }
    seenIds.add(entry.id);
  }

  requireIsoDate(entry, "date", label, problems);
  requireIsoDate(entry, "last_verified", label, problems);
  requireString(entry, "title", label, problems);
  requireString(entry, "organization", label, problems);
  requireString(entry, "scale", label, problems);
  requireString(entry, "surface", label, problems);
  requireString(entry, "harm_bearer", label, problems);
  requireString(entry, "prevented_by_action_governance", label, problems);
  requireString(entry, "body", label, problems);

  requireStringArray(entry, "tools", label, problems);
  requireStringArray(entry, "harm", label, problems);
  requireStringArray(entry, "root_cause", label, problems);

  if (typeof entry.reversible !== "boolean") {
    problems.push(
      `${label}.reversible is ${describe(entry.reversible)}, expected a boolean`,
    );
  }

  // Conditionally required upstream; here it only has to be sane when present.
  if (entry.control !== undefined && entry.control !== null) {
    requireString(entry, "control", label, problems);
  }
  if (entry.aiid_incident !== undefined && entry.aiid_incident !== null) {
    if (typeof entry.aiid_incident !== "number") {
      problems.push(
        `${label}.aiid_incident is ${describe(entry.aiid_incident)}, expected a number or null`,
      );
    }
  }
  if (entry.helio_pack !== undefined && entry.helio_pack !== null) {
    requireHttpUrl(entry, "helio_pack", label, problems);
  }

  validateAgentStack(entry, label, problems);
  validateSources(entry, label, problems);
}

function fail(url: string, problems: string[]): never {
  const shown = problems.slice(0, MAX_REPORTED_PROBLEMS);
  const overflow = problems.length - shown.length;
  const lines = shown.map((problem) => `  - ${problem}`);
  if (overflow > 0) lines.push(`  - …and ${overflow} more`);
  throw new Error(
    `Agent Incident Log payload from ${url} is unusable ` +
      `(${problems.length} problem${problems.length === 1 ? "" : "s"}):\n` +
      lines.join("\n"),
  );
}

/**
 * Throws on anything short of a complete, non-empty dataset.
 *
 * This is deliberate. A thrown error in a server component fails the build,
 * and a build failure is the desired outcome here: a site that quietly deploys
 * with zero incidents is worse than one that does not deploy at all.
 */
function validateDataset(parsed: unknown, url: string): IncidentDataset {
  if (!isRecord(parsed)) {
    fail(url, [`payload is ${describe(parsed)}, expected a JSON object`]);
  }

  const problems: string[] = [];
  const { count, incidents } = parsed;

  if (typeof parsed.version !== "number") {
    problems.push(`version is ${describe(parsed.version)}, expected a number`);
  }
  requireString(parsed, "license", "dataset", problems);
  requireString(parsed, "attribution", "dataset", problems);
  requireString(parsed, "generated_at", "dataset", problems);

  // The floor check. Zero incidents is never a valid publish.
  if (!Array.isArray(incidents)) {
    problems.push(`incidents is ${describe(incidents)}, expected an array`);
  } else if (incidents.length === 0) {
    problems.push("incidents is empty — refusing to publish an empty log");
  }

  if (typeof count !== "number") {
    problems.push(`count is ${describe(count)}, expected a number`);
  } else if (count === 0) {
    problems.push("count is 0 — refusing to publish an empty log");
  } else if (Array.isArray(incidents) && count !== incidents.length) {
    problems.push(
      `count is ${count} but incidents has ${incidents.length} entries — payload is inconsistent`,
    );
  }

  if (Array.isArray(incidents)) {
    const seenIds = new Set<string>();
    incidents.forEach((entry, index) =>
      validateIncident(entry, index, seenIds, problems),
    );
  }

  if (problems.length > 0) fail(url, problems);

  const validated = incidents as Incident[];

  return {
    version: parsed.version as number,
    license: parsed.license as string,
    attribution: parsed.attribution as string,
    generated_at: parsed.generated_at as string,
    count: count as number,
    // ISO dates sort correctly as strings, which sidesteps timezone drift from
    // `new Date()`. Tie-break on id so the order is stable build to build.
    incidents: validated.slice().sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return a.id.localeCompare(b.id);
    }),
  };
}

/* -------------------------------------------------------------------------- */
/* Loading                                                                    */
/* -------------------------------------------------------------------------- */

async function readDataset(url: string, fresh: boolean): Promise<string> {
  if (url.startsWith("file://")) {
    // Local development against a checkout. Imported lazily so the module has
    // no top-level Node builtin dependency.
    const [{ readFile }, { fileURLToPath }] = await Promise.all([
      import("node:fs/promises"),
      import("node:url"),
    ]);
    return readFile(fileURLToPath(url), "utf-8");
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      // raw.githubusercontent sits behind a CDN with `max-age=300`, and cache
      // keying ignores the query string — a `?t=…` buster is measurably a
      // no-op there. A request `Cache-Control: no-cache` does reach past it.
      //
      // Without this, two publishes inside five minutes can leave the site a
      // week stale: the first warms the edge, the second purges our tag, and
      // the re-render is handed the first payload. Valid, current-looking, and
      // wrong, with a green workflow behind it.
      //
      // This is a request header, not a fetch `cache` option, so it changes
      // only what the CDN may answer with. Next still caches the response under
      // INCIDENT_CACHE_TAG with the weekly revalidate, and the routes stay
      // static — `cache: "no-store"` would be the thing that breaks that.
      "Cache-Control": "no-cache",
    },
    ...(fresh
      ? { cache: "no-store" as const }
      : {
          next: {
            revalidate: INCIDENT_REVALIDATE_SECONDS,
            tags: [INCIDENT_CACHE_TAG],
          },
        }),
  });

  if (!response.ok) {
    throw new Error(
      `Agent Incident Log fetch failed: ${response.status} ${response.statusText} from ${url}`,
    );
  }

  return response.text();
}

async function loadDataset(fresh: boolean): Promise<IncidentDataset> {
  const url = incidentDataUrl();
  const raw = await readDataset(url, fresh);

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `Agent Incident Log payload from ${url} is not valid JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  return validateDataset(parsed, url);
}

/**
 * The full dataset, envelope included. Wrapped in React `cache` so one render
 * pass fetches and validates once; Next's data cache handles reuse across
 * requests and across the pages generated in a single build.
 */
export const getIncidentDataset = cache(async (): Promise<IncidentDataset> => {
  return loadDataset(false);
});

/**
 * Fetches and validates upstream while bypassing the cache, throwing on
 * anything unusable.
 *
 * The revalidation endpoint calls this *before* purging the tag. Without that
 * pre-flight, a malformed merge in the data repo purges the cache, every route
 * re-renders, the loader throws, and /incidents, every entry page and
 * /incidents.json all return 500 on the live site — verified, not theorised.
 *
 * Checking first moves the failure back to where the plan wanted it: visible at
 * the source, with the last good data still being served.
 */
export async function verifyUpstreamDataset(): Promise<IncidentDataset> {
  return loadDataset(true);
}

/** All incidents, newest first. */
export async function getIncidents(): Promise<Incident[]> {
  const dataset = await getIncidentDataset();
  return dataset.incidents;
}

/** A single incident, or `undefined` so callers can `notFound()`. */
export async function getIncident(id: string): Promise<Incident | undefined> {
  const incidents = await getIncidents();
  return incidents.find((incident) => incident.id === id);
}

/* -------------------------------------------------------------------------- */
/* Derived views                                                              */
/* -------------------------------------------------------------------------- */

export interface DistributionEntry {
  verdict: PreventionVerdict;
  count: number;
}

export interface Distribution {
  total: number;
  /** Known verdicts in canonical order (including zeroes), then any unknown ones. */
  byVerdict: DistributionEntry[];
}

/**
 * Counts by `prevented_by_action_governance`, for the index counter and the
 * `Dataset` JSON-LD. Always computed, never hardcoded — the same numbers appear
 * in the data repo's hand-maintained README, which is already wrong there.
 */
export async function getDistribution(): Promise<Distribution> {
  const incidents = await getIncidents();

  const counts = new Map<string, number>();
  KNOWN_PREVENTION_VERDICTS.forEach((verdict) => counts.set(verdict, 0));
  incidents.forEach((incident) => {
    const verdict = incident.prevented_by_action_governance;
    counts.set(verdict, (counts.get(verdict) ?? 0) + 1);
  });

  const known: DistributionEntry[] = KNOWN_PREVENTION_VERDICTS.map((verdict) => ({
    verdict: verdict as PreventionVerdict,
    count: counts.get(verdict) ?? 0,
  }));

  // Anything the log has added since these types were written still shows up.
  const unknown: DistributionEntry[] = Array.from(counts.keys())
    .filter(
      (verdict) =>
        !(KNOWN_PREVENTION_VERDICTS as readonly string[]).includes(verdict),
    )
    .sort()
    .map((verdict) => ({ verdict, count: counts.get(verdict) ?? 0 }));

  return { total: incidents.length, byVerdict: known.concat(unknown) };
}

export interface Facets {
  surface: string[];
  tools: string[];
  harm: string[];
  harm_bearer: string[];
  root_cause: string[];
  prevented_by_action_governance: string[];
  /** From `agent_stack.framework`; absent on most entries. */
  framework: string[];
  reversible: boolean[];
  /** Newest first. */
  year: string[];
}

function sortedUnique(values: string[]): string[] {
  return Array.from(new Set(values)).sort();
}

/**
 * Filter facets derived from the data, not hardcoded. This is what keeps a new
 * controlled-vocabulary value upstream from needing a code change here.
 */
export async function getFacets(): Promise<Facets> {
  const incidents = await getIncidents();

  const frameworks: string[] = [];
  incidents.forEach((incident) => {
    const framework = incident.agent_stack?.framework;
    if (framework) frameworks.push(framework);
  });

  const reversible = Array.from(
    new Set(incidents.map((incident) => incident.reversible)),
  ).sort((a, b) => Number(b) - Number(a));

  return {
    surface: sortedUnique(incidents.map((incident) => incident.surface)),
    tools: sortedUnique(incidents.flatMap((incident) => incident.tools)),
    harm: sortedUnique(incidents.flatMap((incident) => incident.harm)),
    harm_bearer: sortedUnique(incidents.map((incident) => incident.harm_bearer)),
    root_cause: sortedUnique(
      incidents.flatMap((incident) => incident.root_cause),
    ),
    prevented_by_action_governance: sortedUnique(
      incidents.map((incident) => incident.prevented_by_action_governance),
    ),
    framework: sortedUnique(frameworks),
    reversible,
    year: sortedUnique(incidents.map((incident) => incident.date.slice(0, 4))).reverse(),
  };
}
