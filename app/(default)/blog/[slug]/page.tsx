import type { Metadata } from "next";
import { getBlogPosts } from "@/components/mdx/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import PostDate from "@/components/post-date";
import { CustomMDX } from "@/components/mdx/mdx";
import PostNav from "./post-nav";
import PageIllustration from "@/components/page-illustration";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata | undefined> {
  const params = await props.params;
  const post = getBlogPosts().find((post) => post.slug === params.slug);

  if (!post) {
    return;
  }

  const { title, description, keywords, canonicalUrl, ogImage, author } =
    post.metadata;

  return {
    title,
    description,
    keywords,
    authors: author ? [{ name: author }] : undefined,
    alternates: canonicalUrl ? { canonical: canonicalUrl } : undefined,
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalUrl,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function SinglePost(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = getBlogPosts().find((post) => post.slug === params.slug);

  if (!post) notFound();

  return (
    <section className="relative">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex justify-between pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Left content */}
          <div className="max-w-3xl">
            <article>
              {/* Section header */}
              <header className="pb-8">
                <div className="mb-6">
                  <Link
                    className="text-sm font-medium text-blue-500 transition-colors hover:text-blue-600"
                    href="/blog"
                  >
                    <span className="tracking-normal text-blue-300">&larr;</span>{" "}
                    Back to blog
                  </Link>
                </div>
                <h1 className="mb-5 text-5xl font-bold">
                  {post.metadata.title}
                </h1>
                <div className="flex items-center gap-3">
                  <img
                    className="rounded-full"
                    src={post.metadata.authorImg}
                    width={32}
                    height={32}
                    alt={post.metadata.author}
                  />
                  <div className="text-sm text-gray-500">
                    {post.metadata.author} ·{" "}
                    <span className="text-gray-700">
                      <PostDate dateString={post.metadata.date ?? ""} />
                    </span>
                  </div>
                </div>
              </header>
              <div className="prose max-w-none text-gray-700 prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:text-gray-900 prose-a:font-medium prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-2 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:font-medium prose-blockquote:italic prose-blockquote:text-gray-900 prose-strong:font-medium prose-strong:text-gray-900 prose-code:rounded prose-code:bg-transparent prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-gray-900 prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:border prose-pre:border-gray-700 prose-pre:bg-gray-900 prose-blockquote:xl:-ml-4">
                <CustomMDX source={post.content} />
              </div>
            </article>
            {/* Newsletter form */}
          </div>
          {/* Right sidebar */}
          <PostNav />
        </div>
      </div>
    </section>
  );
}
