---
title: "Container Orchestration & Kubernetes"
date: 2026-09-25
category: "Infrastructure"
tags: ["kubernetes", "k8s", "orchestration", "cloud"]
description: "How Kubernetes maintains a cluster's desired state across many hosts."
---
# Container Orchestration & Kubernetes

Docker manages containers on a single host. **Kubernetes (K8s)** manages containers across a cluster of machines, automating deployment, scaling, and failure recovery.

<br />

---

## Why orchestration exists

Running ten containers by hand is manageable. Running a few hundred across a dozen hosts is not. Kubernetes automates:

- **Scheduling** — deciding which node runs each workload
- **Scaling** — adding or removing replicas in response to load
- **Self-healing** — restarting or rescheduling containers that die
- **Load balancing** — spreading traffic across identical replicas
- **Rolling updates** — replacing versions without downtime
- **Service discovery** — stable names for ephemeral workloads

<br />

---

## The desired-state model

You do not tell Kubernetes *how* to deploy. You declare *what* you want:

> "Run three replicas of this nginx image, expose port 80."

Controllers continuously compare the observed state to the desired state and act to close the gap. If a node dies, the desired state still says three replicas, so the scheduler places a replacement elsewhere.

```
declare desired state -> observe actual state -> reconcile differences -> repeat
```

<br />

---

## Core objects

| Object | Purpose |
|---|---|
| Pod | Smallest unit — one or more tightly coupled containers |
| Deployment | Manages replicas and rolling updates of a Pod template |
| Service | Stable network endpoint for a set of Pods |
| ConfigMap / Secret | Externalized configuration and sensitive values |
| Namespace | Logical partition of cluster resources |
| Ingress | HTTP routing from outside the cluster |

Pods are **ephemeral**. Their IPs change, they are destroyed and recreated, and nothing durable should be stored inside them — persistent volumes exist for that reason.

<br />

---

## Architecture, briefly

- **Control plane:** API server, scheduler, controller manager, etcd (the cluster's state store)
- **Worker nodes:** kubelet (the node agent), kube-proxy (networking), and the container runtime

Everything goes through the API server. Authentication, authorization, and admission control happen there — which makes it the primary security boundary of the cluster.

<br />

---

## Security angles

- **RBAC misconfiguration** is the most common cluster compromise path — overly broad roles let a compromised service account read Secrets or create privileged Pods.
- **Secrets in etcd** are base64-encoded by default, not encrypted; encryption at rest must be enabled.
- **Privileged pods and host mounts** can escape to the node.
- **Network policies** default to allow-all; without them, any Pod can reach any other.

<div class="info-callout">
<strong>Infrastructure hierarchy:</strong> Physical hardware -> virtualization layer -> cluster orchestration -> containers -> applications. Each layer adds abstraction and a new trust boundary.
</div>
