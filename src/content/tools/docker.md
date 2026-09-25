---
title: "Docker"
date: 2026-09-25
category: "Containerization"
language: "Go"
version: "Latest"
github: "https://github.com/moby/moby"
description: "Platform for developing, shipping, and running applications in isolated containers sharing the host kernel."
---
# Docker

Docker leverages Linux kernel primitives to provide lightweight isolation. Unlike VMs, it focuses on the application environment rather than the entire operating system.

## Core Technical Pillars

### 1. Linux Namespaces
Namespaces are the primary mechanism for isolation. They ensure a container has its own:
- **PID Namespace:** Process isolation (the container has its own PID 1).
- **NET Namespace:** Isolated network stack (own IP and ports).
- **MNT Namespace:** Isolated filesystem view.

### 2. Control Groups (cgroups)
cgroups prevent "noisy neighbors" by enforcing strict resource limits.
- **Resource Capping:** Limiting a container to specific CPU % or RAM (e.g., 512MB) to prevent a single process from crashing the entire host.

## Security Application: Vulnerable Services
For security researchers, Docker is the fastest way to deploy "vulnerable-by-design" services.
- **Rapid Deployment:** Spinning up a vulnerable version of an API or Database in milliseconds using a pre-built image.
- **Reproducibility:** Ensuring that the environment is identical for every test run, eliminating "works on my machine" issues.

## The Security Boundary
It is important to remember that containers share the **Host Kernel**. This means a kernel-level vulnerability (Privilege Escalation) can potentially allow an attacker to "break out" of the container and gain control of the host system.
