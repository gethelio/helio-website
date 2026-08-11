/**
 * The incident log's URL fields — `sources[].url`, `sources[].archive_url` and
 * `helio_pack` — come from contributor front matter and become `href`
 * attributes. The Markdown sanitizer never sees them: it guards prose only.
 *
 * React does not close this gap. It renders `javascript:` hrefs with a console
 * warning rather than blocking them. Neither does the upstream schema, whose
 * `format: "uri"` is an annotation, and which `javascript:alert(1)` satisfies
 * anyway.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { safeExternalUrl } from "../incident-format.ts";

const REJECTED = [
  "javascript:alert(1)",
  "JaVaScRiPt:alert(1)",
  "  javascript:alert(1)",
  "vbscript:msgbox(1)",
  "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
  "file:///etc/passwd",
  "ftp://example.com/x",
  "mailto:someone@example.com",
  "not a url at all",
  "//evil.example/protocol-relative",
  "",
];

for (const value of REJECTED) {
  test(`rejects ${JSON.stringify(value)}`, () => {
    assert.equal(safeExternalUrl(value), undefined);
  });
}

for (const value of [null, undefined]) {
  test(`rejects ${String(value)}`, () => {
    assert.equal(safeExternalUrl(value), undefined);
  });
}

const ACCEPTED = [
  "https://helio.so/packs/example",
  "http://example.com/article?a=1&b=2#frag",
  "https://web.archive.org/web/20260101000000/https://example.com/x",
];

for (const value of ACCEPTED) {
  test(`accepts ${JSON.stringify(value)}`, () => {
    assert.equal(safeExternalUrl(value), value);
  });
}
