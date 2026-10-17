---
title: "SOC Operations: The Defensive Lifecycle"
date: 2026-10-17
tags: ["soc", "dfir", "incident-response", "blue-team"]
---

# SOC Operations: The Defensive Lifecycle

A Security Operations Center (SOC) is not simply about responding to alerts; it is the practice of finding "unexplained" events and reconstructing the narrative of an intrusion through technical artifacts.

<br />

## The Analytical Mindset

The core of defensive operations is the ability to disprove a hypothesis. An alert (e.g., "Off-hours Login") is not a finding until it is contextualized.

<div class="info-callout">
<strong>Contextualization:</strong> An anomaly is only malicious if it cannot be mapped to a sanctioned change ticket, a scheduled maintenance window, or a standard system process.
</div>

**The Investigation Flow:**
`Indicator (IP/Domain)` -> `Pivot across Network` -> `Chronological Sorting` -> `Timeline Reconstruction` -> `Patient Zero Identification`.

<br />

---

## Investigation Pillars

### 1. Endpoint Telemetry & Windows Internals
Focuses on how code executes on the host and how attackers abuse legitimate system functions.

- **Process Ancestry:** Analyzing parent-child relationships. A word processor (`winword.exe`) spawning a command shell (`cmd.exe`) is a critical anomaly.
- **Living off the Land (LotL):** Detecting the abuse of LOLBins (e.g., `certutil.exe` for downloading payloads, `schtasks.exe` for persistence).
- **Evasion:** Identifying tampering with AMSI (Antimalware Scan Interface) or ETW (Event Tracing for Windows) to blind security tooling.

<br />

### 2. Network Forensics
Moving beyond packet capture to behavioral analysis of the communication channel.

- **C2 Detection:** Identifying Command & Control channels via **Beaconing** (consistent connection intervals) and **TLS Fingerprinting** (JA3 hashes) to identify the client software regardless of encryption.
- **Covert Channels:** Spotting DNS Tunneling by analyzing high-entropy subdomains and excessive TXT record queries.
- **Traffic Analysis:** Following TCP streams to extract exfiltrated data and analyzing raw email headers for SPF/DKIM/DMARC failures.

<br />

### 3. Memory Forensics
Analyzing the "Ground Truth" of a system by inspecting RAM, where modern malware often resides without touching the disk.

- **Hidden Processes:** Comparing `pslist` (the OS view) against `psscan` (a raw pool scan of memory) to find unlinked processes.
- **Injection Detection:** Using `malfind` to locate RWX regions and validating them against MZ headers to distinguish from JIT compilation.
- **Module Hiding:** Using `ldrmodules` to find discrepancies between InLoad and InMem lists.

<br />

---

## Investigator's Mapping Table

| Detection Goal | Primary Artifact | Technical Indicator |
|---|---|---|
| **Hidden Process** | Memory Dump | `pslist` vs `psscan` mismatch |
| **Process Hollowing** | Memory Dump | RWX region + MZ Header + `ldrmodules` mismatch |
| **C2 Communication** | PCAP / Netflow | Beaconing cadence + JA3 TLS Hash |
| **Data Exfiltration** | PCAP | High-volume HTTP POST / DNS TXT queries |
| **Privilege Escalation** | OS Logs / Proc | SUID binaries / `sudo -l` / `/proc/<pid>/environ` |
| **Persistence** | Registry / Disk | WMI Event Subscriptions / Scheduled Tasks |

<br />

## The Synthesis

A successful investigation transitions from raw data to a structured product:
`Raw Logs` -> `Timeline Construction` -> `MITRE ATT&CK Mapping` -> `Root Cause Analysis` -> `Containment & Remediation`.
