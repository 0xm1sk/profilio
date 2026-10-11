---
<br />
title: "AD Operator Theory & Methodology"
<br />
date: 2026-10-10
<br />
tags: ["ad", "methodology", "redteam", "identity"]
<br />
---

# AD Operator Theory & Methodology

## 1. The Operator Mindset
<br />
Success in Active Directory environments is not about memorizing commands, but about disciplined methodology.

### Core Habits
<br />
- **Enumerate Before Acting:** Map the domain fully. Most attack paths are visible in the data available to a plain user.
<br />
- **The Note-Taking Mandate:** Turn a pile of facts into a path. Document every host, account, group, and SPN.
<br />
- **Work the Graph:** AD is a web of relationships. Stop running tools at random; ask "Who can reach what from here?"
<br />
- **Assume Monitoring:** Prefer the "quiet" question. Minimal noise = maximum longevity.

### The Tool Map
<br />
| Goal | Primary Tools | Protocol / Mechanism |
<br />
| :--- | :--- | :--- |
<br />
| **Graph Domain** | BloodHound, SharpHound | LDAP -> Graph Edges |
<br />
| **Query Directory** | PowerView, ldapsearch | LDAP |
<br />
| **Host/Service Discovery** | nmap, NetExec | Network, SMB, DNS |
<br />
| **Protocol Driving** | Impacket Suite | SMB, RPC, Kerberos |
<br />
| **Ticket/Hash Mgmt** | Rubeus, Hashcat | Kerberos -> Offline Crack |
<br />
| **Spray/Roast** | Kerbrute, NetExec | Kerberos, LDAP |

---

## 2. Domain Trusts & Architecture

### What is a Trust?
<br />
A trust is a bridge that allows one domain/forest to accept authentication from another.

- **Direction:** 
<br />
  - **One-Way:** Domain B trusts A -> A's users can access B.
<br />
  - **Two-Way:** Both directions allowed.
<br />
- **Transitivity:**
<br />
  - **Transitive:** A -> B -> C allows A to reach C.
<br />
  - **Non-Transitive:** Stops at the immediate bridge.

### Forest Boundaries
<br />
- **Intra-forest (Parent/Child):** Automatically two-way and transitive. The **Forest** is the true security boundary.
<br />
- **Inter-forest:** Deliberate agreements between separate forests. More configurable and typically more restricted.

---

## 3. Identity & Secrets

### Security Principals
<br />
Every entity in AD (User, Computer, Group) is a **Security Principal** identified by a **SID (Security Identifier)**.
<br />
- **RID (Relative ID):** The final part of the SID.
<br />
  - **RID 500:** Built-in Administrator.
<br />
  - **RID 512:** Domain Admins.

### The Credential Map: Where Secrets Live
<br />
| Location | Scope | Content | Value to Attacker |
<br />
| :--- | :--- | :--- | :--- |
<br />
| **SAM** | Local Machine | Local user hashes | Initial foothold / local admin |
<br />
| **LSASS** | Memory (RAM) | Hashes, Kerberos keys | High-value session theft |
<br />
| **ntds.dit** | Domain Controller | All domain hashes | Total Domain Compromise (Endgame) |
<br />
| **DPAPI** | OS/Apps | Saved passwords, keys | Decrypting local secrets/configs |
<br />
| **Cached Creds** | Local Machine | Recent domain logons | Offline access to domain accounts |
