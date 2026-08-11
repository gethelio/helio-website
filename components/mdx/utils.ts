import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Metadata = {
  title: string;
  description?: string;
  slug?: string;
  date?: string;
  updatedAt?: string;
  author?: string;
  authorImg?: string;
  tags?: string[];
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  kind?: string;
  /**
   * Ids of Agent Incident Log entries this post covers.
   *
   * Declared here and nowhere else: both directions of the cross-link render
   * from this one field. Deliberately not stored in the incident data, which is
   * CC BY and reused elsewhere — a dataset that carries links to Helio's blog
   * makes everyone who republishes it carry them too.
   */
  incidents?: string[];
};

function readMDXFile(filePath: string) {
  const rawContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(rawContent);
  return { metadata: data as Metadata, content };
}

function getMDXFiles(dir: string) {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

function getMDXData(dir: string) {
  if (!fs.existsSync(dir)) return [];
  const mdxFiles = getMDXFiles(dir);
  return mdxFiles.flatMap((file) => {
    const parsed = readMDXFile(path.join(dir, file));
    if (!parsed) return [];
    // Prefer the explicit frontmatter slug; fall back to the filename.
    const slug =
      parsed.metadata.slug || path.basename(file, path.extname(file));
    return [{ ...parsed, slug }];
  });
}

export function getBlogPosts() {
  return getMDXData(path.join(process.cwd(), "content/blog"));
}

export function getDocPages() {
  return getMDXData(path.join(process.cwd(), "content/docs"));
}

/**
 * Blog posts covering a given incident, newest first.
 *
 * Reads the filesystem only. An incident page calling this gains no dependency
 * on the incident dataset it does not already have, so the blast radius of a
 * bad merge in the data repo stays where it is.
 */
export function getPostsForIncident(incidentId: string) {
  return getBlogPosts()
    .filter((post) => post.metadata.incidents?.includes(incidentId))
    .map(({ slug, metadata }) => ({
      slug,
      title: metadata.title,
      date: metadata.date,
    }))
    .sort((a, b) => (a.date ?? "") < (b.date ?? "") ? 1 : -1);
}
