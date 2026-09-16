---
title: "A Protocol Revision Can Switch Off Your Guardrails Without Raising a Single Error"
description: "MCP 2026-07-28 made the protocol stateless. We audited Helio against it and filed sixteen issues. The ones that mattered were not the ones that broke loudly, they were the controls that kept reporting success while enforcing nothing."
seoTitle: "What MCP 2026-07-28 Broke in Our Governance Proxy"
metaDescription: "A stateless protocol revision silently voided session budgets, drift detection and annotation rules in our own proxy. The test we used to sort sixteen issues, and what to check in your stack."
slug: "mcp-2026-07-28-silent-governance-failures"
pubDate: "2026-09-15"
author: "Oli Guei"
category: "MCP"
categories: ["MCP", "Governance", "Security"]
authorImage: "/authors/oli-guei.png"
canonicalUrl: "https://helio.so/blog/mcp-2026-07-28-silent-governance-failures"
heroImage: "/mcp-2026-07-28-silent-failures.png"
heroImageAlt: "A governed tool call passing a checkpoint that is no longer checking anything, while the checkpoint still reports success"
---

## The upgrade nobody has to approve

The MCP `2026-07-28` revision moved the protocol toward a stateless core. No `initialize`
handshake. No `Mcp-Session-Id`. New required `Mcp-Method` and `Mcp-Name` headers on every request.
Required `resultType` and cache hints on responses. A twelve-month deprecation policy for
everything it replaced.

Read as a protocol change, that is housekeeping. Read as a governance change, it is something else,
because almost every control worth having is stateful. A per-session budget needs a session. A rule
that says "this tool is destructive" needs tool annotations. Drift detection needs to see the tool
list. Take the state out of the protocol and the controls do not error. They keep running against
nothing.

The part that made this worth writing down is the upgrade path. Nobody in your organization has to
approve this. A client library bumps a minor version, or an upstream server you do not own ships a
release, and the proxy between them is now enforcing less than it was yesterday, with the same
green dashboard.

We filed [sixteen issues](https://github.com/gethelio/helio/issues/228) against our own proxy on 29 July, the day after the revision
landed. This is what we found and, more usefully, the test we ended up using to sort them.

## The test

The first pass at triage was the obvious one: how hard is this to fix, and how much of the spec does
it cover. That produced a list nobody could act on, because it ranked a missing header next to a
budget that had stopped counting.

The question that actually sorted it was narrower:

**Does this silently disable a governance control when either side of the proxy upgrades?**

Not "is this a spec violation." Not "is this severe." Does the control go on reporting success while
enforcing nothing, without anyone being told. If yes, it blocks the release. If it is additive, or
it fails loudly, it does not.

That single question moved items in both directions, which is how you know it was doing work rather
than confirming what we already believed. It demoted conformance gaps we had assumed were urgent.
It promoted one issue we had filed as an enhancement.

## Four controls that stopped enforcing

**[Every per-session limit collapsed into one bucket](https://github.com/gethelio/helio/issues/215).** Session-keyed rate limits, spend
limits and budgets all key off session identity, and the revision removes the header they were
keying off.
Without it, every caller resolves to the same bucket. A limit of a hundred calls per session becomes
a hundred calls across all sessions, shared. Ten agents that each had their own budget now share
one. The limit still appears in the config, still shows in the dashboard, still fires, and enforces
something nobody asked for. The fix was to stop borrowing the transport's identity and
[resolve session identity in the proxy itself](https://github.com/gethelio/helio/issues/218).

**[Drift detection went quiet](https://github.com/gethelio/helio/issues/221).** The revision makes cache hints required on list
responses. Clients
that honor them cache `tools/list`, which means it stops crossing the proxy. A proxy that only sees
the tool list once cannot notice a tool definition changing underneath it, so drift detection
degrades to a startup-only check.

We had filed that one as an enhancement. Under the test it is a blocker, and it has a property the
others do not: **it gets worse as adoption grows.** The better the client, the more it caches, the
less the proxy sees. Nothing in your logs degrades. Your correctly-implemented clients quietly
remove your ability to detect a rug pull.

**[Rules that gate on prior state started denying everything](https://github.com/gethelio/helio/issues/214).** Rules that require a
prerequisite
action to have happened earlier in the session need the session to exist. When it does not, the
prerequisite can never be satisfied, and every gated call is refused. This one is the least
dangerous of the four, because it fails loudly and in the safe direction. We are including it
because it is the same root cause wearing the opposite mask, and because a control that denies
everything gets switched off by whoever is on call at 2am.

**[Upstream forwards were missing required headers](https://github.com/gethelio/helio/issues/217).** Less interesting on its own, but it
is the
mirror image: our own requests had stopped being conformant, and nothing told us either.

## The one that inverted instead of stopping

This is the finding we would want someone else to take away, because it is the one we would have
gotten wrong by reasoning instead of testing.

Helio matches rules on tool annotations, `destructiveHint` and `readOnlyHint` among them. Those
annotations are learned from the upstream handshake. [The revision broke that handshake](https://github.com/gethelio/helio/issues/216), so
the annotation cache never primed.

The intuitive conclusion is that annotation rules go inert. An empty cache, nothing to match, rules
do nothing. That is what we assumed, and it is wrong.

When the cache is unprimed, the matcher applies MCP's own specified defaults: `destructiveHint`
defaults to true, `readOnlyHint` defaults to false. So a rule saying "deny anything destructive"
matches **every tool in the system**, including the read-only ones. And a rule saying "allow
anything read-only" matches **nothing at all**.

The controls did not stop. They inverted. And they inverted in a way that follows the specification
correctly, which is the detail that took three review rounds to pin down. We only established it by
executing the decision path both ways and reading what came back, not by reasoning about the code.

## What we got wrong

Two corrections, both from measurement rather than review.

While [adding Origin validation to the MCP transport](https://github.com/gethelio/helio/issues/213), our documentation claimed that a
`GET /sse` request carries no `Origin` header from any browser. We had written that confidently and
built an argument on top of it. It is false. We ran it in real
Chromium: cross-origin `EventSource` and `fetch` with `mode: 'cors'` both send `Origin` and are
refused by the guard. Only same-origin and no-cors requests omit it. The guard covered more than we
had credited it with, and the residual risk was a different and smaller thing than we had described.

The second is smaller and more embarrassing. One of the sixteen looked like a governance bypass:
[inbound requests were not validated for agreement between their headers and their body](https://github.com/gethelio/helio/issues/226). If a proxy
routes on headers and governs on the body, a mismatch is an authorization bypass. We checked the
forwarding path rather than assuming, and found Helio never relays caller `Mcp-*` headers at all,
only `authorization` and an allowlist. Helio always governs the body it actually parsed. So the
issue was real, and it was a conformance requirement with a defense-in-depth rationale, not the
vulnerability it looked like on paper.

We are including both because a post arguing that controls fail quietly is worth very little if it
only reports the times we were right.

## What we have not fixed

Four of the sixteen are still open, and every one of them is additive rather than silent. That is
the test doing its job, not us being comfortable.

[In-band approvals over the revision's new request-and-respond mechanism](https://github.com/gethelio/helio/issues/220) is the one we
deferred deliberately. It was the largest item in the set, and letting it sit ahead of controls that
were already failing silently would have been the wrong order. The reasoning is on the issue.
[Governing the new Tasks extension](https://github.com/gethelio/helio/issues/222) and [authorization hardening for issuer-bound
credentials](https://github.com/gethelio/helio/issues/223) are both new surface the revision introduced that we do not govern yet.
[Retiring the legacy HTTP+SSE transport on a twelve-month window](https://github.com/gethelio/helio/issues/224) is housekeeping the
revision's own deprecation policy asks for.

None of them makes a control lie about what it is enforcing. All of them are things Helio does not
do, which is a different and more honest category than things Helio appears to do.

## What to check in your own stack

None of this is specific to Helio. Any enforcement point sitting between two components that
upgrade independently has the same shape of exposure. Four questions that are worth an afternoon:

**Which of your controls need protocol state to work?** Per-session anything is the obvious
category. Write down what happens to each one when the field it keys on is absent. If the answer is
"it falls back to a shared default," you have a limit that silently widens instead of failing.

**What does your system do with an empty cache?** Not what do you think it does. Run it. Defaults
are chosen by whoever wrote the spec, and they were chosen for interoperability, not for your
threat model.

**Which controls depend on seeing traffic that a well-behaved client is allowed to stop sending?**
Caching, batching and connection reuse all reduce what crosses a proxy. Anything that watches for
change over time is exposed to this, and the exposure grows as clients get better.

**Can either side upgrade without telling you?** If a client library bump or an upstream release can
change what your enforcement point sees, then your controls have a dependency that no one is
reviewing.

The failure mode worth designing against is not the control that breaks. It is the control that
keeps answering.

## Sources

All sixteen issues are public, filed 29 July 2026 under the `mcp-spec` label and collected under
[the tracking epic](https://github.com/gethelio/helio/issues/228). The fixes shipped across v0.12.0, and Helio now
[negotiates the protocol version and supports 2025-06-18 and 2026-07-28 side by side](https://github.com/gethelio/helio/issues/219).
The position this post argues from is written up separately as
[stateless protocol, stateful governance](https://github.com/gethelio/helio/issues/225). Every claim here about what Helio did is
reproducible from those issues and the release notes.
