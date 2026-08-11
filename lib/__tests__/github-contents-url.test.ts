/**
 * `githubContentsApiUrl` decides whether the revalidation endpoint can check
 * that raw.githubusercontent has caught up with a push before it purges the
 * cache.
 *
 * A regex that fails to match does not error — it silently returns null, the
 * check is skipped, and the endpoint goes back to purging inside the
 * propagation window and re-caching stale data for a week. So the matching is
 * worth pinning down.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { githubContentsApiUrl } from "../incidents.ts";

test("derives the contents API URL for the live dataset", () => {
  assert.equal(
    githubContentsApiUrl(
      "https://raw.githubusercontent.com/gethelio/agent-incident-log/main/dist/incidents.json",
    ),
    "https://api.github.com/repos/gethelio/agent-incident-log/contents/dist/incidents.json?ref=main",
  );
});

test("handles a commit SHA as the ref", () => {
  assert.equal(
    githubContentsApiUrl(
      "https://raw.githubusercontent.com/o/r/0543039fb0000000000000000000000000000000/dist/incidents.json",
    ),
    "https://api.github.com/repos/o/r/contents/dist/incidents.json?ref=0543039fb0000000000000000000000000000000",
  );
});

test("handles a nested path", () => {
  assert.equal(
    githubContentsApiUrl(
      "https://raw.githubusercontent.com/o/r/main/a/b/c/incidents.json",
    ),
    "https://api.github.com/repos/o/r/contents/a/b/c/incidents.json?ref=main",
  );
});

/**
 * Anything that is not raw GitHub returns null, and the caller skips the wait
 * rather than failing. A local checkout has no second source to compare against
 * and no CDN in front of it, so there is nothing to converge on.
 */
const NOT_RAW_GITHUB = [
  "file:///Users/someone/agent-incident-log/dist/incidents.json",
  "http://localhost:8910/incidents.json",
  "https://example.com/incidents.json",
  "https://github.com/gethelio/agent-incident-log/blob/main/dist/incidents.json",
  "https://raw.githubusercontent.com/gethelio/agent-incident-log/main",
  "https://raw.githubusercontent.com/gethelio",
  "",
];

for (const url of NOT_RAW_GITHUB) {
  test(`returns null for ${JSON.stringify(url)}`, () => {
    assert.equal(githubContentsApiUrl(url), null);
  });
}

test("does not match a lookalike host", () => {
  // Guards against a permissive regex accepting an attacker-controlled host
  // that merely contains the real one.
  assert.equal(
    githubContentsApiUrl(
      "https://raw.githubusercontent.com.evil.example/o/r/main/x.json",
    ),
    null,
  );
});
