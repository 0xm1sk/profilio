---
title: "Container Orchestration & Kubernetes"
date: 2026-09-25
category: "Infrastructure"
tags: ["kubernetes", "k8s", "orchestration", "cloud"]
description: "Managing large-scale container deployments across multiple servers."
---
# Container Orchestration & Kubernetes

While Docker manages individual containers, **Kubernetes (K8s)** manages clusters of containers across multiple physical or virtual servers.

## Why Orchestration?
Managing 100+ containers manually is impossible. Kubernetes automates:
- **Scaling:** Increasing/decreasing the number of container copies (replicas) based on load.
- **Self-Healing:** Automatically restarting containers that crash.
- **Load Balancing:** Distributing traffic evenly across identical containers.
- **Rolling Updates:** Updating the app version without downtime.

## The Architecture
Kubernetes uses a **Desired State** model. You tell K8s: *"I want 3 replicas of the Nginx API running."* K8s continuously monitors the cluster; if one node fails, it immediately schedules a new container on a healthy node to maintain that state.

## Summary: The Infrastructure Hierarchy
Physical Hardware -> VM -> Kubernetes -> Container -> Application.
