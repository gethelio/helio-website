/**
 * Presentation helpers for incident data.
 *
 * Pure functions with no server dependencies, so the client components added in
 * later build steps (filters, index list) can import them directly.
 *
 * The log's controlled vocabularies are snake_case (`data_exposure`,
 * `saas_app`). These convert them for display *generically*, so a value added
 * upstream renders sensibly on its own rather than falling through to a raw
 * identifier or, worse, requiring a code change here. That is the same reasoning
 * as the open type unions in `lib/incidents.ts`.
 */

/**
 * Words the generic sentence-case rule gets wrong. A miss here degrades to
 * ordinary capitalisation, which is why this map can stay short and is safe to
 * leave incomplete.
 */
const SPECIAL_CASE_WORDS: Record<string, string> = {
  aiid: "AIID",
  api: "API",
  cli: "CLI",
  ci: "CI",
  mcp: "MCP",
  npm: "npm",
  oidc: "OIDC",
  os: "OS",
  rce: "RCE",
  saas: "SaaS",
  sdk: "SDK",
  ssh: "SSH",
  url: "URL",
};

/**
 * Returns the URL only if it is safe to put in an `href`, otherwise `undefined`
 * so the caller can render plain text instead of a link.
 *
 * The loader already rejects non-http(s) URLs and fails the build, so in
 * practice nothing should ever reach this and be turned away. That is the
 * point: it is the second of two controls, in the same shape as the Markdown
 * pipeline's, and it is the one that still holds if incident data is ever
 * rendered from somewhere that skips validation. React is no help here — it
 * renders `javascript:` hrefs with a console warning rather than blocking them.
 */
export function safeExternalUrl(
  value: string | null | undefined,
): string | undefined {
  if (!value) return undefined;
  try {
    const { protocol } = new URL(value);
    return protocol === "http:" || protocol === "https:" ? value : undefined;
  } catch {
    return undefined;
  }
}

/** `data_exposure` → `Data exposure`; `saas_app` → `SaaS app`. */
export function humanizeValue(value: string): string {
  const words = value.split("_").filter(Boolean);
  if (words.length === 0) return value;

  return words
    .map((word, index) => {
      const special = SPECIAL_CASE_WORDS[word.toLowerCase()];
      if (special) return special;
      if (index === 0) return word.charAt(0).toUpperCase() + word.slice(1);
      return word;
    })
    .join(" ");
}

/** `['repo', 'saas_app']` → `Repo, SaaS app`. */
export function humanizeList(values: readonly string[]): string {
  return values.map(humanizeValue).join(", ");
}

/**
 * A plain-text summary for `<meta name="description">`, derived from the first
 * paragraph of the body. Strips the Markdown constructs that would otherwise
 * leak syntax into search results.
 */
export function incidentExcerpt(markdown: string, maxLength = 155): string {
  const firstParagraph = markdown.split(/\n\s*\n/)[0] ?? "";
  const plain = firstParagraph
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= maxLength) return plain;

  const clipped = plain.slice(0, maxLength);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : maxLength).trimEnd()}…`;
}
