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

**Fetch -> Decode -> Execute**

1. **Fetch**: CPU reads the instruction at the address in RIP.
2. **Decode**: Control unit interprets the instruction.
3. **Execute**: CPU performs the operation -> RIP is updated to the next instruction.

## Control Flow Alteration
Normal execution is linear, but certain instructions change RIP:
- **Jumps (JMP, JZ, JNE):** Forcibly set RIP -> New Address.
- **Calls (CALL):** Current RIP -> Stack -> RIP set to Function Address.
- **Returns (RET):** Stack -> RIP (Returns to caller).

## Exploitation: The "Holy Grail"
In binary exploitation, the goal is to **control RIP**. 
Buffer Overflow -> Overwrite Return Address -> Redirect RIP -> Execute Shellcode.
