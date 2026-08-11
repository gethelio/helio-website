import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

import { INCIDENT_CACHE_TAG } from "@/lib/incidents";

/**
 * Purges the cached incident dataset so a merge in `gethelio/agent-incident-log`
 * reaches helio.so in seconds.
 *
 * This replaces the Vercel deploy hook the plan's §4 describes, because that
 * hook does not actually work: Next's Data Cache persists across deployments
 * and Vercel restores `.next/cache` between builds, so a rebuild triggered by a
 * merge re-serves the payload cached earlier and deploys without the new entry.
 * Everything reports success. Purging the tag avoids the problem rather than
 * working around it, and skips the rebuild entirely.
 *
 * Wiring: put this URL, secret included, in the data repo's
 * `VERCEL_DEPLOY_HOOK_URL` secret. Its workflow POSTs to whatever that holds,
 * so nothing changes on that side.
 *
 *   https://helio.so/api/revalidate-incidents?secret=<INCIDENT_REVALIDATE_SECRET>
 *
 * The weekly `revalidate` on the routes stays as the self-heal: if this endpoint
 * is never called, entries still refresh within a week.
 */

const SECRET_ENV = "INCIDENT_REVALIDATE_SECRET";

/**
 * Compares digests rather than the raw strings, so neither the contents nor the
 * length of the configured secret leaks through timing.
 */
function secretMatches(provided: string, expected: string): boolean {
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

/**
 * Accepts the secret from a query parameter, a header, or a bearer token. The
 * query parameter is the one that matters: a GitHub Actions step posting to a
 * stored hook URL can carry a secret there and nowhere else.
 */
function providedSecret(request: Request): string | null {
  const url = new URL(request.url);
  const fromQuery = url.searchParams.get("secret");
  if (fromQuery) return fromQuery;

  const header = request.headers.get("x-revalidate-secret");
  if (header) return header;

  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ")) return authorization.slice(7);

  return null;
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export async function POST(request: Request) {
  const expected = process.env[SECRET_ENV];

  // Refuse rather than fall open. An unset secret must never mean "no auth
  // required" — that would leave a public cache-purge endpoint on the site.
  if (!expected) {
    return json(
      { revalidated: false, error: `${SECRET_ENV} is not configured` },
      500,
    );
  }

  const provided = providedSecret(request);
  if (!provided || !secretMatches(provided, expected)) {
    return json({ revalidated: false, error: "invalid secret" }, 401);
  }

  // Next 16 requires a cache-life profile alongside the tag. `expire: 0` marks
  // the entry stale immediately, so the next request refetches rather than
  // serving the old payload for a further grace period — the whole point of
  // calling this is that the log has just changed.
  revalidateTag(INCIDENT_CACHE_TAG, { expire: 0 });

  return json({ revalidated: true, tag: INCIDENT_CACHE_TAG }, 200);
}
