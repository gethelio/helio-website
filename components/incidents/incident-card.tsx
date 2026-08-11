import Link from "next/link";
import type { IncidentSummary } from "@/lib/incidents";
import { humanizeList, humanizeValue } from "@/lib/incident-format";
import PostDate from "@/components/post-date";

/**
 * One row of the index.
 *
 * `scale` carries the summary line rather than an excerpt of the prose: it is
 * the log's own one-sentence statement of what was actually lost, which is what
 * a reader scanning for relevance needs.
 */
export default function IncidentCard({
  incident,
}: {
  incident: IncidentSummary;
}) {
  return (
    <article className="border-t border-gray-200 dark:border-gray-800 py-6 first:border-t-0 first:pt-0">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <PostDate dateString={incident.date} /> · {incident.organization}
      </div>
      <h2 className="mt-1 text-xl font-bold">
        <Link href={`/incidents/${incident.id}`} className="hover:underline">
          {incident.title}
        </Link>
      </h2>
      <p className="mt-2 text-gray-700 dark:text-gray-300">{incident.scale}</p>
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
        {humanizeValue(incident.surface)} · {humanizeList(incident.harm)} ·
        Action governance:{" "}
        {humanizeValue(incident.prevented_by_action_governance)}
      </p>
    </article>
  );
}
