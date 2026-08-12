import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import { getIncident, getIncidents } from "@/lib/incidents";
import { renderIncidentMarkdown } from "@/lib/markdown";
import { humanizeValue, incidentExcerpt } from "@/lib/incident-format";
import { incidentReportJsonLd, serializeJsonLd } from "@/lib/incident-jsonld";
import { getPostsForIncident } from "@/components/mdx/utils";
import IncidentMeta from "@/components/incidents/incident-meta";
import SourceList from "@/components/incidents/source-list";
import PostDate from "@/components/post-date";
import PageIllustration from "@/components/page-illustration";

// Literal on purpose — Next rejects an imported binding here. See
// INCIDENT_REVALIDATE_SECONDS in lib/incidents.ts.
export const revalidate = 604800;

// Entries merged into the data repo between builds still resolve, rather than
// 404ing until the next deploy.
export const dynamicParams = true;

// Copied verbatim from app/(default)/blog/[slug]/page.tsx so incident prose and
// blog prose set identically.
const PROSE =
  "prose max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-a:font-medium prose-a:text-blue-500 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-2 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:font-medium prose-blockquote:italic prose-blockquote:text-gray-900 dark:prose-blockquote:text-gray-100 prose-strong:font-medium prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:rounded prose-code:bg-transparent prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-gray-900 dark:prose-code:text-gray-100 prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:border prose-pre:border-gray-700 prose-pre:bg-gray-900 prose-blockquote:xl:-ml-4";

export async function generateStaticParams() {
  const incidents = await getIncidents();
  return incidents.map((incident) => ({ id: incident.id }));
}

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata | undefined> {
  const { id } = await props.params;
  const incident = await getIncident(id);

  if (!incident) return;

  const description = incidentExcerpt(incident.body);
  const url = `/incidents/${incident.id}`;

  return {
    title: `${incident.title} - Agent Incident Log`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: incident.title,
      description,
      type: "article",
      url,
      publishedTime: incident.date,
      modifiedTime: incident.last_verified,
      // No `images` here on purpose. `opengraph-image.tsx` in this folder
      // generates the per-entry card, and metadata set here would take
      // precedence over the file convention and suppress it. This previously
      // restated the site default card, which was correct until that file
      // existed — deleting it is what switches the cards on.
    },
    twitter: {
      card: "summary_large_image",
      title: incident.title,
      description,
    },
  };
}

export default async function IncidentEntry(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const incident = await getIncident(id);

  if (!incident) notFound();

  // Both fields are contributor prose from a public repo, so both go through
  // the sanitizing Markdown pipeline. Never CustomMDX — see lib/markdown.ts.
  const bodyHtml = await renderIncidentMarkdown(incident.body);
  const controlHtml = incident.control
    ? await renderIncidentMarkdown(incident.control)
    : null;

  // Filesystem read, so this adds no dependency on the incident dataset that
  // this page does not already have.
  const relatedPosts = getPostsForIncident(incident.id);

  return (
    <section className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(incidentReportJsonLd(incident)),
        }}
      />
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          <div className="max-w-3xl">
            <article>
              <header className="pb-8">
                <div className="mb-6">
                  <Link
                    className="text-sm font-medium text-blue-500 dark:text-blue-400 transition-colors hover:text-blue-600 dark:hover:text-blue-300"
                    href="/incidents"
                  >
                    <span className="tracking-normal text-blue-300 dark:text-blue-500">&larr;</span>{" "}
                    Back to incidents
                  </Link>
                </div>
                {/* Title only. Everything else about the incident is front
                    matter, and front matter belongs in the definition list
                    below rather than being restated here. */}
                <h1 className="text-4xl font-bold md:text-5xl">
                  {incident.title}
                </h1>
              </header>

              <IncidentMeta incident={incident} />

              <div className={`${PROSE} mt-10`}>
                <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
              </div>

              {/* The analytical layer, and the reason this log is not just a
                  copy of AIID. On `no` entries it is where the log states
                  plainly what action governance cannot do — which is why it is
                  set apart, and why nothing here is colour-coded by verdict. */}
              {controlHtml && (
                <aside className="mt-12 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8">
                  <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Would action governance have prevented this?
                  </h2>
                  <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {humanizeValue(incident.prevented_by_action_governance)}
                  </p>
                  <div className={`${PROSE} mt-4`}>
                    <div dangerouslySetInnerHTML={{ __html: controlHtml }} />
                  </div>
                </aside>
              )}

              <SourceList
                sources={incident.sources}
                lastVerified={incident.last_verified}
              />

              {/* Below the sources on purpose. The log's own citations are the
                  page's provenance; Helio's writing about the same incident is
                  commentary, and putting it above them would invert that. */}
              {relatedPosts.length > 0 && (
                <section className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
                  <h2 className="mb-5 text-lg font-bold text-gray-900 dark:text-gray-100">
                    Related reading
                  </h2>
                  <ul className="space-y-4">
                    {relatedPosts.map((post) => (
                      <li key={post.slug} className="text-sm">
                        <Link
                          className="font-medium text-blue-500 transition-colors hover:text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                          href={`/blog/${post.slug}`}
                        >
                          {post.title}
                        </Link>
                        <div className="mt-0.5 text-gray-500 dark:text-gray-400">
                          Helio blog
                          {post.date && (
                            <>
                              {" · "}
                              <PostDate dateString={post.date} />
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
