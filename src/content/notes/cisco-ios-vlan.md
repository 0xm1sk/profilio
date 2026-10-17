---
title: "Cisco IOS: Switch Configuration & VLAN Management"
date: 2026-10-17
tags: ["networking", "cisco", "ios", "vlan", "switching"]
---

# Cisco IOS: Switch Configuration & VLAN Management

Cisco IOS (Internetwork Operating System) utilizes a hierarchical command structure. Mastering the transition between these modes is fundamental to switch administration.

<br />

## 1. IOS Command Hierarchy

The switch operates in several distinct modes, each with its own set of available commands.

| Prompt | Mode | Purpose |
|---|---|---|
| `Switch>` | **User EXEC** | Basic monitoring and limited status checks. |
| `Switch#` | **Privileged EXEC** | Detailed verification, administration, and saving configs. |
| `Switch(config)#` | **Global Configuration** | Modifying settings that affect the entire switch. |
| `Switch(config-if)#` | **Interface Configuration** | Configuring a specific physical port or SVI. |
| `Switch(config-line)#` | **Line Configuration** | Configuring console or VTY (remote) access. |

**Navigation Flow:**
`User EXEC` -> `enable` -> `Privileged EXEC` -> `configure terminal` -> `Global Config` -> `interface <id>` -> `Interface Config`.

<br />

---

## 2. Base Hardening & Identity

Before deploying a switch, it must be secured to prevent unauthorized access and ensure clear identification.

### Identity & Global Settings
- **Hostname:** `hostname S1` (Identifies the switch in logs and prompts).
- **DNS Suppression:** `no ip domain-lookup` (Prevents the switch from hanging when a mistyped command is interpreted as a DNS query).
- **MOTD Banner:** `banner motd #Authorized users only#` (Displays legal warnings at login).

### Access Control
- **Privileged Mode:** `enable secret class` (Protects the transition to Privileged EXEC).
- **Console Access:**
  ```bash
  line console 0
  password cisco
  login
  exit
  ```
- **Remote Access (VTY):**
  ```bash
  line vty 0 4
  password cisco
  login
  transport input telnet
  exit
  ```
- **Password Obfuscation:** `service password-encryption` (Encrypts plain-text passwords in the configuration file).

<br />

---

## 3. Port Security (The Edge Defense)

Port security restricts input to an interface by limiting the MAC addresses allowed to send traffic.

<div class="info-callout">
<strong>Sticky MACs:</strong> The `switchport port-security mac-address sticky` command allows the switch to dynamically learn a MAC address and automatically add it to the running configuration, ensuring the device remains authorized after a reboot.
</div>

**Configuration Workflow:**
```bash
interface fastEthernet 0/1
 switchport mode access
 switchport port-security
 switchport port-security maximum 2
 switchport port-security mac-address sticky
 switchport port-security violation protect
 no shutdown
```
**Violation Modes:**
- **Protect:** Drops unauthorized traffic without notifying the admin or shutting the port.
- **Restrict:** Drops traffic and logs the violation.
- **Shutdown:** Immediately disables the port (err-disable state).

<br />

---

## 4. VLANs & Logical Segmentation

Virtual Local Area Networks (VLANs) allow a physical switch to be partitioned into multiple logical broadcast domains.

### VLAN Creation & Assignment
1. **Define the VLAN:**
   `vlan 10` -> `name Enseignant`
2. **Assign an Access Port:**
   `interface fastEthernet 0/3` -> `switchport mode access` -> `switchport access vlan 10`

### SVIs (Switched Virtual Interfaces)
An SVI is a logical interface that represents a VLAN. It is primarily used for switch management (SSH/Telnet).
```bash
interface vlan 99
 ip address 192.168.20.1 255.255.255.0
 no shutdown
```

### Trunking (802.1Q)
Trunks allow a single physical link to carry traffic for multiple VLANs between switches.
```bash
interface fastEthernet 0/8
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30,99
```

<br />

---

## 5. VTP (VLAN Trunking Protocol)

VTP synchronizes VLAN databases across switches in the same domain, reducing manual configuration overhead.

| Mode | Role | Behavior |
|---|---|---|
| **Server** | Administrator | Can create/modify/delete VLANs; propagates changes to clients. |
| **Client** | Receiver | Receives VLAN updates; cannot modify the VLAN database. |
| **Transparent** | Independent | Forwards VTP updates but maintains its own local VLAN database. |

**Basic Setup:**
`vtp domain <name>` -> `vtp mode <server/client>` -> `vtp password <pass>`

<br />

---

## 📊 Operator's Verification Cheat Sheet

| Command | Verification Goal |
|---|---|
| `show running-config` | Current active configuration in RAM. |
| `show startup-config` | Configuration saved to NVRAM. |
| `show vlan brief` | Port-to-VLAN assignments and VLAN status. |
| `show interfaces trunk` | Trunking status and allowed VLAN list. |
| `show ip interface brief` | IP addresses and operational state of SVIs. |
| `show port-security` | Global port security status. |
| `show vtp status` | VTP domain, mode, and revision number. |
| `copy running-config startup-config` | Saves the active configuration to persist after reboot. |
