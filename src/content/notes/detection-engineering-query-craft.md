---
title: "Detection Engineering: Query Craft & Generalization"
date: 2026-11-17
tags: ["detection-engineering", "siem", "kql", "opensearch", "sigma", "soc"]
description: "Field dialects, discriminators, KQL quirks, and writing detections that survive rotation."
---

# Detection Engineering: Query Craft & Generalization

The hardest part of writing a detection was never the boolean logic. It was knowing which data language I was speaking, which field actually carried the signal, and whether the rule would still hold when the infrastructure around it changed. These are the lessons I kept relearning.

<br />

## 1. Know your data language before you write a rule

My first rule was written in Azure Monitor Kusto — `AuditLogs | where OperationName...`. It failed validation because those fields did not exist in the data I was querying.

<div class="warning-callout">
<strong>Lesson:</strong> the data lived in OpenSearch with flat <code>snake_case</code> fields, not Kusto with PascalCase tables. Confirm the schema before writing a single line of logic — a correct idea in the wrong dialect is still a broken rule.
</div>

Real field names I had to internalize:

| Concept | Field name |
|---|---|
| What happened | `operation` |
| Who did it | `initiated_by` |
| Target application | `app_display_name` |
| Service principal | `service_principal` |
| Outcome | `result` |
| Source table | `log_type` |

The same mistake surfaced later as a *table mismatch*: mailbox events arrived as `log_type: office`, which maps to `OfficeActivity`, not `AuditLogs`. Every `AuditLogs` rule I wrote returned **0 rows** — not because the logic was wrong, but because I was querying the wrong table entirely.

<br />

---

## 2. The discriminator is rarely the obvious field

The recurring pattern: the field that *looks* most important is the one that cannot separate malicious from benign.

- **Actor, not operation or target.** Malicious credential-adds and routine rotation used identical operations on identical apps. The only separator was `initiated_by` — a service account adding credentials to a reporting app versus the platform team rotating a CI pipeline app.
- **Target privilege, not actor.** For privileged directory role grants, keying on who performed the grant was wrong — a compromised admin is still a legitimate actor. The discriminator was the privilege level of the `target_role`.
- **Outlier cadence, not a known-bad name.** The identity team edited Conditional Access policies at the same time every day. The tampered policy stood out because *who* edited it and *when* broke the routine — and it was corroborated by a diagnostic setting deleted minutes later. Two signals pointing at the same intent beat one signal in isolation.
- **Absence as a discriminator.** A benign mailbox rule looked almost identical to a malicious forwarding rule. The difference was not what it *had* but what it *lacked* — no forwarding address. Learning to key on a missing field mattered as much as keying on a present one.

<div class="info-callout">
<strong>Pattern:</strong> when malicious and benign events look the same, compare them side by side and ask — what does only the malicious one have, or uniquely lack?
</div>

<br />

---

## 3. KQL quirks that cost real time

Validation errors and silent misses came from syntax details, not concept errors.

- **Unsupported operators:** `!in~` was rejected. `not (... has_any ...)` and explicit `!contains` chains worked.
- **`has` vs `contains`:** `has` is token-aware, so `has "/tmp/"` does **not** match `/tmp/svc-fix.sh`. `contains "/tmp/"` does. This single operator broke many rules.
- **En-dash vs hyphen:** `Update application – Certificates...` (en-dash) and `Update application - Certificates...` (hyphen) are different strings. Normalize or account for both.
- **Backslashes are not escapes:** in KQL, `"Vendor\\update"` looks for a literal double backslash. Use a single backslash `"Vendor\update"` — or better, avoid backslashes altogether.
- **Numbers are not strings:** `bytes_out` is numeric. Compare it unquoted (`bytes_out > 10000000`) and never wrap it in `tostring()`.

<br />

---

## 4. Behavior over indicator — the rule must survive rotation

Any rule keyed on a fixed indicator failed as soon as that indicator changed. The indicators that betrayed me: a specific collector address, a C2 IP, a known malware filename, a known service account.

The rules that survived keyed on the **relationship** that made the activity malicious:

- Cross-mailbox forwarding to an external address — not one particular address
- Direct-to-IP TLS with no HTTP host — not one particular IP
- `sudo -u root` from a temp path — not one particular script name
- RC4 tickets against any SPN — not one particular account
- Office applications spawning PowerShell — not one particular document
- SYSTEM tasks pointing outside System32 — not one particular task name

<div class="warning-callout">
<strong>Generalization test:</strong> a held-out corpus of similar events is not the live estate. Rules that matched exact estate values failed; rules that matched the technique passed. If removing a single IOC breaks your rule, the rule is too narrow.
</div>

Size alone is never enough either. Legitimate backups and cloud syncs were also larger than 50 MB. The malicious transfer was distinguished by what it *didn't* have — no `http_host` — and by going to a non-cloud IP.

<br />

---

## 5. Coverage is part of correctness

A rule can be individually correct and still fail the requirement:

- One rule per attack stage is fine — but **together they must cover the whole chain**. Cleaning up duplicates once removed a lateral-movement rule and left a persistence technique uncovered; the pack had a gap even though every remaining rule fired correctly.
- For correlation maps, **one combined rule must catch every row**. Per-exercise rules failed even when each was right on its own.
- Finding what no detection caught meant inverting the query — `NOT alert_id: *` surfaced the events no existing rule had fired on. Those "no alert fired" records hid the real artifacts.

<div class="info-callout">
<strong>Error text is a diagnosis.</strong> "Row 3 matched no stage" meant bundled fields. "Rule 4 fires on a lookalike" meant I matched shape instead of malice. "Each rule must catch all three rows" was a coverage requirement. The fix was almost always sitting in the error message.
</div>
