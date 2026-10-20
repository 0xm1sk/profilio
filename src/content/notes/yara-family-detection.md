---
title: "YARA: Family-Level Detection"
date: 2026-10-20
tags: ["yara", "malware-analysis", "signatures", "threat-hunting"]
---

# YARA: Family-Level Detection

Hash-based detection is brittle; any minor change in a binary's compilation results in a new hash. **YARA** allows for family-level detection by matching the reused code and strings that survive across multiple builds of the same malware family.

<br />

## 1. The Anatomy of a YARA Rule

A YARA rule consists of three main sections: `meta`, `strings`, and `condition`.

### The Strings Section
This is where you define the "Invariants"—the markers that the author likely won't change.
- **Hex Bytes**: `{ 50 45 00 00 }` for binary structures like the PE header.
- **Text Strings**: `"GHOSTLOADER"` ascii wide nocase.
- **Modifiers**:
  - `ascii`: Matches standard ASCII.
  - `wide`: Matches UTF-16LE (common in C#/Go/Rust).
  - `nocase`: Case-insensitive matching.

### The Condition Section
The boolean logic that decides if a file is a match.
- **Example**: `uint16(0) == 0x5A4D and $pe and $family_string`
- **Magic Bytes**: `uint16(0) == 0x5A4D` ensures the file is a Windows PE before checking for strings.

<br />

---

## 2. Invariants vs. Variables

The key to a robust rule is knowing what to ignore.

| Invariant (Match on this) | Variable (Ignore this) |
|---|---|
| Family Name String (`GHOSTLOADER`) | Full File Hash (SHA-256) |
| Mutex Prefix (`Global\\GL-`) | Full Mutex GUID |
| PE Structure / Section Names | Specific C2 Domain |
| Hardcoded Config Markers | Entry-point offset |

<br />

---

## 3. The Testing & Tuning Loop

A rule that fires on benign files is as useless as one that misses malicious ones.

**The Workflow:**
1. **Extract**: Use `strings -a` and `strings -el` to identify common markers across multiple malicious samples.
2. **Draft**: Create a rule requiring the most stable invariants.
3. **Verify**: Run the rule against a "Benign Fixture" (clean system files).
4. **Tune**:
   - **Too Broad?** Add a required string or tighten the condition (`and` instead of `or`).
   - **Too Narrow?** Remove a variable string or use a regex for the marker.

<br />

---

## 4. Practical Tooling

**Local Testing:**
`yara rule.yar /path/to/samples/`

**Python Integration:**
Using `yara-python` to automate the scanning of large datasets.

<div class="info-callout">
<strong>Encoding Tip:</strong> Always use the `wide` modifier for strings in modern malware. Most high-level languages store strings in UTF-16, and a rule without `wide` will miss the majority of the hits.
</div>

