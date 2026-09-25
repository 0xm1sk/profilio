---
title: "ASLR: Address Space Layout Randomization"
date: 2026-09-19
category: "OS Security"
tags: ["mitigation", "memory", "security"]
description: "Understanding the defense-in-depth mechanism that randomizes memory addresses."
---
# ASLR (Address Space Layout Randomization)

**ASLR** is a security technique used by operating systems to prevent exploitation of memory corruption vulnerabilities.

## The Problem
Old Systems: Binary Address ->#45;->gt; Fixed Location ->#45;->gt; Easy Exploitation.

## The Solution
Modern OS: Program Start ->#45;->gt; Randomize Base Address ->#45;->gt; Unpredictable Memory Layout.

## Bypassing ASLR
The common path to bypass ASLR:
Memory Leak ->#45;->gt; Leak Pointer ->#45;->gt; Calculate Base Address ->#45;->gt; Target Function.
