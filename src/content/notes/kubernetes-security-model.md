---
title: "Kubernetes Security: Identity, Authorization & Isolation"
date: 2026-11-17
category: "Cloud Security"
tags: ["kubernetes", "k8s", "security", "rbac", "admission", "container-security", "cloud"]
description: "A mental model of Kubernetes security: how identity, RBAC, admission and isolation interact — and where clusters fail."
---
# Kubernetes Security: Identity, Authorization & Isolation

Kubernetes does **not** isolate pods from the node by default. Isolation is a set of *opt-in* controls — PodSecurity, seccomp, AppArmor, network policies, resource limits, and least-privilege RBAC. A cluster's real security posture is the union of the admission policies that are actually enforced, not the ones that are documented.

This note is the mental model I use to reason about that system: what the pieces are, how a request is authenticated and authorized, and where the dangerous gaps tend to be.

<br />

---

## 1. The mental model

```
                  ┌──────────────────────────────┐
                  │        CONTROL PLANE         │
                  │  kube-apiserver (the front)  │
                  │  etcd (the truth)            │
                  │  scheduler, controller-mgr   │
                  └──────────────┬───────────────┘
                                 │  HTTPS + token/cert
              ┌──────────────────┼──────────────────┐
              ▼                  ▼                  ▼
        ┌──────────┐       ┌──────────┐       ┌──────────┐
        │  NODE A  │       │  NODE B  │       │  NODE C  │
        │ kubelet  │       │ kubelet  │       │ kubelet  │
        │ containerd│      │ containerd│      │ containerd│
        │ ┌──────┐ │       │ ┌──────┐ │       │          │
        │ │ POD  │ │       │ │ POD  │ │       │          │
        │ │ ctnr │ │       │ │ ctnr │ │       │          │
        │ └──────┘ │       │ └──────┘ │       │          │
        └──────────┘       └──────────┘       └──────────┘
```

- **Cluster** = control plane + nodes. The API server is the *only* component that talks to etcd; everything else talks to the API server.
- **Node** = a VM or host. In lightweight distributions the node itself may be a container, which you can confirm from `/proc/self/mountinfo` showing overlay mounts under the runtime's data path.
- **Pod** = the atomic unit. One or more containers sharing network, IPC and UTS namespaces, and optionally a PID namespace. Containers in a pod see each other on `localhost`.
- **Container runtime** = containerd (or Docker) on the node, executing containers through a low-level runtime such as runc.

<div class="info-callout">
<strong>The crucial distinction:</strong> a pod is <em>not</em> a VM. It is a set of Linux namespaces and cgroups managed by a runtime. That is why container escapes are about namespaces (mount, PID, network) and capabilities — not about "breaking out of a hypervisor." A runtime bug is a <em>host</em> bug, even when it is triggered from inside a container.
</div>

<br />

---

## 2. Identity: ServiceAccounts and bound tokens

Every pod runs as a **ServiceAccount**. By default it is `default` in its namespace, but workloads commonly use a dedicated SA.

That identity is a **JWT**, mounted read-only into every container of the pod at:

```
/var/run/secrets/kubernetes.io/serviceaccount/token
```

The decoded payload identifies the principal:

```json
{
  "sub": "system:serviceaccount:<namespace>:<serviceaccount>",
  "kubernetes.io": {
    "namespace": "<namespace>",
    "pod": { "name": "<pod>", "uid": "..." },
    "node": { "name": "<node>" },
    "serviceaccount": { "name": "<serviceaccount>", "uid": "..." }
  }
}
```

Key properties:

- `sub` is the identity the API server sees on **every** request made with that token.
- In modern Kubernetes, tokens are **bound**: they carry `exp`, `iat` and `nbf`, are audience-scoped via `aud`, and are tied to a specific pod. Reusing one outside its pod is possible until expiry, but it is no longer perpetual.
- The token is mounted into **every container** in the pod. Compromise any one of them and the attacker inherits the whole SA's identity.

A token is a bearer credential. The API server trusts whatever identity it encodes — which means the token is only as safe as the permissions attached to that SA.

<br />

---

## 3. Authorization: RBAC and the escalation verbs

Every API request passes through **authentication** (who are you? → the SA identity from the token) and then **authorization** (may you do this? → RBAC).

An RBAC rule is a tuple:

```
apiGroups × resources × verbs × resourceNames
```

| Object | Scope | Purpose |
|---|---|---|
| `Role` | namespace | rules within one namespace |
| `RoleBinding` | namespace | grants a Role (or ClusterRole) to subjects in one namespace |
| `ClusterRole` | cluster | rules cluster-wide, or reusable across namespaces |
| `ClusterRoleBinding` | cluster | grants a ClusterRole cluster-wide |

Verbs that matter: `get`, `list`, `watch`, `create`, `update`, `patch`, `delete`, `deletecollection`, `bind`, `escalate`, `impersonate`.

### The two verbs that change everything

- **`bind`** on a *specific role* → you may create a RoleBinding that references that role **without** the RBAC escalation admission check verifying that you already hold its permissions.
- **`escalate`** on `roles`/`clusterroles` → you may modify a Role to add permissions you do not hold. Even more powerful.

A grant like this is the whole story:

```
roles.rbac.authorization.k8s.io        [<some-role>]   [bind]
rolebindings.rbac.authorization.k8s.io  []             [create get list]
```

The value in the third position is a **`resourceName`**. It scopes the `bind` verb to exactly one role. That is still enough: you can bind that one role to yourself, and the permissions it carries become yours.

### The RBAC escalation admission controller

When you try to create a RoleBinding that grants permissions, the API server asks:

> "Does the requester already hold every permission this binding would grant?"

If not → **Forbidden**. This is a security control layered on top of ordinary RBAC, and it is what blocks binding well-known broad roles like `view`, `edit`, `admin` or `cluster-admin`.

Its documented escape hatches are `bind` and `escalate` on a specific resource. So the failure is not "you can grant what you don't have" — it is **being granted `bind` at all**.

<div class="warning-callout">
<strong>Mental model:</strong> <code>bind</code> and <code>escalate</code> are "make a new admin" verbs. Workloads almost never need them. If a service account has either, assume it can acquire whatever that scoped role contains.
</div>

<br />

---

## 4. Admission: the layer people forget

After RBAC says "yes," a second set of plugins runs — **admission controllers**. Two matter most here:

1. **The RBAC escalation check** described above — it rejects RoleBindings that grant new permissions.
2. **PodSecurity Admission (PSA)** — enforces `baseline` or `restricted` pod profiles.

Under `restricted`, settings like `privileged: true`, `hostPath: /`, `hostPID`, and dangerous capabilities are rejected outright. Under `baseline`, some of them still pass.

A pod requesting `privileged: true` and a `hostPath: /` mount is accepted only when PSA is not enforcing on that namespace. When it is accepted, the node's root filesystem appears inside the pod — typically at a mounted path — and any file on the host is then readable as root. This is why **"can create pods" effectively means "can become root on the node"** unless admission forbids it.

PSA is a **namespaced label**:

```yaml
metadata:
  labels:
    pod-security.kubernetes.io/enforce: restricted
```

If that label is present and enforced, the malicious pod is rejected at creation time — the exploit never starts.

<div class="info-callout">
<strong>Admission is the primary control.</strong> RBAC says "may you ask"; admission says "should this request exist at all." A single missing label can invalidate an otherwise careful RBAC design.
</div>

<br />

---

## 5. The non-resource URL surface

A subtle and frequently overlooked part of authorization: RBAC authorizes two different kinds of requests.

1. **Resource requests** → checked against `(apiGroup, resource, verb, resourceName)`.
2. **Non-resource requests** → paths that do not resolve to a resource, checked against `nonResourceURLs`.

The practical consequence is that raw paths under `/api/*` and `/apis/*` can sometimes return data that ordinary resource operations cannot:

```
GET /api/v1/namespaces/<ns>/secrets
GET /apis/rbac.authorization.k8s.io/v1/namespaces/<ns>/rolebindings
```

The exact behavior is version- and path-dependent: some of these paths resolve to a resource and are denied, while others are authorized by the non-resource rule. That inconsistency is itself the lesson:

- `kubectl get secrets` may be denied while `kubectl get --raw /api/...` succeeds.
- Probing raw API paths is often how over-broad `nonResourceURLs` grants — and hidden role grants — are discovered in the first place.
- Teams frequently hand out `/api/*` and `/apis/*` "for health checks," accidentally opening a read path into the API surface.

<div class="warning-callout">
<strong>Rule of thumb:</strong> treat non-resource URL grants as effectively a wildcard into the raw API. They should never be given to workloads.
</div>

<br />

---

## 6. Failure taxonomy

The paths above collapse into four failure classes.

### A. Identity failure — token overreach

- A ServiceAccount token is a bearer credential. Any container that can read it *is* that SA.
- Bound tokens help (short expiry, audience), but only if the SA's permissions are minimal.
- **Failure mode:** the SA is granted more than the pod needs — `create pods`, `bind`, `/api/*`.
- **Defense:** least-privilege SAs, no `/api/*` for workloads, and `automountServiceAccountToken: false` for pods that do not need API access.

### B. Authorization failure — RBAC mistakes

- `bind` and `escalate` are the "make a new admin" verbs.
- `create rolebindings` combined with `bind` on a powerful role is escalation *within that namespace*.
- **Defense:** forbid `bind`/`escalate` for workload SAs; where genuinely required, scope `resourceNames` as tightly as possible — and remember that even one scoped role may be sufficient to become privileged.

### C. Isolation failure — pod-to-host escapes

- `privileged: true`, `hostPath`, `hostPID`, `hostNetwork`, and capabilities such as `CAP_SYS_ADMIN`, `CAP_SYS_PTRACE` and `CAP_DAC_READ_SEARCH` are the toolkit.
- Admission is the only control that rejects these at creation time. Runtime controls (seccomp, AppArmor) help but are weaker.
- **Defense:** PodSecurity `restricted` on every namespace, plus policy engines such as Kyverno or Gatekeeper to reject privileged pods and host mounts.

### D. Admission failure — the missing layer

Every one of these paths is fundamentally an admission failure:

- A broad `/api/*` non-resource rule is admitted without anyone realizing it grants raw reads.
- PodSecurity is not enforced, so a privileged pod is admitted.
- The RBAC escalation check has a documented bypass (`bind`) that is only safe if `bind` itself is tightly scoped.

The cluster is exactly as secure as the policies that are actually enforced.

<br />

---

## 7. Methodology: how to read a cluster

The reasoning order that consistently works:

1. **Establish your identity.** Decode the mounted token; read `sub` and the `kubernetes.io` claims. You cannot reason about permissions before you know who you are.
2. **Enumerate permissions two ways.** Use `auth can-i --list` for the authored rules, *and* probe raw API paths — non-resource grants do not show up clearly in the first view.
3. **Look for creation primitives.** `create pods`, `create rolebindings`, and `bind`/`escalate` are the three that turn read access into control. Rank them above ordinary `get`/`list`.
4. **Check admission, not just RBAC.** Read namespace labels for PodSecurity enforcement. A permissive label turns "can create pods" into "owns the node."
5. **Map the path.** Chain the primitives: identity → what it may create → what that created object can do → which admission rule would have stopped it.
6. **Key on the control, not the target.** The specific namespace or role name is incidental. The reusable signal is *a workload identity holding a creation or binding verb without a compensating admission policy*.

<div class="info-callout">
<strong>The recurring pattern:</strong> read access is rarely the end goal. It is the starting point for discovering a creation primitive, which admission should have constrained. Follow the chain rather than the object names.
</div>

<br />

---

## 8. Defensive baseline

- Enforce **PodSecurity `restricted`** on every namespace that runs untrusted workloads.
- Give each workload a **dedicated ServiceAccount** with only the verbs it needs; disable token automount where the API is unnecessary.
- **Never** grant `bind`, `escalate` or `impersonate` to workload identities. Audit for them explicitly.
- Reject `/api/*` and `/apis/*` non-resource grants for workloads.
- Use a policy engine (Kyverno, Gatekeeper) to reject `privileged`, host namespaces, hostPath, and dangerous capabilities at admission time.
- Apply **network policies** — pod networking is flat by default.
- Pin and patch the **container runtime**. Runtime bugs are host-compromise bugs, not merely container-escape bugs.

<br />

---

## Takeaway

- A token is only as safe as the RBAC rules attached to it; raw API grants are not harmless health-check permissions.
- "Can create pods" plus no PodSecurity equals root on the node — a privileged pod with a host mount *is* the node.
- Escalation is not blocked by "you can't grant what you don't have"; it is blocked by **not granting `bind`**.
- The cluster's security posture is exactly the union of the admission policies that are actually enforced.

Isolation is opt-in. The job is to make sure every control you assume is present is actually labeled, enforced, and audited.
