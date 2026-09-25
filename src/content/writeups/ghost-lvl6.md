---
title: "Ghost Track: The Listener"
date: 2026-09-19
category: "Linux Fundamentals"
tags: ["networking", "nmap", "netcat"]
description: "Identifying open services and communicating with raw TCP sockets."
tech_stack: ["Nmap", "Netcat"]
github: "https://github.com/0xm1sk/breachlab-docs"
target: "BreachLab Ghost Track"
difficulty: "Beginner"
---
# Ghost Track: The Listener

This challenge focused on service discovery and interacting with network sockets directly from the command line.

## The Implementation
When secrets are not stored on disk, they are often running as services in memory. I followed a two-step process to uncover the secret:

1. **Port Scanning:** I used `nmap -p- localhost` to scan all possible ports. This revealed a series of open ports in the 30000 range.
2. **Socket Communication:** Using `nc` (Netcat), I connected to the identified ports. By interacting with port 30100, I received an authentication token, which I then passed to port 30101 to retrieve the final secret.

## Technical Win
This exercise demonstrates the importance of the "Network Primitive" approach. By using Netcat, I was able to bypass the need for a specialized client and communicate directly with the service.

## Competency: Network Primitives
**Communicating with services over raw TCP and TLS directly from the command line.**
