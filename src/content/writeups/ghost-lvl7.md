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

**Objective:** find and decode a secret stored in an environment variable.

Configuration and API keys are routinely passed to processes through the environment. That makes `env` one of the highest-value reconnaissance commands on any box you land on.

<br />

---

## 1. Enumerate the environment

```bash
env
# or
printenv
```

This prints every environment variable in the current shell. The output is usually noisy — `PATH`, `HOME`, terminal settings — so the useful move is to scan for names that suggest secrets: `API_DIGEST`, `TOKEN`, `KEY`, `SECRET`, `PASS`.

A more systematic pass:

```bash
env | grep -iE 'key|token|secret|pass|digest|api'
```

Here, `API_DIGEST` contained a string ending in `=` — the classic padding signature of Base64.

<br />

---

## 2. Decode it

```bash
echo "$API_DIGEST" | base64 -d
```

Important detail: use `echo` with quotes, or `printf '%s'`, so the shell does not mangle the value. An unquoted variable containing spaces or special characters will be word-split before it reaches `base64`.

```bash
printf '%s' "$API_DIGEST" | base64 -d
```

The trailing `=` padding on Base64 is a strong hint, but absence of padding does not rule it out — Base64 can be unpadded. Recognise the alphabet (A–Z, a–z, 0–9, `+`, `/`) rather than relying only on `=`.

<br />

---

## 3. Base64 is not encryption

This is the core lesson. Base64 is an *encoding*: a reversible representation of bytes using 64 printable characters. It exists so binary data can survive text-only channels. It provides no confidentiality whatsoever.

<div class="info-callout">
<strong>Detection angle:</strong> because Base64 is so common, defenders cannot treat its presence as malicious on its own. What matters is context — a credential named <code>API_DIGEST</code> in a shell environment is suspicious; a Base64 data URL in a web app is routine.
</div>

<br />

---

## 4. Variants worth knowing

```bash
echo "$VALUE" | base64 -d           # standard
echo "$VALUE" | tr '_-' '/+' | base64 -d   # URL-safe alphabet
echo "$VALUE" | xxd -r -p            # if it is hex, not base64
```

Misidentifying the encoding is a common stall: a hex string and a Base64 string can look similar at a glance. Check the character set first.

<br />

---

## 5. The trap

The trap is treating the Base64 string as a hash or encrypted blob and trying to crack it. It is neither — one command reverses it. The other trap is dumping `env` into a terminal screenshot or log without realising it may contain live credentials.

<br />

---

## Command recap

```bash
env                                       # enumerate
env | grep -iE 'key|token|secret|pass'    # narrow down
printf '%s' "$API_DIGEST" | base64 -d     # decode safely
printf '%s' "$VALUE" | tr '_-' '/+' | base64 -d  # URL-safe variant
```

<br />

---

## Takeaway

**Competency: secret hunting.** Extracting data from environment variables, hidden files, and running processes. `env` takes seconds and frequently pays off — make it a reflex on any new box.
