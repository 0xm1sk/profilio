---
title: "RIP (Instruction Pointer)"
date: 2026-09-15
category: "Registers"
tags: ["x86-64", "registers", "execution"]
---
The **RIP (Instruction Pointer)** holds the memory address of the next instruction the CPU is scheduled to execute.

Controlling the RIP is the primary goal of most binary exploitation attacks, as it allows the researcher to redirect the execution flow of a program to a specific location (e.g., a shellcode or a specific function).
