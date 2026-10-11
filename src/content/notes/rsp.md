---
<br />
title: "Understanding RSP"
<br />
date: 2026-09-19
<br />
category: "x86-64"
<br />
tags: ["cpu", "registers", "stack"]
<br />
description: "A deep dive into the Stack Pointer register."
<br />
---
<br />
# The RSP Register

The **RSP (Stack Pointer)** is a 64-bit register that points to the current top of the stack in x86-64 architecture.

## Core Concept
<br />
The stack grows **downwards** in memory. This means as you push data onto the stack, the value in RSP decreases.

## Key Operations
<br />
- **PUSH:** Decrements RSP and writes the value to the memory location.
<br />
- **POP:** Reads the value from the current RSP and then increments RSP.
<br />
- **CALL:** Pushes the return address (RIP) onto the stack and jumps to the function.
<br />
- **RET:** Pops the return address from the stack back into RIP to return to the caller.

## Why it Matters for Exploitation
<br />
In a buffer overflow, if you can overwrite the data on the stack and control the value that eventually gets popped into RIP, you can redirect program execution to your own shellcode or a ROP chain.
