---
title: "Virtualization & Hypervisors"
date: 2026-09-25
category: "Infrastructure"
tags: ["virtualization", "hypervisor", "vm", "hardware"]
description: "How a hypervisor turns one physical machine into several isolated guests."
---
# Virtualization & Hypervisors

Virtualization creates a software representation of a physical computer, allowing several isolated guest operating systems to run on one physical host. It is the foundation of modern server consolidation, cloud infrastructure, and safe malware-analysis labs.

<br />

---

## The hypervisor

The **hypervisor** (or Virtual Machine Monitor, VMM) is the layer that owns the physical resources and distributes them among virtual machines. It decides which guest runs, for how long, and what hardware each guest may see.

### Type 1 vs Type 2

| Type | Runs on | Examples | Trade-off |
|---|---|---|---|
| **Type 1 (bare metal)** | Directly on hardware | VMware ESXi, Microsoft Hyper-V, Xen | Higher performance and smaller attack surface |
| **Type 2 (hosted)** | As an application on a host OS | VirtualBox, VMware Workstation | Convenient for labs; extra host layer |

<br />

---

## How a VM actually works

Modern virtualization relies on CPU extensions — **Intel VT-x** and **AMD-V**. Without them, the hypervisor would have to emulate or trap every privileged instruction in software.

The CPU provides two modes:

- **Root mode:** the hypervisor runs here with full control.
- **Non-root mode:** guests run here; sensitive operations cause a **VM exit** back to the hypervisor.

```text
guest instruction -> normal execution
guest sensitive instruction -> VM exit -> hypervisor handles it -> VM entry -> guest resumes
```

This is why a guest can execute most instructions at native speed while the hypervisor retains control over physical resources.

<br />

---

## The stack

```
Physical Hardware
   -> Hypervisor (Type 1) or Host OS + Hypervisor (Type 2)
      -> Guest OS (its own kernel)
         -> Applications
```

Each guest has its own kernel, its own virtual devices, and its own address space. From the guest's point of view it is running on a complete, private machine.

<br />

---

## Security implications

**Isolation is the main benefit.** A compromise or crash inside one VM does not directly affect the host or other guests, because the guest kernel cannot reach host memory or devices without going through the hypervisor.

That also makes the hypervisor the **critical trust boundary**:

- A hypervisor escape is a high-severity class of vulnerability — guest code breaks out and executes in the host or another guest.
- Shared resources create side channels: timing, cache, and memory-deduplication behavior can leak information between guests.
- Snapshots are a double-edged sword: excellent for analysis and rollback, but a snapshot captured while malware is running preserves its state and keys.

<div class="info-callout">
<strong>Lab practice:</strong> use a Type 2 hypervisor with host-only or NAT networking for malware analysis. Disable shared folders and clipboard sharing, and snapshot the clean state before any detonation.
</div>

<br />

---

## VMs vs containers

A VM virtualizes **hardware**; a container virtualizes the **operating system**. VMs are heavier but isolate kernels; containers are lighter but share the host kernel. See the note on containerization for the comparison.
