import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/components/mdx/utils";
import { getIncidents } from "@/lib/incidents";

// Keeps the sitemap in step with the ISR'd incident routes. Without it the
// sitemap would only refresh on deploy, and could advertise stale lastModified
// dates for pages that had already been rebuilt.
export const revalidate = 604800;

const SITE_URL = "https://helio.so";

// This sitemap enumerates entries explicitly rather than crawling, so every new
// content route has to be added here by hand.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = getBlogPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.metadata.date
      ? new Date(post.metadata.date)
      : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const incidents = await getIncidents();

  const incidentEntries = incidents.map((incident) => ({
    url: `${SITE_URL}/incidents/${incident.id}`,
    // last_verified rather than date: the incident happened once, but the entry
    // changes when the log re-checks it, and that is what a crawler needs.
    lastModified: new Date(incident.last_verified),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Incidents are sorted newest first, but by incident date — the most recent
  // verification is not necessarily the first entry.
  const lastVerified = incidents
    .map((incident) => incident.last_verified)
    .sort()
    .pop();

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/incidents`,
      lastModified: lastVerified ? new Date(lastVerified) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...incidentEntries,
    ...blogPosts,
  ];
}
