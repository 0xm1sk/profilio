---
title: "Networking & Cisco Packet Tracer"
date: 2026-10-01
tags: ["networking", "cisco", "packet-tracer"]
---

# Networking & Cisco Packet Tracer

## Switch Configuration

Basic device setup and security configurations using the Cisco CLI.

### General Configuration
- **Hostname:** Sets the identity of the device.
  ```bash
  hostname <name>
  ```
- **Password Setting:** Securing access to the privileged EXEC mode.
  ```bash
  enable password <password>
  # or
  enable secret <password>
  ```

### Port Security
Preventing unauthorized devices from connecting to the network by limiting the number of MAC addresses allowed on a port.

- **Maximum MACs:** Limit the number of devices allowed on a single port.
  ```bash
  switchport port-security maximum 2
  ```
- **Sticky MACs:** Automatically learn the MAC address of the connected device and save it to the running configuration.
  ```bash
  switchport port-security mac-address sticky
  ```
