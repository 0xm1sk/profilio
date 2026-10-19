---
title: "Advanced Memory Analysis: Hollowing vs. Injection"
date: 2026-10-19
tags: ["forensics", "memory", "volatility", "malware-analysis", "dfir"]
---

# Advanced Memory Analysis: Hollowing vs. Injection

Detecting modern implants requires moving beyond signature-based detection. An investigator must analyze the structural discrepancies between how the Windows kernel tracks a process and the physical reality of the memory pages.

<br />

## 1. Execution Context vs. Malicious Intent

A critical failure in many investigations is the "Loudest String" fallacy—trusting the account that is executing the process over the evidence of the process's actual intent.

<div class="warning-callout">
<strong>The Trap:</strong> Tools like `windows.getsids` may show a process running as a local admin (e.g., `buildadmin`). This is the **execution context**. However, the **malicious intent** is found in the code itself, which may be hardcoded to target a different, higher-privileged domain account.
</div>

**The Breakthrough:**
When structured tools fail, raw string analysis of the memory dump can reveal the intended target:
`strings <dump>.raw | grep -i "<DOMAIN>" | grep -v "\.exe\|\.dll"` -> `Finds hardcoded targets (e.g., DOMAIN\\svc_backup) and function calls (e.g., HoldLsassHandle).`

<br />

---

## 2. The Hollowing Detection Matrix

Process Hollowing involves replacing the executable code of a legitimate process with a malicious payload. Detection focuses on finding the "unmapped" state of the image.

### The Standard Signal (MZ Headers)
The easiest signal is finding a Portable Executable (PE) header in a memory region that should not contain one.
- **Indicator:** `PAGE_EXECUTE_READWRITE` (RWX) memory regions that are anonymous (no file backing) and start with the magic bytes `4D 5A` (MZ).
- **Tool:** `windows.malfind`

### Detecting "Headerless" Hollowing
Sophisticated loaders strip the MZ header to evade `malfind`. In these cases, we rely on structural anomalies:

| Method | Tool/Plugin | Detection Logic |
|---|---|---|
| **PTE/PFN Analysis** | `ptemalfind` | Identifies executable pages in a mapped image that are no longer shareable (modified in-place). |
| **API Pointer Scan** | `apisearch` | Scans for clusters of 8-byte pointers resolving to valid kernel APIs (the IAT pattern). |
| **Entry Point Audit** | `hollowprocesses` | Compares the PEB `ImageBaseAddress` against the actual code at the entry point to find redirects/jumps. |
| **VAD vs. PEB** | `vadinfo` | Checks if the PEB claims a file path, but the VAD entry at the image base is anonymous. |

<br />

---

## 3. 64-Bit Memory Nuances

Analysis of 64-bit processes introduces specific structural shifts that change how we identify anomalies.

- **Pointer Width:** IAT entries and memory addresses are 8 bytes. A 32-bit IAT pattern will not match a 64-bit process.
- **PEB Offsets:** The `ImageBaseAddress` is located at offset `0x10` in 64-bit, compared to `0x08` in 32-bit.
- **Address Ranges:** Valid 64-bit user-mode addresses typically reside in the `0x7FF...` range. An executable region at a low address (e.g., `0x140000000`) in a 64-bit process is a strong indicator of an injected payload.

<br />

---

## 4. Hollowing vs. Thread Hijacking

While both involve injecting code, they leave very different footprints in memory.

| Feature | Thread Hijacking (T1055.003) | Process Hollowing (T1055.012) |
|---|---|---|
| **Target** | Existing running process | Newly created suspended process |
| **Image VAD** | Remains file-backed (original PE stays) | Becomes anonymous (original unmapped) |
| **Footprint** | Small shellcode region (often one page) | Large replacement (entire image section) |
| **Detection** | Thread RIP points to anonymous memory | PEB path vs. VAD mismatch |

**Diagnostic Flow:**
`Identify Process` -> `Check VAD at Image Base` -> `If Anonymous -> Hollowing` -> `If File-Backed but RIP is anomalous -> Thread Hijacking`.

<br />

---

## 🏁 Summary of Forensic Evidence

**The "Smoking Gun" for Hollowing:**
`PEB Path = C:\Windows\System32\calc.exe` -> `VAD at Image Base = Anonymous/RWX` -> `Code = MZ Header / API Pointers`.

**The "Smoking Gun" for Hijacking:**
`PEB Path = C:\Windows\System32\calc.exe` -> `VAD at Image Base = File-backed` -> `Thread RIP = 0x0000... (Anonymous Region)`.

