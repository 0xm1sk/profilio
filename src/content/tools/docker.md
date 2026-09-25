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

Docker utilizes Linux kernel primitives (Namespaces and cgroups) to create lightweight, isolated environments.

## Key Concepts
- **Images:** Read-only blueprints for containers.
- **Containers:** Runnable instances of an image.
- **Docker Hub:** A registry for sharing and pulling pre-configured images.

## Security Use Case
**Infrastructure as Code (IaC).** By defining the environment in a `Dockerfile`, security audits can be performed on the image before it ever reaches production.
