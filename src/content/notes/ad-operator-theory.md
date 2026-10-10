---
title: "AD Operator Theory & Methodology"
date: 2026-10-10
tags: ["ad", "methodology", "redteam", "identity"]
---

# AD Operator Theory & Methodology

## 1. The Operator Mindset
Success in Active Directory environments is not about memorizing commands, but about disciplined methodology.

### Core Habits
- **Enumerate Before Acting:** Map the domain fully. Most attack paths are visible in the data available to a plain user.
- **The Note-Taking Mandate:** Turn a pile of facts into a path. Document every host, account, group, and SPN.
- **Work the Graph:** AD is a web of relationships. Stop running tools at random; ask "Who can reach what from here?"
- **Assume Monitoring:** Prefer the "quiet" question. Minimal noise = maximum longevity.

### The Tool Map
| Goal | Primary Tools | Protocol / Mechanism |
| :--- | :--- | :--- |
| **Graph Domain** | BloodHound, SharpHound | LDAP $\rightarrow$ Graph Edges |
| **Query Directory** | PowerView, ldapsearch | LDAP |
| **Host/Service Discovery** | nmap, NetExec | Network, SMB, DNS |
| **Protocol Driving** | Impacket Suite | SMB, RPC, Kerberos |
| **Ticket/Hash Mgmt** | Rubeus, Hashcat | Kerberos $\rightarrow$ Offline Crack |
| **Spray/Roast** | Kerbrute, NetExec | Kerberos, LDAP |

---

## 2. Domain Trusts & Architecture

### What is a Trust?
A trust is a bridge that allows one domain/forest to accept authentication from another.

- **Direction:** 
  - **One-Way:** Domain B trusts A $\rightarrow$ A's users can access B.
  - **Two-Way:** Both directions allowed.
- **Transitivity:**
  - **Transitive:** A $\rightarrow$ B $\rightarrow$ C allows A to reach C.
  - **Non-Transitive:** Stops at the immediate bridge.

### Forest Boundaries
- **Intra-forest (Parent/Child):** Automatically two-way and transitive. The **Forest** is the true security boundary.
- **Inter-forest:** Deliberate agreements between separate forests. More configurable and typically more restricted.

---

## 3. Identity & Secrets

### Security Principals
Every entity in AD (User, Computer, Group) is a **Security Principal** identified by a **SID (Security Identifier)**.
- **RID (Relative ID):** The final part of the SID.
  - **RID 500:** Built-in Administrator.
  - **RID 512:** Domain Admins.

### The Credential Map: Where Secrets Live
| Location | Scope | Content | Value to Attacker |
| :--- | :--- | :--- | :--- |
| **SAM** | Local Machine | Local user hashes | Initial foothold / local admin |
| **LSASS** | Memory (RAM) | Hashes, Kerberos keys | High-value session theft |
| **ntds.dit** | Domain Controller | All domain hashes | Total Domain Compromise (Endgame) |
| **DPAPI** | OS/Apps | Saved passwords, keys | Decrypting local secrets/configs |
| **Cached Creds** | Local Machine | Recent domain logons | Offline access to domain accounts |
