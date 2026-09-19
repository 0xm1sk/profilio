---
title: "RSP (Stack Pointer)"
date: 2026-09-15
category: "Registers"
tags: ["x86-64", "registers", "memory"]
---
The **RSP (Stack Pointer)** is a 64-bit register that points to the top of the current stack. 

In x86-64, the stack grows downwards (toward lower addresses). When data is pushed onto the stack, the RSP value decreases. When data is popped, it increases.
