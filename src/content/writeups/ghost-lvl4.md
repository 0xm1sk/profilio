---
title: "Ghost Track: Access Denied"
date: 2026-09-19
category: "Linux Fundamentals"
tags: ["permissions", "groups", "id"]
description: "Analyzing Linux group memberships to access restricted system files."
tech_stack: ["Bash", "Linux"]
github: "https://github.com/0xm1sk/breachlab-docs"
target: "BreachLab Ghost Track"
difficulty: "Beginner"
---
# Ghost Track: Access Denied

**Objective:** read `/var/intel/ops/access_codes.dat` despite a "Permission denied" error.

This level is a clean lesson in the Linux permission model: access is not only about the file's owner. Group membership is a parallel path to the same data.

<br />

---

## 1. The denial

```bash
cat /var/intel/ops/access_codes.dat
# cat: /var/intel/ops/access_codes.dat: Permission denied
```

The first instinct is to think "I need root." Often you don't — you need to find which identity already has access.

Start with the file and its parent directories:

```bash
ls -l /var/intel/ops/access_codes.dat
ls -ld /var/intel /var/intel/ops
namei -l /var/intel/ops/access_codes.dat
```

`namei -l` walks every path component and shows its owner and mode. It is the fastest way to spot *which* directory in the chain is blocking you — execute permission on every parent directory is required to reach a file.

<br />

---

## 2. Who am I, really?

```bash
id
```

This prints your UID, your primary GID, and **every supplementary group** you belong to. That last list is the important part. In this case the user `ghost3` was a member of the `analysts` group.

Now compare that to the file's mode:

```bash
ls -l /var/intel/ops/access_codes.dat
# -rw-r----- 1 root analysts ... access_codes.dat
```

Group `analysts` has read permission. Your shell already carries that group. No privilege escalation is needed — just:

```bash
cat /var/intel/ops/access_codes.dat
```

<br />

---

## 3. Why group membership is easy to miss

A new process inherits its groups from its parent. If your session was started before you were added to a group, `id` in that session will not show it:

```bash
newgrp analysts     # start a shell with that group as primary
id                  # verify
```

Conversely, a service account may have groups you would never guess from its username. When you find a permission wall, enumerate identity before assuming you need a password.

<br />

---

## 4. Reading the mode bits

```
-rw-r-----  1  root  analysts   access_codes.dat
 ^^^ ^^^ ^^^     ^     ^
 |   |   |       |     +-- group owner
 |   |   |       +-------- user owner
 |   |   +---------------- others: ---
 |   +-------------------- group: r--
 +------------------------ user: rw-
```

The owner `root` has `rw-`, the group `analysts` has `r--`, and everyone else has nothing. You are in `analysts`, so the middle triplet is the one that applies.

<div class="info-callout">
<strong>PrivEsc habit:</strong> on any box, run <code>id</code> early. Supplementary groups are a common route to files, devices (e.g. <code>disk</code>, <code>docker</code>), and commands that a username alone would not suggest.
</div>

<br />

---

## 5. The trap

The trap is reading "Permission denied" as "I need root" and jumping straight to privilege-escalation exploits. The cheaper question is: *which group owns this file, and am I in it?* Here the access was already granted — it just was not obvious from the username.

<br />

---

## Command recap

```bash
id                                             # what groups do I have?
ls -l /var/intel/ops/access_codes.dat          # which group owns the file?
namei -l /var/intel/ops/access_codes.dat       # is a parent dir the real blocker?
newgrp analysts                                # refresh group context if needed
cat /var/intel/ops/access_codes.dat
```

<br />

---

## Takeaway

**Competency: privilege-escalation identification.** Read the permission bits and group memberships before reaching for an exploit. The path to a file is often through a secondary group, not the owner account.
