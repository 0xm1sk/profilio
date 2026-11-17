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

**Objective:** retrieve a secret that is not stored on disk but served by a process in memory.

When a file search comes up empty, the next question is: *is something listening?* This level is about finding that service and speaking to it directly.

<br />

---

## 1. Find the listening ports

```bash
ss -lntp
# or
nmap -p- localhost
```

`ss -lntp` lists listening TCP sockets with the owning process. `nmap -p- localhost` scans all 65535 ports and confirmed a series of open ports in the 30000 range.

A full TCP scan of localhost is fast, so there is little reason to guess common ports. `-p-` means "all ports" — a useful default when the service is non-standard.

<br />

---

## 2. Talk to the socket with Netcat

The service on port 30100 handed back an authentication token when connected to. The service on 30101 accepted that token and returned the secret.

```bash
nc localhost 30100
# ... token printed ...

nc localhost 30101
# paste token, receive secret
```

No custom client, no protocol library — just a raw TCP connection. Netcat reads from stdin and writes the server's response to stdout, which is exactly what a line-oriented service expects.

For a scripted version, pipe input in:

```bash
printf 'TOKEN\n' | nc -q 1 localhost 30101
```

`-q 1` tells Netcat to quit one second after EOF on stdin, so it does not hang waiting for more input.

<br />

---

## 3. Inspect the protocol first

Before sending a guess, see what the service says:

```bash
nc localhost 30100
```

Many simple services print a banner or prompt that tells you the expected input format. Reading that banner is faster than guessing.

If the exchange needs to be captured for analysis:

```bash
nc localhost 30100 | tee session.txt
```

<br />

---

## 4. Why the "network primitive" approach works

Specialised clients hide the protocol. Netcat exposes it. For an unknown service, raw sockets let you:

- see the exact banner and prompt
- send precisely formatted input
- observe how the server responds to malformed input

That is the same reasoning behind using `curl -v` against an unknown HTTP endpoint — start at the protocol layer, not the application layer.

<div class="info-callout">
<strong>TLS note:</strong> a socket speaking TLS cannot be read with plain <code>nc</code>. Use <code>openssl s_client -connect host:port</code> (or <code>ncat --ssl</code>) when the service expects encryption.
</div>

<br />

---

## 5. The trap

The obvious failure is continuing to search the filesystem after the first `find`/`grep` returns nothing. Secrets held only in process memory leave no file. The moment disk turns up empty, check what is listening.

<br />

---

## Command recap

```bash
ss -lntp                        # what is listening, and who owns it?
nmap -p- localhost              # full TCP port scan
nc localhost 30100              # talk to the service directly
printf 'TOKEN\n' | nc -q 1 localhost 30101
openssl s_client -connect host:port   # when TLS is involved
```

<br />

---

## Takeaway

**Competency: network primitives.** Communicating with services over raw TCP (and TLS) from the command line. This is the foundation for everything from banner-grabbing to manual protocol exploitation.
