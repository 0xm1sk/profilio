---
title: "Linux Privilege Escalation Patterns"
date: 2026-10-16
tags: ["linux", "privesc", "security", "operator-theory"]
---

# Linux Privilege Escalation Patterns

Privilege escalation is rarely about a single "magic" exploit; it is the process of identifying a gap between how a system is intended to be used and how it is actually configured. Most escalations follow a few recurring patterns of misconfiguration.

<br />

## The Operator's First-Look Checklist

Before diving into specific exploits, a systematic enumeration of the environment is mandatory.

- [ ] **Identity & Permissions:** `id`, `sudo -l`, `env`
- [ ] **Environment History:** `~/.bash_history`, `~/.ash_history`, `/etc/environment`
- [ ] **Binary Surface:** SUID/SGID bits, Capabilities (`getcap -r /`)
- [ ] **Persistence/Automation:** Cron jobs, systemd timers, writable scripts in `PATH`
- [ ] **Service Access:** Docker socket, listening ports, writable `/dev` entries

<br />

---

## 1. Binary-Based Escalation

### SUID/SGID & The GTFOBins Pattern
<div class="info-callout">
<strong>Concept:</strong> A Setuid (SUID) bit allows a user to execute a binary with the permissions of the file owner (often root). If that binary has a "feature" to read files, write files, or execute shell commands, it becomes a primitive for escalation.
</div>

**Common Failures:**
- Binaries that accept a file path as an argument for reading (e.g., a backup utility).
- Binaries that allow shell escapes or system calls (e.g., `vim`, `find`, `less`).

<div class="warning-callout">
<strong>Pitfall:</strong> Don't guess. Always check **GTFOBins** to see if a specific binary version has a known escape vector.
</div>

<br />

### Linux Capabilities
<div class="info-callout">
<strong>Concept:</strong> Capabilities break the "all-or-nothing" root privilege into smaller, granular pieces. For example, `cap_setuid` allows a process to change its UID without being full root.
</div>

**Exploit Shape:**
A binary with `cap_setuid=ep` can call `setuid(0)` internally. If an attacker can control the execution flow of such a binary, they can elevate themselves to root.

<br />

---

## 2. Identity & Policy Abuse

### Sudo Misconfigurations
<div class="info-callout">
<strong>Concept:</strong> `sudo -l` reveals what commands a user can run as root. If a user is granted `NOPASSWD` access to an interpreter or editor, they can often spawn a root shell.
</div>

**High-Value Targets:**
- **Interpreters:** `gawk`, `python`, `perl`, `ruby` $->$ use `system()` or `os.system()`.
- **Editors:** `vim`, `nano` $->$ execute shell commands from within the editor.

<br />

### Sudoedit Argument Injection
<div class="info-callout">
<strong>Concept:</strong> `sudoedit` is intended to let users edit specific files. However, if the `EDITOR` environment variable is not sanitized, an attacker can inject arguments to the editor to open and modify *any* file on the system (e.g., `/etc/shadow`).
</div>

<div class="warning-callout">
<strong>Note:</strong> This is often a "stealthier" path than a direct sudo shell, as it focuses on modifying system state rather than spawning a process.
</div>

<br />

---

## 3. System & Environment Hijacking

### PATH Hijacking
<div class="info-callout">
<strong>Concept:</strong> When a script or binary calls another program without using an absolute path (e.g., calling `run-maint` instead of `/usr/bin/run-maint`), the system searches the directories listed in the `PATH` variable in order.
</div>

**The Attack Chain:**
1. Find a root-run script (e.g., via Cron) that uses relative paths.
2. Find a directory in that script's `PATH` that is writable by your current user.
3. Create a malicious binary with the *same name* as the target program in that writable directory.
4. Wait for the system to execute your binary instead of the real one.

<br />

### The Docker Socket "Root-Equivalent"
<div class="info-callout">
<strong>Concept:</strong> Membership in the `docker` group is effectively equivalent to root access. Because the Docker daemon runs as root, any user who can communicate with the socket can tell Docker to mount the host's root directory (`/`) into a container.
</div>

**Exploit Shape:**
`docker run -v /:/mnt/host -it alpine sh` $->$ The entire host filesystem is now accessible and writable at `/mnt/host`.

<br />

---

## Summary Table

| Vector | Primary Tool/Check | Core Failure |
|---|---|---|
| **SUID** | `find / -perm -4000` | Trusting a binary's input |
| **Capabilities** | `getcap -r /` | Granular privileges used for full root |
| **Sudo** | `sudo -l` | Over-privileged binary grants |
| **Sudoedit** | `env \| grep EDITOR` | Unsanitized environment variables |
| **PATH** | `crontab -l` / `ps` | Using relative paths in root scripts |
| **Docker** | `groups` / `ls -l /var/run/docker.sock` | Direct host mount via daemon |

