import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/components/mdx/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = getBlogPosts().map((post) => ({
    url: `https://helio.so/blog/${post.slug}`,
    lastModified: post.metadata.date
      ? new Date(post.metadata.date)
      : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: "https://helio.so",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://helio.so/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...blogPosts,
  ];
}
