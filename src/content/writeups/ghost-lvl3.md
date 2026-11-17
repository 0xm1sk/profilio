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

**Objective:** discover data stored in hidden dot-files that `ls` does not show by default.

"Hidden" on Linux is only a naming convention: a leading dot tells ordinary tools to skip the entry. It is not an access control. Anything you can read, you can read whether the name starts with a dot or not.

<br />

---

## 1. Reveal the hidden entries

```bash
ls -a          # show dot-files
ls -la         # show them with permissions, owner, size
```

`ls -a` includes `.` and `..`; `ls -A` excludes those two and is often tidier. In the home and investigation directories this exposed a `.memo` file and a `.leads` directory.

A useful habit is to sort by modification time — recently touched hidden files are usually the interesting ones:

```bash
ls -lat
```

<br />

---

## 2. Aggregate instead of opening one by one

Inside `.leads` there were many similarly named hidden files. Rather than `cat`-ing each one, a wildcard does the work:

```bash
cat .*
```

This matches every dot-file in the directory and concatenates them. When the files are small and you are looking for a single secret, that is exactly what you want.

For larger sets, add context about which file each line came from:

```bash
head -n 999 .*          # prints ==> filename <== headers
grep -H '' .*           # prefixes every line with its filename
```

<br />

---

## 3. The subtlety with `.*`

`.*` also matches `.` and `..` — the current and parent directory entries. `cat .` fails with "Is a directory," which produces noise but no harm. If you want only files:

```bash
find . -maxdepth 1 -type f -name '.*' -exec cat {} +
```

This is also the more robust pattern when filenames contain spaces or begin with a dash.

<br />

---

## 4. The trap

The obvious failure is running `ls`, seeing nothing, and concluding the directory is empty. The fix is a single flag: `-a`.

The second trap is treating dot-files as "secret" by nature. They are not — they are just skipped in casual listings. Anyone who thinks to add `-a` sees them.

<div class="info-callout">
<strong>Secret hunting checklist:</strong> hidden files (<code>ls -la</code>), environment variables (<code>env</code>), running processes (<code>/proc</code>), and config files are the four places secrets hide by convention rather than by protection.
</div>

<br />

---

## Command recap

```bash
ls -la                                   # reveal hidden entries
ls -lat                                  # sort by mtime
cat .*                                   # concatenate all hidden files
grep -H '' .*                            # same, with filenames
find . -maxdepth 1 -type f -name '.*' -exec cat {} +   # robust version
```

<br />

---

## Takeaway

**Competency: secret hunting.** Hidden files are a convention, not a security boundary. Combine `ls -la` with wildcards and `find` to extract data from obfuscated directory structures quickly.
