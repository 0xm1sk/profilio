---
title: "DEP and NX: Memory Execution Prevention"
date: 2026-09-21
category: "OS Security"
tags: ["memory", "mitigation", "security", "exploit-dev"]
description: "An overview of Data Execution Prevention and the No-Execute bit."
---
# DEP and NX

**DEP (Data Execution Prevention)** and **NX (No-Execute)** are security features implemented at the hardware and OS level to prevent the execution of code from data-only memory regions.

## The Core Concept
In early system architectures, memory was generally readable, writable, and executable. This allowed an attacker to:
1. Inject shellcode into a buffer (e.g., on the stack).
2. Overwrite the RIP to point back to that buffer.
3. Execute the shellcode directly from the stack.

**DEP/NX changes this.** It marks specific regions of memory—specifically the **Stack** and the **Heap**—as non-executable. If the CPU attempts to execute an instruction in a region marked as NX, the processor triggers a memory access violation and the program crashes (Segmentation Fault).

## Implementation
- **Hardware Level:** The CPU uses the **NX bit** (AMD) or **XD bit** (Intel) in the page table entry to signal that the page is not executable.
- **OS Level:** The operating system manages these page table entries to ensure that writable regions are not executable (**W^X**: Write XOR Execute).

## The Bypass: Return-Oriented Programming (ROP)
Since we can no longer execute our own injected code, we must use code that is already present in the binary or its loaded libraries (like `libc`).

The launderer's approach:
**Find "Gadgets"** $\rightarrow$ **Chain Gadgets via Stack** $\rightarrow$ **Execute Existing Logic**.

A **Gadget** is a small snippet of existing executable code ending in a `ret` instruction. By chaining these together, we can perform complex operations (like calling `system("/bin/sh")`) without ever needing to execute a single byte of our own injected shellcode.

---
**Competency:** Mitigation Analysis
*Understanding how the transition from simple shellcode to ROP was forced by the introduction of NX/DEP.*
