---
title: "The Anatomy of a Stack Overflow"
date: 2026-09-19
category: "Binary Exploitation"
tags: ["x86-64", "stack-overflow", "gdb", "memory-corruption"]
description: "An investigation into the mechanics of return address overwrites and execution flow redirection."
tech_stack: ["C", "GDB", "GCC"]
github: ""
status: "Completed"
---
# The Anatomy of a Stack Overflow

This research entry documents an investigation into how memory corruption allows a researcher to hijack the control flow of a program.

## Objective
**The Question:** What happens to the CPU's instruction pointer (RIP) when a buffer is overflowed, and how can we determine the exact distance required to achieve control?

**The Hypothesis:** 
Input Length > Buffer Size ->Overwrite Adjacent Memory ->Overwrite Saved RIP ->Redirect Execution.

## Methodology
To isolate the vulnerability, a controlled environment was established:

### 1. The Target
A simple C program featuring a fixed-size buffer and a vulnerable function call (e.g., `gets()`).

### 2. The Environment
Compiled with specific flags to disable modern security mitigations:
- `-fno-stack-protector`: Disables the stack canary.
- `-no-pie`: Disables Position Independent Executable (fixed binary address).

### 3. The Process
Execution within **GDB** using cyclic patterns to monitor the state of the stack and identify the crash point.

## Observation & Evidence
By monitoring the **RSP** (Stack Pointer) and **RIP** (Instruction Pointer), the following sequence was observed:

**Normal State** ->**Buffer Overflow** ->**Segmentation Fault**

**The Evidence:** 
Checking the registers in GDB revealed that RIP had been overwritten with `0x41414141` (the hex representation of 'AAAA'). This is the definitive proof that the input successfully reached and replaced the return address.

## Analysis
The distance between the start of the buffer and the return address is known as the **offset**. 

**The calculation:**
Buffer Size + Padding/Saved RBP = Offset to RIP

By calculating this offset, we can precisely place a target address (e.g., a `win()` function) exactly where the CPU expects the return address to be.

## Conclusion
The experiment confirms that without stack canaries and PIE, the return address is a vulnerable point of control. This provides the foundation for **Return-Oriented Programming (ROP)**, where multiple "gadgets" are chained to bypass non-executable memory (NX).

---
**Competency:** Binary Analysis
*Understanding the relationship between high-level code, assembly execution, and memory layout.*
