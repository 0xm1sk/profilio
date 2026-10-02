---
title: "Networking & Cisco Packet Tracer"
date: 2026-10-01
tags: ["networking", "cisco", "packet-tracer", "ieee"]
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

---

## IEEE 802 Standards & Ethernet

### IEEE 802 Family
The IEEE 802 standards define the Physical (PHY) and Data Link (MAC) layers of the OSI model.
- **802.1:** Higher Layer LAN/MAN (Bridging, Management).
- **802.3:** Ethernet (Wired LAN).
- **802.11:** Wireless LAN (Wi-Fi).
- **802.15:** Wireless PAN (Bluetooth, Zigbee).
- **802.22:** Wireless Regional Area Networks (WRAN).

### Medium Access Control (MAC)
- **Token-Based Systems:** (e.g., Token Ring) Devices must hold a "token" to transmit. This prevents collisions but creates high latency in large networks because devices must wait their turn.
- **Modern Ethernet:** Uses switching to create dedicated collision domains, removing the need for token-waiting.

### The Ethernet Frame
A standard Ethernet frame must adhere to specific size constraints to be valid.

- **Minimum Size:** 64 octets (bytes). Frames smaller than this are "Runts" and are usually discarded.
- **Maximum Size (MTU):** 1500 octets. Data larger than this must be fragmented.
- **Frame Structure:**
  - **Destination MAC:** Where the frame is going.
  - **Source MAC:** Where the frame came from.
  - **Type/Length:** Defines the network layer protocol (e.g., IPv4).
  - **Payload:** The actual data being transported.
  - **FCS (Frame Check Sequence):** A checksum to ensure the data wasn't corrupted during transit.
