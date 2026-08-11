"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { Facets, IncidentSummary } from "@/lib/incidents";
import {
  applyFilters,
  FILTER_DIMENSIONS,
  readActiveFilters,
} from "@/lib/incident-filters";
import IncidentFilters from "./incident-filters";
import IncidentResults from "./incident-results";

/**
 * Filtering, with the query string as the only source of truth.
 *
 * There is no local filter state: what the URL says is what is rendered. That
 * makes a filtered view linkable and reload-proof, and removes the class of bug
 * where the two disagree after a back-navigation.
 *
 * All of it runs client-side over the embedded dataset. At this size
 * `Array.filter` over a few dozen entries is not worth improving on.
 */
export default function IncidentList({
  incidents,
  facets,
}: {
  incidents: IncidentSummary[];
  facets: Facets;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const active = useMemo(() => readActiveFilters(searchParams), [searchParams]);
  const filtered = useMemo(
    () => applyFilters(incidents, active),
    [incidents, active],
  );

  const commit = useCallback(
    (params: URLSearchParams) => {
      const query = params.toString();
      // replace, not push: changing a filter is not a navigation, and pushing
      // would bury the page a user arrived on under a stack of filter states.
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const handleChange = useCallback(
    (param: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(param, value);
      else params.delete(param);
      commit(params);
    },
    [commit, searchParams],
  );

  const handleClear = useCallback(() => {
    // Drops our params and leaves anything else in the URL alone — campaign
    // tags and the like are not ours to remove.
    const params = new URLSearchParams(searchParams.toString());
    for (const dimension of FILTER_DIMENSIONS) params.delete(dimension.param);
    commit(params);
  }, [commit, searchParams]);

  return (
    <>
      <IncidentFilters
        facets={facets}
        active={active}
        onChange={handleChange}
        onClear={handleClear}
      />
      <IncidentResults incidents={filtered} total={incidents.length} />
    </>
  );
}
