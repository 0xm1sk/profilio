---
title: "Understanding RIP"
date: 2026-09-19
category: "x86-64"
tags: ["cpu", "registers", "execution"]
description: "A deep dive into the Instruction Pointer register."
---
# The RIP Register

The **RIP (Instruction Pointer)** is the most critical register for controlling program flow. It holds the memory address of the next instruction to be executed.

## The Execution Cycle
The CPU operates in a continuous loop known as the **Instruction Cycle**:

**Fetch <code>-></code>#45;<code>-></code>gt; Decode <code>-></code>#45;<code>-></code>gt; Execute**

1. **Fetch**: CPU reads the instruction at the address in RIP.
2. **Decode**: Control unit interprets the instruction.
3. **Execute**: CPU performs the operation <code>-></code>#45;<code>-></code>gt; RIP is updated to the next instruction.

## Control Flow Alteration
Normal execution is linear, but certain instructions change RIP:
- **Jumps (JMP, JZ, JNE):** Forcibly set RIP <code>-></code>#45;<code>-></code>gt; New Address.
- **Calls (CALL):** Current RIP <code>-></code>#45;<code>-></code>gt; Stack <code>-></code>#45;<code>-></code>gt; RIP set to Function Address.
- **Returns (RET):** Stack <code>-></code>#45;<code>-></code>gt; RIP (Returns to caller).

## Exploitation: The "Holy Grail"
In binary exploitation, the goal is to **control RIP**. 
Buffer Overflow <code>-></code>#45;<code>-></code>gt; Overwrite Return Address <code>-></code>#45;<code>-></code>gt; Redirect RIP <code>-></code>#45;<code>-></code>gt; Execute Shellcode.
