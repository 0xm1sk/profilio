---
title: "Active Directory Labs: Wraith"
date: 2026-10-07
tags: ["ad", "redteam", "netexec", "kerberos", "ldap"]
---

# Active Directory Labs: Wraith

## 1. The Mental Model Shift: Protocol Client vs. Local User

In basic labs, you typically have a shell on a target. In advanced AD operations, you operate as a **Protocol Client** from an external attacker box (Kali/Arch).

| Aspect | Local Shell (Old Way) | Protocol Client (New Way) |
| :--- | :--- | :--- |
| **Context** | You are "on" the box. | You are "on the network." |
| **Auth** | Implicit (Session token). | Explicit (User/Pass per request). |
| **Interaction** | Local OS commands (`whoami`, `net user`). | Protocol requests (SMB, LDAP, Kerberos). |
| **Tooling** | Native binaries. | Tooling like **NetExec (nxc)**. |

---

## 2. Tooling: NetExec (nxc)

NetExec is the "Swiss Army Knife" for AD. It wraps multiple protocols into a single CLI.

**General Syntax:** `nxc <protocol> <target> -u <user> -p <password> [flags]`

### SMB (Port 445)
Used for initial authentication, banner grabbing, and checking for null sessions.
- **Command:** `nxc smb 10.10.10.10 -u 'p.adams' -p 'Pass!'`
- **Key Findings:** Hostname, Domain, SMB Signing (critical for relay attacks), and DC status.

### LDAP (Port 389/636)
The "Query Language" of Active Directory. Used to read the AD database.
- **Domain SID:** `nxc ldap <target> -u <user> -p <pass> --get-sid`
- **Custom Queries:** Use `--query "<filter>" "<attributes>"` to find specific objects.
  - *Example (Find Computers):* `--query "(objectClass=computer)" "dNSHostName"`
  - *Example (Find Users):* `--query "(&(objectClass=user)(objectCategory=person))" "sAMAccountName whenCreated"`

### Kerberos (Port 88)
The authentication heartbeat of AD.
- **Kerberoasting:** Requesting a TGS ticket for service accounts (`SPNs`) to crack their passwords offline.
- **Command:** `nxc ldap <target> -u <user> -p <pass> --kerberoasting <file>`

---

## 3. Technical Gotchas & Troubleshooting

### The Clock Skew Problem
Kerberos is extremely sensitive to time. If your attacker machine's clock differs from the DC's clock by more than **~5 minutes**, authentication will fail.

**Fixes:**
1. **Sync with Chrony:** `sudo chronyc add server <DC_IP> iburst && sudo chronyc makestep`
2. **Manual Sync (Nuclear Option):**
   - Query DC time via LDAP: `nxc ldap <target> -u <user> -p <pass> --query "(objectClass=domain)" "currentTime"`
   - Set local time: `sudo date -u -s "YYYY-MM-DD HH:MM:SS"`

### Data Parsing (The "Paste" Problem)
NetExec output for queries is often multi-line and variable. To clean this up for sorting (e.g., finding the newest user):
```bash
# Example: Extracting and sorting newest users by whenCreated
awk '/whenCreated/ {wc=$NF} /sAMAccountName/ {sam=$NF} /employeeID/ {eid=$NF; print wc, sam, eid}' users.txt | sort -r | head -10
```

---

## 4. Target Fact Sheet (WindCorp Lab)
- **Domain:** `windcorp.io`
- **DC FQDN:** `DC01.windcorp.io`
- **Domain SID:** `S-1-5-21-3698659778-4026562730-3385376917`
- **External Trust:** `partner.local` (Possible lateral movement path).
