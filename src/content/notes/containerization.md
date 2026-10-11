---
<br />
title: "Containerization & Docker"
<br />
date: 2026-09-25
<br />
category: "Infrastructure"
<br />
tags: ["docker", "containers", "linux", "namespaces"]
<br />
description: "Exploring the difference between VMs and containers via Linux kernel primitives."
<br />
---
<br />
# Containerization & Docker

Unlike virtualization, containerization does not emulate a full computer. Instead, it isolates processes running on the **same host kernel**.

## VM vs. Container
<br />
- **VMs:** Heavy. Each has its own kernel, BIOS, and virtual hardware. Slow boot times.
<br />
- **Containers:** Light. Share the host kernel. Fast boot times (milliseconds).

## The Linux Magic: Namespaces & cgroups
<br />
Containers are made possible by two core Linux kernel features:

1. **Namespaces:** Provide an isolated view of the system.
<br />
   - **PID Namespace:** Process IDs are isolated (Container A has its own PID 1).
<br />
   - **Net Namespace:** Isolated network interfaces and ports.
<br />
   - **Mnt Namespace:** Isolated filesystem mounts.
<br />
2. **cgroups (Control Groups):** Enforce resource limits (CPU, RAM, I/O) so one container cannot starve the rest of the system.

## Docker Images
<br />
A **Docker Image** is a read-only template (a snapshot of the filesystem). When you run an image, Docker creates a **Container**—a writable layer on top of that image.

**The Flow:**
<br />
Image -> Container -> Running Process.
