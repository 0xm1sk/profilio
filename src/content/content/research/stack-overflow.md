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

## The Question
What happens to the CPU's instruction pointer (RIP) when a buffer is overflowed, and how can we determine the exact distance required to achieve control?

## The Hypothesis
By providing an input larger than the allocated buffer size, we can overwrite adjacent memory on the stack. Specifically, if we overwrite the stored return address, the CPU will attempt to jump to that address upon function return, allowing us to redirect execution.

## The Experiment
To isolate the vulnerability, I created a controlled environment:

1.  **The Target:** A simple C program with a fixed-size buffer and a vulnerable `gets()` or `strcpy()` call.
2.  **The Environment:** I compiled the program with specific flags to disable modern security mitigations:
    - `-fno-stack-protector`: To disable the stack canary.
    - `-no-pie`: To disable Position Independent Executable (PIE), ensuring the binary is loaded at a fixed address.
3.  **The Process:** I ran the program inside **GDB** and provided increasingly larger strings of characters (e.g., a sequence of 'A's) to monitor the state of the stack.

## Observation
Using GDB, I monitored the **RSP (Stack Pointer)** and **RIP (Instruction Pointer)**. 

- **Initial State:** The program functioned normally with short inputs.
- **The Crash:** After providing a specific number of bytes, the program crashed with a `Segmentation Fault`.
- **The Evidence:** Checking the registers revealed that the RIP had been overwritten with `0x41414141` (the hex representation of 'AAAA'). This proved that the input had successfully reached and overwritten the return address on the stack.

## Analysis
The distance between the start of the buffer and the return address is the "offset." By calculating this offset, we can precisely place a memory address of our choosing (such as the address of a `win()` function or a shellcode payload) exactly where the CPU expects the return address to be.

## Conclusion
The experiment confirms that without stack canaries and PIE, the return address is a vulnerable point of control. This investigation provides the foundation for more advanced techniques such as **Return-Oriented Programming (ROP)**, where multiple "gadgets" are chained together to bypass non-executable memory (NX).

## Competency: Binary Analysis
**Understanding the relationship between high-level code, assembly execution, and memory layout.**
