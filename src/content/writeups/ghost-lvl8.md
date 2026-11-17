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

**Objective:** decode a secret wrapped in more than one layer of encoding.

The file `transmission.dat` looked like a hex dump. Reversing one layer revealed another. This level is about recognising formats and building a pipeline that peels them in the right order.

<br />

---

## 1. Identify the outer layer

```bash
cat transmission.dat
```

A stream of hex characters — 0–9 and a–f, often in pairs — is the giveaway. Hex is literally a textual representation of bytes, two characters per byte.

To reverse it:

```bash
cat transmission.dat | xxd -r
```

`xxd -r` converts hex text back into raw binary. At this point the output looked like Base64 rather than readable text, so a second decode was needed:

```bash
cat transmission.dat | xxd -r | base64 -d
```

That one-liner was the whole solution.

<br />

---

## 2. Why the order matters

Encoding layers are nested: the outer layer describes the bytes of the inner layer. You must remove them from outside in. Decoding Base64 first would fail because the hex text is not a valid Base64 string.

A reliable workflow is to decode one layer, then **inspect the result** before choosing the next tool:

```bash
cat transmission.dat | xxd -r | file -
```

`file -` reads from stdin and tells you what the data now looks like. Repeat until the output is plain text. This avoids guessing the whole chain up front.

<br />

---

## 3. Useful variants

```bash
xxd -r -p file.hex              # ignore whitespace and offsets
xxd -g 1 file.bin               # view bytes with spacing
base64 -d <<< "$VALUE"          # here-string
```

`xxd -r` can be picky about whitespace and line offsets in a dump. If the file is a raw hex string with no offsets, `-p` (plain) is the forgiving option:

```bash
tr -d ' \n' < transmission.dat | xxd -r -p | base64 -d
```

<br />

---

## 4. Recognising the layers

| Format | Character set | Typical tell |
|---|---|---|
| Hex | `0-9a-fA-F` | pairs of characters, often fixed width |
| Base64 | `A-Za-z0-9+/=` | padded with `=`, no spaces |
| URL-safe Base64 | `A-Za-z0-9-_` | `-` and `_` instead of `+` and `/` |
| Plain text | readable ASCII | — |

<div class="info-callout">
<strong>The general skill:</strong> multi-layer encoding is obfuscation, not encryption. Once you can name each layer by its character set, the solution is a pipeline of standard tools.
</div>

<br />

---

## 5. The trap

The trap is trying to decode everything as Base64 because it is the most familiar format. Hex and Base64 look similar in a terminal. Check the alphabet first — it costs a second and saves ten minutes of confused one-liners.

<br />

---

## Command recap

```bash
cat transmission.dat                             # identify the outer layer
cat transmission.dat | xxd -r                    # hex -> bytes
cat transmission.dat | xxd -r | file -           # inspect the next layer
cat transmission.dat | xxd -r | base64 -d        # full chain
tr -d ' \n' < transmission.dat | xxd -r -p | base64 -d   # forgiving variant
```

<br />

---

## Takeaway

**Competency: data analysis.** Recognising and peeling apart encoded data without relying on external tools. Identify the format, reverse one layer, inspect, repeat.
