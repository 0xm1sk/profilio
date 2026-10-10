---
title: "Active Directory Foundations"
date: 2026-10-07
tags: ["ad", "redteam", "netexec", "kerberos", "ldap"]
---

# Active Directory Foundations

<br />

## 1. The Mental Model: Protocol Client vs. Local User

In basic labs, you typically have a shell on a target. In advanced AD operations, you operate as a **Protocol Client** from an external attacker box (Kali/Arch).

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

NetExec is a post-exploitation tool that wraps multiple protocols into a single CLI, acting as a "Swiss Army Knife" for AD.

**General Syntax:** 
`nxc <protocol> <target> -u <user> -p <password> [flags]`

<br />

### 🛠️ SMB (Port 445)
Used for initial authentication and checking for null sessions.
- **Command:** `nxc smb <target> -u 'user' -p 'pass'`
- **Key Findings:** Hostname, Domain, SMB Signing, and DC status.

<br />

### 🛠️ LDAP (Port 389/636)
The "Query Language" of AD. Used to read the AD database.
- **Domain SID:** `--get-sid`
- **Custom Queries:** `--query "<filter>" "<attributes>"`
  - *Example (Find Computers):* `--query "(objectClass=computer)" "dNSHostName"`
  - *Example (Find Users):* `--query "(&(objectClass=user)(objectCategory=person))" "sAMAccountName whenCreated"`

<br />

### 🛠️ Kerberos (Port 88)
The authentication heartbeat of AD.
- **Kerberoasting:** Requesting TGS tickets for service accounts to crack offline.
- **Command:** `nxc ldap <target> -u <user> -p <pass> --kerberoasting <file>`

<br />

---

## 3. Technical Gotchas & Troubleshooting

### 🕒 The Clock Skew Problem
Kerberos is extremely sensitive to time. If your clock differs from the DC's by more than **~5 minutes**, authentication fails.

<br />

**How to Fix:**
1. **Sync with Chrony:** 
   `sudo chronyc add server <DC_IP> iburst && sudo chronyc makestep`
2. **Manual Sync (Nuclear Option):**
   - Query DC time: `nxc ldap <target> -u <user> -p <pass> --query "(objectClass=domain)" "currentTime"`
   - Set local time: `sudo date -u -s "YYYY-MM-DD HH:MM:SS"`

<br />

### 🧹 Data Parsing (The "Paste" Problem)
NetExec output for queries is often multi-line. Use `awk` to clean it up for sorting:

```bash
# Example: Extracting and sorting newest users by whenCreated
awk '/whenCreated/ {wc=$NF} /sAMAccountName/ {sam=$NF} /employeeID/ {eid=$NF; print wc, sam, eid}' users.txt | sort -r | head -10
```

<br />

---

## 4. General Reference
When analyzing a new domain, always track the following:
- **Domain FQDN:** The full address of the domain.
- **Domain SID:** The unique identifier for the domain.
- **Trusts:** Any external domains that the current forest trusts.
