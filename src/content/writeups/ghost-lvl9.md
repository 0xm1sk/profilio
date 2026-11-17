---
title: "Ghost Track: Something's Running"
date: 2026-09-19
category: "Linux Fundamentals"
tags: ["procfs", "pid", "memory"]
description: "Extracting process-specific environment variables from the Linux /proc filesystem."
tech_stack: ["Bash", "Linux Kernel"]
github: "https://github.com/0xm1sk/breachlab-docs"
target: "BreachLab Ghost Track"
difficulty: "Beginner"
---
# Ghost Track: Something's Running

**Objective:** recover a secret that exists only in the environment of a running process.

Level 7 covered `env` for your own shell. This level asks a sharper question: what if the secret was passed to a *different* process at startup? The answer lives in `/proc`.

<br />

---

## 1. Find the process

```bash
ps aux | grep ghost8
```

`ps aux` lists every process with its owner, PID, and command line. Filtering for `ghost8` identified the target PID.

A cleaner alternative that avoids matching the `grep` process itself:

```bash
pgrep -a ghost8
```

<br />

---

## 2. Read the process environment

Every process has a directory at `/proc/<PID>/`. Inside it, `environ` contains the environment that process was started with:

```bash
tr '\0' '\n' < /proc/<PID>/environ
```

The file is NUL-separated, not newline-separated, so `tr '\0' '\n'` makes it readable. Reading it directly prints one giant line that is hard to parse.

From here, the same secret-hunting reflex applies:

```bash
tr '\0' '\n' < /proc/<PID>/environ | grep -iE 'key|token|secret|pass'
```

That exposed the value we needed.

<br />

---

## 3. What `/proc` gives you

`/proc` is a virtual filesystem backed by the kernel. It is not real files on disk — it is a live view of process state. Useful entries include:

| Path | Contents |
|---|---|
| `/proc/<PID>/environ` | Initial environment variables |
| `/proc/<PID>/cmdline` | The command line the process was started with |
| `/proc/<PID>/cwd` | Symlink to its working directory |
| `/proc/<PID>/exe` | Symlink to the executable |
| `/proc/<PID>/maps` | Memory mappings |
| `/proc/<PID>/fd/` | Open file descriptors |

Together these let you reconstruct what a process is doing without attaching a debugger.

<br />

---

## 4. Permissions matter

`/proc/<PID>/environ` is readable by the process owner and by root. If the target runs as another user, you may get "Permission denied" — that is where this technique stops and a privilege-escalation step would begin.

Also note that `environ` reflects the environment **at startup**. If the process changes its own environment later, that change is not visible here.

<div class="info-callout">
<strong>Blue-team angle:</strong> because <code>/proc/&lt;PID&gt;/environ</code> leaks secrets to anyone who can read it, production systems should avoid passing credentials through environment variables where possible, or restrict process visibility with namespaces / hidepid.
</div>

<br />

---

## 5. The trap

The trap is running `env` in your own shell and concluding "the secret isn't here." Your environment and the target process's environment are different worlds. Once the data is not in your own session, move to `ps` and `/proc`.

<br />

---

## Command recap

```bash
ps aux | grep ghost8                                   # find the PID
pgrep -a ghost8                                        # cleaner alternative
tr '\0' '\n' < /proc/<PID>/environ                     # readable environment
tr '\0' '\n' < /proc/<PID>/environ | grep -i secret    # hunt for the value
ls -l /proc/<PID>/fd                                   # other process state
```

<br />

---

## Takeaway

**Competency: secret hunting.** Extracting data from environment variables, hidden files, and running processes. `/proc` is the kernel's window into process state — often the only place a runtime secret exists.
