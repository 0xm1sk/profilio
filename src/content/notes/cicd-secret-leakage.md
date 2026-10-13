---
title: "CI/CD Secret Leakage"
date: 2026-10-13
tags: ["cicd", "devops", "secrets", "kubernetes", "cloud"]
---

# CI/CD Secret Leakage

Modern CI/CD pipelines are complex chains of trust. Secrets often leak not through a single failure, but through the persistence of credentials across different stages of the build and deployment process.

<br />

## 1. Process Environment Leakage

<div class="info-callout">
<strong>Concept:</strong> Build runners inject secrets as environment variables. These variables persist in the process environment and are accessible via the Linux `/proc` filesystem.
</div>

<br />

**Methodology:**
1. Identify the target process (e.g., a build runner) using `ps`.
2. Dump the environment variables:
   `cat /proc/<pid>/environ | tr '\0' '\n'`
3. Filter for sensitive keywords:
   `grep -E "SECRET|TOKEN|KEY|PASSWORD"`

<div class="warning-callout">
<strong>Lesson:</strong> Environment variables are not temporary; they persist as long as the process is alive.
</div>

<br />

---

## 2. Container Image Layer Analysis

<div class="info-callout">
<strong>Concept:</strong> Docker images are immutable layers. If a secret is added in Layer A and deleted in Layer B, the secret still exists in the history of Layer A.
</div>

<br />

**Methodology:**
1. Use the **Docker Registry HTTP API (v2)** to fetch the image manifest and blobs.
2. Extract each layer (typically `.tar.gz` files).
3. Search through the extracted filesystems for secrets:
   `grep -R "password" .`
4. Identify "whiteout" files (`.wh.`) to understand what the developers tried to hide.

<div class="warning-callout">
<strong>Lesson:</strong> Once a secret is committed to an image layer, it is permanent. Rotation is the only fix.
</div>

<br />

---

## 3. Cloud Credential Abuse

<div class="info-callout">
<strong>Concept:</strong> Long-lived AWS/Azure/GCP keys are often left in home directories or config files on build agents, allowing an attacker to assume that identity.
</div>

<br />

**Methodology:**
1. Search for common config paths: `~/.aws/credentials`, `~/.azure/`, or `.env` files.
2. Use the corresponding CLI to verify the identity:
   `aws sts get-caller-identity`
3. Enumerate accessible resources:
   `aws s3 ls`
   `aws secretsmanager list-secrets`

<div class="warning-callout">
<strong>Lesson:</strong> Use short-lived, identity-based tokens (like IAM Roles for EC2/K8s) instead of static access keys.
</div>

<br />

---

## 4. Kubernetes Service Account Tokens

<div class="info-callout">
<strong>Concept:</strong> Every pod is automatically mounted with a Service Account token. If the RBAC permissions for that account are over-privileged, the pod becomes a gateway to the cluster.
</div>

<br />

**Methodology:**
1. Locate the token: `/var/run/secrets/kubernetes.io/serviceaccount/token`
2. Use `kubectl` to test permissions:
   `kubectl auth can-i --list`
3. Attempt to list secrets across the cluster:
   `kubectl get secrets -A`

<div class="warning-callout">
<strong>Lesson:</strong> Disable `automountServiceAccountToken: false` in the pod spec unless the pod explicitly needs to talk to the K8s API.
</div>

<br />

---

## 5. Git History Recovery

<div class="info-callout">
<strong>Concept:</strong> Git is a content-addressed database. Deleting a file in a new commit does not remove it from the object store.
</div>

<br />

**Methodology:**
1. Find deleted files that might have contained secrets:
   `git log --diff-filter=D --summary`
2. Search through all commits for specific patterns:
   `git grep "SECRET" $(git rev-list --all)`
3. Inspect dangling blobs (objects not linked to any branch):
   `git fsck --lost-found`
   `git cat-file -p <blob-hash>`

<div class="warning-callout">
<strong>Lesson:</strong> Use tools like `trufflehog` or `gitleaks` in the pipeline to prevent secrets from being committed in the first place.
</div>

<br />

---

## 🛠️ Operator's Workflow

When auditing a CI/CD pipeline, follow this sequence:

1. **Enumerate Environment** $\rightarrow$ Check `/proc`, mounts, and env vars.
2. **Recover Credentials** $\rightarrow$ Search config files, image layers, and Git history.
3. **Authenticate** $\rightarrow$ Use recovered keys to access Cloud/K8s/Registry APIs.
4. **Enumerate Permissions** $\rightarrow$ Map out what the identity can actually do.
5. **Pivot** $\rightarrow$ Use existing access to find more secrets or move to other systems.

<br />

**Key Toolkit:**
`ps`, `cat /proc`, `curl`, `aws-cli`, `kubectl`, `git`, `grep`, `trufflehog`.
