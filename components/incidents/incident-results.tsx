import type { IncidentSummary } from "@/lib/incidents";
import IncidentCard from "./incident-card";

/**
 * The results list and its count.
 *
 * Deliberately free of hooks and state so it renders in two places: inside the
 * client filter component, and as the Suspense fallback on the index. That
 * second use is what puts every entry into the statically prerendered HTML —
 * without it, a page whose list depends on `useSearchParams` ships with an
 * empty results area to crawlers and to anyone without JavaScript.
 */
export default function IncidentResults({
  incidents,
  total,
}: {
  incidents: IncidentSummary[];
  total: number;
}) {
  const shown = incidents.length;

  return (
    <>
      <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        {shown === total
          ? `${total} ${total === 1 ? "entry" : "entries"}`
          : `${shown} of ${total} ${total === 1 ? "entry" : "entries"}`}
      </p>

      {shown === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">
          No entries match these filters. Clear one to widen the search.
        </p>
      ) : (
        <div>
          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
      )}
    </>
  );
}
