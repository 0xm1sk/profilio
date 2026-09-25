---
title: "Ghost Track: Name Game"
date: 2026-09-19
category: "Linux Fundamentals"
tags: ["shell", "quoting", "escaping"]
description: "Handling non-standard filenames and shell parsing obstacles."
tech_stack: ["Bash", "Linux"]
github: "https://github.com/0xm1sk/breachlab-docs"
target: "BreachLab Ghost Track"
difficulty: "Beginner"
---
# Ghost Track: Name Game

This challenge focused on shell parsing and how the Linux command line handles filenames containing spaces or special characters (like leading dashes).

## The Implementation
When a filename contains a space (e.g., "file name"), the shell interprets the space as a delimiter between two separate arguments. To override this behavior, I utilized two primary methods of shell escaping:

1. Quoting: Using double quotes to encapsulate the filename: "cat 'file name'"
2. Escaping: Using the backslash to escape the space character: "cat file\ name"

## Technical Win
Understanding the difference between how the shell parses arguments and how the kernel views filenames is critical. This prevents "argument injection" confusion when dealing with maliciously named files.

## Competency: Shell Mastery
Handling shell weirdness - filenames with spaces, quoting, pipes, and redirection - without hesitation.
