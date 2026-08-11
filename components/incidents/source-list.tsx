import type { Incident } from "@/lib/incidents";
import { safeExternalUrl } from "@/lib/incident-format";
import PostDate from "@/components/post-date";

/**
 * The entry's sources, with publisher and date visible on every row.
 *
 * A reference work is only as good as its provenance, so this is deliberately
 * an ordered list: the numbers are citable, not decorative. `last_verified` is
 * repeated here even though it also appears in the front matter — it is the
 * log's anti-folklore mechanism, and it only works if a reader actually sees it
 * next to the claims it dates.
 */
export default function SourceList({
  sources,
  lastVerified,
}: {
  sources: Incident["sources"];
  lastVerified: string;
}) {
  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="mb-5 text-lg font-bold text-gray-900">Sources</h2>
      <ol className="space-y-5">
        {sources.map((source, index) => {
          // Both URLs come from contributor-supplied front matter, which the
          // Markdown sanitizer never sees. A source whose URL is unusable still
          // gets cited — the title, publisher and date are the citation; the
          // link is a convenience.
          const url = safeExternalUrl(source.url);
          const archiveUrl = safeExternalUrl(source.archive_url);

          return (
            <li key={source.url} className="flex gap-3 text-sm">
              <span className="shrink-0 tabular-nums text-gray-400">
                {index + 1}.
              </span>
              <div>
                {url ? (
                  <a
                    className="font-medium text-blue-500 transition-colors hover:text-blue-600 hover:underline"
                    href={url}
                  >
                    {source.title}
                  </a>
                ) : (
                  <span className="font-medium text-gray-900">
                    {source.title}
                  </span>
                )}
                <div className="mt-0.5 text-gray-500">
                  {source.publisher} · <PostDate dateString={source.date} />
                  {source.primary && (
                    <span className="ml-2 text-gray-400">Primary source</span>
                  )}
                </div>
                {archiveUrl && (
                  <a
                    className="mt-0.5 inline-block text-gray-500 underline decoration-gray-300 underline-offset-2 transition-colors hover:text-gray-700"
                    href={archiveUrl}
                  >
                    Archived copy
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <p className="mt-6 text-sm text-gray-500">
        Sources last verified on <PostDate dateString={lastVerified} />.
      </p>
    </section>
  );
}
