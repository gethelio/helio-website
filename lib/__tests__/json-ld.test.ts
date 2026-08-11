/**
 * Incident titles, prose and source names reach a `<script type="ld+json">`
 * block straight from contributor front matter. If any of them can close that
 * tag, the log's structured data becomes a script injection route into
 * helio.so — the same threat the Markdown pipeline exists to stop, arriving
 * through a different door.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { serializeJsonLd } from "../json-ld.ts";

/** How a browser's HTML parser decides a script block has ended. */
const CLOSES_SCRIPT_TAG = /<\/script/i;

const HOSTILE_VALUES = [
  "</script><img src=x onerror=alert(1)>",
  "</SCRIPT><script>alert(1)</script>",
  "</script >",
  "</script\t>",
  "<!--<script>",
  "<script>alert(1)</script>",
  "</script>",
  "already \\u003c escaped",
];

for (const value of HOSTILE_VALUES) {
  test(`cannot close the script tag: ${JSON.stringify(value)}`, () => {
    const serialized = serializeJsonLd({ headline: value });

    assert.ok(
      !CLOSES_SCRIPT_TAG.test(serialized),
      `output can close the script tag: ${serialized}`,
    );
    assert.ok(
      !serialized.includes("<"),
      `output contains a raw "<": ${serialized}`,
    );
  });

  test(`round-trips unchanged: ${JSON.stringify(value)}`, () => {
    // Escaping must not corrupt the data. A consumer parsing the block gets
    // exactly what the log wrote, character for character.
    const parsed = JSON.parse(serializeJsonLd({ headline: value }));
    assert.equal(parsed.headline, value);
  });
}

test("escapes values nested anywhere in the document", () => {
  const serialized = serializeJsonLd({
    citation: [{ publisher: { name: "Evil </script><svg onload=alert(1)>" } }],
  });
  assert.ok(!CLOSES_SCRIPT_TAG.test(serialized), serialized);
  assert.ok(!serialized.includes("<"), serialized);
});

test("leaves ordinary content readable", () => {
  const serialized = serializeJsonLd({ name: "Agent Incident Log", count: 7 });
  assert.equal(serialized, '{"name":"Agent Incident Log","count":7}');
});
