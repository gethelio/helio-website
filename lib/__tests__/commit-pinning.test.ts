/**
 * The dataset is fetched from a commit-pinned raw URL rather than a branch one,
 * because raw.githubusercontent caches its *ref resolution*: after a push,
 * `/main/` keeps serving the previous commit's blob for minutes, while a commit
 * URL is correct immediately.
 *
 * These two functions decide whether that pinning happens at all. Neither
 * throws when it fails to match — they return null and the caller falls back to
 * the branch URL, which is the pre-fix behaviour. So a regex mistake here does
 * not surface as an error; it silently reinstates the bug.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { githubCommitApiUrl, pinRawUrlToSha } from "../incidents.ts";

const SHA = "2f66d73e8544196b90cc0712bc909ec3edede5c4";

test("resolves the commits API URL for the live dataset", () => {
  assert.equal(
    githubCommitApiUrl(
      "https://raw.githubusercontent.com/gethelio/agent-incident-log/main/dist/incidents.json",
    ),
    "https://api.github.com/repos/gethelio/agent-incident-log/commits/main",
  );
});

test("pins a branch URL to a commit", () => {
  assert.equal(
    pinRawUrlToSha(
      "https://raw.githubusercontent.com/gethelio/agent-incident-log/main/dist/incidents.json",
      SHA,
    ),
    `https://raw.githubusercontent.com/gethelio/agent-incident-log/${SHA}/dist/incidents.json`,
  );
});

test("pins a nested path", () => {
  assert.equal(
    pinRawUrlToSha("https://raw.githubusercontent.com/o/r/main/a/b/c.json", SHA),
    `https://raw.githubusercontent.com/o/r/${SHA}/a/b/c.json`,
  );
});

test("an already-pinned URL needs no resolution", () => {
  // Avoids spending a rate-limited API call to look up a SHA we already have.
  assert.equal(
    githubCommitApiUrl(
      `https://raw.githubusercontent.com/o/r/${SHA}/dist/incidents.json`,
    ),
    null,
  );
});

test("resolves a non-main branch", () => {
  assert.equal(
    githubCommitApiUrl(
      "https://raw.githubusercontent.com/o/r/some-branch/dist/incidents.json",
    ),
    "https://api.github.com/repos/o/r/commits/some-branch",
  );
});

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
  test(`no resolution for ${JSON.stringify(url)}`, () => {
    assert.equal(githubCommitApiUrl(url), null);
    assert.equal(pinRawUrlToSha(url, SHA), null);
  });
}

test("does not match a lookalike host", () => {
  const lookalike =
    "https://raw.githubusercontent.com.evil.example/o/r/main/x.json";
  assert.equal(githubCommitApiUrl(lookalike), null);
  assert.equal(pinRawUrlToSha(lookalike, SHA), null);
});

test("refuses anything that is not a full SHA", () => {
  const url =
    "https://raw.githubusercontent.com/o/r/main/dist/incidents.json";
  for (const bad of ["", "main", "2f66d73", `${SHA}extra`, "../../etc/passwd"]) {
    assert.equal(pinRawUrlToSha(url, bad), null, `accepted ${bad}`);
  }
});
