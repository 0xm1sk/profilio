---
title: "Host DFIR Investigation Methodology"
date: 2026-10-20
tags: ["dfir", "host-forensics", "incident-response", "kill-chain"]
---

# Host DFIR Investigation Methodology

Host-based Digital Forensics and Incident Response (DFIR) is the process of stitching together volatile memory and non-volatile disk evidence to reconstruct a complete attack timeline. 

<br />

## 1. The Reconstruction Process (The Kill Chain)

A professional investigation follows a strict order of operations to identify the lifecycle of the intrusion.

1. **Patient Zero Identification**: Identify the first-executed malicious process, its PID, and the on-disk path.
   - *Analyst Tell*: Look for masquerading (e.g., `svchost.exe` running from `AppData\Local\Temp` instead of `System32`).
2. **Proof of Execution**: Confirm the loader actually ran using disk artifacts.
   - *Primary Artifact*: **Windows Prefetch** (`C:\Windows\Prefetch\<NAME>.EXE-<hash>.pf`).
3. **Injection Tracing**: Determine how the beacon hid its code (e.g., **Process Hollowing**, T1055.012) and identify the host process.
4. **C2 Extraction**: Extract the destination and configuration from the memory region where the implant resides (strings analysis of the process image).
5. **Credential Access**: Identify the mechanism used to steal credentials (e.g., LSASS dumping) and the specific `DOMAIN\account` harvested.
6. **Persistence Analysis**: Map the autorun mechanism (Registry, Scheduled Tasks) to the payload path.
7. **Staging & Exfiltration**: Identify the archives created for data theft and the method of exfiltration.
8. **Anti-Forensics Detection**: Identify evidence-destruction tells (Log clearing, Timestomping).
9. **Impact Assessment**: Determine the end-stage action (e.g., ransomware encryption).

<br />

---

## 2. Analytical Traps: Impact vs. Evasion

A common error in reporting is conflating the destruction of recovery capabilities with the removal of evidence.

| Action | ATT&CK ID | Category | Purpose |
|---|---|---|---|
| `vssadmin delete shadows /all` | T1490 | **Impact** | Inhibit System Recovery |
| `bcdedit /set {default} recoveryenabled no` | T1490 | **Impact** | Inhibit System Recovery |
| Security log cleared (Event ID 1102) | T1070.001 | **Defense Evasion** | Indicator Removal |
| Timestomp / Backdated timestamps | T1070.006 | **Defense Evasion** | Indicator Removal |
| Deleting the staged archive | T1070.004 | **Defense Evasion** | Indicator Removal |

<div class="warning-callout">
<strong>Reporting Rule:</strong> Destroying backups/recovery is an **Impact** event. Destroying logs/files/timestamps is **Defense Evasion**.
</div>

<br />

---

## 3. Operational Discipline

### Kill Chain Mapping
- **One Row = One Event**: Never bundle "Staging and Exfiltration" into one row. Each must be a distinct event in the timeline.
- **Chronological Order**: Credential access must be placed according to the evidence, even if it occurs before persistence.
- **Evidence-Based**: Do not invent stages (e.g., Phishing) if no specific artifact exists in the dump.

### Formatting Standard
For professional reports, avoid ambiguity:
- **Paths**: Use full absolute paths (`C:\Windows\Prefetch\SVCHOST.EXE-123.pf`) instead of filenames.
- **Process ID**: Use consistent formatting, e.g., `svchost.exe (PID 3780)`.
- **Signatures**: Identify the **Artifact** (e.g., a watermark `watermark=HP`) rather than the analyst's **Codename** (e.g., `PatientZero`).

