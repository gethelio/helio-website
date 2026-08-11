# helio-website

Marketing site and blog for Helio, at **helio.so**. Public repo, deployed on
Vercel.

## Commands

```bash
pnpm dev      # next dev --turbopack
pnpm build    # production build — run this before claiming a change works
pnpm start
pnpm test     # node:test over lib/__tests__ — incident markdown sanitization
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
  localStorage. Most pages are written light-first with `dark:` variants used
  sparingly — match the surrounding code rather than assuming full dark mode.

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

## In progress: the Agent Incident Log integration

Adding `helio.so/incidents` and `helio.so/incidents/[id]`, rendered from a
separate public data repo, `gethelio/agent-incident-log`.

**Full implementation plan:**
`.local/docs/helio-incident-log-website-integration-plan-10-08-2026.md`
(`.local/` is gitignored — internal working documents.)

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

Two fixes that look right and are not:

- `cache: "no-store"` turns `/incidents` and `/incidents/[id]` fully dynamic and
  loses static generation, exactly as §1.2 of the plan warns.
- Lowering the fetch's `revalidate` drags the **route** revalidate down with it
  (Next takes the minimum), so a 60s fetch means every route revalidates every
  minute and hammers raw.githubusercontent.
