---
title: "Syscalls"
date: 2026-09-15
category: "Kernel"
tags: ["linux", "kernel", "syscalls"]
---
A **Syscall (System Call)** is the interface between a user-space application and the operating system kernel.

Since user-space programs are restricted from accessing hardware directly for security reasons, they must execute a syscall (e.g., `int 0x80` or the `syscall` instruction) to request the kernel to perform tasks like reading a file or printing to the console.
