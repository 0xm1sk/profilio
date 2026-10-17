---
title: "DFIR: Persistence & Anti-Forensics"
date: 2026-10-17
tags: ["dfir", "forensics", "persistence", "antiforensics", "malware"]
---

# DFIR: Persistence & Anti-Forensics

A core tenet of Digital Forensics and Incident Response (DFIR) is the understanding that attackers must maintain access to a system. This requires "persistence"—a mechanism that ensures a malicious payload executes after a system reboot. However, the act of establishing persistence often leaves a trail of artifacts that an investigator can use to uncover the intrusion.

<br />

## 1. The Persistence Battle: "Whack-a-Mole"

Finding a persistence mechanism is only the first step. The challenge is proving that the mechanism was actually utilized and that the corresponding payload executed.

### The Logic of Proof of Execution
A persistence entry (such as a registry key or a cron job) is a *configuration*, not *evidence* of execution. To move from a lead to a finding, you must find independent artifacts that prove the OS actually triggered the file.

**Corroboration Sources:**
- **Windows:** Prefetch files, ShimCache, Amcache, and Event Logs (e.g., Event ID 4688).
- **Linux:** `syslog`, `auth.log`, and bash history.

<div class="warning-callout">
<strong>The Decoy Strategy:</strong> Sophisticated attackers often plant multiple suspicious-looking startup entries. One is frequently a "decoy" designed to lead the investigator toward a harmless file, while the real payload is hidden in a less obvious secondary location.
</div>

<br />

---

## 2. Anti-Forensics & Metadata Forgery

Attackers attempt to hide their presence by manipulating the filesystem metadata that investigators use to build timelines.

### Timestomping and Metadata Forgery
The most common anti-forensic technique is "Timestomping," where an attacker alters the creation or modification dates of a malicious file to make it blend in with legitimate, years-old system files.

<div class="info-callout">
<strong>The Substrate:</strong> NTFS and other modern filesystems track multiple sets of timestamps. For instance, NTFS maintains the **Standard Information (SI)** attribute and the **File Name (FN)** attribute. User-level tools typically only modify the SI timestamps.
</div>

### The Divergence Method
The "smoking gun" of a forged timestamp is **divergence**. By comparing the SI timestamps against the FN timestamps, an analyst can spot inconsistencies. If the SI date claims the file was created in 2010, but the FN date shows it was created yesterday, the file has been manipulated.

**Filtering False Positives:**
Not every mismatch is malicious. Natural metadata shifts can occur when a file is copied from one volume to another. An investigator must distinguish between a deliberate forgery (targeted timestamps) and a natural shift (consistent shifts across multiple attributes).

<br />

---

## 🏁 The Golden Rule of DFIR

The fundamental principle of any forensic investigation is: **Never trust a single data point.**

Whether analyzing a startup configuration or a file timestamp, the only way to uncover the truth is to cross-reference independent sources of evidence. An attacker can forge a timestamp or plant a decoy, but they almost never clean every single artifact across the entire system.

**Workflow:**
`Detection` (Suspicious File) -> `Check Persistence` (Registry/Cron) -> `Verify Execution` (Prefetch/Logs) -> `Audit Metadata` (SI vs FN) -> `Confirmed Finding`.

