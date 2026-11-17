---
title: "Anatomy of a Stack Frame"
date: 2026-09-19
category: "x86-64"
tags: ["memory", "stack", "functions", "exploit-dev"]
description: "How functions build, use, and tear down their own region of the stack."
---
# Stack Frames

When a function is called it receives its own region of the stack: a **stack frame**. The frame holds local variables, saved registers, and the return address. Understanding its exact layout is the foundation of stack exploitation.

<br />

---

## Frame layout

A frame built with the classic prologue looks like this (growing upward toward higher addresses):

```
 higher addresses
 +----------------------+
 | caller's locals      |
 +----------------------+
 | return address       |  <- [rbp + 8]
 +----------------------+
 | saved RBP            |  <- [rbp]
 +----------------------+  <-- RBP
 | local variable A     |  <- [rbp - 8]
 | local variable B     |  <- [rbp - 16]
 | saved registers      |
 +----------------------+  <-- RSP (current top)
 lower addresses
```

<br />

---

## Prologue and epilogue

```asm
; prologue
push rbp          ; save caller's frame pointer
mov  rbp, rsp     ; establish new frame pointer
sub  rsp, 32      ; reserve 32 bytes for locals

; ... function body ...

; epilogue
mov  rsp, rbp     ; release locals
pop  rbp          ; restore caller's frame pointer
ret               ; pop return address into RIP
```

The `leave` instruction is shorthand for `mov rsp, rbp; pop rbp`, so many functions end with `leave; ret`.

<div class="info-callout">
<strong>RBP vs RSP:</strong> RSP moves as values are pushed and popped; RBP stays fixed for the lifetime of the frame. That stability is why locals are addressed as offsets from RBP (<code>[rbp-0x10]</code>) rather than from RSP.
</div>

<br />

---

## Frame-pointer omission

Modern compilers often use `-fomit-frame-pointer` (default at `-O2` on x86-64), freeing RBP as a general-purpose register. Locals are then addressed relative to RSP, and there is no saved RBP on the stack.

Practical consequences:

- The overflow path shortens — the return address sits directly after the locals.
- `leave; ret` pivots are less reliable, but `pop rsp` / `xchg rsp, reg` gadgets become more useful.
- Debugging is harder without a frame pointer, though DWARF unwind info compensates.

<br />

---

## The overflow path

Writing past the end of a local buffer walks upward through the frame:

```
input overflows buffer
  -> overwrite adjacent locals
  -> overwrite saved RBP
  -> overwrite return address
  -> ret loads attacker value into RIP
```

**Result:** a controlled return address gives control of execution — shellcode, a ROP chain, or a ret2libc call.

<br />

---

## What stands in the way

| Mitigation | What it blocks |
|---|---|
| Stack canary | Detects any overwrite that crosses into saved data before `ret` |
| NX / DEP | Prevents execution of shellcode placed in the stack |
| ASLR / PIE | Randomizes addresses so a fixed return target is unreliable |
| Shadow stack (CET) | Enforces a separate, protected copy of return addresses |

<div class="warning-callout">
<strong>Read the frame before writing the exploit.</strong> Use a debugger to find the exact offset from the start of the buffer to the saved return address — cyclic patterns (<code>msf-pattern_create</code>) turn the crash value into an exact byte count. Guessing wastes time.
</div>

<br />

---

## Inspecting frames in GDB

- `info frame` — frame base, saved RIP, and source location
- `bt` / `bt full` — backtrace with local variables
- `x/20gx $rbp-0x40` — dump the raw frame
- `frame N` — select a frame from the backtrace
