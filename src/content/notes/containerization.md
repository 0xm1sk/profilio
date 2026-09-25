---
title: "Containerization & Docker"
date: 2026-09-25
category: "Infrastructure"
tags: ["docker", "containers", "linux", "namespaces"]
description: "Exploring the difference between VMs and containers via Linux kernel primitives."
---
# Containerization & Docker

Unlike virtualization, containerization does not emulate a full computer. Instead, it isolates processes running on the **same host kernel**.

## VM vs. Container
- **VMs:** Heavy. Each has its own kernel, BIOS, and virtual hardware. Slow boot times.
- **Containers:** Light. Share the host kernel. Fast boot times (milliseconds).

## The Linux Magic: Namespaces & cgroups
Containers are made possible by two core Linux kernel features:

1. **Namespaces:** Provide an isolated view of the system.
   - **PID Namespace:** Process IDs are isolated (Container A has its own PID 1).
   - **Net Namespace:** Isolated network interfaces and ports.
   - **Mnt Namespace:** Isolated filesystem mounts.
2. **cgroups (Control Groups):** Enforce resource limits (CPU, RAM, I/O) so one container cannot starve the rest of the system.

## Docker Images
A **Docker Image** is a read-only template (a snapshot of the filesystem). When you run an image, Docker creates a **Container**—a writable layer on top of that image.

**The Flow:**
Image $\rightarrow$ Container $\rightarrow$ Running Process.
