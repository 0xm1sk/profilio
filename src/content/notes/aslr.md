---
title: "ASLR: Address Space Layout Randomization"
date: 2026-09-19
category: "OS Security"
tags: ["mitigation", "memory", "security", "exploit-dev"]
description: "How address randomization works, what it covers, and how it is defeated."
---
# ASLR (Address Space Layout Randomization)

**ASLR** randomizes the locations of key regions in a process's address space. Its purpose is to make exploitation unreliable: even if a bug gives an attacker a write, they cannot know which address to write to.

<br />

---

## The problem it solves

Without ASLR, every process has a predictable layout:

```
fixed binary base -> fixed libc base -> fixed stack -> fixed heap -> easy exploitation
```

An exploit can hardcode the address of `system()`, a gadget, or a shellcode buffer, and it will work on every run of every instance.

<br />

---

## The solution

At load time the OS randomizes the base addresses of:

| Region | Typical control |
|---|---|
| Stack | Random offset to initial stack pointer |
| Heap | Random brk/mmap base |
| Libraries (libc, etc.) | Random load base per process |
| Executable (with PIE) | Random image base |

The randomization is per-process, so two runs of the same binary place the same function at different addresses.

<div class="info-callout">
<strong>ASLR vs PIE:</strong> ASLR is the OS policy of randomizing mappings. PIE (Position-Independent Executable) is a property of the binary that makes it <em>capable</em> of being loaded anywhere. A non-PIE main executable stays at its fixed base even with ASLR enabled — only the libraries and stack move.
</div>

<br />

---

## Entropy and brute force

Randomization is only as strong as its entropy. On 32-bit systems the usable entropy is small enough that repeated attempts can guess a base address. On 64-bit systems the space is large enough that brute force is usually impractical — but other constraints reduce it:

- ASLR is often disabled or weakened in local lab VMs and containers.
- Forking children may share a base address with the parent.
- Some application-specific mappings are not randomized.

Check the current setting on Linux with:

```bash
cat /proc/sys/kernel/randomize_va_space   # 0 = off, 1 = conservative, 2 = full
```

<br />

---

## Bypassing ASLR

The standard path is to turn randomization from a blocker into a known quantity:

```
memory disclosure -> leak a pointer -> compute base address -> target function
```

1. **Leak a pointer.** A format string bug, an out-of-bounds read, or a dangling pointer printed to the user reveals a live address.
2. **Compute the base.** Subtract the known offset of the leaked symbol from its static offset in the binary or libc: `base = leaked_addr - symbol_offset`.
3. **Derive targets.** Add offsets from the base to reach `system`, `/bin/sh`, or gadgets.
4. **Fire the exploit** in the same process, because a new process gets a new base.

Other routes:

- **Partial overwrite:** overwrite only the low bytes of a saved return address. The randomized high bytes stay intact, and a small, targeted change redirects execution within the same module.
- **ret2plt / ret2csu:** call functions through the PLT at the binary's own (often fixed) base rather than through randomized libc.
- **Heap spray / NOP sled:** historically used to compensate for uncertain addresses; largely obsolete on 64-bit with full ASLR.

<br />

---

## Relationship to the other mitigations

| Mitigation | Blocks | Forces |
|---|---|---|
| NX / DEP | Executing injected code | ROP / code reuse |
| ASLR | Knowing where code lives | Information leak |
| Stack canary | Reaching the return address | Canary leak or separate overwrite |
| CET shadow stack | Tampering with returns | Alternative control-flow primitives |

<div class="warning-callout">
<strong>Defense in depth:</strong> no single mitigation is sufficient. ASLR without NX still allows a direct jump to shellcode once an address is leaked; NX without ASLR allows a fixed ROP chain. The strength is in the combination.
</div>
