---
title: "Containerization & Docker"
date: 2026-09-25
category: "Infrastructure"
tags: ["docker", "containers", "linux", "namespaces"]
description: "How namespaces and cgroups isolate processes without a separate kernel."
---
# Containerization & Docker

Containerization does not emulate a computer. It isolates a group of processes running on the **same host kernel** and makes them believe they have a private system.

<br />

---

## VM vs container

| Property | VM | Container |
|---|---|---|
| Kernel | One per guest | Shared with host |
| Boot time | Seconds to minutes | Milliseconds |
| Size | GBs | MBs |
| Isolation boundary | Hardware / hypervisor | Kernel primitives |
| Compromise impact | Guest only | Potentially the host kernel |

Containers are fast and dense precisely because there is no second kernel to boot.

<br />

---

## The Linux primitives

Containers are built from two kernel features plus a filesystem concept.

### 1. Namespaces — isolation of view

| Namespace | What it isolates |
|---|---|
| PID | Process IDs; a container has its own PID 1 |
| NET | Network interfaces, routes, ports |
| MNT | Filesystem mount points |
| IPC | SysV IPC and message queues |
| UTS | Hostname and domain name |
| USER | User and group ID mappings |

A process inside a PID namespace sees only processes in its own namespace, so it cannot even name a host process to signal it.

### 2. cgroups — limits on resources

Control Groups cap what a container may consume: CPU shares, memory, block I/O, and network. Without cgroups, one container could starve every other workload on the host.

### 3. Layered filesystems

An image is a set of read-only layers. Starting a container adds a thin writable layer on top. Changes stay in that layer and disappear when the container is removed, which is why containers are disposable.

<br />

---

## Docker images

```text
Dockerfile -> build -> image (read-only layers) -> run -> container (writable layer) -> process
```

An image is a template; a container is a running instance of that template. This separation is what makes deployments reproducible: the same image ID produces the same filesystem everywhere.

<br />

---

## Security considerations

Containers are **not** virtual machines. Every container shares the host kernel, so a kernel exploit can cross the boundary.

- **Privileged containers** disabled in production — they grant near-host capabilities.
- **Root in a container** maps to root on the host unless user namespaces remap it.
- **Mounting the Docker socket** (`/var/run/docker.sock`) is effectively host root access.
- **Seccomp, AppArmor/SELinux, and capability dropping** reduce the kernel surface available to a container.

<div class="warning-callout">
<strong>Mental model:</strong> a container is a dressed-up process, not a small VM. Isolate it accordingly, and never treat root inside a container as a security boundary by itself.
</div>

<br />

---

## Where orchestration fits

Docker manages containers on one host. When those containers must run across many hosts with scaling, healing, and service discovery, an orchestrator such as Kubernetes takes over — see the orchestration note.
