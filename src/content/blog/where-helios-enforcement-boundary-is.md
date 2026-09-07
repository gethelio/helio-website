---
title: "A Proxy Cannot Guard Its Own Config File: Where Helio's Enforcement Boundary Actually Is"
description: "We found that a process sharing the proxy's user could rewrite Helio's policy live, lift its dashboard secret, and reload a tampered file through a read-only mount. Here is what we reproduced, what shipped in v0.13.1 and v0.14.0, and what the default install still does not defend."
seoTitle: "Where Helio's Enforcement Boundary Actually Is"
metaDescription: "What we found in Helio's own default install, the four questions that decide your tier, what shipped in v0.13.1 and v0.14.0, and what a same-user agent can still do."
slug: "where-helios-enforcement-boundary-is"
pubDate: "2026-09-07"
author: "Oli Guei"
category: "Security"
categories: ["Security", "Governance"]
authorImage: "/authors/oli-guei.png"
canonicalUrl: "https://helio.so/blog/where-helios-enforcement-boundary-is"
heroImage: "/enforcement-boundary.png"
heroImageAlt: "An AI agent's tool call passing through a governance checkpoint while a second path reaches around it to the proxy's own config file"
---

## What we found

On 2 September 2026 we reviewed our own default install and found that a process running as the same user as the proxy, which is what `helio init` and `helio start` give you on a workstation, could rewrite the policy live, read the dashboard secret out of the config file, and, in the Docker recipes, change the running policy through a mount we had described as read-only. We reproduced the write path and the mount path with scripts we kept. The read-access path went through a security advisory, GHSA-5hpf-j7jh-7x44, and its fix is verified from the v0.13.1 tag in that release's notes. All three scripts were re-run on the v0.14.0 release candidate, and those transcripts are in the v0.14.0 release notes.

The review was a focused look at one question, not a full audit: what can a process that shares the proxy's filesystem do to it? Four findings came out of it, and we titled them plainly at the time.

1. "Write access to helio.yaml is an instant, unaudited policy bypass (hot reload defaults on)." Everything load-bearing for enforcement lives in `helio.yaml`, most of it reloads live by default, and the proxy did not record a reload. A process that can write the file can change every one of those keys on a running proxy in well under a second without restarting anything, and the proxy does not check who wrote it.
2. "Read access to helio.yaml yields dashboard.api_secret, which self-approves the agent's own tickets." `helio init` wrote the secret into the file as plaintext, so any local reader of the file held the operator credential that gates ticket approval.
3. "The :ro bind mount in the Docker recipes blocks only the container; host-side writes propagate and survive restart." The read-only flag protects the container side. A write on the host side reaches the running proxy through the same hot reload, and a restart loads whatever is on disk.
4. "Sidecar recipe binds the operator sideband to 0.0.0.0 on the network the agent shares." We read this one from the recipe on the day and confirmed it live the next: the dashboard answered its health check from inside the agent container.

Here is what the write path looked like before the fix. One overwrite of the file from a separate process, three governed calls around it, and the audit table afterwards:

```
id        tool_name      policy_decision  block_reason   matched_rule       record_kind  t           
--------  -------------  ---------------  -------------  -----------------  -----------  ------------
bc8fd227  delete_record  deny             policy_denied  block-destructive  tool_call    09:52:56.208
bcc07220  delete_record  allow                           block-destructive  tool_call    09:52:57.075
2d9cba97  delete_record  deny             policy_denied  block-destructive  tool_call    09:52:57.390
```

Three rows and no reload row between them. The second call was allowed because the file had been rewritten between the first and the second, and nothing in the audit trail says so. That table is the whole finding.

## The principle

There is nothing exotic in any of this. An enforcement point can only refuse what reaches it, and it can only keep its own rules if the thing it governs cannot rewrite them. A proxy that runs as the same user as the agent, with its config, its secret, and its audit database in directories that user owns, sits inside the privilege domain of the thing it governs. No user-space process can defend itself from there. That is a property of operating systems, not of Helio, and SECURITY.md now says it in two sentences we intend to keep: "Nothing in this section is a property of the software alone. It is a property of where you put the process and its files."

What Helio's design does give you is a boundary that can move. Enforcement is a separate process. A rule in it is not in the model's context, so a long session cannot evict it and an injection cannot argue it away, and a tool call routed through Helio is decided before it is forwarded, whatever the model has been told. Those two hold on every install. Whether the process and its files are outside the agent's trust domain is decided by where you put them: give the proxy its own user or its own container and keep its config, its secret, and its audit database off the agent's filesystem, and the same binary is on the other side of the line.

## The four questions

SECURITY.md reduces the tier you are on to four questions, and we quote them as written: "can the agent write the config, can it read the secret, can it restart the proxy or set its environment, and can it write the audit database. If every answer is yes, you are on the detection-only tier, whatever else you have configured."

A workstation install leaves the write, restart, and audit answers yes (since v0.13.1 a `helio init` config holds only the digest of the dashboard secret), and that is the detection tier. Turning the answers to no is deployment work, and the two recipes in the docs are the two ways to do it: run the proxy as a dedicated OS user, with the config, the digest, and the audit database in directories the agent's account cannot read or write and no signal path to the proxy, or run it in its own container attached to no network the agent is on, with the config mounted from a directory the agent never sees. The proxy tells you which side you are on: when the config file is writable by the user it runs as, `helio start` prints an `Enforcement posture` line naming the two ways up a tier.

## What shipped

By pull request, in the order they merged.

- The boundary statement itself (#343, in v0.13.1). SECURITY.md gained the "Process and filesystem boundaries" section this post quotes, and the README, the sidecar page, and the getting-started checklist scoped their claims to it.
- The digest secret (#346, in v0.13.1, GHSA-5hpf-j7jh-7x44). `dashboard.api_secret` accepts a `sha256:` digest, `helio init` writes only the digest and prints the secret once, and `helio secret` prints a fresh secret and digest pair. Read access to the file no longer yields a working credential; a plaintext value still works and draws a startup warning. The v0.13.1 release notes carry the read-access script run against the tag, and its transcript reads "lifted value is the secret: no"; presenting the lifted value to the operator sideband returns `{"error":"Unauthorized"}` on the list and on the approve, and the parked call ends with "Approval timed out".
- The recipes and `helio init --sandbox` (#354 and #355, in v0.14.0). A separate-user recipe run end to end on Ubuntu 24.04, a sidecar layout with Helio attached to no network the agent is on and a stream forwarder relaying the MCP port, and one command that writes that layout. From inside the container `helio init --sandbox` lays out, governance cannot be bypassed for an upstream the agent cannot otherwise reach or authenticate to: there is no route to the compose-internal upstream, no mount holding the config, no signal path to the proxy, and no copy of the upstream credential. The agent's network has internet egress by design, so an upstream reachable over the internet is protected only while the sole copy of its credential is in Helio's environment.
- Audited reloads, the hash on every record, the pin, and the posture line (#356, in v0.14.0). Every reload attempt is an audit record, `record_kind: policy_reload`, with the outcome, the hash of the file before and after, the rule and budget counts, the names of the rules that disappeared, and the error on a refusal; the same facts go out on the dashboard event stream as `policy_reload`, and the stderr line stays. Every audit record carries `config_sha256`, the hash of the config bytes in force when it was written, so any decision can be checked against the policy text it ran under. Setting `HELIO_CONFIG_SHA256` to the value `helio config hash` prints makes the proxy refuse a changed file: a reload with a different hash is recorded as `rejected_pinned` and the running policy stays, and a start under a different file exits before it serves anything. A file watch the proxy loses is logged and recorded as `watch_failed`. And when the config file is writable by the user the proxy runs as, `helio start` prints the `Enforcement posture` line.

Here is the write path again, run against the v0.14.0 release candidate. The same overwrite, the same three calls, and the table now has five rows:

```
id        tool_name      policy_decision  block_reason   record_kind    outcome  config        t           
--------  -------------  ---------------  -------------  -------------  -------  ------------  ------------
43646ecd  delete_record  deny             policy_denied  tool_call               de86d1c99a56  07:05:57.699
4b6796f0  helio.yaml     policy_reload                   policy_reload  applied  60c425641d0f  07:05:57.964
43838d35  delete_record  allow                           tool_call               60c425641d0f  07:05:58.221
e6802228  helio.yaml     policy_reload                   policy_reload  applied  de86d1c99a56  07:05:58.477
e39bf6ac  delete_record  deny             policy_denied  tool_call               de86d1c99a56  07:05:58.735
```

The second call is still allowed. On a same-user install the write is not prevented, and it is not meant to look prevented. What changed is that the reload is a row of its own, and every decision carries the hash of the policy it ran under, so the allowed call is visibly a decision made under a different file from the one before it and the one after it.

And the mount path, with the pin set on the container. The host-side write is refused at reload and recorded as `rejected_pinned`, and the restart under the tampered file exits before it serves anything:

```
### container state after restart under the tampered file: exited exit=1
### mismatch lines in the log: 1
Error: HELIO_CONFIG_SHA256 does not match /config/helio.yaml: pinned sha256:fb6bfcc6ce02c910fb4aed104f2daffd50db204005de336a69061d623c9e1476, file sha256:9767ec7c3b514cca4aef6430efb0ca0cd1f6945681f9897c56137f052fec1b1b. Review the change and re-pin it with helio config hash.
```

One reload row in the audit database afterwards, `rejected_pinned` under the pinned hash, and the running policy unchanged.

## What it does not do

This is the part a diligence reader should hold us to, so here it is as plainly as we can state it.

- The default local install is the detection tier. `helio init` and `helio start` run as the same user as the coding agent, and coding agents carry file and shell tools that never pass through Helio.
- A same-user agent can restart the proxy without the pin. The pin holds for the process the operator started.
- It can edit or delete the audit file, which also holds the budget ledger, so deleting it resets spend, and which `helio export` reads as written.
- The reload record and the hash on every record are durable only while the agent cannot write the audit file, and the event stream and stderr are the channels that leave the box before that.
- It can read the proxy's environment, including the SDK and adapter tokens when the sideband is enabled, and any secret the config carries as a literal: Slack tokens, webhook secrets, static upstream headers. The Slack action callback is served on the agent-edge port, so a lifted signing secret forges Slack approvals.
- For a stdio upstream it can run the server command itself, as can any co-located process that can read the proxy's command line.
- An agent at any tier can rewrite its own MCP client config to address an HTTP upstream directly. The answer is credential termination, which holds only while the sole copy of the credential is in Helio's environment.
- On Docker Desktop a dashboard port published to the host is reachable from the agent container through the host gateway. Its control-plane routes stay behind the secret, and `/api/health` answers without it.
- The sidecar's `edge` network has internet egress, so an upstream reachable over the internet is protected only while Helio holds the sole copy of its credential.
- A watch the proxy loses means no later edit reloads until a restart. The form that raises an error is logged and recorded as `watch_failed`; a silent form, reproduced when the config is replaced by a file the proxy cannot read, is open as issue #352 in the Helio repo. The hash on every row, checked against `helio config hash`, is the test that does not depend on the watch.
- Evidence grounding at the SDK sideband is cooperative: the proxy checks that an allowlisted evidence key was posted for the session and has not expired, not what it contains.
- Windows is outside this statement: the audit file permission hardening is a no-op there.

Nothing here defends a same-user co-location; the separate-user and sidecar recipes are the way out, and the posture line at startup tells you which side you are on.

## Check your own deployment

The sidecar layout ships with a README, and this is its verification block, run from inside the agent container (`docker compose exec agent sh`):

```sh
# 1. No route to the upstream: must fail (exit 6 or 7).
curl -s -m 3 http://mcp-server:8080/mcp; echo "exit: $?"
# 2. No mount holding the config: both paths must be missing.
ls /config /workspace/helio 2>&1; echo "exit: $?"
# 3. No route to the dashboard: must fail (exit 6; helio-edge:3100 gives 7).
curl -s -m 3 http://helio:3100/api/health; echo "exit: $?"
# 4. No credential in the environment: must print nothing.
env | grep -iE 'helio|upstream|secret'; echo "exit: $?"
# Through Helio it works and is audited:
curl -s -m 5 -X POST http://helio-edge:3000/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

On Docker Desktop (macOS and Windows) every port published to the host is reachable from every container through the Desktop host gateway: `curl -s -m 3 http://host.docker.internal:3100/api/health` answers from the agent there. Run the same probe on your own host and believe its answer.

For the separate-user install the four questions are the check, and the recipe's proof step is the commands that answer them from a second account.

---

Found and reproduced by the maintainer; every plan and every implementation went through external adversarial review before it merged.

_Disclosure: I build [Helio](https://github.com/gethelio/helio), an open-source governance proxy for AI agents, so this is the problem I spend my days on. This post is about a weakness in our own default install, found and fixed by us. If you think a sentence here overclaims, [the repo takes corrections](https://github.com/gethelio/helio/issues). I'd much rather be corrected than cited incorrectly._
