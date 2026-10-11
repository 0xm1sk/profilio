---
<br />
title: "Networking & Cisco Packet Tracer"
<br />
date: 2026-10-01
<br />
tags: ["networking", "cisco", "packet-tracer", "ieee", "vlans"]
<br />
---

# Networking & Cisco Packet Tracer

## Switch Configuration

Basic device setup and security configurations using the Cisco CLI.

### General Configuration
<br />
- **Hostname:** Sets the identity of the device.
<br />
  ```bash
<br />
  hostname <name>
<br />
  ```
<br />
- **Password Setting:** Securing access to the privileged EXEC mode.
<br />
  ```bash
<br />
  enable password <password>
<br />
  # or
<br />
  enable secret <password>
<br />
  ```

### Port Security
<br />
Preventing unauthorized devices from connecting to the network by limiting the number of MAC addresses allowed on a port.

- **Maximum MACs:** Limit the number of devices allowed on a single port.
<br />
  ```bash
<br />
  switchport port-security maximum 2
<br />
  ```
<br />
- **Sticky MACs:** Automatically learn the MAC address of the connected device and save it to the running configuration.
<br />
  ```bash
<br />
  switchport port-security mac-address sticky
<br />
  ```

---

## IEEE 802 Standards & Ethernet

### IEEE 802 Family
<br />
The IEEE 802 standards define the Physical (PHY) and Data Link (MAC) layers of the OSI model.
<br />
- **802.1:** Higher Layer LAN/MAN (Bridging, Management).
<br />
- **802.3:** Ethernet (Wired LAN).
<br />
- **802.11:** Wireless LAN (Wi-Fi).
<br />
- **802.15:** Wireless PAN (Bluetooth, Zigbee).
<br />
- **802.22:** Wireless Regional Area Networks (WRAN).

### Medium Access Control (MAC)
<br />
- **Token-Based Systems:** (e.g., Token Ring) Devices must hold a "token" to transmit. This prevents collisions but creates high latency in large networks because devices must wait their turn.
<br />
- **Modern Ethernet:** Uses switching to create dedicated collision domains, removing the need for token-waiting.

### The Ethernet Frame
<br />
A standard Ethernet frame must adhere to specific size constraints to be valid.

- **Minimum Size:** 64 octets (bytes). Frames smaller than this are "Runts" and are usually discarded.
<br />
- **Maximum Size (MTU):** 1500 octets. Data larger than this must be fragmented.
<br />
- **Frame Structure:**
<br />
  - **Destination MAC:** Where the frame is going.
<br />
  - **Source MAC:** Where the frame came from.
<br />
  - **Type/Length:** Defines the network layer protocol (e.g., IPv4).
<br />
  - **Payload:** The actual data being transported.
<br />
  - **FCS (Frame Check Sequence):** A checksum to ensure the data wasn't corrupted during transit.

---

## Advanced Switching & VLANs

### Switching Modes & Performance
<br />
Switches are used for high-performance, secure, and scalable network connectivity.

- **Full Duplex:** Simultaneous send and receive, eliminating collisions.
<br />
- **Store-and-Forward:** The switch buffers the entire frame and checks the CRC for errors before forwarding. Higher reliability, higher latency.
<br />
- **Cut-Through:** The switch forwards the frame as soon as the destination MAC is read. Lower latency, but may forward corrupt frames.

### Virtual LANs (VLANs)
<br />
VLANs allow a single physical switch to be partitioned into multiple logical networks.

- **Purpose:** Isolation of traffic, reduction of broadcast domains, and increased security.
<br />
- **Lab Implementation:** Configured via Cisco Packet Tracer by assigning specific ports to a VLAN ID.
