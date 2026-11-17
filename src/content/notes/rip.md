---
title: "Understanding RIP"
date: 2026-09-19
category: "x86-64"
tags: ["cpu", "registers", "execution"]
description: "A deep dive into the Instruction Pointer register and what it means to control it."
---
# The RIP Register

The **RIP (Instruction Pointer)** is the most critical register for controlling program flow. It holds the address of the next instruction the CPU will execute. In x86-64 it is 64 bits wide; in 32-bit code the equivalent is `EIP`.

You cannot write to RIP directly — there is no `mov rip, ...` instruction. Every change to it happens through control-flow instructions or as a side effect of execution.

<br />

---

## The Fetch–Decode–Execute cycle

The CPU runs a continuous loop:

1. **Fetch** — read the instruction at the address held in RIP.
2. **Decode** — the control unit interprets the opcode and operands.
3. **Execute** — perform the operation, then advance RIP to the next instruction.

For linear code, RIP advances by the length of the instruction just executed. **Control-flow instructions** are the exception: they assign a new value to RIP.

<br />

---

## Instructions that change RIP

| Instruction | Effect on RIP | Notes |
|---|---|---|
| `jmp`, `jz`, `jne`, ... | RIP = target | Unconditional or conditional branch |
| `call func` | push return address, then RIP = func | Return address is the instruction *after* the call |
| `ret` | RIP = pop from stack | Returns to the saved address |
| `syscall` / `sysenter` | RIP = kernel entry point | Mode switch; saved state restored on return |
| Interrupt / exception | RIP = handler vector | Hardware or software generated |

<div class="info-callout">
<strong>Key detail:</strong> the value pushed by <code>call</code> is the address of the next instruction, not the address of the call itself. Overwriting that saved value on the stack is what redirects execution on <code>ret</code>.
</div>

<br />

---

## RIP-relative addressing

x86-64 supports addressing relative to RIP, written as `[rip + offset]` or `label(%rip)`. The CPU computes the effective address as `RIP_after_instruction + offset`.

This is the default for most PC-relative data references in compiled code:

```asm
lea message(%rip), rdi   ; address of 'message' relative to RIP
call puts@plt
```

RIP-relative addressing is **position independent by design** — the displacement is constant no matter where the module is loaded. It matters for shellcode and ROP because gadgets frequently use it to reach data and the GOT/PLT.

<br />

---

## Exploitation: the "holy grail"

If an attacker can overwrite the saved return address on the stack, the next `ret` loads that value into RIP:

```
buffer overflow -> overwrite saved RIP -> redirect execution -> shellcode / ROP chain
```

What "control of RIP" means in practice depends on the mitigations in place:

- **No NX, no ASLR:** jump straight to injected shellcode on the stack.
- **NX enabled:** stack is not executable — use ROP and point RIP at existing executable gadgets.
- **ASLR + PIE enabled:** addresses are randomized — first obtain a memory leak to compute a usable base address.

<div class="warning-callout">
<strong>Mitigation chain:</strong> controlling RIP is only step one. NX forces ROP, ASLR forces an information leak, and stack canaries force a separate bypass before the return address can even be reached.
</div>

<br />

---

## Debugging RIP

In GDB, RIP is read with `info registers rip` or `p $rip`. Useful commands:

- `x/i $rip` — disassemble the instruction about to execute
- `si` / `ni` — step one instruction (into / over calls)
- `break *0x401000` — break at a raw address

When a crash reports a faulting address, comparing it to `RIP` confirms whether the CPU tried to execute attacker-controlled data (a non-executable page fault) or jumped to a bogus code address.
