---
title: "NetExec (nxc)"
date: 2026-10-07
version: "7.0"
language: "Python"
github: "https://github.com/NetExecOrg/netexec"
description: "A post-exploitation tool and Swiss Army Knife for network enumeration and Active Directory attacks."
tags: ["redteam", "enumeration", "ad", "smb", "ldap"]
---

# NetExec (nxc)

NetExec is a post-exploitation tool that serves as a modern successor to CrackMapExec. It is a "Swiss Army Knife" for network enumeration and attack, allowing operators to interact with multiple protocols from a single CLI.

## Core Functionality
NetExec wraps various network protocols into a friendly interface. Every command generally follows this shape:
`nxc <protocol> <target> -u <user> -p <password> [flags]`

### Supported Protocols
- **SMB (445):** Used for initial authentication, banner grabbing, and checking for null sessions.
- **LDAP (389/636):** The primary method for querying the Active Directory database (users, groups, computers, trusts).
- **Kerberos (88):** Used for requesting tickets (TGT/TGS) and performing Kerberoasting attacks.
- **WinRM (5985/5986):** Remote Windows Management for executing code via PowerShell.
- **MSSQL (1433):** Interacting with SQL Server databases.

## Key Operator Use-Cases

### 1. Domain Enumeration
Using LDAP to extract the domain structure without needing a shell on a target.
- **Get Domain SID:** `--get-sid`
- **List DCs:** `--dc-list`
- **Custom Queries:** Use `--query "<filter>" "<attributes>"` to find specific objects.
  - *Example (Find Computers):* `--query "(objectClass=computer)" "dNSHostName"`
  - *Example (Find Users):* `--query "(&(objectClass=user)(objectCategory=person))" "sAMAccountName whenCreated"`

### 2. Credential Testing & Spraying
Testing sets of credentials across a range of hosts to identify valid accounts or privileged users.

### 3. Kerberoasting
Identifying service accounts with an SPN (Service Principal Name) and requesting encrypted tickets to crack passwords offline.
- **Command:** `nxc ldap <target> -u <user> -p <pass> --kerberoasting <file>`

## Integration with the Operator Mindset
NetExec is a "Protocol Client." It allows the operator to interact with the domain while remaining external to the target hosts, reducing the noise and risk of detection compared to running tools locally on a compromised machine.
