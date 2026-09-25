---
title: "Anatomy of a Stack Frame"
date: 2026-09-19
category: "x86-64"
tags: ["memory", "stack", "functions"]
description: "Understanding how functions manage their local state on the stack."
---
# Stack Frames

When a function is called, a **Stack Frame** is created to store local variables and return information.

## The RBP and RSP Relationship
- **RSP (Stack Pointer):** Points to the current top of the stack.
- **RBP (Base Pointer):** Fixed reference for the current frame.

## Buffer Overflows
The overflow path:
Input Overflow ->#45;->gt; Overwrite Local Vars ->#45;->gt; Overwrite Saved RBP ->#45;->gt; Overwrite Return Address.

**Result:** Controlled Return Address ->#45;->gt; Hijacked RIP ->#45;->gt; Control of Execution.
