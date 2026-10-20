---
title: "Detection Strategy: The Trinity"
date: 2026-10-20
tags: ["strategy", "soc", "detection-engineering", "yara", "sigma", "suricata"]
---

# Detection Strategy: The Trinity

A robust security posture does not rely on a single tool. Instead, it employs a "Trinity" of detection layers—Network, Log, and File—to ensure that if an attacker evades one layer, they are caught by another.

<br />

## 1. The Detection Pipeline

The most effective investigations use these tools in a sequential pipeline to confirm a threat.

**The Ideal Workflow:**
`Suricata` (Network) -> `Sigma` (Logs) -> `YARA` (Files/Memory)

1. **The Trigger (Suricata)**: A network alert fires on a suspicious C2 beacon or an executable download.
2. **The Context (Sigma)**: The analyst pivots to the logs to see which process initiated the connection and what its parent process was.
3. **The Confirmation (YARA)**: The binary is dumped from the host and scanned. A YARA rule confirms it belongs to a known malware family.

<br />

---

## 2. Comparison Matrix

| Feature | Suricata (Network) | Sigma (Logs) | YARA (File/Memory) |
|---|---|---|---|
| **Inspection Target** | Live Packets / Streams | Event Logs / Telemetry | Binaries / RAM Dumps |
| **Format** | Snort-style Rules | YAML | C-like Rules |
| **Runtime** | Network Tap / IPS | SIEM (Splunk, Elastic) | EDR / Scanner / Sandbox |
| **Primary Strength** | C2 & Exfil Detection | TTP & Behavior Tracking | Family-level Identification |
| **Major Blindspot** | Encrypted Payloads | Content-level details | Dormant/Fileless threats |

<br />

---

## 3. Handling "Blinded" Layers

No single layer is perfect. A professional strategy accounts for the failure of any one component.

- **Case A: Encrypted Traffic**: Suricata is blinded by HTTPS. $\rightarrow$ **Sigma** catches the process execution on the endpoint.
- **Case B: Fileless Malware**: YARA has no file to scan. $\rightarrow$ **Sigma** catches the anomalous PowerShell command.
- **Case C: Log Deletion**: The attacker clears the Event Logs. $\rightarrow$ **Suricata** has already recorded the network beaconing.

<div class="info-callout">
<strong>The Synthesis:</strong> By correlating these three independent data sources, we move from "guessing" to "proving." The intersection of a network alert, a log anomaly, and a YARA match is a high-fidelity signal that is nearly impossible for an attacker to fully spoof.
</div>

<br />

## 4. Mapping to the Portfolio

This strategy integrates the following research notes:
- **Network Layer** $\rightarrow$ `network-detection-suricata.md`
- **Log Layer** $\rightarrow$ `detection-engineering-sigma.md`
- **File Layer** $\rightarrow$ `yara-family-detection.md`
