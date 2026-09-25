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
Old Systems: Binary Address <code>-></code>#45;<code>-></code>gt; Fixed Location <code>-></code>#45;<code>-></code>gt; Easy Exploitation.

## The Solution
Modern OS: Program Start <code>-></code>#45;<code>-></code>gt; Randomize Base Address <code>-></code>#45;<code>-></code>gt; Unpredictable Memory Layout.

## Bypassing ASLR
The common path to bypass ASLR:
Memory Leak <code>-></code>#45;<code>-></code>gt; Leak Pointer <code>-></code>#45;<code>-></code>gt; Calculate Base Address <code>-></code>#45;<code>-></code>gt; Target Function.
