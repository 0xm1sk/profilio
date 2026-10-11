---
<br />
title: "Anatomy of a Stack Frame"
<br />
date: 2026-09-19
<br />
category: "x86-64"
<br />
tags: ["memory", "stack", "functions"]
<br />
description: "Understanding how functions manage their local state on the stack."
<br />
---
<br />
# Stack Frames

When a function is called, a **Stack Frame** is created to store local variables and return information.

## The RBP and RSP Relationship
<br />
- **RSP (Stack Pointer):** Points to the current top of the stack.
<br />
- **RBP (Base Pointer):** Fixed reference for the current frame.

## Buffer Overflows
<br />
The overflow path:
<br />
Input Overflow -> Overwrite Local Vars -> Overwrite Saved RBP -> Overwrite Return Address.

**Result:** Controlled Return Address -> Hijacked RIP -> Control of Execution.
