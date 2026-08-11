/**
 * Serialization for `<script type="application/ld+json">` blocks.
 *
 * Kept in its own module with no imports so `pnpm test` can load it directly:
 * Node's test runner cannot resolve the `@/` path alias, and this is the one
 * piece of the JSON-LD path that is a security control rather than a shape.
 */

/**
 * Escaping `<` is load-bearing, not tidiness.
 *
 * Incident titles, prose and source names arrive through public pull requests
 * to the data repo. A value containing `</script>` would close the tag early
 * and let everything after it be parsed as markup, which is script injection by
 * way of structured data. `<` is a valid escape inside a JSON string, so
 * consumers still parse a byte-identical document — only the HTML parser is
 * affected, which is exactly the intent. This also neutralises `<!--`, which
 * can otherwise start a comment that swallows the rest of the block.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
