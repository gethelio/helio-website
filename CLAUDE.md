# helio-website

Marketing site and blog for Helio, at **helio.so**. Public repo, deployed on
Vercel.

## Commands

```bash
pnpm dev      # next dev --turbopack
pnpm build    # production build — run this before claiming a change works
pnpm start
pnpm test     # node:test over lib/__tests__ — sanitization, URL safety,
              # JSON-LD escaping, commit-pin URL derivation. No framework:
              # Node's runner with native type stripping, so zero deps.
pnpm lint     # BROKEN: `next lint` was removed in Next 16, exits 1
```

pnpm is the package manager (10.19). Do not use npm or yarn here.

## Git workflow

**Never commit directly to `main` in this repo.** Every change goes on a
branch and merges via pull request — including one-line config edits and
documentation. There is no size or category exception.

This is specific to `helio-website`, because it is the live marketing site.
Sibling repos in HelioHQ do not all use the same rule; do not carry this
convention outward, and do not assume it applies elsewhere.

## Stack

Next.js 16 App Router · React 19 · TypeScript · Tailwind v4
(`@tailwindcss/postcss`, with the `forms` and `typography` plugins).

## Layout conventions

- Public pages live in the **`app/(default)/`** route group, which supplies the
  shared header and footer via `app/(default)/layout.tsx`. New public routes
  belong inside it. `app/layout.tsx` is the root shell.
- `app/sitemap.ts` and `app/robots.ts` are generated. **Any new content route
  must be added to `sitemap.ts`** — it enumerates entries explicitly rather
  than crawling.
- Shared chrome is in `components/ui/`. The header has a **separate mobile
  component** (`components/ui/mobile-menu.tsx`), so nav links must be added in
  both places.
- `components/theme-provider.tsx` provides light/dark, persisted to
  localStorage, and the footer offers the toggle sitewide. Coverage is uneven:
  marketing pages and chrome are fully themed, incident pages are fully themed,
  the blog's prose is themed but its index and cards are not. **Check a new page
  in both themes before calling it done** — the failure is silent, because
  explicit `text-gray-900` on a near-black body renders as unreadable rather
  than as anything obviously broken.
- Prose blocks need two things, not one: `dark:prose-invert` recolours what the
  typography plugin owns, but explicit `prose-headings:` / `prose-code:`
  overrides are plain utilities that beat it and need their own `dark:` twins.

## Next 16 behaviours that cost time here

Each of these was found by measurement, and each fails silently rather than
loudly:

- **Segment config must be a literal.** `export const revalidate = SOME_CONST`
  fails the build. Inline the number and reference the constant in a comment.
- **GET route handlers are no longer cached by default.** A route needs
  `dynamic = "force-static"` to be prerendered — and exporting *any* non-GET
  method silently reverts it to dynamic. That is why `app/incidents.json/` has
  no `OPTIONS` handler.
- **A fetch's `revalidate` lowers the whole route's.** Next takes the minimum,
  so a 60s fetch makes every route on the page revalidate every 60s.
- **`useSearchParams` opts its subtree out of prerendering.** Give the Suspense
  boundary a fallback that renders the real content, or the static HTML ships
  empty to crawlers and to anyone without JavaScript.
- **Metadata merges shallowly.** Naming `openGraph` at all drops the root
  layout's card, so a page that only wants to change the title must restate the
  image.

## Content pipeline

Blog posts are MDX files in `content/blog/`, read from disk at build time by
`components/mdx/utils.ts` (gray-matter for front matter) and rendered through
`components/mdx/mdx.tsx` (`next-mdx-remote-client`, with `rehype-pretty-code`
and Shiki for syntax highlighting).

Two patterns worth reusing rather than reinventing:

- `app/(default)/blog/page.tsx` loads content server-side and passes **only
  serializable fields** to a client component for filtering and pagination.
  Use this shape for any filterable index.
- `app/(default)/blog/[slug]/page.tsx` sets the detail-page conventions: async
  `params`, `generateMetadata`, `notFound()`, and a long `prose` class string.
  Copy the `prose` string so typography stays consistent.

## The Agent Incident Log integration

`helio.so/incidents`, `/incidents/[id]` and `/incidents.json`, rendered from a
separate public data repo, `gethelio/agent-incident-log`. Shipped 11 August
2026.

The original plan is at
`.local/docs/helio-incident-log-website-integration-plan-10-08-2026.md`
(`.local/` is gitignored). It is a **historical record, annotated with
corrections** — parts of it are wrong, and it does not travel with the repo.
This file is the source of truth.

The dataset is live and stable, so work can be verified against real data
immediately with no mocking:

```
https://raw.githubusercontent.com/gethelio/agent-incident-log/main/dist/incidents.json
```

### Non-negotiable: do not render incident bodies through MDX

The obvious move is to reuse `CustomMDX`, since it is the only renderer here.
Do not.

MDX executes JSX. The incident log is a public repo that accepts community pull
requests, so a merged entry containing JSX would execute code inside this
site's build. That turns an open contribution process into an execution path
into helio.so's build pipeline — a supply chain attack of exactly the kind the
log itself catalogues.

Incident prose must go through a plain Markdown pipeline with
`rehype-sanitize`. See §1.1 of the plan. Existing entries happen to be
MDX-clean; that is luck, not a control.

### The same threat arrives outside the prose

The sanitizer guards the body. It never sees front matter, and every field there
is equally contributor-supplied. Two instances were found after the pipeline was
already in place:

- **URLs into `href`.** `sources[].url`, `sources[].archive_url` and
  `helio_pack` reach attributes directly. React renders a `javascript:` URL with
  a console warning rather than blocking it, and the schema's `format: "uri"` is
  an annotation that `javascript:alert(1)` satisfies. The loader now rejects
  non-http(s) URLs and `safeExternalUrl` re-checks at render.
- **Text into `<script type="application/ld+json">`.** A `</script>` in a title
  closes the tag early and the rest parses as markup. `serializeJsonLd` escapes
  `<`.

**Before putting any incident field into an attribute, a URL or a script block,
assume it is hostile.** The threat model in the plan is about prose only, so it
will not prompt you.

### Second thing to get right

The log's schema evolves — it gained two controlled-vocabulary values in a
single day during drafting. Keep TypeScript unions for its enums **open** to
unknown strings, and derive filter facets from the data rather than hardcoding
them, or the site build breaks the next time the log adds a value.

### Sync: a Vercel deploy hook does not work — the plan's §4 is wrong here

The plan wires merges in the data repo to a Vercel deploy hook. That does not
propagate new entries. Next's Data Cache persists across deployments and Vercel
restores `.next/cache` between builds, so a rebuild triggered by a merge
re-serves the payload cached earlier and deploys **without** the new entry, with
the build green and nothing to indicate it.

Demonstrated locally: two builds sharing a cache with the upstream dataset
changed between them, second build still rendered the old entries.

Instead, the dataset fetch is tagged (`INCIDENT_CACHE_TAG`) and
`app/api/revalidate-incidents/route.ts` purges that tag. The data repo POSTs to
that URL, secret included, in place of a deploy hook — no rebuild, and entries
appear in seconds. The weekly `revalidate` on the routes stays as the self-heal.

That URL must use whichever host answers **without redirecting**. One of
`helio.so` and `www.helio.so` 307s to the other, and which one has changed —
check with `curl -sI` before storing it. `curl` neither follows a redirect by
default nor treats one as an error, so a workflow posting to the redirecting
host exits 0 having reached nothing, and the site stays stale for a week.

The dataset is fetched from a **commit-pinned** raw URL, resolved through the
GitHub commits API, not from `/main/`. raw.githubusercontent caches its *ref
resolution*: after a push, `/main/` serves the previous commit's blob for up to
five minutes. Measured against a real publish, sampling every eight seconds —
`/main/` was stale for the full 109 seconds observed while the commit URL was
correct from the first sample. Note this is a *different* cache from the one
below: `Cache-Control: no-cache` defeats the byte cache, but ref resolution is
the origin deciding which blob `main` means, and no header or polling window
touches it. Do not "simplify" the pinning away.

Two fixes that look right and are not:

- `cache: "no-store"` turns `/incidents` and `/incidents/[id]` fully dynamic and
  loses static generation, exactly as §1.2 of the plan warns.
- Lowering the fetch's `revalidate` drags the **route** revalidate down with it
  (Next takes the minimum), so a 60s fetch means every route revalidates every
  minute and hammers raw.githubusercontent.

### `cache: "no-store"` only governs Next's cache

Three separate bugs here were the same mistake: assuming that opting out of
Next's cache means the response is fresh. It does not. There are caches between
Next and the origin, and each needs its own header:

- raw.githubusercontent serves `max-age=300` behind a CDN. Its cache key
  **ignores the query string**, so a `?t=…` buster is measurably a no-op; a
  request `Cache-Control: no-cache` does get past it.
- The GitHub commits API serves `public, max-age=60, s-maxage=60`. Without the
  same header, the SHA lookup resolved the *previous* commit, which made the
  validate-before-purge check approve a merge it had never seen.

Every outbound fetch in `lib/incidents.ts` carries `Cache-Control: no-cache` for
this reason. If you add another, carry it across.

### The log is broader than "an agent did something"

Four of the seven entries — Asana, Flowise, LiteLLM, TanStack — are failures in
agent *infrastructure* where no agent acted at all. The split is clean across
`agent_stack`, `surface`, verdict and root cause.

This matters for copy. Anything rendered above an arbitrary entry must not
assume an agent was involved: "what was reachable", not "what the agent could
reach". It also matters if the scope is ever questioned again — every `no` and
`partially` verdict is in that group, so removing it would leave the log
reporting that action governance prevents 100% of what it catalogues.
