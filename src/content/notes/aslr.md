---
<br />
title: "ASLR: Address Space Layout Randomization"
<br />
date: 2026-09-19
<br />
category: "OS Security"
<br />
tags: ["mitigation", "memory", "security"]
<br />
description: "Understanding the defense-in-depth mechanism that randomizes memory addresses."
<br />
---
<br />
# ASLR (Address Space Layout Randomization)

**ASLR** is a security technique used by operating systems to prevent exploitation of memory corruption vulnerabilities.

## The Problem
<br />
Old Systems: Binary Address -> Fixed Location -> Easy Exploitation.

## The Solution
<br />
Modern OS: Program Start -> Randomize Base Address -> Unpredictable Memory Layout.

## Bypassing ASLR
<br />
The common path to bypass ASLR:
<br />
Memory Leak -> Leak Pointer -> Calculate Base Address -> Target Function.
