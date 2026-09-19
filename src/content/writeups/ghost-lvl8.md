---
title: "Ghost Track: Lost in Translation"
date: 2026-09-19
category: "Linux Fundamentals"
tags: ["hex", "base64", "encoding"]
description: "Decoding multi-layer encoded data using hex-to-binary conversion."
tech_stack: ["xxd", "Base64"]
github: "https://github.com/0xm1sk/breachlab-docs"
target: "BreachLab Ghost Track"
difficulty: "Beginner"
---
# Ghost Track: Lost in Translation

This challenge involved "peeling the onion"—decoding a secret that was wrapped in multiple layers of encoding.

## The Implementation
The target file, `transmission.dat`, appeared as a hex dump. To retrieve the secret, I had to reverse the encoding layers in the correct order:

1. **Hex Reversal:** I used `xxd -r` to convert the hex representation back into binary data.
2. **Base64 Decoding:** The resulting binary was still Base64 encoded. I piped the output directly into `base64 -d` to reveal the final string.

The complete one-liner used: `cat transmission.dat | xxd -r | base64 -d`

## Technical Win
Multi-layer encoding is a common way to obfuscate data. The key is to recognize the format (Hex $\rightarrow$ Base64 $\rightarrow$ Text) and use a pipeline of tools to process the data linearly.

## Competency: Data Analysis
**Recognizing and peeling apart encoded data without relying on external tools.**
