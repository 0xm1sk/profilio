---
title: "The Stack"
date: 2026-09-15
category: "Memory"
tags: ["memory", "x86-64", "functions"]
---
The **Stack** is a LIFO (Last-In, First-Out) region of memory used for storing local variables, function arguments, and return addresses.

Every time a function is called, a new "stack frame" is created, which contains all the necessary data for that specific function call. When the function returns, the frame is discarded.
