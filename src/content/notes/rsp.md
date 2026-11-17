---
title: "Understanding RSP"
date: 2026-09-19
category: "x86-64"
tags: ["cpu", "registers", "stack"]
description: "A deep dive into the Stack Pointer register and the x86-64 stack discipline."
---
# The RSP Register

**RSP** is the 64-bit Stack Pointer. It holds the address of the current top of the stack. Together with RBP it defines the active stack frame, and it is the register that makes `call`/`ret` work at all.

<br />

---

## The stack grows downward

On x86-64 the stack grows toward **lower** addresses. Pushing data *decreases* RSP; popping *increases* it.

```asm
push rax      ; rsp = rsp - 8 ; [rsp] = rax
pop  rax      ; rax = [rsp] ; rsp = rsp + 8
```

This is why a buffer overflow writes *upward* into saved frame data: a local buffer is at a lower address than the saved RBP and return address.

<div class="info-callout">
<strong>Mnemonic:</strong> "push subtracts, pop adds." Stack diagrams are usually drawn with high addresses at the top, so the stack appears to grow down the page.
</div>

<br />

---

## Core operations

| Instruction | RSP behavior |
|---|---|
| `push value` | `RSP -= 8`, then write value at `[RSP]` |
| `pop reg` | read `[RSP]` into reg, then `RSP += 8` |
| `call label` | push return address, then jump |
| `ret` | pop address into RIP |
| `sub rsp, N` | allocate N bytes of local space |
| `add rsp, N` | release that space |

`sub rsp, N` and `add rsp, N` are how compilers allocate and free stack space in one instruction rather than pushing individual variables.

<br />

---

## Stack alignment

The x86-64 System V ABI requires RSP to be **16-byte aligned** at the point of a `call`, so the callee enters with `RSP % 16 == 8`. Compilers insert padding or a dummy `push` to satisfy this.

Misalignment matters in practice: SSE instructions such as `movaps` operate on aligned 16-byte locations and will fault if the stack is misaligned. Shellcode and ROP chains that call library functions must respect the same rule or the call will crash inside `movaps`.

<br />

---

## The red zone

The 128 bytes below RSP are the **red zone**. Leaf functions (functions that make no calls) may use this area without adjusting RSP, because signal handlers and interrupts are required not to overwrite it.

```asm
mov QWORD PTR [rsp-8], 0    ; valid leaf-function scratch space
```

Code that calls other functions must not rely on the red zone — the callee is free to use the same region.

<br />

---

## Why RSP matters for exploitation

In a stack buffer overflow, data written past the buffer walks toward higher addresses and eventually reaches:

```
[ local buffer ] -> [ saved registers ] -> [ saved RBP ] -> [ return address ] -> caller's stack
```

The return address is what `ret` pops into RIP. An attacker who controls it controls execution.

- **Stack pivot:** if a write primitive targets RSP itself (`leave; ret`, `xchg rsp, rax`), the attacker can move the stack to a buffer they fully control.
- **ROP alignment:** each gadget typically ends in `ret`, which pops 8 bytes and advances RSP — so a ROP chain is laid out as a sequence of addresses at consecutive stack slots.
- **Canaries:** a stack canary sits between the buffer and the saved return address; overwriting the return address also overwrites the canary, which is detected before `ret`.

<div class="warning-callout">
<strong>Rule of thumb:</strong> wherever execution goes, RSP leads. Being able to overwrite memory is only half the battle — controlling where RSP points is what turns a write into a control-flow hijack.
</div>
