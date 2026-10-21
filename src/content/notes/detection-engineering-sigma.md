---
title: "Detection Engineering with Sigma"
date: 2026-10-20
tags: ["sigma", "detection-engineering", "siem", "soc"]
---

# Detection Engineering with Sigma

Sigma is a vendor-neutral, YAML-based language used to describe detection rules. It allows analysts to write a detection once and convert it into specific queries for Splunk, Elastic, Microsoft Sentinel, or other SIEMs.

<br />

## 1. Anatomy of a Sigma Rule

A robust Sigma rule is composed of three primary segments:

### The Metadata
Defines the rule's purpose, author, and mapping to the **MITRE ATT&CK** framework.

### The Logsource
Defines **where** the rule should run.
- **Category**: `process_creation`, `network_connection`, `registry_event`, `file_event`.
- **Product**: `windows`, `linux`, etc.

### The Detection Logic
The core of the rule, consisting of selection blocks and a final condition.
- **Selection**: A set of fields and values that must match (e.g., `Image: 'cmd.exe'`).
- **Filter**: A set of values to exclude to reduce false positives (e.g., `CommandLine: 'allowed_script.ps1'`).
- **Condition**: A boolean expression combining selections and filters (e.g., `selection1 and not filter1`).

<br />

---

## 2. The Three-Layer Rule Design

To minimize false positives while maintaining high detection rates, apply the three-layer design pattern:

1. **Identity**: Identify the tool or process (e.g., `Image|endswith: '\certutil.exe'`).
2. **Primitive**: Identify the malicious behavior (e.g., `CommandLine|contains: '-urlcache'`).
3. **Network Signal**: Identify the external interaction (e.g., `CommandLine|contains: 'http://'`).

**Logic Flow:**
`Identity` -> `Primitive` -> `Network Signal` -> `High Confidence Alert`.

<br />

---

## 3. The "Rosetta Stone" (Field Mapping)

Because every SIEM calls the same thing by a different name, Sigma acts as a translation layer. You write in **Sigma Language**, and the converter handles the vendor specifics.

### Common Translation Map

| Concept | Sigma Field | Sysmon (Win) | Security 4688 | Elastic ECS | Splunk CIM |
|---|---|---|---|---|---|
| **The Process** | `Image` | `Image` | `NewProcessName` | `process.executable` | `process_path` |
| **The Command** | `CommandLine` | `CommandLine` | `ProcessCommandLine` | `process.command_line` | `process` |
| **The Parent** | `ParentImage` | `ParentImage` | `ParentProcessName` | `process.parent.executable` | `parent_process_path` |

<div class="info-callout">
<strong>Pro Tip: Keep it Portable.</strong> To ensure your rules work on any SIEM, always use the **Sigma Field** (left column). Avoid using vendor-specific fields like `OriginalFileName` or hardcoding Event IDs (e.g., `EventID: 1`), as these will break the translation to other platforms.
</div>

<br />

---

## 4. The Iterative Engineering Loop

Detection is an iterative process of refining the "Sweet Spot" between being too narrow (missing variants) and too broad (excessive false positives).

1. **Pivot**: Compare malicious and benign command lines side-by-side in the SIEM.
2. **Isolate**: Identify the discriminating primitive (the token that only appears in malicious samples).
3. **Draft**: Write the narrowest rule that captures the primitive.
4. **Test**: Run against a dataset of known-benign logs.
5. **Tune**: Add filter blocks to exclude benign near-misses.
