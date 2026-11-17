---
title: "DEP and NX: Memory Execution Prevention"
date: 2026-09-21
category: "OS Security"
tags: ["memory", "mitigation", "security", "exploit-dev"]
description: "How the NX bit ends shellcode-on-stack exploitation and forces code-reuse attacks."
---
# DEP and NX

**DEP (Data Execution Prevention)** and **NX (No-Execute)** are hardware- and OS-level features that prevent code from running in memory regions intended for data — primarily the stack and the heap.

<br />

---

## The core concept

Early architectures treated most memory as readable, writable, and executable. That allowed the classic stack overflow exploit:

1. Inject shellcode into a buffer on the stack.
2. Overwrite the return address to point at that buffer.
3. Execute the shellcode when `ret` fires.

NX breaks step 3. Writable regions are marked non-executable; the CPU refuses to fetch instructions from them and raises a fault (a segmentation violation on Linux, an access violation on Windows).

<br />

---

## Implementation

| Layer | Mechanism |
|---|---|
| Hardware | NX bit (AMD) / XD bit (Intel) in the page-table entry |
| OS | Marks stack and heap pages non-executable; enforces **W^X** |
| Compiler | Marks sections with explicit execute permission (`.text` executable, `.data`/`.bss` not) |

**W^X (Write XOR Execute)** is the governing policy: a page should be writable *or* executable, never both. JIT compilers temporarily relax this by flipping permissions, which is why they are a common target for exploitation.

```bash
# inspect page permissions in Linux
cat /proc/self/maps
# 7f... rw-p   -> writable, not executable
# 55... r-xp   -> executable, not writable
```

<br />

---

## The bypass: Return-Oriented Programming

With NX, injected bytes cannot execute — but the binary and its libraries still contain plenty of executable code. ROP reuses that code.

A **gadget** is a short instruction sequence ending in `ret`. Chaining gadgets gives arbitrary computation:

```
find gadgets -> chain addresses on the stack -> ret walks the chain -> existing logic executes
```

A classic ret2libc chain calls `system("/bin/sh")` without a single injected instruction:

```
[ system() address ][ fake return address ][ pointer to "/bin/sh" ]
```

Useful primitives when building chains:

- `pop rdi; ret` — load the first argument (System V calling convention)
- `ret` — alignment gadget for 16-byte stack alignment
- `leave; ret` — stack pivot

Tools like `ROPgadget` and `pwntools` enumerate gadgets and locate offsets in a leaked libc.

<br />

---

## NX vs ASLR

These mitigations attack different parts of the exploit:

- **NX** removes the ability to execute your own bytes, forcing code reuse.
- **ASLR** removes knowledge of where reusable code lives, forcing an information leak.

Together they turn a simple shellcode jump into a multi-stage exploit: leak a libc address, compute its base, build a ROP chain, and satisfy alignment.

<div class="info-callout">
<strong>Competency:</strong> mitigation analysis. Understanding how the transition from shellcode to ROP was forced by NX/DEP — and how ASLR then forced the leak — is the core of modern binary exploitation reasoning.
</div>

<br />

---

## Further hardening

- **CET / Shadow Stack:** keeps a protected second copy of return addresses, so a tampered stack return is detected.
- **Control-Flow Integrity (CFI):** restricts indirect branches to valid targets, limiting gadget chaining.
- **RELRO / Full RELRO:** makes the GOT read-only, blocking GOT-overwrite techniques that bypass both NX and ASLR.
