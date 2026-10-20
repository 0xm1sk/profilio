---
title: "Network Detection: Suricata & Packet Analysis"
date: 2026-10-20
tags: ["networking", "suricata", "ids", "ips", "network-security"]
---

# Network Detection: Suricata & Packet Analysis

While YARA inspects files and Sigma inspects logs, Suricata inspects the network layer. It provides real-time visibility into traffic, allowing analysts to detect C2 communication, exploit attempts, and data exfiltration as they happen.

<br />

## 1. Deployment Models

Suricata can be deployed in three primary modes depending on the organizational goal:

- **IDS (Intrusion Detection System)**: Passive mode. Mirrors traffic from a SPAN port or TAP. It generates alerts but cannot stop traffic.
- **IPS (Intrusion Prevention System)**: Inline mode. Sits directly in the traffic path and can `drop` or `reject` malicious packets in real-time.
- **NSM (Network Security Monitoring)**: Focuses on producing rich, protocol-specific logs (EVE JSON) for long-term hunting and forensics.

<br />

---

## 2. Rule Anatomy

A Suricata rule is a structured instruction that defines exactly what a "malicious" packet looks like.

**Rule Format:**
`action protocol src_ip src_port -> dst_ip dst_port (rule options)`

### Example: Detecting a Suspicious User-Agent
```bash
alert http $EXTERNAL_NET any -> $HOME_NET any (
    msg:"Suspicious User-Agent Detected";
    flow:established,to_server;
    http.user_agent;
    content:"suspicious-agent";
    nocase;
    classtype:trojan-activity;
    sid:1000001;
    rev:1;
)
```

### Key Components:
- **Action**: `alert` (log), `drop` (block), `pass` (ignore).
- **Header**: Defines the flow direction and network boundaries (`$HOME_NET` vs `$EXTERNAL_NET`).
- **Rule Options**:
    - `content`: The specific byte sequence or string to match.
    - `pcre`: Perl-compatible regular expressions for complex patterns.
    - `flow`: Ensures the rule only fires on specific connection states (e.g., `established`).
    - `http.user_agent` / `tls.sni`: Scopes the search to a specific protocol field.

<br />

---

## 3. Detection Patterns

### The "Executable Download" Pattern
A powerful way to detect initial access is identifying the **MZ Header** (`4D 5A`) being sent in an HTTP response body.

`alert http $EXTERNAL_NET any -> $HOME_NET any (msg:"Executable Download"; flow:established,to_client; http.response_body; content:"|4D 5A|"; startswith; sid:1000003;)`

### The "Reverse Shell" Pattern
Detecting interactive shells by looking for common shell signatures (`/bin/sh` or `cmd.exe`) within an established TCP stream.

`alert tcp $HOME_NET any -> $EXTERNAL_NET any (msg:"Possible Reverse Shell"; flow:established; content:"/bin/sh"; content:"-i"; within:10; sid:1000002;)`

<br />

---

## 4. Operator's Toolkit

**Validation & Testing:**
- **Test Config**: `suricata -T -c /etc/suricata/suricata.yaml` (Checks for syntax errors).
- **PCAP Replay**: `suricata -r capture.pcap -c suricata.yaml` (Tests rules against historical traffic).

<div class="info-callout">
<strong>Pro Tip:</strong> When writing rules, always start with `nocase` for strings to avoid being bypassed by simple casing changes (e.g., `PowerShell` vs `powershell`).
</div>

