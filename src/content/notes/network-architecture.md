---
title: "Network Architecture & Topologies"
date: 2026-09-24
category: "Networking"
tags: ["infrastructure", "lan", "wan", "topology"]
description: "Network scale, hierarchical design, and why topology dictates the attack surface."
---
# Network Architecture & Topologies

Networking is the systemic arrangement of nodes that enables data exchange. The scale and structure of a network determine where bottlenecks form — and where an attacker can move most freely.

<br />

---

## Network scale

| Type | Scope | Notes |
|---|---|---|
| **PAN** | Around one person | Bluetooth, USB tethering |
| **LAN** | Home, office, lab | High throughput, limited users, strong internal controls |
| **MAN** | City or campus | Interconnects several LANs |
| **WAN** | Global | The Internet, leased lines, satellite |

The boundary between LAN and WAN is where most perimeter controls live: firewalls, NAT, and VPN concentrators.

<br />

---

## Topologies

A topology describes how nodes are interconnected.

- **Bus / Ring** — legacy; a single failure or collision domain affects everyone.
- **Star** — every node connects to a central switch. Simple, but the switch is a single point of failure.
- **Mesh** — every node connects to several others. Resilient but expensive and complex.
- **Hierarchical (Tree)** — the enterprise standard.

### Hierarchical design

The Cisco three-layer model organizes the network into:

```
Core        -> fast backbone, high-speed forwarding between sites
Distribution -> routing, policy, ACLs, VLAN summarization
Access      -> end devices, port security, VLAN assignment
```

Segmentation at the distribution layer limits broadcast domains and gives a natural place to enforce policy between departments.

<div class="info-callout">
<strong>Security value:</strong> a flat network lets an attacker reach every host after one foothold. A hierarchical design with VLANs and ACLs turns lateral movement into a series of controlled crossings — each one a potential detection point.
</div>

<br />

---

## Addressing and segmentation

- **Subnets** split a network into broadcast domains; routers or Layer 3 switches connect them.
- **VLANs** segment at Layer 2, so hosts on the same physical switch can be logically separated.
- **DMZ** isolates internet-facing services from the internal network.
- **NAT** hides internal addressing but is not a security control on its own.

<br />

---

## Design and validation

Before deployment, designs are modeled in tools such as **Cisco Packet Tracer** or GNS3. This lets you verify:

- routing convergence and failover behavior
- ACL and firewall rule effects
- VLAN tagging and trunk configuration
- bandwidth and bottleneck behavior under load

Testing a topology in simulation is far cheaper than discovering a routing loop in production.

<br />

---

## Attack-surface view

When mapping a network as an attacker or defender, follow the paths:

```
external perimeter -> DMZ -> distribution layer -> internal VLANs -> critical assets
```

Each hop is a place where trust changes and where controls — and detections — should exist. The hierarchical model is useful precisely because it makes those trust boundaries explicit.
