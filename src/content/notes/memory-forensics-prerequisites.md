---
title: "Prerequisites for Memory Forensics & Windows Internals"
date: 2026-10-19
tags: ["forensics", "windows-internals", "memory", "theory", "volatility"]
---

# Prerequisites for Memory Forensics & Windows Internals

Memory forensics is the art of reconstructing the state of a system from a raw dump of physical RAM. To move beyond simply running plugins, an analyst must understand the underlying kernel structures and the "map" the OS uses to manage memory.

<br />

## 1. The Windows Process Hierarchy

Every process in Windows is represented by a set of linked kernel objects. Understanding these relationships is the foundation of all memory analysis.

<div class="info-callout">
<strong>The Core Relationship:</strong>
`KDBG` (Kernel Debugger Block) -> `ActiveProcessLinks` -> `_EPROCESS` -> `{ PEB, VadRoot, ThreadList, ObjectTable, Token }`
</div>

### Key Kernel Structures
- **`_EPROCESS`**: The primary kernel-level object for a process. It contains the PID, image name, and pointers to the process's memory and security context.
- **`PEB` (Process Environment Block)**: A user-mode mirror of process info. It stores the `ImageBaseAddress`, the list of loaded modules (`Ldr`), and command-line arguments.
- **VAD Tree (Virtual Address Descriptor)**: A kernel-level AVL tree that describes every single virtual memory region allocated to a process. This is where we find if a region is private, shared, or file-backed.
- **Access Token**: Defines the security context (SID, groups, and privileges). This is where we detect privilege escalation.

<br />

---

## 2. Virtual Memory & Address Spaces

Memory forensics is essentially the study of the mapping between virtual and physical addresses.

### Virtual vs. Physical
Each process operates in its own **Virtual Address Space**. The CPU and the OS use page tables (PML4 -> PDPT -> PD -> PTE on x64) to translate these virtual addresses into actual physical locations in the RAM dump.

### Memory Protection & Types
The VAD tree tracks the protection flags for every page:
- **PAGE_READONLY**: Standard for constant data.
- **PAGE_EXECUTE_READ**: Standard for code sections.
- **PAGE_EXECUTE_READWRITE (RWX)**: A massive red flag. Legitimate code is rarely writable and executable simultaneously; this is the primary indicator for injected shellcode or hollowing.

<br />

---

## 3. The PE (Portable Executable) Standard

Because a memory dump is just a stream of bytes, you must know the structure of a Windows executable to make sense of it.

### The Header Hierarchy
`DOS Header` -> `NT Headers` -> `Optional Header` -> `Section Table`

### Critical Analysis Points
- **The IAT (Import Address Table)**: On disk, the IAT contains names of functions. In memory, these are resolved to absolute addresses. If an IAT entry points to an anonymous memory region instead of a known DLL, the function has been hooked.
- **Section Mapping**: The `.text` section contains the code, while `.data` and `.rsrc` contain configuration and resources. Malware often hides its config blobs in the `.rsrc` section.

<br />

---

## 4. Hiding Techniques & Detection Theory

Modern malware avoids the "loud" methods of the past. An analyst must know the a-priori hiding techniques to choose the right detection tool.

| Evasion Technique | Mechanism | Forensic Detection |
|---|---|---|
| **DKOM** | Unlinks `_EPROCESS` from `ActiveProcessLinks` | `pslist` (linked) vs `psscan` (pool scan) |
| **Ldr Unlinking** | Removes DLL from PEB module list | `dlllist` (PEB) vs `ldrmodules` (VAD) |
| **Process Hollowing** | Replaces legitimate image with malicious code | `malfind` (RWX + MZ) or `hollowprocesses` |
| **API Hooking** | Redirects function calls to malicious code | `apihooks` or manual IAT pointer audit |

<br />

---

## 🏁 The Analyst's Learning Path

To master memory forensics, study these topics in the following order:

1. **PE Format & x86/x64 Basics** -> Understand how binaries are structured.
2. **Process Internals** -> Master the `_EPROCESS` and `PEB` relationship.
3. **Virtual Memory** -> Understand page tables and the VAD tree.
4. **Volatility Plugins** -> Start with `pslist` -> `malfind` -> `netscan` -> `vadinfo`.
5. **Evasion Techniques** -> Study DKOM, Hollowing, and Reflective Loading.

**Recommended Resource:** The "Windows Process Internals" series by Kirtar Oza for deep-dives into kernel offsets and WinDbg examples.
