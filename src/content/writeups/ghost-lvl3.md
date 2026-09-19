---
title: "Ghost Track: In The Shadows"
date: 2026-09-19
category: "Linux Fundamentals"
tags: ["hidden-files", "recon", "wildcards"]
description: "Identifying and extracting secrets from hidden dot-files and directories."
tech_stack: ["Bash", "Linux"]
github: "https://github.com/0xm1sk/breachlab-docs"
target: "BreachLab Ghost Track"
difficulty: "Beginner"
---
# Ghost Track: In The Shadows

The goal of this level was to discover hidden data stored in "dot-files", which are ignored by default by the standard ls command.

## The Implementation

I employed the -a (all) flag with the ls command to reveal hidden entries in the home and investigation directories.

Discovery: 
Ran ls -a to find the .memo file and the .leads directory.

Aggregation: 
Once inside the .leads directory, I noticed multiple similar hidden files. Instead of reading them individually, I used a wildcard to cat all hidden files simultaneously: 
"cat .*"

## Technical Win

This exercise highlights that "hidden" in Linux is merely a naming convention, not a security feature. Combining ls -la with wildcards allows for rapid data extraction from obfuscated directory structures.

## Competency: Secret Hunting

Extracting data from environment variables, hidden files, and running processes.
