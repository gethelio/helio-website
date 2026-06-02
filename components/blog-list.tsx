"use client";

import { useMemo, useState } from "react";
import PostItem from "@/components/post-item";
import type { Metadata } from "@/components/mdx/utils";

type Post = { slug: string; metadata: Metadata };

// Curated category labels. A post belongs to a category when any of its tags
// contains the label (case-insensitive), so "Security" matches both
// "MCP security" and "supply chain security". Edit this list to change the
// filter bar.
const CATEGORIES = ["All", "Governance", "Security", "MCP", "Engineering"];

// Posts shown before the "Load more" button appears.
const POSTS_PER_PAGE = 6;

function matchesCategory(post: Post, category: string) {
  if (category === "All") return true;
  const needle = category.toLowerCase();
  return (post.metadata.tags ?? []).some((tag) =>
    tag.toLowerCase().includes(needle),
  );
}

export default function BlogList({ posts }: { posts: Post[] }) {
  const [category, setCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  // Only show category buttons that actually have matching posts ("All" is
  // always shown). Keeps the filter bar free of dead, always-empty categories.
  const availableCategories = useMemo(
    () =>
      CATEGORIES.filter(
        (label) =>
          label === "All" ||
          posts.some((post) => matchesCategory(post, label)),
      ),
    [posts],
  );

  const filtered = useMemo(
    () => posts.filter((post) => matchesCategory(post, category)),
    [posts, category],
  );

  const visiblePosts = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  function selectCategory(next: string) {
    setCategory(next);
    setVisibleCount(POSTS_PER_PAGE); // reset pagination when filtering
  }

  return (
    <>
      {/* Categories */}
      <div className="mb-10 flex flex-wrap gap-2">
        {availableCategories.map((label) => {
          const active = label === category;
          return (
            <button
              key={label}
              onClick={() => selectCategory(label)}
              aria-pressed={active}
              className={`btn-sm cursor-pointer font-normal shadow-sm transition-colors ${
                active
                  ? "bg-gray-800 text-gray-200 hover:bg-gray-900"
                  : "bg-white text-gray-800 hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="space-y-10 border-l [border-image:linear-gradient(to_bottom,var(--color-slate-200),var(--color-slate-300),transparent)1]">
        {visiblePosts.length > 0 ? (
          visiblePosts.map((post) => <PostItem key={post.slug} {...post} />)
        ) : (
          <p className="pl-6 text-gray-500 sm:pl-10">
            No posts in this category yet.
          </p>
        )}
      </div>

      {/* Load more — only shown when more posts remain */}
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={() => setVisibleCount((count) => count + POSTS_PER_PAGE)}
            className="btn-sm min-w-[220px] cursor-pointer bg-gray-800 py-1.5 text-gray-200 shadow-sm transition-colors hover:bg-gray-900"
          >
            Load more{" "}
            <span className="ml-2 tracking-normal text-gray-500">↓</span>
          </button>
        </div>
      )}
    </>
  );
}
