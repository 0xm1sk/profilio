---
title: "Rust Port Scanner"
date: 2026-06-13
category: "Networking"
tags: ["rust", "networking", "sockets"]
description: "A lightweight, concurrent port scanner exploring low-level network communication and socket programming."
tech_stack: ["Rust", "std::net"]
github: "https://github.com/0xm1sk/port_scanner"
---
# Project: Rust Port Scanner

A lightweight, concurrent port scanner developed in Rust to explore low-level network communication and socket programming.

## The Implementation
The tool utilizes `std::net::TcpStream` to attempt connections to a range of ports (1-10,000). To prevent the scanner from hanging on filtered ports, I implemented a strict `connect_timeout` of 150ms.

## Technical Details
- **Concurrency:** Explored the use of `ToSocketAddrs` for resolving hostnames to IP addresses.
- **Timeout Logic:** Balanced the scan speed against the probability of missing open ports by tuning the millisecond timeout.
- **Error Handling:** Used Rust's `Result` and `Option` types to gracefully handle failed connections without crashing the scan process.

## What I Learned
This project reinforced my understanding of the TCP three-way handshake and how timeout values directly impact the reliability of network reconnaissance tools.
