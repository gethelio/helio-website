import { getBlogPosts } from "@/components/mdx/utils";
import PageIllustration from "@/components/page-illustration";
import BlogList from "@/components/blog-list";

export const metadata = {
  title: "Helio Blog - Open-Source MCP Governance for AI Agents",
  description:
    "Field notes on AI agent governance, MCP, and the runtime controls that keep autonomous systems safe - from the team building Helio.",
  alternates: { canonical: "/blog" },
};

export default function Blog() {
  const allBlogs = getBlogPosts();

  // Sort posts by date (newest first)
  allBlogs.sort((a, b) => {
    return new Date(a.metadata.date ?? 0) > new Date(b.metadata.date ?? 0)
      ? -1
      : 1;
  });

  // Only pass serializable fields to the client (omit the large MDX content).
  const posts = allBlogs.map(({ slug, metadata }) => ({ slug, metadata }));

  return (
    <section className="relative">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Main content */}
        <div className="mx-auto max-w-3xl pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Section header */}
          <div className="pb-16">
            <h1 className="mb-4 text-5xl font-bold">The Helio blog</h1>
            <p className="text-lg text-gray-700">
              Field notes on AI agent governance, MCP, and the runtime controls
              that keep autonomous systems safe.
            </p>
          </div>
          {/* Categories + posts + pagination (client-side) */}
          <BlogList posts={posts} />
        </div>
      </div>
    </section>
  );
}
