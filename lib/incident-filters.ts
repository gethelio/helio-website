/**
 * Filter dimensions for the incident index.
 *
 * Every option list is read from `getFacets()`, which derives values from the
 * data. Nothing here enumerates a controlled vocabulary, so a value the log
 * adds upstream becomes a filter option on the next build with no code change.
 * The `param` names are deliberately short and readable — these end up in
 * shared URLs, and "every third-party-harm incident" is exactly the kind of
 * link that gets cited.
 */

import type { Facets, IncidentSummary } from "@/lib/incidents";
import { humanizeValue } from "@/lib/incident-format";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDimension {
  /** Query-string key. */
  param: string;
  label: string;
  options(facets: Facets): FilterOption[];
  matches(incident: IncidentSummary, value: string): boolean;
}

function humanized(values: string[]): FilterOption[] {
  return values.map((value) => ({ value, label: humanizeValue(value) }));
}

function verbatim(values: string[]): FilterOption[] {
  // Framework names and years are already human-readable, and forcing them
  // through humanizeValue would turn "OpenClaw" into "Openclaw".
  return values.map((value) => ({ value, label: value }));
}

export const FILTER_DIMENSIONS: FilterDimension[] = [
  {
    param: "surface",
    label: "Surface",
    options: (facets) => humanized(facets.surface),
    matches: (incident, value) => incident.surface === value,
  },
  {
    param: "tool",
    label: "Tool",
    options: (facets) => humanized(facets.tools),
    matches: (incident, value) => incident.tools.indexOf(value) !== -1,
  },
  {
    param: "harm",
    label: "Harm",
    options: (facets) => humanized(facets.harm),
    matches: (incident, value) => incident.harm.indexOf(value) !== -1,
  },
  {
    param: "harmed",
    label: "Who was harmed",
    options: (facets) => humanized(facets.harm_bearer),
    matches: (incident, value) => incident.harm_bearer === value,
  },
  {
    param: "cause",
    label: "Root cause",
    options: (facets) => humanized(facets.root_cause),
    matches: (incident, value) => incident.root_cause.indexOf(value) !== -1,
  },
  {
    param: "reversible",
    label: "Reversible",
    // `humanized` rather than a Yes/No map: the values are strings now, and
    // `unclear` has to render as itself rather than collapsing into "No".
    options: (facets) => humanized(facets.reversible),
    matches: (incident, value) => incident.reversible === value,
  },
  {
    param: "prevented",
    label: "Action governance",
    options: (facets) => humanized(facets.prevented_by_action_governance),
    matches: (incident, value) =>
      incident.prevented_by_action_governance === value,
  },
  {
    param: "framework",
    label: "Framework",
    options: (facets) => verbatim(facets.framework),
    matches: (incident, value) => incident.agent_stack?.framework === value,
  },
  {
    param: "year",
    label: "Year",
    options: (facets) => verbatim(facets.year),
    matches: (incident, value) => incident.date.slice(0, 4) === value,
  },
];

export type ActiveFilters = Record<string, string>;

/** Reads only the params we recognise, ignoring anything else in the URL. */
export function readActiveFilters(
  searchParams: URLSearchParams | ReadonlyURLSearchParams,
): ActiveFilters {
  const active: ActiveFilters = {};
  for (const dimension of FILTER_DIMENSIONS) {
    const value = searchParams.get(dimension.param);
    if (value) active[dimension.param] = value;
  }
  return active;
}

/**
 * OR is not offered within a dimension and AND is implied across them: one
 * value per dimension, every active dimension must match. At this dataset's
 * size that is all the expressiveness the index needs, and it keeps shared
 * URLs legible.
 */
export function applyFilters(
  incidents: IncidentSummary[],
  active: ActiveFilters,
): IncidentSummary[] {
  const dimensions = FILTER_DIMENSIONS.filter((d) => active[d.param]);
  if (dimensions.length === 0) return incidents;
  return incidents.filter((incident) =>
    dimensions.every((d) => d.matches(incident, active[d.param])),
  );
}

/** Minimal structural type so this module needs no next/navigation import. */
interface ReadonlyURLSearchParams {
  get(name: string): string | null;
}
