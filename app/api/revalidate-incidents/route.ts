import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

import { INCIDENT_CACHE_TAG, verifyUpstreamDataset } from "@/lib/incidents";

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
 *   https://<canonical-host>/api/revalidate-incidents?secret=<INCIDENT_REVALIDATE_SECRET>
 *
 * **Use whichever host answers without redirecting.** One of `helio.so` and
 * `www.helio.so` 307s to the other, and which one has changed. Check before
 * storing the URL:
 *
 *   curl -sI https://helio.so/incidents | head -1     # 200 or 307?
 *
 * A redirect here fails in the worst way available. `curl` does not follow one
 * unless asked and does not treat one as an error, so a workflow step posting to
 * the redirecting host reports success having reached nothing, and the site
 * serves stale entries until the weekly revalidate catches up a week later.
 *
 * Better still, have the caller pass `-L` so the direction stops mattering.
 *
 * The weekly `revalidate` on the routes stays as the self-heal: if this endpoint
 * is never called, entries still refresh within a week.
 */

const SECRET_ENV = "INCIDENT_REVALIDATE_SECRET";

/** One year — matches the Expire column the routes already build with. */
const STALE_WHILE_REVALIDATE_SECONDS = 31_536_000;

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

  // Check upstream before purging anything. A malformed merge that gets past
  // this point takes /incidents, every entry page and /incidents.json to 500 on
  // the live site, because the loader is designed to throw rather than render a
  // half-empty log. Failing here instead leaves the last good data in place and
  // reports the problem to the caller, where someone is watching a workflow.
  let dataset;
  try {
    dataset = await verifyUpstreamDataset();
  } catch (error) {
    return json(
      {
        revalidated: false,
        error: error instanceof Error ? error.message : String(error),
      },
      422,
    );
  }

  // Next 16 wants a cache-life profile alongside the tag. A long `expire` keeps
  // stale-while-revalidate behaviour: the cached pages stay servable while the
  // new ones render, so a failure during regeneration degrades to slightly old
  // content instead of an error page. `expire: 0` would forbid serving the old
  // copy at all and make every regeneration failure a 500.
  revalidateTag(INCIDENT_CACHE_TAG, { expire: STALE_WHILE_REVALIDATE_SECONDS });

  return json(
    { revalidated: true, tag: INCIDENT_CACHE_TAG, count: dataset.count },
    200,
  );
}
