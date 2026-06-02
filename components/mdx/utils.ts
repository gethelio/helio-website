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
