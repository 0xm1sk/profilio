---
title: "Virtualization & Hypervisors"
date: 2026-09-25
category: "Infrastructure"
tags: ["virtualization", "hypervisor", "vm", "hardware"]
description: "Understanding the abstraction of physical hardware into virtual machines."
---
# Virtualization & Hypervisors

Virtualization is the process of creating a software-based (virtual) representation of a physical computer. It allows a single physical machine to host multiple isolated guest operating systems.

## The Hypervisor
The **Hypervisor** (or Virtual Machine Monitor - VMM) is the software layer that manages the hardware resources and distributes them among the virtual machines (VMs).

### Type 1 vs. Type 2 Hypervisors
- **Type 1 (Bare Metal):** Runs directly on the hardware (e.g., VMware ESXi, Microsoft Hyper-V). Higher performance and security.
- **Type 2 (Hosted):** Runs as an application on top of a host OS (e.g., VirtualBox, VMware Workstation). Easier to set up for labs and development.

## How VMs Work
Modern virtualization relies on hardware support (Intel VT-x or AMD-V). The hypervisor allows the guest OS to execute most instructions directly on the physical CPU, but intercepts "sensitive" operations to maintain isolation.

**The VM Stack:**
Physical Hardware -> Host OS -> Hypervisor -> Guest OS -> Applications.

## Security Implication: Isolation
VMs provide strong isolation because each has its own Kernel. A crash or compromise in one VM does not inherently affect the host or other VMs, making it the gold standard for malware analysis and segregated labs.
