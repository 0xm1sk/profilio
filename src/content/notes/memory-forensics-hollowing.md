---
title: "Memory Forensics: Detecting Process Hollowing"
date: 2026-10-17
tags: ["forensics", "memory", "volatility", "malware-analysis"]
---

# Memory Forensics: Detecting Process Hollowing

Process Hollowing is a sophisticated defense-evasion technique where a legitimate, signed Windows executable is launched in a suspended state, its memory is "hollowed out" (deallocated), and malicious code is injected into the remaining shell. The process continues to appear legitimate to the OS and most security tools.

<br />

## 🔍 The Forensic Workflow: Corroboration Chain

A professional forensic investigation does not trust a single tool's output. Detection requires corroborating evidence across multiple kernel structures.

### Step 1: Identifying Anomalous Memory (Detection)
The first step is to find regions of memory that exhibit suspicious characteristics.

**Tool:** `windows.malfind`
**The Target:** Regions that are both **Executable** and **Writable** (RWX) but are not backed by a file on disk.

<div class="warning-callout">
<strong>The JIT Trap:</strong> Modern .NET applications and PowerShell use Just-In-Time (JIT) compilation, which creates RWX regions. This often triggers false positives in `malfind`.
</div>

**Verification:**
To distinguish JIT from malware, inspect the hex dump for the **MZ magic bytes** (`4D 5A`) and the string `"This program cannot be run in DOS mode"`. JIT code does not create a full PE header; a fresh MZ header inside a system process is a high-confidence indicator of injection.

<br />

### Step 2: Verifying Hidden Modules (Corroboration)
Once a suspicious process is identified, we must verify that the malware is actively hiding its presence from the OS.

**Tool:** `windows.ldrmodules`
**The Logic:** Windows tracks loaded DLLs in three different linked lists:
1. **InLoad:** The primary linked list of loaded modules.
2. **InInit:** Modules in the process of initialization.
3. **InMem:** Modules actually present in physical memory.

**The Smoking Gun:**
Filter the output by the suspicious PID. If a module is present in memory (**InMem = True**) but missing from the OS tracking lists (**InLoad = False**), the process has been hollowed or modules have been unlinked to evade detection.

<br />

---

## 🛠️ Forensic Summary

**Detection Pipeline:**
`malfind` (RWX Scan) -> `Hex Dump` (MZ Header Check) -> `ldrmodules` (List Mismatch) -> `Extraction`

**Key Indicators:**
- **RWX Memory:** Indicates dynamically allocated executable code.
- **MZ Header:** Confirms the presence of a Portable Executable (PE) in memory.
- **Unlinked Modules:** Proves an intentional effort to hide from the Windows Loader.

<br />

**Conclusion:**
By corroborating the evidence between memory regions and loader lists, we can confidently move from a "suspicious alert" to a "confirmed compromise."
