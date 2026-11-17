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

**Objective:** read a file whose name contains spaces (and deal with the other shell-parsing traps that come with unusual filenames).

This level is about the gap between what you *type* and what the program you call actually *receives*. The shell tokenises your input before `cat` ever sees it.

<br />

---

## 1. The problem

If a file is named `file name`, this fails:

```bash
cat file name
```

The shell splits on whitespace, so `cat` receives two arguments — `file` and `name` — and reports "No such file or directory" for both. The filename exists; the *argument* does not.

Note that `ls` will happily display the file as `file name`. That is the visual trap: the name looks like two words on screen, and you instinctively type it the way you saw it.

<br />

---

## 2. Two ways to fix it

### Quoting

Wrap the whole name in single quotes so the shell treats it as one token:

```bash
cat 'file name'
```

Single quotes suppress all interpretation. Double quotes would also work here, but single quotes are the safer default when the name contains `$`, backticks, or `!`.

### Escaping

Escape the space character with a backslash:

```bash
cat file\ name
```

The backslash tells the shell "take the next character literally." The result is the same: a single argument.

<br />

---

## 3. Filenames that start with a dash

A related trap: a file named `-secret` is interpreted by `cat` as an option. The fix is to terminate option parsing with `--`:

```bash
cat -- -secret
```

Or prefix the path so it no longer begins with a dash:

```bash
cat ./-secret
```

This pattern generalises — most GNU tools accept `--` for exactly this reason.

<br />

---

## 4. Safe listing with odd names

When you do not know what the names look like, `ls -lb` is your friend: `-b` prints non-printing characters and escapes them, so a filename with a space or newline becomes unambiguous.

```bash
ls -lb
# file\ name
```

<br />

---

## 5. The trap

The naive approach is to copy the filename from `ls` output verbatim. That fails for spaces, and fails worse for leading dashes or newlines. The habit to build is: *if the name looks odd, quote it or escape it by default.*

<div class="warning-callout">
<strong>Why this matters later:</strong> the same parser distinction underlies argument-injection bugs. If a program builds a command by concatenating unquoted user input, the shell may split it into extra arguments — with consequences far beyond a failed <code>cat</code>.
</div>

<br />

---

## Command recap

```bash
cat 'file name'     # quoting
cat file\ name      # escaping
cat -- -secret      # leading-dash filename
cat ./-secret       # same thing, different trick
ls -lb              # see the real bytes of a filename
```

<br />

---

## Takeaway

**Competency: shell mastery.** Understanding that the shell parses arguments before the kernel sees filenames is what separates comfortable command-line use from guessing. Quoting, escaping, pipes, and redirection are the grammar of that language.
