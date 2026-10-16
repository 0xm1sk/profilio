---
title: "The Architecture of Failure: CI/CD & Cloud"
date: 2026-10-13
tags: ["architecture", "cicd", "cloud-security", "operator-theory"]
---

# The Architecture of Failure

The central theme of modern infrastructure exploitation is a single recurring realization: **a system that stores or transports data never truly forgets it, and the controls placed on top of it are merely policies with exceptions.**

Whether we are dealing with kernel pseudo-filesystems, container overlays, or Git object stores, the failure is almost always the same: a confusion between the *view* (what the system shows) and the *substrate* (what the system actually contains).

<br />

## 1. The Substrate vs. The View

The following analyses break down how common technical substrates are misinterpreted as security boundaries.

### Process Environments (`/proc`)
- **The Substrate:** On Linux, every process has a kernel-exposed pseudo-filesystem entry at `/proc/<pid>/`. The `environ` file is a NUL-separated snapshot of the environment variables present at process start.
- **The Failure:** CI runners inject secrets as environment variables for simplicity. These are treated as transient, but they persist for the entire lifetime of the process.
- **The Exploit Shape:** Identify the target process -> read `/proc/<pid>/environ` -> grep for credentials. The failure is **secret materialization in a long-lived process**.

<br />

### Container Image Layers
- **The Substrate:** Images are an ordered list of content-addressed tarball layers. Deletions in later layers are implemented as **whiteout files** (`.wh.<name>`), which mask the lower entry without removing the bytes.
- **The Failure:** The assumption that `RUN rm secret` erases data. It only hides it from the final flattened filesystem.
- **The Exploit Shape:** Pull the manifest -> walk every individual layer blob -> extract and grep. The failure is **deletion modeled as masking while storage is append-only**.

<br />

### Cloud Credentials & Home Directories
- **The Substrate:** Cloud SDKs rely on bearer credentials stored in well-known paths (e.g., `~/.aws/credentials`). Possession of the key equals authority.
- **The Failure:** Machine identities are often scoped too broadly and are never rotated because rotation would acknowledge the key's existence.
- **The Exploit Shape:** Enumerate config dirs -> point CLI at the internal endpoint (`--endpoint-url`) -> enumerate identity and resources. The failure is **standing credentials + excessive scope + no rotation**.

<br />

### Kubernetes Service Account Tokens
- **The Substrate:** Every pod receives a projected JWT token at `/var/run/secrets/kubernetes.io/serviceaccount/`. The API server validates this identity and enforces RBAC.
- **The Failure:** Automounting is enabled by default, and RBAC is often granted broadly "to make things work."
- **The Exploit Shape:** Read the token -> decode the JWT -> enumerate permissions via `kubectl auth can-i`. The failure is **default-issued identity + over-broad RBAC**.

<br />

### Git Object Model
- **The Substrate:** Git is a content-addressed object store. Branches and HEAD are just movable pointers. Anything not pointed to is "unreachable" but remains in `.git/objects` until garbage collected.
- **The Failure:** History rewriting (`rebase`, `filter-branch`) drops the pointer, not the data.
- **The Exploit Shape:** Use `git fsck --lost-found` to identify dangling blobs -> read raw bytes via `git cat-file -p`. The failure is **history rewriting as pointer-dropping, not data-deletion**.

<br />

---

## 2. Policy as a List of Exceptions

Security controls in high-automation environments are rarely absolute walls; they are lists of exceptions required for the system to function.

### Branch Protection & Automation
- **The Reality:** Branch rules (required reviews, CI checks) almost always have carve-outs for bot accounts, specific namespaces (`automerge/*`), or trusted CI identities.
- **The Exploit:** Identify the exception signal (e.g., a specific committer email or a bot token) -> assume that identity -> push to the exempt lane. The failure is **policy with an automation exception reachable by anyone holding the credential**.

### The Trust Chain Paradox
- **The Reality:** A release pipeline builds -> signs -> deploys. The fleet verifies the signature.
- **The Failure:** The system conflates the **identity of the signer** with the **integrity of the artifact**. If the pipeline is steered into signing a poisoned artifact, the fleet trusts it implicitly because the signature is valid.
- **The Exploit:** Poison a non-protected file the pipeline consumes -> let the pipeline build and sign the payload -> deploy via the exempt lane. The failure is **trusting the signer rather than the human intent**.

<br />

---

## 3. Cross-Cutting Methodology

<div class="info-callout">
<strong>The Operator's Process:</strong>
1. **Enumerate the Substrate:** Identify what exists and who owns it (`ps`, `git fsck`, `kubectl`).
2. **Identify the Boundary:** Find where data crosses from trusted to untrusted zones.
3. **Read the Check:** Infer the enforcement logic and find the "carve-out" or exception.
4. **Steer the Machinery:** Don't fight the system; use the target's own trusted processes (the pipeline, the signer, the fleet) to do the work.
</div>

<div class="warning-callout">
<strong>Recurring Failure Mode:</strong>
The most reliable exploits occur when we recognize that systems model deletion as "stop pointing at it," controls as "a list of exceptions," and trust as "a valid signature."
</div>

<br />

**Key Toolkit for this Architecture:**
`ps`, `/proc`, `git fsck`, `kubectl`, `Registry API`, `aws-cli`, `trufflehog`.
