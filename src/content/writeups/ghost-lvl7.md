---
title: "Ghost Track: Ghost in the Machine"
date: 2026-09-19
category: "Linux Fundamentals"
tags: ["env-vars", "base64", "recon"]
description: "Extracting and decoding secrets stored in shell environment variables."
tech_stack: ["Bash", "Base64"]
github: "https://github.com/0xm1sk/breachlab-docs"
target: "BreachLab Ghost Track"
difficulty: "Beginner"
---
# Ghost Track: Ghost in the Machine

The goal of this level was to identify and decode a secret stored within the shell's environment variables.

## The Implementation
Environment variables are often used for configuration and API keys, making them a prime target for reconnaissance.

1. **Enumeration:** I used the `env` command to list all active environment variables in the current session.
2. **Pattern Recognition:** I spotted a variable named `API_DIGEST` containing a string that ended in `=`, a hallmark of Base64 encoding.
3. **Decoding:** I piped the string into the `base64 -d` command to retrieve the plaintext secret.

## Technical Win
This reinforces the fact that Base64 is an encoding, not encryption. Any "secret" stored in Base64 is essentially plaintext to anyone with the knowledge to decode it.

## Competency: Secret Hunting
**Extracting data from environment variables, hidden files, and running processes.**
