import { getIncidentDataset } from "@/lib/incidents";

/**
 * The Agent Incident Log, re-served as a citable dataset.
 *
 * Cheap to provide and disproportionately valuable: a reference work that can
 * only be read as HTML is a reference work nobody can compute over. This is the
 * URL the index's `Dataset` JSON-LD points its `distribution` at, and the one
 * an analyst or a notebook actually fetches.
 *
 * Lives at `app/incidents.json/` rather than inside the `(default)` route
 * group: the group supplies the site header and footer, which a JSON response
 * has no use for. The path does not collide with `/incidents` — they are
 * different segments.
 */

/**
 * Next 15 stopped caching GET route handlers by default, so `revalidate` alone
 * leaves this dynamic and re-fetching per request. Forcing static puts the
 * dataset in the build output alongside the pages, which is what keeps
 * raw.githubusercontent a build-time dependency rather than a runtime one — it
 * has no SLA and it rate limits.
 */
export const dynamic = "force-static";

// Literal on purpose — Next rejects an imported binding here. See
// INCIDENT_REVALIDATE_SECONDS in lib/incidents.ts.
export const revalidate = 604800;

const LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";
const SOURCE_REPOSITORY = "https://github.com/gethelio/agent-incident-log";

/**
 * `*` is correct here and not a lapse: the payload is public, CC BY licensed,
 * and carries no credentials. The point is that it works from someone else's
 * page or notebook without a proxy.
 *
 * There is deliberately no `OPTIONS` handler. Exporting any non-GET method
 * makes the whole route dynamic — verified, it flips from `○` to `ƒ` in the
 * build output — which would undo `force-static` above and put a
 * raw.githubusercontent fetch back on the request path. A plain cross-origin
 * `fetch` of this file never preflights, so nothing real is lost. A caller that
 * sends a custom header would need one; that is a worse trade than a runtime
 * dependency on a service with no SLA.
 */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET",
};

export async function GET() {
  const dataset = await getIncidentDataset();

  // Attribution first, so it is the first thing anyone reading the raw file
  // sees rather than something buried under a few hundred KB of entries.
  const payload = {
    license: dataset.license,
    license_url: LICENSE_URL,
    attribution: dataset.attribution,
    source: SOURCE_REPOSITORY,
    version: dataset.version,
    generated_at: dataset.generated_at,
    count: dataset.count,
    incidents: dataset.incidents,
  };

  return new Response(`${JSON.stringify(payload, null, 2)}\n`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...CORS_HEADERS,
    },
  });
}
