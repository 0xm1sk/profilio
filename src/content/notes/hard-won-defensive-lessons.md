---
title: "Hard-Won Defensive Lessons"
date: 2026-11-17
tags: ["methodology", "lessons-learned", "soc", "detection-engineering", "incident-response", "mindset"]
---

# Hard-Won Defensive Lessons

These are the principles that survived the most failures — the ones I now apply before I touch a rule, a report, or an alert queue.

<br />

## 1. Read the error text precisely

Every error message was a diagnosis, not a verdict. "Row 3 matched no stage" meant bundled fields. "Scope does not cover every asset" meant a missing IP. "Rule 4 fires on a lookalike" meant I matched shape instead of malice. The fix was almost always in the wording of the error.

<br />

## 2. One item per row

Every grader that failed for bundling said the same thing: rows register as single events. A row that says "do A and B and C" counts as one step and loses the other two. Keep findings, report fields, and response actions atomic.

<br />

## 3. Behavior over indicator

Every rule keyed on a fixed IOC — a collector address, a C2 IP, a service name, a script filename — failed held-out tests. The rules that held keyed on the relationship that made the activity malicious: cross-mailbox forwarding, root escalation from a temp path, RC4 on any SPN, Office spawning PowerShell, SYSTEM tasks outside System32. Indicators rot; techniques persist.

<br />

## 4. Decoys are everywhere

Every scenario had a benign record shaped exactly like the evil one — a legitimate backup script, an admin consent, a newsletter rule, a large cloud sync. The technique that worked every time was to place the two events side by side and key on what only the malicious one had, or uniquely lacked.

<br />

## 5. Verify field names and types before writing rules

Snake_case versus PascalCase, `has` versus `contains`, number versus string, comma-formatted byte counts, doubled backslashes — roughly half of failed submissions were correct logic in the wrong dialect. Confirm the schema and the query language first.

<br />

## 6. Ask for clarification early

After more than a dozen failed variations of a single rule, one well-formed question to the person who designed the exercise resolved what weeks of guessing could not: a coverage requirement, a held-out dataset, an escaping quirk. Asking is a resource, not a defeat. State what you have tried and ask a specific question.

<br />

## 7. Never fabricate artifacts

Invented scheduled tasks, phantom files on disk, made-up mechanisms — all counted as noise and drove precision failures. Submit only what a log line proves.

<br />

## 8. Silent containment first

Quiet actions — isolate, block egress, revoke tokens — come before loud ones like disabling an account or resetting a password, because the loud ones tip off the attacker before their access is cut.
