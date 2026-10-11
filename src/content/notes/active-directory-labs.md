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
<br />
| :--- | :--- | :--- |
<br />
| **Context** | You are "on" the box. | You are "on the network." |
<br />
| **Auth** | Implicit (Session token). | Explicit (User/Pass per request). |
<br />
| **Interaction** | Local OS commands (`whoami`, `net user`). | Protocol requests (SMB, LDAP, Kerberos). |
<br />
| **Tooling** | Native binaries. | Tooling like **NetExec (nxc)**. |

<br />

---

## 2. Core Tooling: NetExec (nxc)

NetExec is a post-exploitation framework that wraps multiple protocols into a single CLI, acting as a centralized tool for AD enumeration.

**General Syntax:** 
<br />
`nxc <protocol> <target> -u <user> -p <password> [flags]`

<br />

### SMB (Port 445)
<br />
Used for initial authentication, banner grabbing, and checking for null sessions.
<br />
- **Command:** `nxc smb <target> -u 'user' -p 'pass'`
<br />
- **Key Findings:** Hostname, Domain, SMB Signing, and Domain Controller (DC) status.

<br />

### LDAP (Port 389/636)
<br />
The primary interface for reading the Active Directory database.
<br />
- **Domain SID:** `--get-sid`
<br />
- **Custom Queries:** `--query "<filter>" "<attributes>"`
<br />
  - *Example (Find Computers):* `--query "(objectClass=computer)" "dNSHostName"`
<br />
  - *Example (Find Users):* `--query "(&(objectClass=user)(objectCategory=person))" "sAMAccountName whenCreated"`

<br />

### Kerberos (Port 88)
<br />
The authentication mechanism of AD.
<br />
- **Kerberoasting:** Requesting TGS tickets for service accounts to crack passwords offline.
<br />
- **Command:** `nxc ldap <target> -u <user> -p <pass> --kerberoasting <file>`

<br />

---

## 3. Technical Gotchas & Troubleshooting

### The Clock Skew Problem
<br />
Kerberos requires strict time synchronization. If the attacker's clock differs from the DC's by more than **~5 minutes**, authentication will fail.

<br />

**Resolution Steps:**
<br />
1. **Sync with Chrony:** 
<br />
   `sudo chronyc add server <DC_IP> iburst && sudo chronyc makestep`
<br />
2. **Manual Sync (Nuclear Option):**
<br />
   - Query DC time: `nxc ldap <target> -u <user> -p <pass> --query "(objectClass=domain)" "currentTime"`
<br />
   - Set local time: `sudo date -u -s "YYYY-MM-DD HH:MM:SS"`

<br />

### Data Parsing (The "Paste" Problem)
<br />
NetExec query output is often multi-line. To clean this for sorting (e.g., finding the newest user), use `awk`:

```bash

# Extract and sort newest users by whenCreated

awk '/whenCreated/ {wc=$NF} /sAMAccountName/ {sam=$NF} /employeeID/ {eid=$NF; print wc, sam, eid}' users.txt | sort -r | head -10

```

<br />

---

## 4. General Reference
<br />
When analyzing a new domain, always track these key identifiers:
<br />
- **Domain FQDN:** The full address of the domain.
<br />
- **Domain SID:** The unique identifier for the domain.
<br />
- **Trusts:** Any external domains that the current forest trusts.
