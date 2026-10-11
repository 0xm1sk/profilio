---
title: "Active Directory Foundations"
date: 2026-10-07
tags: ["ad", "redteam", "netexec", "kerberos", "ldap"]
---

# Active Directory Foundations

The transition from basic lab environments to enterprise Active Directory operations requires a shift in how we interact with target systems.

<br />

## 1. The Mental Model: Protocol Client vs. Local User

In standard penetration testing, you typically work with a shell on a target. In advanced AD operations, you operate as a **Protocol Client** from an external attacker box (Kali/Arch).

<br />

| Aspect | Local Shell (Old Way) | Protocol Client (New Way) |
| :--- | :--- | :--- |
| **Context** | You are "on" the box. | You are "on the network." |
| **Auth** | Implicit (Session token). | Explicit (User/Pass per request). |
| **Interaction** | Local OS commands (`whoami`, `net user`). | Protocol requests (SMB, LDAP, Kerberos). |
| **Tooling** | Native binaries. | Tooling like **NetExec (nxc)**. |

<br />

---

## 2. Core Tooling: NetExec (nxc)

NetExec is a post-exploitation framework that wraps multiple protocols into a single CLI, acting as a centralized tool for AD enumeration.

**General Syntax:** 
`nxc <protocol> <target> -u <user> -p <password> [flags]`

<br />

### SMB (Port 445)
Used for initial authentication, banner grabbing, and checking for null sessions.
- **Command:** `nxc smb <target> -u 'user' -p 'pass'`
- **Key Findings:** Hostname, Domain, SMB Signing, and Domain Controller (DC) status.

<br />

### LDAP (Port 389/636)
The primary interface for reading the Active Directory database.
- **Domain SID:** `--get-sid`
- **Custom Queries:** `--query "<filter>" "<attributes>"`
  - *Example (Find Computers):* `--query "(objectClass=computer)" "dNSHostName"`
  - *Example (Find Users):* `--query "(&(objectClass=user)(objectCategory=person))" "sAMAccountName whenCreated"`

<br />

### Kerberos (Port 88)
The authentication mechanism of AD.
- **Kerberoasting:** Requesting TGS tickets for service accounts to crack passwords offline.
- **Command:** `nxc ldap <target> -u <user> -p <pass> --kerberoasting <file>`

<br />

---

## 3. Technical Gotchas & Troubleshooting

### The Clock Skew Problem
Kerberos requires strict time synchronization. If the attacker's clock differs from the DC's by more than **~5 minutes**, authentication will fail.

<br />

**Resolution Steps:**
1. **Sync with Chrony:** 
   `sudo chronyc add server <DC_IP> iburst && sudo chronyc makestep`
2. **Manual Sync (Nuclear Option):**
   - Query DC time: `nxc ldap <target> -u <user> -p <pass> --query "(objectClass=domain)" "currentTime"`
   - Set local time: `sudo date -u -s "YYYY-MM-DD HH:MM:SS"`

<br />

### Data Parsing (The "Paste" Problem)
NetExec query output is often multi-line. To clean this for sorting (e.g., finding the newest user), use `awk`:

```bash
# Extract and sort newest users by whenCreated
awk '/whenCreated/ {wc=$NF} /sAMAccountName/ {sam=$NF} /employeeID/ {eid=$NF; print wc, sam, eid}' users.txt | sort -r | head -10
```

<br />

---

## 4. General Reference
When analyzing a new domain, always track these key identifiers:
- **Domain FQDN:** The full address of the domain.
- **Domain SID:** The unique identifier for the domain.
- **Trusts:** Any external domains that the current forest trusts.
