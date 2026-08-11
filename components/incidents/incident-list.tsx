import type { IncidentSummary } from "@/lib/incidents";
import IncidentCard from "./incident-card";

/**
 * The results list.
 *
 * Deliberately still a server component: it has no interactivity yet, so making
 * it a client component now would ship JavaScript that does nothing. The props
 * boundary is already the right shape for the filters that come next — only the
 * `"use client"` directive and the filter state need adding.
 */
export default function IncidentList({
  incidents,
}: {
  incidents: IncidentSummary[];
}) {
  if (incidents.length === 0) {
    return <p className="text-gray-500">No entries match these filters.</p>;
  }

  return (
    <div>
      {incidents.map((incident) => (
        <IncidentCard key={incident.id} incident={incident} />
      ))}
    </div>
  );
}
