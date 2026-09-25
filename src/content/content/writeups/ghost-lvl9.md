---
title: "Ghost Track: Something's Running"
date: 2026-09-19
category: "Linux Fundamentals"
tags: ["procfs", "pid", "memory"]
description: "Extracting process-specific environment variables from the Linux /proc filesystem."
tech_stack: ["Bash", "Linux Kernal"]
github: "https://github.com/0xm1sk/breachlab-docs"
target: "BreachLab Ghost Track"
difficulty: "Beginner"
---
# Ghost Track: Something's Running

This challenge focused on utilizing the `/proc` virtual filesystem to inspect the memory of a running process.

## The Implementation
When a secret is passed to a process at runtime, it may not be available in the current shell's environment, but it remains accessible via the kernel's process interface.

1. **Process Identification:** I used `ps aux | grep ghost8` to find the Process ID (PID) of the target application.
2. **Kernel Inspection:** I navigated to the `/proc/[PID]/` directory, which provides a real-time view of the process state.
3. **Extraction:** I read the `environ` file within that directory, which contains all environment variables associated with that specific process.

## Technical Win
This demonstrates a powerful reconnaissance technique: using the `/proc` filesystem to leak secrets from running processes without needing to attach a debugger.

## Competency: Secret Hunting
**Extracting data from environment variables, hidden files, and running processes.**
