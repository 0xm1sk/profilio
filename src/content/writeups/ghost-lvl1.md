---
title: "Ghost Track: First Contact"
date: 2026-09-19
category: "Linux Fundamentals"
tags: ["recon", "traversal", "shell"]
description: "Initial system orientation and basic directory traversal to uncover credentials."
tech_stack: ["Bash", "Linux"]
github: "https://github.com/0xm1sk/breachlab-docs"
target: "BreachLab Ghost Track"
difficulty: "Beginner"
---
# Ghost Track: First Contact

**Objective:** locate the credentials for the user `ghost1` on a fresh target box.

This is the first level of the Ghost Track, and the whole challenge is an exercise in orientation. There is no exploit here — just the discipline of looking carefully before reaching for a tool.

<br />

---

## 1. Orient first

The first command on any new box is the one people skip:

```bash
pwd
ls -la
```

`pwd` tells you where you are. `ls -la` shows everything in the directory, including dot-files, plus ownership and permission bits. Even at this level that output is information: a directory named `workspace`, a file you did not expect, a world-readable file owned by another user.

Only after that do you start moving:

```bash
ls -la workspace
ls -la workspace/archive
```

The credentials were in `workspace/archive/credentials`. A couple of `ls` calls and one `cat` later, the level was done.

```bash
cat workspace/archive/credentials
```

<br />

---

## 2. Why this matters

The "low-hanging fruit" principle is not a joke — misplaced credentials are one of the most common real findings. Before any scanner or exploit:

- list the home directory and common workspace folders
- check dot-files (`ls -la`, not just `ls`)
- read files that are world-readable but shouldn't be

<div class="info-callout">
<strong>Mental model:</strong> the shell is a file-system navigation language. Getting comfortable with <code>pwd</code>, <code>ls -la</code>, and relative paths is more useful than memorising tool flags.
</div>

<br />

---

## 3. The trap

The first instinct on a "find the credentials" task is to run a scanner or start guessing passwords. That stalls because it skips the actual question: *what is on this box?* A two-second `ls -la` answers it.

The other common mistake is using bare `ls` and concluding "there's nothing here" — bare `ls` hides dot-files by design.

<br />

---

## Command recap

```bash
pwd                          # where am I?
ls -la                       # what is here, including hidden files?
ls -la workspace/archive     # follow the obvious lead
cat workspace/archive/credentials
```

<br />

---

## Takeaway

**Competency: system recon.** The ability to orient rapidly on a fresh box — files, permissions, processes, network — is the base layer everything else is built on. Speed here comes from habit, not cleverness.
