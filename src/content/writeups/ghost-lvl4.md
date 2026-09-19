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

This level focused on the Linux permission model, specifically how group-level access can grant permissions that the primary user account does not possess.

## The Implementation
I encountered a restricted directory at /var/intel/ops/ containing access_codes.dat. A standard access attempt resulted in a "Permission Denied" error.

1. Identity Analysis: I ran the "id" command to inspect my current user's group memberships.
2. Permission Mapping: I discovered my user ("ghost3") belonged to the "analysts" group.
3. Verification: I verified that the target file had read permissions for the "analysts" group, allowing me to successfully execute "cat /var/intel/ops/access_codes.dat".

## Technical Win
This reinforces the importance of checking group IDs (GID) during privilege escalation. Often, the path to a file is not through the owner, but through a secondary group membership.

## Competency: PrivEsc Identification
Reading Linux permissions, including SUID, and recognizing binaries that serve as privilege escalation opportunities.
