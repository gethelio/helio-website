/**
 * Markdown rendering for Agent Incident Log prose.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DO NOT render incident bodies through `CustomMDX` (components/mdx/mdx.tsx).
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * MDX executes JSX. The incident log is a public repository that accepts
 * community pull requests, so an entry body containing JSX or a bare expression
 * would run code inside helio.so's build. That turns an open contribution
 * process into an execution path into this site's build pipeline — a supply
 * chain attack of exactly the kind the log itself catalogues.
 *
 * A weaker second reason: MDX is stricter than Markdown. Prose that is perfectly
 * valid Markdown fails MDX parsing on a bare `<`, an unescaped `{`, or an
 * autolink, which would break this build from a merge in a different repo.
 *
 * Every incident body currently in the log happens to be MDX-clean. That is
 * luck, not a control.
 *
 * There are two independent controls here, and both are deliberate:
 *
 *   1. `remark-rehype` runs with `allowDangerousHtml` left at its default
 *      (false), so raw HTML in the Markdown source is dropped at the
 *      mdast → hast boundary and never becomes an element at all.
 *   2. `rehype-sanitize` then filters the tree against an allowlist, which also
 *      catches anything a future plugin might reintroduce.
 *
 * Control 1 alone would be enough today. Control 2 is the one that survives
 * somebody later adding `rehype-raw` without thinking it through. Do not remove
 * either.
 */

import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

const attributes = defaultSchema.attributes ?? {};

/**
 * The default allowlist, widened only where GitHub Flavored Markdown needs it.
 *
 * `clobberPrefix` is set to `""` on purpose. `remark-rehype` already namespaces
 * footnote ids and their hrefs with `user-content-`, and it rewrites both sides
 * consistently. Leaving the sanitizer's own default prefix in place would apply
 * a second `user-content-` to the ids but not to the hrefs, silently breaking
 * every footnote link. DOM clobbering is still prevented, because footnotes are
 * the only source of ids in this pipeline — raw HTML never survives step 1.
 */
const schema = {
  ...defaultSchema,
  clobberPrefix: "",
  attributes: {
    ...attributes,
    // Table column alignment.
    th: [...(attributes.th ?? []), "align"],
    td: [...(attributes.td ?? []), "align"],
    // GFM footnotes: markers, back-references and their container.
    a: [
      ...(attributes.a ?? []),
      "id",
      "dataFootnoteRef",
      "dataFootnoteBackref",
      "ariaDescribedBy",
      "ariaLabel",
      "className",
    ],
    li: [...(attributes.li ?? []), "id"],
    section: [...(attributes.section ?? []), "dataFootnotes", "className"],
    sup: [...(attributes.sup ?? []), "id"],
  },
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  // allowDangerousHtml intentionally omitted — see control 1 above.
  .use(remarkRehype)
  .use(rehypeSanitize, schema)
  .use(rehypeStringify)
  .freeze();

/**
 * Render untrusted incident prose to a sanitized HTML string.
 *
 * The result is injected with `dangerouslySetInnerHTML` into the shared `prose`
 * container. That prop name is accurate about the mechanism but not about the
 * risk here: the string has been through the allowlist above, and the input
 * never had the chance to become script in the first place.
 */
export async function renderIncidentMarkdown(markdown: string): Promise<string> {
  const file = await processor.process(markdown);
  return String(file);
}
